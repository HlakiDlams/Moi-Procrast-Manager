import { X } from '../icons'
import { useState } from 'react'
import { useSettings } from '../lib/settings'

/** Where beta feedback goes. Leave the email empty to hide the email button. */
export const FEEDBACK_EMAIL = ''
const ISSUES_URL = 'https://github.com/HlakiDlams/Moi-Procrast-Manager/issues/new'

const KINDS = [
  ['Something is broken', 'bug'],
  ['A lesson or answer is wrong', 'content'],
  ['An idea', 'idea'],
  ['Something else', 'other'],
] as const

/** Technical details only. Never includes your name, profile, health, schedule or marks. */
function appInfo(theme: string, mode: string) {
  const ua = navigator.userAgent.match(/\(([^)]*)\)/)?.[1] ?? 'unknown'
  return [
    `App: Un-procrast-inator ${__VERSION__} (build ${__BUILD__})`,
    `Screen: ${location.hash.replace('#/', '') || 'today'}`,
    `Theme: ${theme} / ${mode}`,
    `Window: ${innerWidth}x${innerHeight}`,
    `Device: ${ua}`,
  ].join('\n')
}

/** Beta feedback: you choose what is sent and where. Nothing leaves the phone until you tap a button. */
export default function Feedback({ onClose }: { onClose: () => void }) {
  const s = useSettings()
  const [kind, setKind] = useState<(typeof KINDS)[number][1]>('bug')
  const [text, setText] = useState('')
  const [withInfo, setWithInfo] = useState(true)
  const [copied, setCopied] = useState(false)

  const label = KINDS.find((k) => k[1] === kind)![0]
  const info = appInfo(s.theme, s.mode)
  const subject = `[Beta] ${label}`
  const body = `${text.trim()}${withInfo ? `\n\n---\n${info}` : ''}`

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="sheet-backdrop modal legal-backdrop" onClick={onClose}>
      <div className="sheet modal-sheet legal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Send feedback">
        <div className="row-between">
          <h2>Send feedback</h2>
          <button type="button" className="icon-btn subtle" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p className="muted small">The app is in beta. Tell us what is broken, wrong or missing and we will fix it in the next update.</p>
        <label className="field">
          <span className="field-label">What is it about?</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            {KINDS.map(([name, id]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Tell us more</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="What happened? Where in the app? For a wrong lesson, say the subject and the question."
          />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={withInfo} onChange={(e) => setWithInfo(e.target.checked)} />
          <span>Include app details to help us find the problem</span>
        </label>
        {withInfo && <pre className="q-code small">{info}</pre>}
        <p className="field-hint">Your name, profile, health logs, schedule and marks are never included. Nothing is sent until you tap a button below.</p>
        <div className="btn-row">
          {FEEDBACK_EMAIL && (
            <a
              className={'btn btn-primary' + (text.trim() ? '' : ' disabled')}
              style={{ flex: 1, textAlign: 'center' }}
              aria-disabled={!text.trim()}
              href={text.trim() ? `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : undefined}
            >
              Send by email
            </a>
          )}
          <a
            className={'btn' + (FEEDBACK_EMAIL ? '' : ' btn-primary') + (text.trim() ? '' : ' disabled')}
            style={{ flex: 1, textAlign: 'center' }}
            aria-disabled={!text.trim()}
            target="_blank"
            rel="noopener noreferrer"
            href={text.trim() ? `${ISSUES_URL}?title=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 4000))}` : undefined}
          >
            Open on GitHub
          </a>
          <button type="button" className="btn" onClick={copy} disabled={!text.trim()}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="field-hint">"Open on GitHub" needs a free GitHub account. If you do not have one, use Copy and send it to whoever gave you the app.</p>
      </div>
    </div>
  )
}
