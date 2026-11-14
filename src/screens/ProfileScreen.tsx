import { Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, localDay, type WeightLog } from '../lib/db'
import { ADULT_BMI_AGE, ageOn, bmi, bmiLabel, healthyRange, LIFE_STAGES, saveProfile, useProfile, type LifeStage, type Profile } from '../lib/profile'
import { setSetting, useSettings } from '../lib/settings'
import GoalsSection from '../components/GoalsSection'

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

const GENDERS = ['', 'Female', 'Male', 'Non-binary', 'Prefer not to say', 'Other']
const RACES = ['', 'Black African', 'Coloured', 'Indian', 'Asian', 'White', 'Mixed', 'Other', 'Prefer not to say']

/** Small SVG line chart of weigh-ins (oldest → newest). */
function WeightChart({ logs }: { logs: WeightLog[] }) {
  if (logs.length < 2) return <p className="muted small">Log your weight a few times to see your trend.</p>
  const w = 320
  const h = 120
  const pad = 8
  const ks = logs.map((l) => l.kg)
  const min = Math.min(...ks) - 0.5
  const max = Math.max(...ks) + 0.5
  const x = (i: number) => pad + (i / (logs.length - 1)) * (w - pad * 2)
  const y = (kg: number) => h - pad - ((kg - min) / (max - min)) * (h - pad * 2)
  const d = logs.map((l, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(l.kg).toFixed(1)}`).join(' ')
  return (
    <svg className="line-chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Weight trend from ${ks[0]} to ${ks[ks.length - 1]} kg`}>
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {logs.map((l, i) => (
        <circle key={l.id} cx={x(i)} cy={y(l.kg)} r="4" fill="var(--accent)" />
      ))}
    </svg>
  )
}

