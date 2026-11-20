import { useEffect, useState, type CSSProperties } from 'react'
import { Bell, Check, ChevronRight, Gamepad2, Play, Plus, Timer, X } from '../icons'
import { useLiveQuery } from 'dexie-react-hooks'
import { displayName, useSettings } from '../lib/settings'
import { addXp, useXpStats } from '../lib/xp'
import { db, fmtTime, localDay, type Block, type BlockKind } from '../lib/db'
import { blockEnd, blockState, kindInfo, KINDS, nextBlock, setBlockDone } from '../lib/blocks'
import { startStarter, useFocus } from '../lib/focus'
import type { TabId } from '../tabs'
import WeekChart from '../components/WeekChart'
import StreakCard from '../components/StreakCard'
import CycleMini from '../components/CycleMini'
import { usePlayBalance } from '../lib/play'
import { useDueCards } from '../study/progress'

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

function PlayLink({ go }: { go: (t: TabId) => void }) {
  const s = useSettings()
  const bal = usePlayBalance(s)
  return (
    <button className="list-row" onClick={() => go('play')}>
      <span className="row-icon">
        <Gamepad2 size={18} />
      </span>
      <span className="row-main">Play time earned</span>
      <span className="row-value">{bal ? `${bal.left} min` : '…'}</span>
      <ChevronRight size={18} className="muted" />
    </button>
  )
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
    await db.blocks.add({
      day: localDay(),
      start,
      minutes,
      title: title.trim(),
      kind,
      status: 'planned',
    })
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
              {k.label}
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
        {b.status === 'done' ? <Check size={16} strokeWidth={3} /> : null}
      </button>
      <div className="block-main">
        <div className="block-title">
          <k.Icon size={15} className="kind-icon" /> {b.title}
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
            <Play size={16} />
          </button>
        )}
        <button className="icon-btn subtle" onClick={() => confirm(`Delete "${b.title}"?`) && db.blocks.delete(b.id!)} aria-label={`Delete ${b.title}`}>
          <X size={16} />
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
  const dueCount = useDueCards().length
  const [adding, setAdding] = useState(false)
  const [freeTitle, setFreeTitle] = useState('')

  const exam = new Date(s.matricStart + 'T09:00:00')
  const daysLeft = Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / 86_400_000))
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

  const when = next ? (blockState(next, now) === 'now' ? 'Now' : untilText(new Date(next.day + 'T' + next.start).getTime() - now.getTime())) : ''

  return (
    <div className="stack">
      <header className="today-head">
        <h1>
          {greeting(now.getHours())}, {displayName(s)}
        </h1>
        {s.showCountdown && (
          <p className="muted">
            {daysLeft} days to {s.countdownLabel || 'the big day'}
          </p>
        )}
      </header>

      {/* the anti-procrastination core */}
      <section className="card next-card">
        <div className="row-between">
          <span className="label in">Next up</span>
          {next && <span className="muted small">{when}</span>}
        </div>
        {next ? (
          <div className="next-title">
            {next.title}
            <div className="muted small">
              {next.start} · {next.minutes} min
            </div>
          </div>
        ) : (
          <input placeholder="Nothing planned. What will you start?" value={freeTitle} onChange={(e) => setFreeTitle(e.target.value)} maxLength={80} />
        )}
        <button className="btn btn-primary btn-xl stacked" onClick={justTwo} disabled={!!focus}>
          <span className="row-inline">
            <Timer size={20} /> Start with 2 minutes
          </span>
          <span className="btn-sub">Keep going and it becomes a {s.pomodoroWork}-minute Pomodoro</span>
        </button>
      </section>

      <div className="stat-strip">
        <button className="stat-cell" onClick={addWater} aria-label="Add a glass of water">
          <span className="v">
            {water}/{s.waterGoal}
          </span>
          <span className="k">water · tap +1</span>
        </button>
        <button className="stat-cell" onClick={() => go('study')}>
          <span className="v">{dueCount}</span>
          <span className="k">to review</span>
        </button>
        <div className="stat-cell">
          <span className="v">{stats.level.level}</span>
          <span className="k">level</span>
        </div>
        <div className="stat-cell">
          <span className="v">{focusToday}</span>
          <span className="k">focus min</span>
        </div>
      </div>
      {water > 0 && (
        <button className="link-btn small" onClick={undoWater}>
          Undo last glass
        </button>
      )}

      <StreakCard stats={stats} goal={s.dailyXpGoal} />

      <span className="label">
        Schedule · {done}/{blocks.length} done
        {missed ? ` · ${missed} missed` : ''}
      </span>
      <section className="card">
        {blocks.length === 0 && !adding && <p className="muted small">Nothing yet. Add a block, or generate your week in the Planner.</p>}
        <ul className="blocks">
          {blocks.map((b) => (
            <BlockRow key={b.id} b={b} now={now} />
          ))}
        </ul>
        {adding ? (
          <AddBlock onDone={() => setAdding(false)} />
        ) : (
          <button className="btn btn-ghost full" onClick={() => setAdding(true)}>
            <Plus size={18} /> Add a block
          </button>
        )}
      </section>

      <span className="label">XP this week</span>
      <section className="card">
        <WeekChart data={stats.week} />
      </section>

      <div className="list">
        <PlayLink go={go} />
        <CycleMini go={go} />
        <button className="list-row" onClick={() => go('alarms')}>
          <span className="row-icon">
            <Bell size={18} />
          </span>
          <span className="row-main">Reminders</span>
          <span className="row-value">{s.notifications ? 'On' : 'Off'}</span>
          <ChevronRight size={18} className="muted" />
        </button>
      </div>
    </div>
  )
}
