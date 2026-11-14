import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type HomeworkCheck } from '../lib/db'
import { useSettings } from '../lib/settings'
import { useProfile } from '../lib/profile'
import { markHomework, saveCheck, shrinkImage, type HomeworkResult } from '../lib/homework'
import { MistralError } from '../lib/mistral'
import type { TabId } from '../tabs'

const VERDICT = { correct: ['✅', 'Correct'], partial: ['🟡', 'Partly right'], wrong: ['❌', 'Not quite'], unreadable: ['👀', "Couldn't read"] } as const
const WAITING = ['Reading your handwriting… ✍🏾', 'Checking every answer… 🔍', 'Writing explanations… 📝', 'Almost done… 💕']
const fmt = (iso: string) => new Date(iso).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function Result({ r, cards, onAgain }: { r: HomeworkResult; cards?: number; onAgain?: () => void }) {
  const pct = r.score.total ? Math.round((r.score.earned / r.score.total) * 100) : 0
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="stack">
      <section className="card hero hw-score">
        <div className="big-num">{pct}%</div>
        <div className="muted">
          {r.score.earned}/{r.score.total} marks
        </div>
        {r.summary && <p>{r.summary}</p>}
        {!r.readable && <p className="small warn-text">Parts of the photo were hard to read. A closer, brighter photo helps.</p>}
        {cards ? <p className="small">🧠 {cards} mistake{cards === 1 ? '' : 's'} added to your Review deck in Study.</p> : null}
      </section>

      <section className="card">
        <h2>Answer by answer</h2>
        <ul className="hw-items">
          {r.items.map((it, i) => {
            const [icon, label] = VERDICT[it.verdict]
            const isOpen = open === i || it.verdict !== 'correct'
            return (
              <li key={i} className={'hw-item v-' + it.verdict}>
                <button className="hw-head" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="hw-icon">{icon}</span>
                  <span className="course-main">
                    <strong>{it.question || `Question ${i + 1}`}</strong>
                    <span className="muted small">
                      {label}
                      {it.marks.total ? ` · ${it.marks.earned}/${it.marks.total}` : ''}
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <div className="hw-body small">
                    {it.learnerAnswer && (
                      <p>
                        <span className="muted">Your answer:</span> {it.learnerAnswer}
                      </p>
                    )}
                    {it.feedback && <p>{it.feedback}</p>}
                    {it.steps.length > 0 && (
                      <ol className="steps">
                        {it.steps.map((s, n) => (
                          <li key={n}>{s}</li>
                        ))}
                      </ol>
                    )}
                    {it.verdict !== 'correct' && it.correctAnswer && (
                      <p className="hw-correct">
                        <b>Correct answer:</b> {it.correctAnswer}
                      </p>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {r.tips.length > 0 && (
        <section className="card">
          <h2>💡 Tips</h2>
          <ul className="steps small">
            {r.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}
      <p className="field-hint center">AI marking can make mistakes. If something looks wrong, check with your textbook or teacher.</p>
      {onAgain && (
        <button className="btn btn-primary btn-xl" onClick={onAgain}>
          📷 Check another
        </button>
      )}
    </div>
  )
}

export default function HomeworkScreen({ go }: { go: (t: TabId) => void }) {
  const s = useSettings()
  const p = useProfile()
  const subjects = useLiveQuery(() => db.subjects.toArray(), []) ?? []
  const history = useLiveQuery(() => db.homework.reverse().limit(20).toArray(), []) ?? []
  const [subject, setSubject] = useState('')
  const [task, setTask] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(0)
  const [err, setErr] = useState('')
  const [result, setResult] = useState<{ r: HomeworkResult; cards: number } | null>(null)
  const [viewing, setViewing] = useState<HomeworkCheck | null>(null)
  const camRef = useRef<HTMLInputElement>(null)
  const galRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const subj = subject || subjects[0]?.name || 'General'

  async function addFiles(files: FileList | null) {
    if (!files) return
    setErr('')
    const room = 4 - images.length
    const picked = [...files].slice(0, room)
    try {
      const shrunk = await Promise.all(picked.map((f) => shrinkImage(f)))
      setImages((x) => [...x, ...shrunk])
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  async function check() {
    if (!images.length) return
    setBusy(true)
    setErr('')
    setWait(0)
    const tick = setInterval(() => setWait((w) => Math.min(w + 1, WAITING.length - 1)), 6000)
    const ac = new AbortController()
    abortRef.current = ac
    try {
      const r = await markHomework(images, subj, task, p.lifeStage === 'school' ? p.grade : '', ac.signal)
      const thumbBlob = await (await fetch(images[0])).blob()
      const thumb = await shrinkImage(thumbBlob, 240, 0.7)
      const saved = await saveCheck(subj, task, thumb, r)
      setResult({ r, cards: saved.cards })
      setImages([])
      setTask('')
    } catch (e) {
      if ((e as Error).name === 'AbortError') setErr('Stopped.')
      else setErr(e instanceof MistralError ? e.message : `Something went wrong: ${(e as Error).message}`)
    } finally {
      clearInterval(tick)
      setBusy(false)
    }
  }

  if (!s.mistralApiKey.trim()) {
    return (
      <div className="stack">
        <section className="card hero">
          <div className="hero-icon">✅</div>
          <h1>Homework Checker</h1>
          <p>Snap your homework and get it marked with step-by-step explanations. It uses Mistral AI with your own free key.</p>
        </section>
        <section className="card">
          <h2>🔑 Add your Mistral key (once)</h2>
          <ol className="steps small">
            <li>
              Go to <b>console.mistral.ai</b> and sign up (the free "Experiment" plan is enough to start)
            </li>
            <li>
              Open <b>API Keys</b> → <b>Create new key</b> and copy it
            </li>
            <li>
              Paste it in <b>Settings → Mistral AI</b> and tap <b>Test key</b>
            </li>
          </ol>
          <p className="field-hint">Your key is saved only on this phone and is only ever sent to Mistral. Usage goes on your own Mistral account.</p>
          <button className="btn btn-primary full" onClick={() => go('settings')}>
            Open Settings
          </button>
        </section>
      </div>
    )
  }

  if (viewing) {
    return (
      <div className="stack">
        <button className="link-btn small" onClick={() => setViewing(null)}>
          ‹ Back
        </button>
        <p className="muted small">
          {viewing.subject} · {fmt(viewing.at)}
          {viewing.task ? ` · ${viewing.task}` : ''}
        </p>
        <Result r={viewing.result} />
      </div>
    )
  }

  if (result) return <Result r={result.r} cards={result.cards} onAgain={() => setResult(null)} />

  return (
    <div className="stack">
      <section className="card">
        <h2>📸 Check my homework</h2>
        <label className="field">
          <span className="field-label">Subject</span>
          <select value={subj} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((x) => (
              <option key={x.id} value={x.name}>
                {x.icon} {x.name}
              </option>
            ))}
            {!subjects.some((x) => x.name === 'General') && <option value="General">📘 Other</option>}
          </select>
        </label>
        <label className="field">
          <span className="field-label">What was the task? (optional)</span>
          <textarea value={task} onChange={(e) => setTask(e.target.value)} rows={2} maxLength={400} placeholder="e.g. Exercise 3.2, questions 1–5: solve the equations" />
        </label>

        <div className="hw-photos">
          {images.map((src, i) => (
            <div key={i} className="hw-photo">
              <img src={src} alt={`Page ${i + 1}`} />
              <button className="icon-btn" onClick={() => setImages(images.filter((_, j) => j !== i))} aria-label={`Remove page ${i + 1}`} disabled={busy}>
                ✕
              </button>
            </div>
          ))}
        </div>
        {images.length < 4 && (
          <div className="btn-row">
            <button className="btn" style={{ flex: 1 }} onClick={() => camRef.current?.click()} disabled={busy}>
              📷 Take photo
            </button>
            <button className="btn" style={{ flex: 1 }} onClick={() => galRef.current?.click()} disabled={busy}>
              🖼️ From gallery
            </button>
          </div>
        )}
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
        <input ref={galRef} type="file" accept="image/*" multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
        <p className="field-hint">Up to 4 pages. Tip: good light, flat page, whole question in view.</p>

        {busy ? (
          <div className="hw-wait">
            <div className="hw-spinner" aria-hidden />
            <p>{WAITING[wait]}</p>
            <button className="btn btn-ghost" onClick={() => abortRef.current?.abort()}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-xl" onClick={check} disabled={!images.length}>
            ✅ Check it
            <span className="btn-sub">{images.length ? `${images.length} page${images.length === 1 ? '' : 's'} · +10 XP` : 'add a photo first'}</span>
          </button>
        )}
        {err && <p className="small warn-text">{err}</p>}
        <p className="field-hint">🔒 Photos are sent to Mistral only when you tap Check. Only a small preview is kept on your phone.</p>
      </section>

      {history.length > 0 && (
        <section className="card">
          <h2>Past checks</h2>
          <ul className="history">
            {history.map((h) => (
              <li key={h.id} className="hw-hist" onClick={() => setViewing(h)}>
                <img src={h.thumb} alt="" />
                <span>
                  <b>{h.subject}</b>
                  <br />
                  <span className="muted small">{fmt(h.at)}</span>
                </span>
                <span className="hw-pct">{h.result.score.total ? Math.round((h.result.score.earned / h.result.score.total) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
