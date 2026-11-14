import { BookOpen, ChevronLeft, Dumbbell, Languages, Scale, Target, Timer, Wallet, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, localDay, type Goal, type GoalSource } from '../lib/db'
import { MAX_KG_PER_WEEK, checkWeightGoal, pace, type Pace } from '../lib/goals'
import { ageOn, useProfile } from '../lib/profile'
import { COURSES, allLessons } from '../study/courses'

const fmt = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
const r1 = (n: number) => Math.round(n * 10) / 10
const nowIso = () => new Date().toISOString()

/** Current value of a goal, from its source. */
async function currentValue(g: Goal): Promise<number> {
  switch (g.source) {
    case 'weight': {
      const last = await db.weights.orderBy('day').last()
      return last?.kg ?? g.startValue
    }
    case 'lessons':
      return db.lessons
        .where('courseId')
        .equals(g.courseId ?? '')
        .count()
    case 'workouts':
      return (
        g.startValue +
        (await db.workouts
          .where('day')
          .aboveOrEqual(g.startDate)
          .filter((w) => w.completed)
          .count())
      )
    case 'focusHours': {
      const f = await db.focus.where('day').aboveOrEqual(g.startDate).toArray()
      return r1(g.startValue + f.reduce((n, x) => n + x.minutes, 0) / 60)
    }
    default: {
      const logs = await db.goalLogs.where('goalId').equals(g.id!).sortBy('day')
      return logs.length ? logs[logs.length - 1].value : g.startValue
    }
  }
}

/** Line icon for a goal (older goals stored an emoji; we use the category instead). */
const GOAL_ICON: Record<string, LucideIcon> = {
  body: Scale,
  study: BookOpen,
  focus: Timer,
  fitness: Dumbbell,
  money: Wallet,
  language: Languages,
  other: Target,
}
function GoalIcon({ g }: { g: { icon: string; category: string } }) {
  const I = GOAL_ICON[g.icon] ?? GOAL_ICON[g.category] ?? Target
  return <I size={22} />
}

const STATUS: Record<Pace['status'], [string, string]> = {
  done: ['Done', 'ok'],
  early: ['Fresh start', 'info'],
  ahead: ['Ahead', 'ok'],
  'on-track': ['On track', 'ok'],
  behind: ['Behind', 'warn'],
  overdue: ['Date passed', 'warn'],
}

interface Template {
  label: string
  icon: string
  category: Goal['category']
  source: GoalSource
  unit: string
  title: string
}

const TEMPLATES: Template[] = [
  {
    label: 'Body weight',
    icon: 'body',
    category: 'body',
    source: 'weight',
    unit: 'kg',
    title: 'Reach a healthy weight',
  },
  {
    label: 'Finish lessons',
    icon: 'study',
    category: 'study',
    source: 'lessons',
    unit: 'lessons',
    title: 'Finish lessons',
  },
  {
    label: 'Focus hours',
    icon: 'focus',
    category: 'study',
    source: 'focusHours',
    unit: 'hours',
    title: 'Focus hours',
  },
  {
    label: 'Workouts',
    icon: 'fitness',
    category: 'fitness',
    source: 'workouts',
    unit: 'workouts',
    title: 'Workouts done',
  },
  {
    label: 'Save money',
    icon: 'money',
    category: 'money',
    source: 'manual',
    unit: 'R',
    title: 'Save money',
  },
  {
    label: 'Words / kanji',
    icon: 'language',
    category: 'language',
    source: 'manual',
    unit: 'words',
    title: 'Learn words',
  },
  {
    label: 'Anything else',
    icon: 'other',
    category: 'other',
    source: 'manual',
    unit: '',
    title: '',
  },
]

