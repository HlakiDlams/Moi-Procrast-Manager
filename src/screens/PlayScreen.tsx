import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, localDay, type Hobby } from '../lib/db'
import { setSetting, useSettings } from '../lib/settings'
import { ensureHobbiesSeeded, startPlay, usePlayBalance, usePlayState } from '../lib/play'
import WeekChart from '../components/WeekChart'

function HobbyEditor({ h, onClose }: { h: Hobby; onClose: () => void }) {
  const [x, setX] = useState(h)
  return (
    <div className="sheet-backdrop modal" onClick={onClose}>
      <div className="sheet modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Edit hobby">
        <div className="sheet-handle" />
        <div className="stack-sm">
          <h2>{h.id ? 'Edit hobby' : 'New hobby'}</h2>
          <div className="grid-3">
            <label className="field" style={{ gridColumn: '1 / -1' }}>
              <span className="field-label">Name</span>
              <input value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} placeholder="e.g. Guitar, Roblox, crochet" maxLength={30} />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Usual session</span>
            <select value={x.minutes} onChange={(e) => setX({ ...x, minutes: Number(e.target.value) })}>
              {[5, 10, 15, 20, 25, 30, 45, 60].map((m) => (
                <option key={m} value={m}>
                  {m} min
                </option>
              ))}
            </select>
          </label>
          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (!x.name.trim()) return
                await db.hobbies.put({ ...x, name: x.name.trim() })
                onClose()
              }}
            >
              Save
            </button>
            {h.id && (
              <button className="btn btn-danger" onClick={async () => confirm(`Delete ${h.name}?`) && (await db.hobbies.delete(h.id!), onClose())}>
                Delete
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlayScreen() {
  const s = useSettings()
  const bal = usePlayBalance(s)
  const active = usePlayState()
  const hobbies = useLiveQuery(() => db.hobbies.toArray(), []) ?? []
  const today = localDay()
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
  const logs = useLiveQuery(() => db.playLogs.where('day').between(days[0], today, true, true).toArray(), [today]) ?? []
  const [picked, setPicked] = useState<Hobby | null>(null)
  const [mins, setMins] = useState(15)
  const [edit, setEdit] = useState<Hobby | null>(null)

  useEffect(() => {
    ensureHobbiesSeeded().catch(() => {})
  }, [])

  const left = bal?.left ?? 0
  const onTime = logs.length ? Math.round((logs.filter((l) => l.onTime).length / logs.length) * 100) : null
  const byHobby = new Map<string, number>()
  for (const l of logs) byHobby.set(l.name, (byHobby.get(l.name) ?? 0) + l.minutes)

  async function go() {
    if (!picked) return
    if (
      mins > left &&
      !confirm(
        left > 0
          ? `You've earned ${left} min so far. Play ${mins} min anyway? The extra shows as borrowed.`
          : `You haven't earned play time yet today. Play anyway? (A 2-minute study start earns some fast!)`,
      )
    )
      return
    await startPlay(picked, mins)
    setPicked(null)
  }

  return (
    <div className="stack">
      <section className="card hero play-hero">
        <div className="muted small">Earned play time today</div>
        <div className={'big-num' + (left < 0 ? ' warn-text' : '')}>{left} min</div>
        {bal && (
          <p className="small muted">
            {bal.focusMin} focus min + {bal.lessons} lesson
            {bal.lessons === 1 ? '' : 's'} + {bal.workoutMin} workout min → {bal.earned} min earned
            {s.playBase ? ` (incl. ${s.playBase} free)` : ''} · {bal.used} used
          </p>
        )}
        <p className="field-hint">
          Every {s.playRatio} minutes of effort earns 1 minute of play. It resets at midnight.
          {left <= 0 && ' Start a "Just 2 minutes" on Today to earn some.'}
        </p>
      </section>

      {active && <p className="small center">A play timer is running</p>}

      <section className="sec">
        <div className="row-between sec-head">
          <h2>Pick your fun</h2>
          <button className="btn btn-ghost" onClick={() => setEdit({ name: '', icon: '', minutes: 15, active: true })}>
            + Hobby
          </button>
        </div>
        <div className="card">
          <div className="more-grid">
            {hobbies.map((h) => (
              <button
                key={h.id}
                className={'more-item' + (picked?.id === h.id ? ' picked' : '')}
                onClick={() => {
                  setPicked(h)
                  setMins(h.minutes)
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setEdit(h)
                }}
              >
                <span>{h.name}</span>
              </button>
            ))}
          </div>
          {picked && (
            <div className="stack-sm play-start">
              <div className="row-between">
                <strong>{picked.name}</strong>
                <button className="link-btn small" onClick={() => setEdit(picked)}>
                  edit
                </button>
              </div>
              <div className="chip-wrap">
                {[5, 10, 15, 20, 30, 45].map((m) => (
                  <button key={m} className={'tag-chip' + (mins === m ? ' on' : '')} onClick={() => setMins(m)}>
                    {m} min{m > left ? '' : ''}
                  </button>
                ))}
              </div>
              <button className="btn btn-primary btn-xl" onClick={go} disabled={!!active}>
                <Play size={16} fill="currentColor" /> Play {mins} min
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="sec">
        <div className="row-between sec-head">
          <h2>This week</h2>
          <span className="muted small">{onTime !== null ? `back on time ${onTime}%` : ''}</span>
        </div>
        <div className="card">
          <WeekChart
            data={days.map((d) => ({
              day: d,
              xp: logs.filter((l) => l.day === d).reduce((n, l) => n + l.minutes, 0),
            }))}
          />
          {byHobby.size > 0 && (
            <ul className="history small">
              {[...byHobby].map(([n, m]) => (
                <li key={n}>
                  <span>{n}</span>
                  <span>{m} min</span>
                  <span />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="sec">
        <h2 className="section-title">Play rules</h2>
        <div className="card">
          <div className="grid-2">
            <label className="field">
              <span className="field-label">Effort per play minute</span>
              <select value={s.playRatio} onChange={(e) => setSetting('playRatio', Number(e.target.value))}>
                {[2, 3, 4, 5, 6].map((r) => (
                  <option key={r} value={r}>
                    {r} min → 1 min
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Free minutes per day</span>
              <select value={s.playBase} onChange={(e) => setSetting('playBase', Number(e.target.value))}>
                {[0, 5, 10, 15, 20, 30].map((r) => (
                  <option key={r} value={r}>
                    {r} min
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Planner reward breaks</span>
              <select value={s.playEvery} onChange={(e) => setSetting('playEvery', Number(e.target.value))}>
                <option value={0}>Off</option>
                {[2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    After every {n} study blocks
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Reward break length</span>
              <select value={s.playBreakMin} onChange={(e) => setSetting('playBreakMin', Number(e.target.value))}>
                {[10, 15, 20, 30].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="field-hint">Reward breaks appear in your Planner next time you tap Generate week. They only go in after real study blocks.</p>
        </div>
      </section>

      {edit && <HobbyEditor h={edit} onClose={() => setEdit(null)} />}
    </div>
  )
}
