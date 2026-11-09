import { useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, localDay, type WeightLog } from '../lib/db'
import { ageOn, bmi, bmiLabel, healthyRange, saveProfile, useProfile, type Profile } from '../lib/profile'
import { setSetting, useSettings } from '../lib/settings'

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
    const row = { day, kg: Math.round(v * 10) / 10, heightCm: height ?? undefined }
    if (existing?.id !== undefined) await db.weights.update(existing.id, row)
    else await db.weights.add(row)
    setKg('')
  }

  return (
    <div className="stack">
      <section className="card hero">
        <div className="hero-icon">🎯</div>
        <h1>{p.fullName || s.name}</h1>
        <p className="muted">
          {[age !== null ? `${age} years old` : null, p.grade ? `Grade ${p.grade}` : null, p.school || null].filter(Boolean).join(' · ') || 'Fill in your details below'}
        </p>
      </section>

      <section className="card">
        <h2>About me</h2>
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
          <Field label="School">
            <input value={p.school} onChange={text('school')} maxLength={60} />
          </Field>
          <Field label="Grade">
            <input value={p.grade} onChange={text('grade')} maxLength={10} inputMode="numeric" />
          </Field>
        </div>
        <Field label="Languages I speak">
          <input value={p.languages} onChange={text('languages')} placeholder="e.g. English, isiZulu, Afrikaans" maxLength={120} />
        </Field>
        <p className="field-hint">Everything here stays on your phone. All fields are optional.</p>
      </section>

      <section className="card">
        <h2>Body</h2>
        <div className="grid-2">
          <Field label="Height (cm)">
            <input
              type="number"
              inputMode="decimal"
              value={p.heightCm ?? ''}
              onChange={(e) => saveProfile({ heightCm: e.target.value ? Number(e.target.value) : null })}
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
              {age !== null && age >= 20 && height ? (
                <span className="small muted">
                  Healthy range for {height} cm: {healthyRange(height)[0].toFixed(0)}–{healthyRange(height)[1].toFixed(0)} kg
                </span>
              ) : (
                <span className="small muted">
                  Under 20, BMI is read on age-and-sex growth charts, not the adult scale, because your body is still developing. A clinic nurse can plot it for you.
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
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <section className="card">
        <h2>Health notes</h2>
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
      </section>

      <section className="card">
        <h2>🎯 Goals</h2>
        <p className="muted small">
          Coming in the Profile & Goals stage: goals with target dates (fitness, study, languages), progress tracking, and a "behind schedule?" planner that offers a realistic new date or a bigger weekly load, with healthy-rate limits for body goals (max ~0.5 kg/week).
        </p>
      </section>
    </div>
  )
}
