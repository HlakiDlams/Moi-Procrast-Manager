import { useEffect, useState, type CSSProperties } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, localDay, type MealKind, type Routine } from '../lib/db'
import { setSetting, useSettings } from '../lib/settings'
import { useProfile } from '../lib/profile'
import { addXp } from '../lib/xp'
import { ensureRoutinesSeeded, routineDueOn, sleepHours, xpOnce } from '../lib/selfcare'
import WeekChart from '../components/WeekChart'
import { isIOS, isNative } from '../lib/platform'
import { disableAutoSteps, enableAutoSteps, syncSteps } from '../lib/steps'
import PeriodCard from './PeriodCard'

const MOODS = ['😞', '😕', '😐', '🙂', '😄']
const MOOD_WORDS = ['Rough', 'Meh', 'Okay', 'Good', 'Great']
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function last7(today: string) {
  return Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
}

// ---------------- mood ----------------

function MoodCard({ today }: { today: string }) {
  const m = useLiveQuery(() => db.moods.get(today), [today])
  const [note, setNote] = useState<string | null>(null)
  const save = async (patch: { mood?: number; energy?: number; note?: string }) => {
    await db.moods.put({ day: today, mood: m?.mood ?? 3, energy: m?.energy ?? 3, note: m?.note, ...patch })
    await xpOnce(today, 'mood', 2)
  }
  return (
    <section className="card">
      <h2>How are you feeling?</h2>
      <div className="mood-row" role="radiogroup" aria-label="Mood">
        {MOODS.map((e, i) => (
          <button key={i} className={'mood-btn' + (m?.mood === i + 1 ? ' on' : '')} onClick={() => save({ mood: i + 1 })} aria-pressed={m?.mood === i + 1} aria-label={MOOD_WORDS[i]}>
            {e}
          </button>
        ))}
      </div>
      <div className="row-between small">
        <span className="field-label">Energy</span>
        <span className="muted">{m ? `${m.energy}/5` : ''}</span>
      </div>
      <div className="energy-row" role="radiogroup" aria-label="Energy">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} className={'energy-seg' + ((m?.energy ?? 0) >= n ? ' on' : '')} onClick={() => save({ energy: n })} aria-label={`Energy ${n}`} />
        ))}
      </div>
      {m && (
        <input
          className="mood-note"
          placeholder="Anything on your mind? (optional)"
          value={note ?? m.note ?? ''}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== null && save({ note })}
          maxLength={200}
        />
      )}
      {m && m.mood <= 2 && <p className="small soft-note">Sending you a hug 💕 Be gentle with yourself today: water, a short walk, and one small task is enough. If it keeps feeling heavy, talk to someone you trust.</p>}
    </section>
  )
}

// ---------------- water ----------------

