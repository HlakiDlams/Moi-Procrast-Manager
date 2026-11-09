import { useEffect, useState, type CSSProperties } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSettings } from '../lib/settings'
import { addXp, useXpStats } from '../lib/xp'
import { db, fmtTime, localDay, type Block, type BlockKind } from '../lib/db'
import { blockEnd, blockState, kindInfo, KINDS, nextBlock, setBlockDone } from '../lib/blocks'
import { startStarter, useFocus } from '../lib/focus'
import type { TabId } from '../tabs'
import WeekChart from '../components/WeekChart'

function useNow(ms: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(id)
  }, [ms])
  return now
}

function greeting(h: number) {
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function untilText(ms: number) {
  const m = Math.round(ms / 60_000)
  if (m < 1) return 'now'
  if (m < 60) return `in ${m} min`
  const h = Math.floor(m / 60)
  return `in ${h}h ${m % 60 ? `${m % 60}m` : ''}`.trim()
}

function AddBlock({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState(() => {
    const d = new Date()
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0)
    return fmtTime(d)
  })
  const [minutes, setMinutes] = useState(30)
  const [kind, setKind] = useState<BlockKind>('study')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await db.blocks.add({ day: localDay(), start, minutes, title: title.trim(), kind, status: 'planned' })
    onDone()
  }

  return (
    <form className="add-block" onSubmit={save}>
      <input placeholder="What? e.g. Maths: trig identities" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus maxLength={80} />
      <div className="grid-3">
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} aria-label="Start time" />
        <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} aria-label="Length">
          {[5, 10, 15, 20, 25, 30, 45, 60, 90, 120].map((m) => (
            <option key={m} value={m}>
              {m} min
            </option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value as BlockKind)} aria-label="Type">
          {KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.icon} {k.label}
            </option>
          ))}
        </select>
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" type="submit">
          Add
        </button>
        <button className="btn btn-ghost" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function BlockRow({ b, now }: { b: Block; now: Date }) {
  const k = kindInfo(b.kind)
  const st = blockState(b, now)
  return (
    <li className={'block-row st-' + st} style={{ '--k': k.color } as CSSProperties}>
      <button className={'tick' + (b.status === 'done' ? ' on' : '')} onClick={() => setBlockDone(b, b.status !== 'done')} aria-label={b.status === 'done' ? 'Mark not done' : 'Mark done'}>
        {b.status === 'done' ? '✓' : ''}
      </button>
      <div className="block-main">
        <div className="block-title">
          {k.icon} {b.title}
        </div>
        <div className="muted small">
          {b.start}–{fmtTime(blockEnd(b))} · {b.minutes} min
          {st === 'now' && <span className="tag tag-now">now</span>}
          {st === 'missed' && <span className="tag tag-missed">missed</span>}
        </div>
      </div>
      <div className="block-actions">
        {b.status === 'planned' && b.kind !== 'sleep' && (
          <button className="icon-btn" onClick={() => startStarter(b.title, b.id)} aria-label={`Start ${b.title}`}>
            ▶
          </button>
        )}
        <button
          className="icon-btn subtle"
          onClick={() => confirm(`Delete "${b.title}"?`) && db.blocks.delete(b.id!)}
          aria-label={`Delete ${b.title}`}
        >
          ✕
        </button>
      </div>
    </li>
  )
}

