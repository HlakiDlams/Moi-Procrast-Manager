import { Play, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, localDay } from '../lib/db'
import { setSetting, useSettings } from '../lib/settings'
import { addXp } from '../lib/xp'
import { useProfile } from '../lib/profile'
import { useTheme } from '../lib/themes'
import { EXERCISES, GOALS, WORKOUTS, estMinutes, lowImpact, scaleSteps, workoutById, type Goal, type Step } from '../exercise/library'
import { PHASES, nextMonday, phaseDays, programmeDay } from '../exercise/programme'
import WorkoutPlayer from '../exercise/WorkoutPlayer'
import WeekChart from '../components/WeekChart'

const fmt = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
const ACTIVITIES = ['Soccer', 'Netball', 'Basketball', 'Volleyball', 'Running', 'Walking', 'Dancing', 'Swimming', 'Cycling', 'Martial arts class', 'Gym', 'Yoga', 'Other']

/** Log a sport / class / walk: counts towards the weekly goal and XP. */
function ActivityLogger({ today }: { today: string }) {
  const [open, setOpen] = useState(false)
  const [what, setWhat] = useState(ACTIVITIES[0])
  const [other, setOther] = useState('')
  const [mins, setMins] = useState(60)
  const [day, setDay] = useState(today)
  const [msg, setMsg] = useState('')
  async function save(e: React.FormEvent) {
    e.preventDefault()
    const name = what.endsWith('Other') && other.trim() ? `${other.trim()}` : what
    await db.workouts.add({
      day,
      at: new Date().toISOString(),
      workoutId: 'activity',
      name,
      minutes: mins,
      sets: [],
      completed: true,
    })
    const xp = Math.min(20, Math.max(3, Math.round(mins / 3)))
    await addXp(xp, 'exercise', `Activity: ${name}`)
    setMsg(`Logged ${name}, ${mins} min · +${xp} XP`)
    setOpen(false)
  }
  return (
    <section className="sec">
      <div className="row-between sec-head">
        <h2>Sport or activity</h2>
        <button className="btn btn-ghost" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : '+ Log'}
        </button>
      </div>
      <div className="card">
        {!open && <p className="muted small">Played a match, had practice, walked to the shops, danced? Log it here. It counts towards your weekly goal.</p>}
        {open && (
          <form className="stack-sm" onSubmit={save}>
            <div className="chip-wrap">
              {ACTIVITIES.map((a) => (
                <button key={a} type="button" className={'tag-chip' + (what === a ? ' on' : '')} onClick={() => setWhat(a)}>
                  {a}
                </button>
              ))}
            </div>
            {what.endsWith('Other') && <input placeholder="What did you do?" value={other} onChange={(e) => setOther(e.target.value)} maxLength={40} />}
            <div className="grid-2">
              <label className="field">
                <span className="field-label">Minutes</span>
                <select value={mins} onChange={(e) => setMins(Number(e.target.value))}>
                  {[10, 15, 20, 30, 45, 60, 75, 90, 120, 150, 180].map((m) => (
                    <option key={m} value={m}>
                      {m} min
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Day</span>
                <input type="date" value={day} max={today} onChange={(e) => setDay(e.target.value)} />
              </label>
            </div>
            <button className="btn btn-primary" type="submit">
              Save activity
            </button>
            <p className="field-hint">Tip: add regular practice (e.g. netball Tue 15:00) in Planner → Fixed commitments with type Exercise, and the Planner won't add an extra workout that day.</p>
          </form>
        )}
        {msg && <p className="small">{msg}</p>}
      </div>
    </section>
  )
}

const BREATH = /breath|asthma|wheez|lung|chest|nose|bleed|dust|heart|knee|back/i

interface Playing {
  workoutId: string
  name: string
  steps: Step[]
  programmeWeek?: number
}

export default function ExerciseScreen() {
  const s = useSettings()
  const p = useProfile()
  const today = localDay()
  const t = useTheme()
  const vars = t.tabVars('exercise')
  const [goal, setGoal] = useState<Goal | 'all'>('all')
  const [playing, setPlaying] = useState<Playing | null>(null)
  const logs = useLiveQuery(() => db.workouts.reverse().toArray(), []) ?? []

  const healthNotes = [p.conditions, p.allergies].filter(Boolean).join(' · ')
  const careful = BREATH.test(healthNotes)

  const prog = s.programmeStart ? programmeDay(s.programmeStart, today) : null
  const progWorkout = prog?.workoutId ? workoutById(prog.workoutId) : undefined

  // keep the Planner's workout days in step with the programme phase
  const wantDays = s.programmeStart ? phaseDays(s.programmeStart, today).join(',') : ''
  useEffect(() => {
    if (wantDays && [...s.exerciseDays].sort().join(',') !== wantDays) setSetting('exerciseDays', wantDays.split(',').map(Number))
  }, [wantDays, s.exerciseDays])

  function prepare(steps: Step[]) {
    return s.lowImpact ? lowImpact(steps) : steps
  }

  function startProgramme() {
    const start = nextMonday(today)
    if (!confirm(`Start the 12-week programme on ${fmt(start)}? Your Planner will put early-morning workouts on the training days.`)) return
    setSetting('programmeStart', start)
    setSetting('exerciseWhen', 'morning')
  }

  function playProgramme() {
    if (!prog?.phase || !progWorkout) return
    setPlaying({
      workoutId: progWorkout.id,
      name: `${progWorkout.name} · week ${prog.week}`,
      steps: prepare(scaleSteps(progWorkout.steps, prog.phase.factor, prog.phase.extraSet)),
      programmeWeek: prog.week,
    })
  }

  // stats
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
  const thisWeek = logs.filter((l) => l.day >= weekDays[0])
  const mondayKey = addDays(today, -((new Date(today + 'T12:00:00').getDay() + 6) % 7))
  const weekMin = logs.filter((l) => l.day >= mondayKey).reduce((n, l) => n + l.minutes, 0)
  const goalPct = Math.min(100, Math.round((weekMin / Math.max(1, s.exerciseGoalMin)) * 100))
  const best = new Map<string, number>()
  for (const l of logs) for (const x of l.sets) best.set(x.ex, Math.max(best.get(x.ex) ?? 0, x.reps ?? x.secs ?? 0))
  const progDone = s.programmeStart ? logs.filter((l) => l.programmeWeek && l.completed).length : 0

  return (
    <div className="stack">
      {(careful || healthNotes) && (
        <section className="card warn-card">
          <h2>Train safe</h2>
          {healthNotes && <p className="small muted">Your health notes: {healthNotes}</p>}
          <ul className="steps small">
            <li>Warm up first (built into every workout) and keep your inhaler nearby if you have one.</li>
            <li>Wipe your mat or floor with a damp cloth to keep dust down, and open a window.</li>
            <li>Breathe through your nose; slow down if you can't talk in short sentences.</li>
            <li>Stop if you feel wheezy, dizzy or have chest pain. For a nosebleed: sit, lean forward, pinch the soft part of your nose for 10 minutes.</li>
            <li>If breathing problems come with exercise often, get checked at a clinic before pushing harder.</li>
          </ul>
        </section>
      )}

      <section className="card">
        <label className="toggle">
          <input type="checkbox" checked={s.lowImpact} onChange={(e) => setSetting('lowImpact', e.target.checked)} />
          <span>Low-impact mode (no jumping)</span>
        </label>
        <p className="field-hint">Jumping jacks become step jacks, burpees become slow sprawls, high knees become a fast march.</p>
      </section>

      {/* ---------------- 12-week programme ---------------- */}
      <section className="card hero prog-card" style={vars}>
        <h2>12-week early-morning programme</h2>
        {!s.programmeStart ? (
          <>
            <ul className="steps small">
              {PHASES.map((ph) => (
                <li key={ph.name}>
                  <b>
                    Weeks {ph.weeks[0]}–{ph.weeks[1]}: {ph.name}
                  </b>
                  , {Object.keys(ph.days).length}×/week
                  {ph.factor > 1 ? `, ${Math.round((ph.factor - 1) * 100)}% more reps` : ''}
                  {ph.extraSet ? ' + extra set' : ''}
                </li>
              ))}
            </ul>
            <button className="btn btn-primary btn-xl" onClick={startProgramme}>
              Start on {fmt(nextMonday(today))}
            </button>
          </>
        ) : prog && prog.week === 0 ? (
          <p>Starts {fmt(s.programmeStart)}. Rest up and get your space ready</p>
        ) : prog?.finished ? (
          <>
            <p>You finished all 12 weeks! {progDone} sessions done.</p>
            <button className="btn" onClick={() => setSetting('programmeStart', '')}>
              Start again
            </button>
          </>
        ) : (
          prog && (
            <>
              <div className="row-between">
                <strong>
                  Week {prog.week}/12 · {prog.phase?.name}
                </strong>
                <span className="muted small">{progDone} sessions done</span>
              </div>
              <div className="prog-weeks" aria-label={`Week ${prog.week} of 12`}>
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} className={i + 1 < prog.week ? 'done' : i + 1 === prog.week ? 'now' : ''} />
                ))}
              </div>
              {progWorkout ? (
                <button className="btn btn-primary btn-xl" onClick={playProgramme}>
                  Today: {progWorkout.name}
                  <span className="btn-sub">about {estMinutes(scaleSteps(progWorkout.steps, prog.phase!.factor, prog.phase!.extraSet)) + 2} min</span>
                </button>
              ) : (
                <p className="small">
                  Rest day. Recovery is part of training.{' '}
                  <button
                    className="link-btn"
                    onClick={() =>
                      setPlaying({
                        workoutId: 'flex-a',
                        name: 'Stretch & breathe',
                        steps: prepare(workoutById('flex-a')!.steps),
                      })
                    }
                  >
                    Do a gentle stretch?
                  </button>
                </p>
              )}
              <button className="link-btn small" onClick={() => confirm('Stop the 12-week programme?') && setSetting('programmeStart', '')}>
                Stop programme
              </button>
            </>
          )
        )}
      </section>

      <section className="sec">
        <div className="row-between sec-head">
          <h2>This week</h2>
          <span className="muted small">
            {weekMin} / {s.exerciseGoalMin} min
          </span>
        </div>
        <div className="card">
          <div className="bar thick">
            <div className="bar-fill" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="field-hint">
            {goalPct >= 100 ? 'Weekly goal reached!' : ''}Workouts and sports both count. Goal:{' '}
            <select className="inline-select" value={s.exerciseGoalMin} onChange={(e) => setSetting('exerciseGoalMin', Number(e.target.value))} aria-label="Weekly goal">
              {[60, 90, 120, 150, 180, 240, 300].map((m) => (
                <option key={m} value={m}>
                  {m} min/week
                </option>
              ))}
            </select>
          </p>
        </div>
      </section>

      <ActivityLogger today={today} />

      {/* ---------------- workouts ---------------- */}
      <section className="sec">
        <h2 className="section-title">Workouts</h2>
        <div className="card">
          <div className="chip-wrap">
            <button className={'tag-chip' + (goal === 'all' ? ' on' : '')} onClick={() => setGoal('all')}>
              All
            </button>
            {GOALS.map((g) => (
              <button key={g.id} className={'tag-chip' + (goal === g.id ? ' on' : '')} onClick={() => setGoal(g.id)}>
                {g.label}
              </button>
            ))}
          </div>
          <div className="stack-sm wk-list">
            {WORKOUTS.filter((w) => goal === 'all' || w.goal === goal).map((w) => {
              const steps = prepare(w.steps)
              return (
                <button key={w.id} className="course-card" style={{ '--k': 'var(--accent)' } as React.CSSProperties} onClick={() => setPlaying({ workoutId: w.id, name: w.name, steps })}>
                  <span className="course-main">
                    <strong>{w.name}</strong>
                    <span className="muted small">
                      {estMinutes(steps) + 2} min · {w.desc}
                    </span>
                  </span>
                  <span className="muted">
                    <Play size={18} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- progress ---------------- */}
      <section className="sec">
        <div className="row-between sec-head">
          <h2>Progress</h2>
          <span className="muted small">
            {thisWeek.length} workouts · {thisWeek.reduce((n, l) => n + l.minutes, 0)} min this week
          </span>
        </div>
        <div className="card">
          <WeekChart
            data={weekDays.map((d) => ({
              day: d,
              xp: logs.filter((l) => l.day === d).reduce((n, l) => n + l.minutes, 0),
            }))}
          />
          {best.size > 0 && (
            <>
              <span className="field-label">Personal bests</span>
              <ul className="history small">
                {[...best].map(([id, v]) => (
                  <li key={id}>
                    <span>{EXERCISES[id]?.name}</span>
                    <span>{EXERCISES[id]?.type === 'time' ? `${v}s` : `${v} reps`}</span>
                    <span />
                  </li>
                ))}
              </ul>
            </>
          )}
          {logs.length > 0 ? (
            <>
              <span className="field-label">History</span>
              <ul className="history small">
                {logs.slice(0, 10).map((l) => (
                  <li key={l.id}>
                    <span>
                      {fmt(l.day)} · {l.name}
                    </span>
                    <span className="muted">
                      {l.minutes} min{l.completed ? '' : ' (part)'}
                    </span>
                    <button className="icon-btn subtle" onClick={() => confirm('Delete this workout?') && db.workouts.delete(l.id!)} aria-label="Delete">
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted small">No workouts yet. Start with any one above: even the warm-up counts</p>
          )}
        </div>
      </section>

      {playing && <WorkoutPlayer {...playing} vars={vars} onClose={() => setPlaying(null)} />}
    </div>
  )
}