export default function ProfileScreen() {
  const p = useProfile()
  const s = useSettings()
  const logs = useLiveQuery(() => db.weights.orderBy('day').toArray(), []) ?? []
  const [kg, setKg] = useState('')
  const [day, setDay] = useState(() => localDay())
  const [showAll, setShowAll] = useState(false)

  const age = ageOn(p.dob)
  const latest = logs[logs.length - 1]
  const first = logs[0]
  const height = p.heightCm ?? latest?.heightCm ?? null
  const b = latest && height ? bmi(latest.kg, height) : null
  const lbl = b !== null ? bmiLabel(b, age) : null

  const isSchool = p.lifeStage === 'school'
  const isStudy = p.lifeStage === 'tertiary' || p.lifeStage === 'work-study'
  const isWork = p.lifeStage === 'working' || p.lifeStage === 'work-study'
  const stageBits = isSchool
    ? [p.grade ? `Grade ${p.grade}` : null, p.school || null]
    : [isWork ? p.jobTitle || 'Working' : null, isStudy ? p.course || 'Studying' : null, p.lifeStage === 'gap' ? 'Gap year' : null]

  async function changeStage(st: LifeStage) {
    await saveProfile({ lifeStage: st })
    if (st !== 'school' && s.countdownLabel === 'Matric finals') {
      if (confirm('Done with Matric? Turn off the Matric countdown on Today? (You can set a new countdown in Settings.)')) await setSetting('showCountdown', false)
    }
  }

  const text =
    <K extends keyof Profile>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      saveProfile({ [k]: e.target.value } as Partial<Profile>)

  async function addWeight(e: React.FormEvent) {
    e.preventDefault()
    const v = Number(kg.replace(',', '.'))
    if (!(v > 20 && v < 300)) return
    // one entry per day: replace if it exists
    const existing = await db.weights.where('day').equals(day).first()
    const row = {
      day,
      kg: Math.round(v * 10) / 10,
      heightCm: height ?? undefined,
    }
    if (existing?.id !== undefined) await db.weights.update(existing.id, row)
    else await db.weights.add(row)
    setKg('')
  }

  return (
    <div className="stack">
      <section className="card hero">
        <h1>{p.fullName || s.name || 'Your profile'}</h1>
        <p className="muted">{[age !== null ? `${age} years old` : null, ...stageBits].filter(Boolean).join(' · ') || 'Fill in your details below'}</p>
      </section>

      <section className="sec">
        <h2 className="section-title">About me</h2>
        <div className="card">
          <Field label="App name (what the app calls you)">
            <input value={s.name} onChange={(e) => setSetting('name', e.target.value)} maxLength={30} />
          </Field>
          <Field label="Full name">
            <input value={p.fullName} onChange={text('fullName')} maxLength={80} autoComplete="name" />
          </Field>
          <div className="grid-2">
            <Field label="Date of birth" hint={age !== null ? `Age ${age}` : undefined}>
              <input type="date" value={p.dob} onChange={text('dob')} max={localDay()} />
            </Field>
            <Field label="Gender">
              <select value={p.gender} onChange={text('gender')}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g || 'Choose…'}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pronouns">
              <input value={p.pronouns} onChange={text('pronouns')} placeholder="e.g. she/her" maxLength={30} />
            </Field>
            <Field label="Race">
              <select value={p.race} onChange={text('race')}>
                {RACES.map((r) => (
                  <option key={r} value={r}>
                    {r || 'Choose…'}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Languages I speak">
            <input value={p.languages} onChange={text('languages')} placeholder="e.g. English, isiZulu, Afrikaans" maxLength={120} />
          </Field>
          <p className="field-hint">Everything here stays on your phone. All fields are optional.</p>
        </div>
      </section>

      <section className="sec">
        <h2 className="section-title">Right now I'm…</h2>
        <div className="card">
          <div className="stage-grid" role="radiogroup" aria-label="Life stage">
            {LIFE_STAGES.map((st) => (
              <button key={st.id} type="button" className={'stage-chip' + (p.lifeStage === st.id ? ' on' : '')} onClick={() => changeStage(st.id)} aria-pressed={p.lifeStage === st.id}>
                <span className="stage-icon">
                  <st.Icon size={18} />
                </span>
                {st.label}
              </button>
            ))}
          </div>
          {isSchool && (
            <div className="grid-2">
              <Field label="School">
                <input value={p.school} onChange={text('school')} maxLength={60} />
              </Field>
              <Field label="Grade">
                <input value={p.grade} onChange={text('grade')} maxLength={10} inputMode="numeric" />
              </Field>
            </div>
          )}
          {isStudy && (
            <div className="grid-2">
              <Field label="Course / qualification">
                <input value={p.course} onChange={text('course')} placeholder="e.g. BSc IT, N6, short course" maxLength={80} />
              </Field>
              <Field label="Where">
                <input value={p.institution} onChange={text('institution')} placeholder="e.g. UNISA, Wits, Coursera" maxLength={80} />
              </Field>
            </div>
          )}
          {isWork && (
            <div className="grid-2">
              <Field label="Job">
                <input value={p.jobTitle} onChange={text('jobTitle')} placeholder="e.g. Junior developer" maxLength={60} />
              </Field>
              <Field label="Work hours / week">
                <input
                  type="number"
                  inputMode="numeric"
                  value={p.workHoursPerWeek ?? ''}
                  onChange={(e) =>
                    saveProfile({
                      workHoursPerWeek: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  min={0}
                  max={80}
                />
              </Field>
            </div>
          )}
          <p className="field-hint">
            {isWork
              ? 'The Planner will treat your work shifts as fixed and fit study, gym and rest around them, with lighter study loads on long work days.'
              : 'The Planner uses this to decide what is fixed in your week and what it can plan around.'}
          </p>
        </div>
      </section>

      <section className="sec">
        <h2 className="section-title">Body</h2>
        <div className="card">
          <div className="grid-2">
            <Field label="Height (cm)">
              <input
                type="number"
                inputMode="decimal"
                value={p.heightCm ?? ''}
                onChange={(e) =>
                  saveProfile({
                    heightCm: e.target.value ? Number(e.target.value) : null,
                  })
                }
                min={100}
                max={230}
              />
            </Field>
            <div className="field">
              <span className="field-label">Current weight</span>
              <div className="big-val">{latest ? `${latest.kg} kg` : '—'}</div>
              {latest && first && latest !== first && (
                <span className="field-hint">
                  {latest.kg - first.kg >= 0 ? '+' : ''}
                  {(latest.kg - first.kg).toFixed(1)} kg since {first.day}
                </span>
              )}
            </div>
          </div>

          {b !== null && lbl && (
            <div className={'bmi-box tone-' + lbl.tone}>
              <div>
                <div className="muted small">BMI</div>
                <div className="big-val">{b.toFixed(1)}</div>
              </div>
              <div className="bmi-text">
                <strong>{lbl.label}</strong>
                {age !== null && age >= ADULT_BMI_AGE && height ? (
                  <span className="small muted">
                    Healthy range for {height} cm: {healthyRange(height)[0].toFixed(0)}–{healthyRange(height)[1].toFixed(0)} kg
                  </span>
                ) : (
                  <span className="small muted">
                    Under 18, BMI is read on age-and-sex growth charts, not the adult scale, because your body is still developing. A clinic nurse can plot it for you.
                  </span>
                )}
              </div>
            </div>
          )}
          {!height && <p className="muted small">Add your height to see your BMI.</p>}

          <form className="weigh-form" onSubmit={addWeight}>
            <input type="number" inputMode="decimal" step="0.1" placeholder="Weight (kg)" value={kg} onChange={(e) => setKg(e.target.value)} aria-label="Weight in kg" />
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} max={localDay()} aria-label="Date" />
            <button className="btn btn-primary" type="submit">
              Log
            </button>
          </form>
          <p className="field-hint">Tip: weigh yourself at the same time of day (morning, before eating). Weekly is plenty.</p>

          <WeightChart logs={logs.slice(-20)} />

          {logs.length > 0 && (
            <>
              <button className="link-btn small" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Hide history' : `Show history (${logs.length})`}
              </button>
              {showAll && (
                <ul className="history">
                  {[...logs].reverse().map((l) => (
                    <li key={l.id}>
                      <span>{l.day}</span>
                      <span>{l.kg} kg</span>
                      <button className="icon-btn subtle" onClick={() => confirm(`Delete ${l.day}?`) && db.weights.delete(l.id!)} aria-label={`Delete ${l.day}`}>
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>

      <section className="sec">
        <h2 className="section-title">Health notes</h2>
        <div className="card">
          <p className="muted small">Used later to keep workouts and meal ideas safe for you.</p>
          <Field label="Allergies">
            <input value={p.allergies} onChange={text('allergies')} placeholder="e.g. peanuts, none" maxLength={200} />
          </Field>
          <Field label="Conditions / injuries">
            <input value={p.conditions} onChange={text('conditions')} placeholder="e.g. asthma, sore knee" maxLength={200} />
          </Field>
          <Field label="Anything else">
            <textarea value={p.notes} onChange={text('notes')} rows={3} maxLength={1000} />
          </Field>
        </div>
      </section>

      <GoalsSection />
    </div>
  )
}
