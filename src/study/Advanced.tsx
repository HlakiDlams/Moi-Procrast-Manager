import { useRef, useState } from 'react'
import { ChevronRight, Lock, Play, ScanText, Sparkles, Trash2 } from '../icons'
import { AI_COURSE, createAiCourse, createAiLesson, deleteAiCourse, deleteAiLesson, useAiCourses, useAiLessons } from '../lib/aiLessons'
import { providerOf } from '../lib/mistral'
import { useProfile } from '../lib/profile'
import { useSettings } from '../lib/settings'
import type { TabId } from '../tabs'
import type { Course, Lesson } from './types'
import { useLessonsDone } from './progress'

/** Advanced: AI-written lessons and the Homework Checker. Locked until an AI key is added. */
export default function Advanced({ courses, onPlay, go }: { courses: Course[]; onPlay: (l: Lesson) => void; go: (t: TabId) => void }) {
  const s = useSettings()
  const p = useProfile()
  const allSaved = useAiLessons()
  const saved = allSaved.filter((x) => !x.courseId)
  const aiCourses = useAiCourses()
  const [asCourse, setAsCourse] = useState(false)
  const [progress, setProgress] = useState('')
  const done = new Map(useLessonsDone(AI_COURSE).map((d) => [d.lessonId, d]))
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const abort = useRef<AbortController | null>(null)
  const ai = providerOf(s)
  const subj = subject || courses[0]?.name || 'General knowledge'

  if (!s.mistralApiKey.trim()) {
    return (
      <section className="card locked-card">
        <span className="locked-icon">
          <Lock size={28} />
        </span>
        <h2>Advanced is locked</h2>
        <span className="pill">Waiting for API key</span>
        <p className="muted small">
          Advanced adds AI lessons on any topic you choose, at exam level, and the Homework Checker that marks photos of your work. It needs a key from Mistral (free tier available) or another AI
          service.
        </p>
        <button className="btn btn-primary full" onClick={() => go('settings')}>
          Add API key
        </button>
      </section>
    )
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim() || busy) return
    setBusy(true)
    setErr('')
    const ac = new AbortController()
    abort.current = ac
    try {
      const level = p.lifeStage === 'school' && p.grade ? `Grade ${p.grade}` : ''
      if (asCourse) {
        await createAiCourse(subj, topic.trim(), level, (n, total, title) => setProgress(n < total ? `Writing lesson ${n + 1} of ${total}: ${title}` : ''), ac.signal)
        setTopic('')
      } else {
        const row = await createAiLesson(subj, topic.trim(), level, ac.signal)
        setTopic('')
        onPlay(row.lesson)
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setErr((e as Error).message)
    } finally {
      setBusy(false)
      setProgress('')
    }
  }

  return (
    <div className="stack">
      <section className="sec">
        <h2 className="section-title">Create with AI</h2>
        <form className="card stack-sm" onSubmit={create}>
          <label className="field">
            <span className="field-label">Subject</span>
            <select value={subj} onChange={(e) => setSubject(e.target.value)} disabled={busy}>
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="General knowledge">Something else</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Topic</span>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. completing the square, lydende vorm, isometric circles" maxLength={120} disabled={busy} />
          </label>
          <div className="seg" role="radiogroup" aria-label="What to create">
            <button type="button" role="radio" aria-checked={!asCourse} className={!asCourse ? 'on' : ''} onClick={() => setAsCourse(false)} disabled={busy}>
              One lesson
            </button>
            <button type="button" role="radio" aria-checked={asCourse} className={asCourse ? 'on' : ''} onClick={() => setAsCourse(true)} disabled={busy}>
              A whole course
            </button>
          </div>
          {busy ? (
            <div className="btn-row">
              <button className="btn btn-primary" type="button" disabled style={{ flex: 1 }}>
                {progress || (asCourse ? 'Planning your course…' : 'Writing your lesson…')}
              </button>
              <button className="btn" type="button" onClick={() => abort.current?.abort()}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary full" type="submit" disabled={!topic.trim()}>
              <Sparkles size={16} /> {asCourse ? 'Create my course' : 'Write my lesson'}
            </button>
          )}
          {err && <p className="small warn-text">{err}</p>}
          <p className="field-hint">
            Written by {ai.name}. A lesson takes about 10 to 30 seconds; a course of 5 lessons about 2 minutes. Leave the screen open while it writes. AI can make mistakes, so check anything that
            looks off against your textbook.
          </p>
        </form>
      </section>

      <section className="sec">
        <h2 className="section-title">Homework</h2>
        <div className="list">
          <button className="list-row" onClick={() => go('homework')}>
            <span className="row-icon">
              <ScanText size={20} />
            </span>
            <span className="row-main">Homework Checker</span>
            <span className="row-value">Mark a photo</span>
            <ChevronRight size={18} className="muted" />
          </button>
        </div>
      </section>

      {aiCourses.length > 0 && (
        <section className="sec">
          <h2 className="section-title">My AI courses</h2>
          {aiCourses.map((c) => {
            const ls = allSaved.filter((x) => x.courseId === c.id).reverse()
            const finished = ls.filter((x) => done.has(x.lesson.id)).length
            return (
              <div key={c.id} className="card stack-sm">
                <div className="row-between">
                  <div>
                    <strong>{c.name}</strong>
                    <div className="muted small">
                      {c.subject} · {finished}/{ls.length} lessons done{!busy && ls.length < c.plan.length ? ` · ${c.plan.length - ls.length} did not finish writing` : ''}
                    </div>
                  </div>
                  <button className="icon-btn subtle" onClick={() => confirm(`Delete the course "${c.name}" and its lessons?`) && deleteAiCourse(c.id)} aria-label={`Delete ${c.name}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <ul className="history ai-list">
                  {ls.map((x) => (
                    <li key={x.lesson.id}>
                      <button className="ai-open" onClick={() => onPlay(x.lesson)}>
                        <Play size={16} />
                        <span>
                          <strong>{x.lesson.title}</strong>
                          <span className="muted small">{done.has(x.lesson.id) ? `best ${done.get(x.lesson.id)!.best}%` : 'not played yet'}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </section>
      )}

      {saved.length > 0 && (
        <section className="sec">
          <h2 className="section-title">My single lessons</h2>
          <ul className="history ai-list">
            {saved.map((x) => {
              const d = done.get(x.lesson.id)
              return (
                <li key={x.lesson.id}>
                  <button className="ai-open" onClick={() => onPlay(x.lesson)}>
                    <Play size={16} />
                    <span>
                      <strong>{x.lesson.title}</strong>
                      <span className="muted small">
                        {x.subject} · {x.lesson.questions.length} questions{d ? ` · best ${d.best}%` : ''}
                      </span>
                    </span>
                  </button>
                  <button className="icon-btn subtle" onClick={() => confirm(`Delete "${x.lesson.title}"?`) && deleteAiLesson(x.lesson.id)} aria-label={`Delete ${x.lesson.title}`}>
                    <Trash2 size={18} />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