export default function TodayScreen({ go }: { go: (t: TabId) => void }) {
  const s = useSettings()
  const stats = useXpStats()
  const now = useNow(20_000)
  const focus = useFocus()
  const today = localDay(now)
  const blocks = useLiveQuery(() => db.blocks.where('day').equals(today).sortBy('start'), [today]) ?? []
  const focusToday = useLiveQuery(async () => (await db.focus.where('day').equals(today).toArray()).reduce((n, f) => n + f.minutes, 0), [today]) ?? 0
  const water = useLiveQuery(() => db.water.where('day').equals(today).count(), [today]) ?? 0
  const [adding, setAdding] = useState(false)
  const [freeTitle, setFreeTitle] = useState('')

  const exam = new Date(s.matricStart + 'T09:00:00')
  const daysLeft = Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / 86_400_000))
  const goalPct = Math.min(100, Math.round((stats.today / Math.max(1, s.dailyXpGoal)) * 100))
  const lvlPct = Math.round((stats.level.into / stats.level.need) * 100)
  const next = nextBlock(blocks, now)
  const done = blocks.filter((b) => b.status === 'done').length
  const missed = blocks.filter((b) => blockState(b, now) === 'missed').length

  async function addWater() {
    await db.water.add({ day: today, at: new Date().toISOString() })
    if (water < s.waterGoal) await addXp(2, 'selfcare', 'Water')
    navigator.vibrate?.(30)
  }

  async function undoWater() {
    const last = await db.water.where('day').equals(today).last()
    if (last?.id !== undefined) await db.water.delete(last.id)
  }

  function justTwo() {
    if (next) startStarter(next.title, next.id)
    else startStarter(freeTitle.trim() || 'Anything, for 2 minutes')
  }

  return (
    <div className="stack">
      <section className="card hero">
        <p className="muted small">
          {now.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} · {fmtTime(now)}
        </p>
        <h1>
          {greeting(now.getHours())}, {s.name} 💕
        </h1>
      </section>

      {/* ---- the anti-procrastination core ---- */}
      <section className="card next-card">
        <div className="row-between">
          <h2>Next up</h2>
          {next && (
            <span className="pill">
              {blockState(next, now) === 'now' ? 'happening now' : untilText(new Date(next.day + 'T' + next.start).getTime() - now.getTime())}
            </span>
          )}
        </div>
        {next ? (
          <div className="next-title">
            {kindInfo(next.kind).icon} {next.title}
            <div className="muted small">
              {next.start} · {next.minutes} min
            </div>
          </div>
        ) : (
          <input placeholder="Nothing planned. What will you start?" value={freeTitle} onChange={(e) => setFreeTitle(e.target.value)} maxLength={80} />
        )}
        <button className="btn btn-primary btn-xl" onClick={justTwo} disabled={!!focus}>
          ⏱️ Just 2 minutes
          <span className="btn-sub">then roll into a {s.pomodoroWork}/{s.pomodoroBreak} Pomodoro if you're vibing</span>
        </button>
      </section>

      <div className="grid-2">
        <section className="card stat">
          <div className="stat-icon">🔥</div>
          <div className="stat-num">{stats.streak}</div>
          <div className="muted small">day streak</div>
        </section>
        <section className="card stat">
          <div className="stat-icon">⭐</div>
          <div className="stat-num">Lv {stats.level.level}</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${lvlPct}%` }} />
          </div>
          <div className="muted small">
            {stats.level.into}/{stats.level.need} XP
          </div>
        </section>
        <section className="card stat water-card">
          <div className="stat-icon">💧</div>
          <div className="stat-num">
            {water}/{s.waterGoal}
          </div>
          <div className="btn-row center-row">
            <button className="btn btn-primary water-btn" onClick={addWater} aria-label="Add a glass of water">
              +1 glass
            </button>
          </div>
          {water > 0 && (
            <button className="link-btn small" onClick={undoWater}>
              undo
            </button>
          )}
        </section>
        {s.showCountdown ? (
          <section className="card stat">
            <div className="stat-icon">🎓</div>
            <div className="stat-num">{daysLeft}</div>
            <div className="muted small">days to {s.countdownLabel || 'the big day'}</div>
            <div className="muted small">{Math.floor(daysLeft / 7)} weeks</div>
          </section>
        ) : (
          <section className="card stat">
            <div className="stat-icon">🍅</div>
            <div className="stat-num">{focusToday}</div>
            <div className="muted small">focus min today</div>
          </section>
        )}
      </div>

      <section className="card">
        <div className="row-between">
          <h2>Daily XP goal</h2>
          <span className="muted small">
            {stats.today}/{s.dailyXpGoal}
          </span>
        </div>
        <div className="bar thick">
          <div className="bar-fill" style={{ width: `${goalPct}%` }} />
        </div>
        {goalPct >= 100 && <p className="small">Goal smashed today 🎉</p>}
      </section>

      <section className="card">
        <div className="row-between">
          <h2>Today's schedule</h2>
          <span className="muted small">
            {done}/{blocks.length} done{missed ? ` · ${missed} missed` : ''}
          </span>
        </div>
        {blocks.length === 0 && !adding && <p className="muted small">No blocks yet. Add one, or open the Planner and tap ✨ Generate week.</p>}
        <ul className="blocks">
          {blocks.map((b) => (
            <BlockRow key={b.id} b={b} now={now} />
          ))}
        </ul>
        {adding ? (
          <AddBlock onDone={() => setAdding(false)} />
        ) : (
          <button className="btn btn-ghost full" onClick={() => setAdding(true)}>
            + Add a block
          </button>
        )}
      </section>

      <section className="card">
        <h2>This week</h2>
        <WeekChart data={stats.week} />
      </section>

      <button className="card link-card" onClick={() => go('alarms')}>
        <span>⏰ Alarms & reminders</span>
        <span className="muted small">{s.notifications ? 'Reminders on' : 'Reminders off'} ›</span>
      </button>
    </div>
  )
}