function NewGoal({ onClose }: { onClose: () => void }) {
  const p = useProfile()
  const subjects = useLiveQuery(() => db.subjects.toArray(), []) ?? []
  const lastWeight = useLiveQuery(() => db.weights.orderBy('day').last(), [])
  const today = localDay()
  const [t, setT] = useState<Template | null>(null)
  const [title, setTitle] = useState('')
  const [unit, setUnit] = useState('')
  const [start, setStart] = useState('0')
  const [target, setTarget] = useState('')
  const [date, setDate] = useState(addDays(today, 90))
  const [courseId, setCourseId] = useState(COURSES[0].id)
  const [subjectId, setSubjectId] = useState<number | ''>('')
  const [err, setErr] = useState<React.ReactNode>(null)

  function pick(x: Template) {
    setT(x)
    setTitle(x.title)
    setUnit(x.unit)
    setStart(x.source === 'weight' ? String(lastWeight?.kg ?? '') : '0')
  }

  async function save(force?: { date?: string; target?: number }) {
    if (!t) return
    const tgt = force?.target ?? Number(target)
    const dt = force?.date ?? date
    let startValue = Number(start) || 0
    if (t.source === 'lessons') startValue = await db.lessons.where('courseId').equals(courseId).count()
    if (t.source === 'workouts' || t.source === 'focusHours') startValue = 0
    if (!title.trim() || !Number.isFinite(tgt) || dt <= today) {
      setErr('Add a title, a target and a date in the future.')
      return
    }
    if (t.source === 'weight') {
      if (!startValue) {
        setErr('Log your current weight in Body (above) first.')
        return
      }
      const height = p.heightCm ?? lastWeight?.heightCm ?? null
      const c = checkWeightGoal(startValue, tgt, today, dt, height, ageOn(p.dob))
      if (!c.ok) {
        setErr(
          <div className="stack-sm">
            {c.belowHealthy && (
              <p className="small">
                {tgt} kg is below the healthy range for your height ({c.healthyMin}–{c.healthyMax} kg), so we won't set that goal. Your body needs fuel to study, grow and stay well.
              </p>
            )}
            {!c.belowHealthy && c.saferDate && (
              <p className="small">
                That's about {r1(c.perWeek)} kg a week. A healthy pace is at most {MAX_KG_PER_WEEK} kg a week, without crash diets. A safer date is <b>{fmt(c.saferDate)}</b>.
              </p>
            )}
            <div className="btn-row">
              {!c.belowHealthy && c.saferDate && (
                <button className="btn btn-primary" onClick={() => save({ date: c.saferDate })}>
                  Use {fmt(c.saferDate)}
                </button>
              )}
              {c.belowHealthy && c.healthyMin && (
                <button className="btn btn-primary" onClick={() => setTarget(String(c.healthyMin))}>
                  Aim for {c.healthyMin} kg instead
                </button>
              )}
            </div>
          </div>,
        )
        return
      }
    }
    await db.goals.add({
      title: title.trim(),
      icon: t.icon,
      category: t.category,
      source: t.source,
      courseId: t.source === 'lessons' ? courseId : undefined,
      subjectId: subjectId === '' ? undefined : subjectId,
      unit: unit.trim(),
      startValue,
      target: tgt,
      startDate: today,
      targetDate: dt,
      createdAt: nowIso(),
    })
    onClose()
  }

  const lessonCount = allLessons(COURSES.find((c) => c.id === courseId) ?? COURSES[0]).length

  return (
    <div className="sheet-backdrop modal" onClick={onClose}>
      <div className="sheet modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="New goal">
        <div className="sheet-handle" />
        <h2>New goal</h2>
        {!t ? (
          <div className="more-grid">
            {TEMPLATES.map((x) => (
              <button key={x.label} className="more-item" onClick={() => pick(x)}>
                <span className="more-icon">
                  <GoalIcon g={x} />
                </span>
                <span>{x.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="stack-sm">
            <label className="field">
              <span className="field-label">Goal</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pass Maths with 40%" maxLength={60} />
            </label>
            {t.source === 'lessons' && (
              <label className="field">
                <span className="field-label">Course</span>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="field-hint">{lessonCount} lessons in this course so far</span>
              </label>
            )}
            <div className="grid-3">
              {t.source === 'manual' && (
                <label className="field">
                  <span className="field-label">Now</span>
                  <input type="number" inputMode="decimal" value={start} onChange={(e) => setStart(e.target.value)} />
                </label>
              )}
              {t.source === 'weight' && (
                <label className="field">
                  <span className="field-label">Now (kg)</span>
                  <input type="number" value={start} readOnly />
                </label>
              )}
              <label className="field">
                <span className="field-label">Target</span>
                <input type="number" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Unit</span>
                <input value={unit} onChange={(e) => setUnit(e.target.value)} maxLength={12} readOnly={t.source !== 'manual'} />
              </label>
            </div>
            <label className="field">
              <span className="field-label">By</span>
              <input type="date" value={date} min={addDays(today, 1)} onChange={(e) => setDate(e.target.value)} />
            </label>
            {subjects.length > 0 && t.category !== 'body' && (
              <label className="field">
                <span className="field-label">Linked Planner subject (optional)</span>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">None</option>
                  {subjects.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
                <span className="field-hint">If you fall behind and choose to speed up, this subject gets more Planner time.</span>
              </label>
            )}
            {t.source === 'weight' && <p className="field-hint">We keep body goals to a healthy pace (max {MAX_KG_PER_WEEK} kg/week) and never suggest cutting meals.</p>}
            {err && <div className="soft-note small">{err}</div>}
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => save()}>
                Save goal
              </button>
              <button className="btn btn-ghost" onClick={() => setT(null)}>
                <ChevronLeft size={16} /> Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function GoalCard({ g, cur }: { g: Goal; cur: number }) {
  const today = localDay()
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  const [msg, setMsg] = useState('')
  const pc = pace(g, cur, today, g.source === 'weight' ? { maxRate: MAX_KG_PER_WEEK } : {})
  const [label, tone] = STATUS[pc.status]
  const u = g.unit ? ` ${g.unit}` : ''
  const per = (n: number) => `${r1(n)}${u}/week`

  async function logValue(e: React.FormEvent) {
    e.preventDefault()
    const v = Number(val)
    if (!Number.isFinite(v)) return
    if (g.source === 'weight') {
      const existing = await db.weights.where('day').equals(today).first()
      if (existing?.id !== undefined) await db.weights.update(existing.id, { kg: v })
      else await db.weights.add({ day: today, kg: v })
    } else await db.goalLogs.add({ goalId: g.id!, day: today, value: v })
    setVal('')
  }

  async function moveDate() {
    if (!pc.newDate) return
    // a new plan starts fresh from today, from where you are now
    await db.goals.update(g.id!, {
      targetDate: pc.newDate,
      startDate: today,
      startValue: cur,
    })
    setMsg(`New plan: about ${per(pc.assumedRate ?? pc.rate)}, finishing by ${fmt(pc.newDate)}.`)
  }

  async function speedUp() {
    await db.goals.update(g.id!, { startDate: today, startValue: cur })
    let extra = ''
    if (g.subjectId) {
      const s = await db.subjects.get(g.subjectId)
      if (s) {
        await db.subjects.update(g.subjectId, { priority: 3 })
        extra = ` ${s.name} is now top priority. Tap Generate week in the Planner to get more time for it.`
      }
    }
    setMsg(`New plan: ${per(pc.neededRate)} until ${fmt(g.targetDate)}.${extra}`)
  }

  return (
    <div className={'goal-card tone-' + tone}>
      <button className="goal-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="goal-icon">
          <GoalIcon g={g} />
        </span>
        <span className="course-main">
          <strong>{g.title}</strong>
          <span className="muted small">
            {r1(pc.current)}
            {u} → {g.target}
            {u} · by {fmt(g.targetDate)}
          </span>
          <span className="bar">
            <span className="bar-fill" style={{ width: `${pc.pct}%`, display: 'block' }} />
          </span>
        </span>
        <span className={'goal-chip ' + tone}>{label}</span>
      </button>

      {open && (
        <div className="goal-body stack-sm">
          {pc.status !== 'done' && pc.status !== 'early' && (
            <p className="small muted">
              Your pace: {per(pc.rate)} · needed: {per(pc.neededRate)}
              {pc.projected && pc.status !== 'overdue' ? ` · at this pace you'll finish around ${fmt(pc.projected)}` : ''}
            </p>
          )}
          {pc.status === 'early' && <p className="small muted">Give it a week, then I'll tell you if you're on track. Needed pace: {per(pc.neededRate)}.</p>}

          {(pc.status === 'behind' || pc.status === 'overdue') && (
            <div className="behind-box">
              <strong>{pc.status === 'overdue' ? "The date passed. Let's re-plan" : "You're a bit behind. Pick a new plan:"}</strong>
              {pc.newDate && (
                <button className="option-card" onClick={moveDate}>
                  <b>(a) Move the date to {fmt(pc.newDate)}</b>
                  <span className="small muted">Keep a steady {per(pc.assumedRate ?? pc.rate)}. Less pressure.</span>
                </button>
              )}
              {!pc.loadUnsafe ? (
                <button className="option-card" onClick={speedUp}>
                  <b>
                    (b) Keep {fmt(g.targetDate)}: do {per(pc.neededRate)}
                  </b>
                  <span className="small muted">
                    {pc.factor ? `That's ${r1(pc.factor)}× your current pace.` : 'Start now and keep it steady.'}
                    {g.subjectId ? ' Your linked subject gets more Planner time.' : ''}
                  </span>
                </button>
              ) : (
                <p className="small muted">
                  {g.source === 'weight'
                    ? `Keeping the date would need ${per(pc.neededRate)}, more than the healthy ${MAX_KG_PER_WEEK} kg/week, so moving the date is the safe choice.`
                    : 'There is no time left before this date, so moving it is the way forward.'}
                </p>
              )}
            </div>
          )}
          {msg && <p className="small soft-note">{msg}</p>}

          {(g.source === 'manual' || g.source === 'weight') && pc.status !== 'done' && (
            <form className="weigh-form two" onSubmit={logValue}>
              <input type="number" inputMode="decimal" step="any" placeholder={`Where are you now?${u}`} value={val} onChange={(e) => setVal(e.target.value)} />
              <button className="btn btn-primary" type="submit">
                Update
              </button>
            </form>
          )}
          {g.source !== 'manual' && g.source !== 'weight' && (
            <p className="field-hint">Updates automatically from your {g.source === 'lessons' ? 'lessons' : g.source === 'workouts' ? 'workouts' : 'focus timer'}.</p>
          )}
          {g.category === 'body' && <p className="field-hint">Steady habits win: regular meals, water, sleep and movement. No crash diets</p>}
          <div className="btn-row">
            {pc.status !== 'done' ? (
              <button className="btn btn-ghost" onClick={() => db.goals.update(g.id!, { done: true })}>
                Mark done
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={() => db.goals.update(g.id!, { done: false })}>
                Re-open
              </button>
            )}
            <button className="btn btn-danger" onClick={() => confirm(`Delete "${g.title}"?`) && db.goals.delete(g.id!)}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GoalsSection() {
  const [adding, setAdding] = useState(false)
  // live: re-runs whenever goals or their source data (weights, lessons, workouts, focus, logs) change
  const data = useLiveQuery(async () => {
    const goals = await db.goals.toArray()
    return Promise.all(goals.map(async (g) => ({ g, cur: await currentValue(g) })))
  }, [])

  return (
    <section className="sec">
      <div className="row-between sec-head">
        <h2>Goals</h2>
        <button className="btn btn-ghost" onClick={() => setAdding(true)}>
          + New
        </button>
      </div>
      <div className="card">
        {(data ?? []).length === 0 && <p className="muted small">Set a goal with a date: study, fitness, languages, money, anything. I'll track your pace and help you re-plan if you fall behind.</p>}
        <div className="stack-sm">
          {(data ?? []).map(({ g, cur }) => (
            <GoalCard key={g.id} g={g} cur={cur} />
          ))}
        </div>
        {adding && <NewGoal onClose={() => setAdding(false)} />}
      </div>
    </section>
  )
}
