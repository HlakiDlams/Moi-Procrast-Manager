import { useState } from 'react'
import { setSetting, type Settings } from '../lib/settings'
import { saveProfile, useProfile } from '../lib/profile'
import { THEMES, applyTheme, themeById } from '../lib/themes'

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

/** First-run welcome: name, (optional) gender, colour theme. Shown once. */
export default function Welcome({ s }: { s: Settings }) {
  const p = useProfile()
  const [name, setName] = useState(s.name)
  const [gender, setGender] = useState<string | null>(null)
  const [theme, setTheme] = useState(s.theme)
  const g = gender ?? p.gender

  async function done(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await setSetting('name', name.trim())
    await setSetting('theme', theme)
    if (g) await saveProfile({ gender: g })
    await setSetting('onboarded', true)
  }

  return (
    <div className="welcome" role="dialog" aria-label="Welcome">
      <form className="welcome-card" onSubmit={done}>
        <div className="welcome-logo">⏰✨</div>
        <h1>Welcome to the Un-procrast-inator</h1>
        <p className="muted">Your own scheduler: plans, study, self-care and gentle nudges to just start. Everything stays on this phone.</p>

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
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={'theme-chip' + (theme === t.id ? ' on' : '')}
              onClick={() => {
                setTheme(t.id)
                applyTheme(themeById(t.id))
              }}
              aria-pressed={theme === t.id}
            >
              <span className="theme-dots">
                {[t.accents.today, t.accents.study, t.accents.planner, t.accents.selfcare].map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              {t.emoji} {t.name}
            </button>
          ))}
        </div>

        <button className="btn btn-primary btn-xl" type="submit" disabled={!name.trim()}>
          {name.trim() ? `Let's go, ${name.trim()} ✨` : "Let's go ✨"}
        </button>
      </form>
    </div>
  )
}
