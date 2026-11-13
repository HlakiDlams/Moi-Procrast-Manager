import { useRef, useState, type ReactNode } from 'react'
import { setSetting, useSettings, type Settings } from '../lib/settings'
import { THEMES } from '../lib/themes'
import { downloadBackup, importData } from '../lib/backup'
import { db } from '../lib/db'
import { addXp } from '../lib/xp'

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export default function SettingsScreen() {
  const s = useSettings()
  const [showKey, setShowKey] = useState(false)
  const [keyStatus, setKeyStatus] = useState<string>('')
  const [msg, setMsg] = useState('')
  const [withKey, setWithKey] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const num =
    <K extends keyof Settings>(k: K, min: number, max: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.round(Number(e.target.value))
      if (Number.isFinite(v)) setSetting(k, Math.min(max, Math.max(min, v)) as Settings[K])
    }
  const str =
    <K extends keyof Settings>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setSetting(k, e.target.value as Settings[K])

  async function testKey() {
    if (!s.mistralApiKey) return setKeyStatus('Add a key first.')
    setKeyStatus('Checking…')
    try {
      const r = await fetch('https://api.mistral.ai/v1/models', {
        headers: { Authorization: `Bearer ${s.mistralApiKey}` },
      })
      setKeyStatus(r.ok ? '✅ Key works!' : `❌ Mistral said ${r.status}. Check the key.`)
    } catch {
      setKeyStatus("❌ Couldn't reach Mistral. Are you online?")
    }
  }

  async function onImport(file: File) {
    try {
      await importData(JSON.parse(await file.text()))
      setMsg('✅ Backup restored.')
    } catch (e) {
      setMsg('❌ ' + (e instanceof Error ? e.message : 'Import failed.'))
    }
  }

  async function resetAll() {
    if (!confirm('Delete ALL data on this device? Export a backup first if you want to keep it.')) return
    await Promise.all(db.tables.map((t) => t.clear()))
    setMsg('All data cleared.')
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>About you</h2>
        <Field label="Your name">
          <input value={s.name} onChange={str('name')} maxLength={30} />
        </Field>
        <label className="toggle">
          <input type="checkbox" checked={s.showCountdown} onChange={(e) => setSetting('showCountdown', e.target.checked)} />
          <span>Show a countdown on Today</span>
        </label>
        {s.showCountdown && (
          <div className="grid-2">
            <Field label="Counting down to">
              <input value={s.countdownLabel} onChange={str('countdownLabel')} maxLength={40} placeholder="e.g. Matric finals, exams, payday" />
            </Field>
            <Field label="Date">
              <input type="date" value={s.matricStart} onChange={str('matricStart')} />
            </Field>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Display</h2>
        <span className="field-label">Colour theme</span>
        <div className="theme-grid" role="radiogroup" aria-label="Colour theme">
          {THEMES.map((t) => (
            <button key={t.id} type="button" className={'theme-chip' + (s.theme === t.id ? ' on' : '')} onClick={() => setSetting('theme', t.id)} aria-pressed={s.theme === t.id}>
              <span className="theme-dots">
                {[t.accents.today, t.accents.study, t.accents.planner, t.accents.selfcare].map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              {t.emoji} {t.name}
            </button>
          ))}
        </div>
        <Field label={`Display size: ${s.uiScale}%`} hint="Smaller = more fits on screen. 80% is a good start.">
          <input type="range" min={60} max={130} step={5} value={s.uiScale} onChange={num('uiScale', 60, 130)} className="range" />
        </Field>
        <div className="btn-row">
          {[70, 80, 90, 100].map((v) => (
            <button key={v} className={'btn' + (s.uiScale === v ? ' btn-primary' : '')} onClick={() => setSetting('uiScale', v)}>
              {v}%
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Focus timer</h2>
        <div className="grid-2">
          <Field label="Pomodoro (min)">
            <input type="number" inputMode="numeric" value={s.pomodoroWork} onChange={num('pomodoroWork', 5, 90)} />
          </Field>
          <Field label="Break (min)">
            <input type="number" inputMode="numeric" value={s.pomodoroBreak} onChange={num('pomodoroBreak', 1, 30)} />
          </Field>
          <Field label="Daily XP goal">
            <input type="number" inputMode="numeric" value={s.dailyXpGoal} onChange={num('dailyXpGoal', 10, 500)} />
          </Field>
          <Field label="Water goal (glasses)">
            <input type="number" inputMode="numeric" value={s.waterGoal} onChange={num('waterGoal', 1, 20)} />
          </Field>
          <Field label="Bedtime">
            <input type="time" value={s.bedtime} onChange={str('bedtime')} />
          </Field>
          <Field label="Wake time">
            <input type="time" value={s.wakeTime} onChange={str('wakeTime')} />
          </Field>
        </div>
        <a className="btn btn-ghost full" href="#/alarms">
          ⏰ Reminders & alarms ›
        </a>
      </section>

      <section className="card">
        <h2>Mistral AI</h2>
        <p className="muted small">
          Optional. Powers new lessons, explanations and the Homework Checker. Your key is saved only on
          this device and is only ever sent to api.mistral.ai.
        </p>
        <Field label="API key">
          <div className="input-row">
            <input
              type={showKey ? 'text' : 'password'}
              value={s.mistralApiKey}
              onChange={str('mistralApiKey')}
              placeholder="Paste your key from console.mistral.ai"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="btn btn-ghost" onClick={() => setShowKey((v) => !v)} type="button">
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        <div className="grid-2">
          <Field label="Text model">
            <input value={s.mistralTextModel} onChange={str('mistralTextModel')} spellCheck={false} />
          </Field>
          <Field label="Vision model">
            <input value={s.mistralVisionModel} onChange={str('mistralVisionModel')} spellCheck={false} />
          </Field>
        </div>
        <div className="row-between">
          <button className="btn" onClick={testKey} type="button">
            Test key
          </button>
          <span className="small">{keyStatus}</span>
        </div>
      </section>

      <section className="card">
        <h2>Backup</h2>
        <p className="muted small">Everything lives on this phone. Export a JSON backup now and then.</p>
        <label className="toggle">
          <input type="checkbox" checked={withKey} onChange={(e) => setWithKey(e.target.checked)} />
          <span>Include my API key in the backup</span>
        </label>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => downloadBackup(withKey)}>
            ⬇️ Export
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            ⬆️ Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImport(f)
              e.target.value = ''
            }}
          />
        </div>
        {msg && <p className="small">{msg}</p>}
      </section>

      <section className="card">
        <h2>Danger zone</h2>
        <div className="btn-row">
          {import.meta.env.DEV && (
            <button className="btn btn-ghost" onClick={() => addXp(10, 'today', 'dev test')}>
              +10 test XP
            </button>
          )}
          <button className="btn btn-danger" onClick={resetAll}>
            Delete all data
          </button>
        </div>
      </section>
      <p className="muted small center">
        Un-procrast-inator ✨ · build {__BUILD__} · {__BUILT_AT__}
      </p>
    </div>
  )
}