function WaterCard({ today, goal }: { today: string; goal: number }) {
  const n = useLiveQuery(() => db.water.where('day').equals(today).count(), [today]) ?? 0
  async function add() {
    await db.water.add({ day: today, at: new Date().toISOString() })
    if (n < goal) await addXp(2, 'selfcare', 'Water')
    navigator.vibrate?.(30)
  }
  async function undo() {
    const last = await db.water.where('day').equals(today).last()
    if (last?.id !== undefined) await db.water.delete(last.id)
  }
  return (
    <section className="card">
      <div className="row-between">
        <h2>💧 Water</h2>
        <span className="muted small">
          {n}/{goal} glasses
        </span>
      </div>
      <div className="glasses">
        {Array.from({ length: Math.max(goal, n) }, (_, i) => (
          <button key={i} className={'glass' + (i < n ? ' full' : '')} onClick={i < n ? undefined : add} aria-label={i < n ? 'Glass drunk' : 'Add a glass'}>
            {i < n ? '💧' : '○'}
          </button>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={add}>
          + 1 glass
        </button>
        {n > 0 && (
          <button className="btn btn-ghost" onClick={undo}>
            Undo
          </button>
        )}
      </div>
    </section>
  )
}

// ---------------- steps ----------------

function AutoSteps({ on }: { on: boolean }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  if (!isNative) return <p className="field-hint">📲 In the phone app (Android or iPhone), steps can be counted automatically.</p>
  return (
    <div className="auto-steps">
      <label className="toggle">
        <input
          type="checkbox"
          checked={on}
          disabled={busy}
          onChange={async (e) => {
            setBusy(true)
            setMsg('')
            if (e.target.checked) {
              const r = await enableAutoSteps().catch(() => 'denied' as const)
              if (r === 'no-sensor') setMsg("This phone doesn't have a step sensor, so keep typing steps in.")
              if (r === 'denied') setMsg(isIOS ? 'Allow "Motion & Fitness" for Un-procrast-inator in Settings → Privacy & Security, then try again.' : 'Allow "Physical activity" for Un-procrast-inator in your phone settings, then try again.')
              if (r === 'on') setMsg(isIOS ? 'Counting ✨ Your last 7 days were filled in from your iPhone.' : 'Counting from now on ✨ Today starts from this moment; tomorrow will be the full day.')
            } else await disableAutoSteps()
            setBusy(false)
          }}
        />
        <span>📲 Count steps automatically</span>
      </label>
      {on && (
        <button
          className="link-btn small"
          onClick={async () => {
            const r = await syncSteps()
            setMsg(r?.ok ? 'Updated ✅' : "Couldn't read the step sensor just now.")
          }}
        >
          Refresh now
        </button>
      )}
      {msg && <p className="small">{msg}</p>}
      {on && (
        <p className="field-hint">
          {isIOS
            ? "Uses your iPhone's motion chip, which keeps the last 7 days, so it fills in whenever you open the app. Carry your phone for it to count. A bigger number you type in (e.g. from a watch) wins."
            : 'Uses your phone\'s step sensor, checked about every 15 min. On Huawei, set the app to "Manage manually" in Battery → App launch so it keeps counting. Carry your phone for it to count. A bigger number you type in (e.g. from a watch) wins.'}
        </p>
      )}
    </div>
  )
}

function StepsCard({ today, goal, auto }: { today: string; goal: number; auto: boolean }) {
  const days = last7(today)
  const rows = useLiveQuery(() => db.steps.where('day').between(days[0], today, true, true).toArray(), [today]) ?? []
  const todayRow = rows.find((r) => r.day === today)
  const [val, setVal] = useState('')
  const pct = Math.min(100, Math.round(((todayRow?.steps ?? 0) / goal) * 100))
  async function save(e: React.FormEvent) {
    e.preventDefault()
    const steps = Math.round(Number(val))
    if (!(steps >= 0 && steps < 200000)) return
    await db.steps.put({ day: today, steps })
    if (steps >= goal) await xpOnce(today, 'steps', 5)
    setVal('')
  }
  return (
    <section className="card">
      <div className="row-between">
        <h2>👟 Steps</h2>
        <span className="muted small">
          {(todayRow?.steps ?? 0).toLocaleString('en-ZA')} / {goal.toLocaleString('en-ZA')}
        </span>
      </div>
      <div className="bar thick">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <form className="weigh-form two" onSubmit={save}>
        <input type="number" inputMode="numeric" placeholder="Today's steps" value={val} onChange={(e) => setVal(e.target.value)} aria-label="Steps today" />
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
      <AutoSteps on={auto} />
      <p className="field-hint">{auto ? 'Or type a number from your watch or health app.' : "Copy today's number from your phone's health app (e.g. Huawei Health)."} Goal: </p>
      <select className="inline-select" value={goal} onChange={(e) => setSetting('stepsGoal', Number(e.target.value))} aria-label="Steps goal">
        {[3000, 5000, 6000, 7500, 8000, 10000, 12000].map((g) => (
          <option key={g} value={g}>
            {g.toLocaleString('en-ZA')} steps
          </option>
        ))}
      </select>
      <WeekChart data={days.map((d) => ({ day: d, xp: rows.find((r) => r.day === d)?.steps ?? 0 }))} />
    </section>
  )
}

// ---------------- sleep ----------------

function SleepCard({ today, bedDefault, wakeDefault }: { today: string; bedDefault: string; wakeDefault: string }) {
  const days = last7(today)
  const rows = useLiveQuery(() => db.sleep.where('day').between(days[0], today, true, true).toArray(), [today]) ?? []
  const todayRow = rows.find((r) => r.day === today)
  // your edits win; otherwise show what was saved, otherwise your usual times
  const [draft, setDraft] = useState<{ bed?: string; wake?: string; quality?: number }>({})
  const bed = draft.bed ?? todayRow?.bed ?? bedDefault
  const wake = draft.wake ?? todayRow?.wake ?? wakeDefault
  const quality = draft.quality ?? todayRow?.quality ?? 3
  const setBed = (v: string) => setDraft((d) => ({ ...d, bed: v }))
  const setWake = (v: string) => setDraft((d) => ({ ...d, wake: v }))
  const setQuality = (v: number) => setDraft((d) => ({ ...d, quality: v }))
  const hours = sleepHours(bed, wake)
  const avg = rows.length ? Math.round((rows.reduce((n, r) => n + r.hours, 0) / rows.length) * 10) / 10 : null

  async function save() {
    await db.sleep.put({ day: today, bed, wake, hours, quality })
    setDraft({})
    await xpOnce(today, 'sleep', 2)
  }

  return (
    <section className="card">
      <div className="row-between">
        <h2>😴 Sleep (last night)</h2>
        {avg !== null && <span className="muted small">7-day avg {avg} h</span>}
      </div>
      <div className="grid-3">
        <label className="field">
          <span className="field-label">Bed</span>
          <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Woke</span>
          <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} />
        </label>
        <div className="field">
          <span className="field-label">Hours</span>
          <div className={'big-val' + (hours < 7 ? ' warn-text' : '')}>{hours}</div>
        </div>
      </div>
      <div className="row-between">
        <span className="field-label">Quality</span>
        <span className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={'star' + (n <= quality ? ' on' : '')} onClick={() => setQuality(n)} aria-label={`${n} stars`}>
              ★
            </button>
          ))}
        </span>
      </div>
      <button className="btn btn-primary full" onClick={save}>
        {todayRow ? 'Update' : 'Save'} sleep
      </button>
      {hours < 7 && <p className="small warn-text">Under 7 hours. Your brain files away what you studied while you sleep, so protect your bedtime 💤</p>}
      <WeekChart data={days.map((d) => ({ day: d, xp: rows.find((r) => r.day === d)?.hours ?? 0 }))} />
    </section>
  )
}

