import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { setSetting, type Settings } from '../lib/settings'
import { LIFE_STAGES, saveProfile, useProfile, type LifeStage } from '../lib/profile'
import { applyTheme, resolveTheme, type Mode } from '../lib/themes'
import ThemePicker from './ThemePicker'
import { db } from '../lib/db'
import { COURSES } from '../study/courses'
import { MORE_SCHOOL_SUBJECTS, applySetup, subjectNameOf } from '../lib/setup'

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={'tag-chip' + (on ? ' on' : '')} onClick={onClick} aria-pressed={on}>
      {children}
    </button>
  )
}

/**
 * First-run (and "redo setup") welcome in 3 steps:
 * 1. name, gender, colours · 2. life stage + what to learn · 3. your day.
 */
export default function Welcome({ s }: { s: Settings }) {
  const p = useProfile()
  const subjects = useLiveQuery(() => db.subjects.toArray(), [])
  const commitments = useLiveQuery(() => db.commitments.toArray(), [])
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)

  // step 1
  const [name, setName] = useState(s.name)
  const [gender, setGender] = useState<string | null>(null)
  const [theme, setTheme] = useState(s.theme)
  const [mode, setMode] = useState<Mode>(s.mode)
  const g = gender ?? p.gender

  // step 2: start from what this install already has (empty for a new one)
  const [stage, setStage] = useState<LifeStage | null>(null)
  const st = stage ?? (p.lifeStage || 'school')
  const [school, setSchool] = useState<string | null>(null)
  const [grade, setGrade] = useState<string | null>(null)
  const [picked, setPicked] = useState<Set<string> | null>(null)
  const [extras, setExtras] = useState<Set<string> | null>(null)
  const [custom, setCustom] = useState('')

  const subjectNames = new Set((subjects ?? []).map((x) => x.name))
  const coursePick =
    picked ??
    new Set(
      s.myCourses
        ? s.myCourses
        : COURSES.filter((c) => subjectNames.has(subjectNameOf(c.id))).map((c) => c.id),
    )
  const courseSubjectNames = new Set(COURSES.map((c) => subjectNameOf(c.id)))
  const extraPick = extras ?? new Set([...subjectNames].filter((n) => !courseSubjectNames.has(n)))

  // step 3
  const [wake, setWake] = useState(s.wakeTime)
  const [bed, setBed] = useState(s.bedtime)
  const [prayers, setPrayers] = useState<boolean | null>(null)
  const pray = prayers ?? (commitments ?? []).some((c) => c.kind === 'prayer')
  const [countdown, setCountdown] = useState<boolean | null>(null)
  const showCd = countdown ?? (s.onboarded ? s.showCountdown : st === 'school')
  const [cdLabel, setCdLabel] = useState(s.countdownLabel)
  const [cdDate, setCdDate] = useState(s.matricStart)
  const [drop, setDrop] = useState<Set<number>>(new Set())

  const toggle = (set: Set<string>, v: string, save: (x: Set<string>) => void) => {
    const n = new Set(set)
    if (n.has(v)) n.delete(v)
    else n.add(v)
    save(n)
  }

  async function finish() {
    setBusy(true)
    try {
      await setSetting('name', name.trim())
      await setSetting('theme', theme)
      await setSetting('mode', mode)
      await saveProfile({ gender: g, lifeStage: st, ...(st === 'school' ? { school: school ?? p.school, grade: grade ?? p.grade } : {}) })
      await setSetting('showCountdown', showCd)
      if (showCd) {
        await setSetting('countdownLabel', cdLabel.trim() || 'The big day')
        await setSetting('matricStart', cdDate)
      }
      await applySetup({
        courseIds: [...coursePick],
        extraSubjects: [...extraPick],
        prayers: pray,
        wake,
        bed,
        keepCommitmentIds: (commitments ?? []).filter((c) => !drop.has(c.id!)).map((c) => c.id!),
      })
      await setSetting('onboarded', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="welcome" role="dialog" aria-label="Welcome">
      <div className="welcome-card">
        <div className="welcome-steps" aria-label={`Step ${step} of 3`}>
          {[1, 2, 3].map((n) => (
            <i key={n} className={n <= step ? 'on' : ''} />
          ))}
        </div>

        {step === 1 && (
          <form
            className="stack-sm"
            onSubmit={(e) => {
              e.preventDefault()
              if (name.trim()) setStep(2)
            }}
          >
            <div className="welcome-logo">⏰✨</div>
            <h1>Welcome to the Un-procrast-inator</h1>
            <p className="muted center">Your own scheduler: plans, study, self-care and gentle nudges to just start. Everything stays on this phone.</p>
            <label className="field">
              <span className="field-label">What should we call you?</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={30} autoFocus required />
            </label>
            <span className="field-label">Gender (optional)</span>
            <p className="field-hint">Only used to show the period tracker for female users. You can change this any time.</p>
            <div className="stage-grid">
              {GENDERS.map((x) => (
                <button key={x} type="button" className={'stage-chip' + (g === x ? ' on' : '')} onClick={() => setGender(g === x ? '' : x)} aria-pressed={g === x}>
                  {x}
                </button>
              ))}
            </div>
            <span className="field-label">Pick your colours</span>
            <ThemePicker
              theme={theme}
              mode={mode}
              onTheme={(id) => {
                setTheme(id)
                applyTheme(resolveTheme(id, mode))
              }}
              onMode={(m) => {
                setMode(m)
                applyTheme(resolveTheme(theme, m))
              }}
            />
            <button className="btn btn-primary btn-xl" type="submit" disabled={!name.trim()}>
              Next ›
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="stack-sm">
            <h1>What are you up to, {name.trim()}?</h1>
            <div className="stage-grid">
              {LIFE_STAGES.map((x) => (
                <button key={x.id} type="button" className={'stage-chip' + (st === x.id ? ' on' : '')} onClick={() => setStage(x.id)} aria-pressed={st === x.id}>
                  <span className="stage-icon">{x.icon}</span>
                  {x.label}
                </button>
              ))}
            </div>
            {st === 'school' && (
              <div className="grid-2">
                <label className="field">
                  <span className="field-label">School</span>
                  <input value={school ?? p.school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Impaq" maxLength={60} />
                </label>
                <label className="field">
                  <span className="field-label">Grade</span>
                  <input value={grade ?? p.grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. 12" maxLength={10} />
                </label>
              </div>
            )}

            <h2>What do you want to learn?</h2>
            <p className="field-hint">These get lessons in Study and time in your Planner. Pick as many as you like. You can change them any time.</p>
            <span className="field-label">📚 School subjects with lessons</span>
            <div className="chip-wrap">
              {COURSES.filter((c) => c.group === 'school').map((c) => (
                <Chip key={c.id} on={coursePick.has(c.id)} onClick={() => toggle(coursePick, c.id, setPicked)}>
                  {c.icon} {c.name}
                </Chip>
              ))}
            </div>
            <span className="field-label">🌍 Languages</span>
            <div className="chip-wrap">
              {COURSES.filter((c) => c.section === 'Languages').map((c) => (
                <Chip key={c.id} on={coursePick.has(c.id)} onClick={() => toggle(coursePick, c.id, setPicked)}>
                  {c.icon} {c.name}
                </Chip>
              ))}
            </div>
            <span className="field-label">✨ Skills</span>
            <div className="chip-wrap">
              {COURSES.filter((c) => c.group === 'extra' && c.section !== 'Languages').map((c) => (
                <Chip key={c.id} on={coursePick.has(c.id)} onClick={() => toggle(coursePick, c.id, setPicked)}>
                  {c.icon} {c.name}
                </Chip>
              ))}
            </div>
            <span className="field-label">More subjects (planner time now, lessons later)</span>
            <div className="chip-wrap">
              {[...new Set([...MORE_SCHOOL_SUBJECTS, ...extraPick])].map((n) => (
                <Chip key={n} on={extraPick.has(n)} onClick={() => toggle(extraPick, n, setExtras)}>
                  {n}
                </Chip>
              ))}
            </div>
            <form
              className="input-row"
              onSubmit={(e) => {
                e.preventDefault()
                const v = custom.trim()
                if (!v) return
                setExtras(new Set([...extraPick, v]))
                setCustom('')
              }}
            >
              <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Something else? e.g. Driving theory" maxLength={40} />
              <button className="btn" type="submit">
                Add
              </button>
            </form>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                ‹ Back
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>
                Next ›
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="stack-sm">
            <h1>Your day</h1>
            <div className="grid-2">
              <label className="field">
                <span className="field-label">I wake up at</span>
                <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">I go to sleep at</span>
                <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} />
              </label>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={pray} onChange={(e) => setPrayers(e.target.checked)} />
              <span>🙏 Add prayer times (morning, noon, night)</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={showCd} onChange={(e) => setCountdown(e.target.checked)} />
              <span>⏳ Count down to something (exams, a trip…)</span>
            </label>
            {showCd && (
              <div className="grid-2">
                <input value={cdLabel} onChange={(e) => setCdLabel(e.target.value)} placeholder="e.g. Matric finals" maxLength={40} aria-label="Countdown name" />
                <input type="date" value={cdDate} onChange={(e) => setCdDate(e.target.value)} aria-label="Countdown date" />
              </div>
            )}
            {(commitments ?? []).length > 0 && (
              <>
                <span className="field-label">Fixed things in your week: untick what isn't yours</span>
                {(commitments ?? []).map((c) => (
                  <label key={c.id} className="toggle">
                    <input
                      type="checkbox"
                      checked={!drop.has(c.id!)}
                      onChange={() => {
                        const n = new Set(drop)
                        if (n.has(c.id!)) n.delete(c.id!)
                        else n.add(c.id!)
                        setDrop(n)
                      }}
                    />
                    <span>
                      {c.title} · {c.start}–{c.end}
                    </span>
                  </label>
                ))}
              </>
            )}
            <p className="field-hint">Meals are added for you. Add work, church, sport or anything else later in Planner → Fixed commitments.</p>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>
                ‹ Back
              </button>
              <button className="btn btn-primary btn-xl" style={{ flex: 1 }} onClick={finish} disabled={busy}>
                {busy ? 'Setting up…' : `Let's go, ${name.trim()} ✨`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