// ---------------- meals ----------------

const MEALS: { id: MealKind; icon: string; label: string }[] = [
  { id: 'breakfast', icon: '🍳', label: 'Breakfast' },
  { id: 'lunch', icon: '🥪', label: 'Lunch' },
  { id: 'supper', icon: '🍲', label: 'Supper' },
  { id: 'snack', icon: '🍎', label: 'Snack' },
]

function MealsCard({ today }: { today: string }) {
  const rows = useLiveQuery(() => db.meals.where('day').equals(today).toArray(), [today]) ?? []
  const [note, setNote] = useState('')
  async function toggle(m: MealKind) {
    const existing = rows.find((r) => r.meal === m)
    if (existing && m !== 'snack') {
      await db.meals.delete(existing.id!)
      return
    }
    await db.meals.add({ day: today, at: new Date().toISOString(), meal: m, note: note.trim() || undefined })
    setNote('')
    await xpOnce(today, `meal-${m}`, 1)
  }
  return (
    <section className="card">
      <h2>🍽️ Meals today</h2>
      <div className="meal-grid">
        {MEALS.map((m) => {
          const count = rows.filter((r) => r.meal === m.id).length
          return (
            <button key={m.id} className={'meal-btn' + (count ? ' on' : '')} onClick={() => toggle(m.id)} aria-pressed={count > 0}>
              <span className="meal-icon">{m.icon}</span>
              {m.label}
              {count > 1 && <span className="muted small"> ×{count}</span>}
            </button>
          )
        })}
      </div>
      <input placeholder="What did you eat? (optional, then tap the meal)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={100} />
      {rows.some((r) => r.note) && (
        <ul className="history small">
          {rows
            .filter((r) => r.note)
            .map((r) => (
              <li key={r.id}>
                <span>{MEALS.find((m) => m.id === r.meal)?.icon}</span>
                <span>{r.note}</span>
                <button className="icon-btn subtle" onClick={() => db.meals.delete(r.id!)} aria-label="Delete">
                  ✕
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  )
}

// ---------------- routines ----------------

function RoutineEditor({ r, onClose }: { r: Routine; onClose: () => void }) {
  const [x, setX] = useState(r)
  const [newItem, setNewItem] = useState('')
  return (
    <div className="sheet-backdrop modal" onClick={onClose}>
      <div className="sheet modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Edit routine">
        <div className="sheet-handle" />
        <div className="stack-sm">
          <div className="grid-3">
            <label className="field">
              <span className="field-label">Icon</span>
              <input value={x.icon} onChange={(e) => setX({ ...x, icon: e.target.value })} maxLength={4} />
            </label>
            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span className="field-label">Name</span>
              <input value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} maxLength={30} />
            </label>
          </div>
          <span className="field-label">Steps</span>
          {x.items.map((it, i) => (
            <div key={it.id} className="input-row">
              <input value={it.label} onChange={(e) => setX({ ...x, items: x.items.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)) })} maxLength={60} />
              <button className="icon-btn subtle" onClick={() => setX({ ...x, items: x.items.filter((_, j) => j !== i) })} aria-label="Remove step">
                ✕
              </button>
            </div>
          ))}
          <form
            className="input-row"
            onSubmit={(e) => {
              e.preventDefault()
              if (!newItem.trim()) return
              setX({ ...x, items: [...x.items, { id: Math.random().toString(36).slice(2, 8), label: newItem.trim() }] })
              setNewItem('')
            }}
          >
            <input placeholder="Add a step" value={newItem} onChange={(e) => setNewItem(e.target.value)} maxLength={60} />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
          <span className="field-label">Days (none selected = every day)</span>
          <div className="day-picker">
            {DOW.map((d, i) => (
              <button key={i} type="button" className={'day-chip' + (x.days.includes(i) ? ' on' : '')} onClick={() => setX({ ...x, days: x.days.includes(i) ? x.days.filter((y) => y !== i) : [...x.days, i] })}>
                {d}
              </button>
            ))}
          </div>
          <label className="field">
            <span className="field-label">Reminder time (optional)</span>
            <input type="time" value={x.time ?? ''} onChange={(e) => setX({ ...x, time: e.target.value || undefined })} />
          </label>
          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if (x.id) await db.routines.put(x)
                else await db.routines.add(x)
                onClose()
              }}
            >
              Save
            </button>
            {x.id && (
              <button className="btn btn-danger" onClick={async () => confirm(`Delete ${x.name}?`) && (await db.routines.delete(x.id!), onClose())}>
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

function RoutinesCard({ today }: { today: string }) {
  const routines = useLiveQuery(() => db.routines.toArray(), []) ?? []
  const checks = useLiveQuery(() => db.routineChecks.where('day').equals(today).toArray(), [today]) ?? []
  const [edit, setEdit] = useState<Routine | null>(null)
  const due = routines.filter((r) => routineDueOn(r, today))
  const isOn = (r: Routine, itemId: string) => checks.some((c) => c.key === `${today}:${r.id}:${itemId}`)

  async function toggle(r: Routine, itemId: string) {
    const key = `${today}:${r.id}:${itemId}`
    if (isOn(r, itemId)) {
      await db.routineChecks.delete(key)
      return
    }
    await db.routineChecks.put({ key, day: today, routineId: r.id!, itemId })
    const doneNow = r.items.every((it) => it.id === itemId || isOn(r, it.id))
    if (doneNow) await xpOnce(today, `routine-${r.id}`, 3)
  }

  return (
    <section className="card">
      <div className="row-between">
        <h2>✨ Routines</h2>
        <button className="btn btn-ghost" onClick={() => setEdit({ name: 'New routine', icon: '✨', items: [], days: [], active: true })}>
          + New
        </button>
      </div>
      {due.length === 0 && <p className="muted small">No routines today.</p>}
      <div className="stack-sm">
        {due.map((r) => {
          const done = r.items.filter((it) => isOn(r, it.id)).length
          return (
            <div key={r.id} className={'routine' + (done === r.items.length && r.items.length ? ' complete' : '')}>
              <div className="row-between">
                <strong>
                  {r.icon} {r.name}
                </strong>
                <button className="link-btn small" onClick={() => setEdit(r)}>
                  {done}/{r.items.length} · edit
                </button>
              </div>
              <div className="routine-items">
                {r.items.map((it) => (
                  <label key={it.id} className="toggle routine-item">
                    <input type="checkbox" checked={isOn(r, it.id)} onChange={() => toggle(r, it.id)} />
                    <span>{it.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {routines.filter((r) => !routineDueOn(r, today)).length > 0 && (
        <p className="muted small">
          Not today:{' '}
          {routines
            .filter((r) => !routineDueOn(r, today))
            .map((r) => (
              <button key={r.id} className="link-btn small" onClick={() => setEdit(r)}>
                {r.icon} {r.name}
              </button>
            ))}
        </p>
      )}
      {edit && <RoutineEditor r={edit} onClose={() => setEdit(null)} />}
    </section>
  )
}

// ---------------- screen ----------------

export default function SelfCareScreen() {
  const s = useSettings()
  const p = useProfile()
  const today = localDay()
  useEffect(() => {
    ensureRoutinesSeeded().catch(() => {})
  }, [])
  const showPeriods = s.trackPeriods === 'on' || (s.trackPeriods === 'auto' && p.gender === 'Female')

  return (
    <div className="stack" style={{ '--k': 'var(--accent)' } as CSSProperties}>
      <MoodCard today={today} />
      <WaterCard today={today} goal={s.waterGoal} />
      {showPeriods && <PeriodCard today={today} />}
      <RoutinesCard today={today} />
      <MealsCard today={today} />
      <SleepCard today={today} bedDefault={s.bedtime} wakeDefault={s.wakeTime} />
      <StepsCard today={today} goal={s.stepsGoal} auto={s.autoSteps} />
      <section className="card">
        <h2>Period tracker</h2>
        <div className="seg seg-3">
          {(['auto', 'on', 'off'] as const).map((v) => (
            <button key={v} className={s.trackPeriods === v ? 'on' : ''} onClick={() => setSetting('trackPeriods', v)}>
              {v === 'auto' ? 'Auto' : v === 'on' ? 'Show' : 'Hide'}
            </button>
          ))}
        </div>
        <p className="field-hint">Auto shows it when your profile gender is Female. Anyone can turn it on or off.</p>
      </section>
    </div>
  )
}
