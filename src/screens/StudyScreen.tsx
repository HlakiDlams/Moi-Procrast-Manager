import { useState, type CSSProperties } from 'react'
import { COMING_SOON, COURSES, allLessons, findQuestion } from '../study/courses'
import type { Course, Lesson } from '../study/types'
import { MAX_HEARTS, useAllCards, useDueCards, useHearts, useLessonsDone } from '../study/progress'
import LessonPlayer from '../study/LessonPlayer'
import { useXpStats } from '../lib/xp'
import { setSetting, useSettings } from '../lib/settings'
import { themeById } from '../lib/themes'

type Playing = { courseId: string; color: string; lang?: string; lesson?: Lesson; review?: { key: string; q: import('../study/types').Question }[] }

function mins(ms: number) {
  return Math.ceil(ms / 60_000)
}

/** Days since 1 Jan 2020: picks the same prompt all day, a new one tomorrow. */
function dayNumber() {
  const d = new Date()
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2020, 0, 1)) / 86_400_000)
}

function CourseCard({ c, onOpen }: { c: Course; onOpen: () => void }) {
  const done = useLessonsDone(c.id)
  const total = allLessons(c).length
  const due = useDueCards(c.id).length
  const pct = Math.round((done.length / total) * 100)
  return (
    <button className="course-card" style={{ '--k': c.color } as CSSProperties} onClick={onOpen}>
      <span className="course-icon">{c.icon}</span>
      <span className="course-main">
        <strong>{c.name}</strong>
        <span className="muted small">
          {done.length}/{total} lessons{due ? ` · ${due} to review` : ''}
        </span>
        <span className="bar">
          <span className="bar-fill" style={{ width: `${pct}%`, background: c.color, display: 'block' }} />
        </span>
      </span>
      <span className="muted">›</span>
    </button>
  )
}

function CoursePath({ c, onPlay, onBack }: { c: Course; onPlay: (l: Lesson) => void; onBack: () => void }) {
  const done = new Map(useLessonsDone(c.id).map((d) => [d.lessonId, d]))
  const lessons = allLessons(c)
  const nextIdx = lessons.findIndex((l) => !done.has(l.id))
  const indexOf = new Map(lessons.map((l, i) => [l.id, i]))
  return (
    <div className="stack">
      <section className="card hero" style={{ '--accent': c.color } as CSSProperties}>
        <button className="link-btn small" onClick={onBack}>
          ‹ All subjects
        </button>
        <h1>
          {c.icon} {c.name}
        </h1>
        {c.blurb && <p className="small">{c.blurb}</p>}
        <p className="muted small">
          {done.size}/{lessons.length} lessons · tap the glowing one to continue
        </p>
        {nextIdx >= 0 && (
          <button className="btn btn-primary btn-xl" onClick={() => onPlay(lessons[nextIdx])}>
            ▶ {lessons[nextIdx].title}
            <span className="btn-sub">about 5 minutes</span>
          </button>
        )}
      </section>

      {c.prompts && c.prompts.length > 0 && (
        <section className="card prompt-card" style={{ '--k': c.color } as CSSProperties}>
          <div className="muted small">✏️ Today's practice prompt</div>
          <p className="prompt-text">{c.prompts[dayNumber() % c.prompts.length]}</p>
          <p className="field-hint">A new one every day. Set a 10–15 min timer and just start.</p>
        </section>
      )}

      {c.units.map((u) => (
        <section key={u.id} className="card unit" style={{ '--k': c.color } as CSSProperties}>
          <div className="unit-head">
            <span className="unit-icon">{u.icon}</span>
            <div>
              <h2>{u.title}</h2>
              <p className="muted small">{u.description}</p>
            </div>
          </div>
          <div className="path">
            {u.lessons.map((l) => {
              const n = indexOf.get(l.id)!
              const d = done.get(l.id)
              const isNext = n === nextIdx
              const locked = !d && !isNext
              return (
                <div key={l.id} className="path-row" style={{ '--off': `${[0, 1.6, 0, -1.6][n % 4]}rem` } as CSSProperties}>
                  <button
                    className={'path-node' + (d ? ' done' : '') + (isNext ? ' next' : '') + (locked ? ' locked' : '')}
                    onClick={() => (!locked || confirm(`Skip ahead to "${l.title}"? (You can, if you already know the earlier stuff.)`)) && onPlay(l)}
                    aria-label={`${l.title}${d ? `, done, best ${d.best}%` : locked ? ', locked' : ''}`}
                  >
                    {d ? (d.best === 100 ? '👑' : '✓') : locked ? '🔒' : '★'}
                  </button>
                  <span className="path-label">
                    {l.title}
                    {d && <span className="muted small"> · {d.best}%</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <section className="card">
        <h2>➕ Add your own</h2>
        <p className="muted small">Adding your own units and questions (and Mistral-generated lessons) is coming in the next Study update.</p>
      </section>
    </div>
  )
}

export default function StudyScreen() {
  const s = useSettings()
  const stats = useXpStats()
  const hearts = useHearts()
  const due = useDueCards()
  const cards = useAllCards()
  const [open, setOpen] = useState<string | null>(null)
  const [playing, setPlaying] = useState<Playing | null>(null)

  const course = COURSES.find((c) => c.id === open)
  const [managing, setManaging] = useState(false)
  const mine = s.myCourses ? COURSES.filter((c) => s.myCourses!.includes(c.id)) : COURSES
  const sectionOf = (c: Course) => (c.group === 'school' ? 'school' : c.section === 'Languages' ? 'lang' : 'skills')
  const toggleCourse = (id: string) => {
    const cur = s.myCourses ?? COURSES.map((c) => c.id)
    setSetting('myCourses', cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }
  const goalPct = Math.min(100, Math.round((stats.today / Math.max(1, s.dailyXpGoal)) * 100))

  function startReview(onlyDue: boolean) {
    const list = (onlyDue ? due : cards).slice(0, 10)
    const items = list
      .map((c) => ({ key: c.key, q: findQuestion(c.courseId, c.qid)?.q, lang: COURSES.find((x) => x.id === c.courseId)?.lang }))
      .filter((x): x is { key: string; q: NonNullable<typeof x.q>; lang: string | undefined } => !!x.q)
    if (!items.length) return
    setPlaying({ courseId: list[0].courseId, color: themeById(s.theme).accents.study, review: items })
  }

  function play(c: Course, l: Lesson) {
    if (hearts.n <= 0) {
      alert(`You're out of hearts 💔 Next one in ${mins(hearts.nextIn ?? 0)} min, or review your mistakes to earn hearts now.`)
      return
    }
    setPlaying({ courseId: c.id, color: c.color, lang: c.lang, lesson: l })
  }

  return (
    <>
      {course ? (
        <CoursePath c={course} onPlay={(l) => play(course, l)} onBack={() => setOpen(null)} />
      ) : (
        <div className="stack">
          <div className="grid-3 study-stats">
            <section className="card stat">
              <div className="stat-icon">{stats.streakInfo.atRisk ? '⚠️' : '🔥'}</div>
              <div className="stat-num">{stats.streak}</div>
              <div className="muted small">{stats.streakInfo.atRisk ? 'save it today' : 'streak'}</div>
            </section>
            <section className="card stat">
              <div className="stat-icon">❤️</div>
              <div className="stat-num">
                {hearts.n}/{MAX_HEARTS}
              </div>
              <div className="muted small">{hearts.nextIn ? `+1 in ${mins(hearts.nextIn)}m` : 'full'}</div>
            </section>
            <section className="card stat">
              <div className="stat-icon">⭐</div>
              <div className="stat-num">{stats.today}</div>
              <div className="muted small">/{s.dailyXpGoal} XP today</div>
            </section>
          </div>
          <div className="bar thick">
            <div className="bar-fill" style={{ width: `${goalPct}%` }} />
          </div>

          <section className="card review-card">
            <div className="row-between">
              <div>
                <h2>🧠 Review my mistakes</h2>
                <p className="muted small">
                  {due.length ? `${due.length} due today` : cards.length ? `Nothing due. ${cards.length} in your deck.` : 'Wrong answers land here so you can fix them.'}
                </p>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn btn-primary" disabled={!due.length} onClick={() => startReview(true)}>
                Review {due.length ? `(${Math.min(10, due.length)})` : ''}
              </button>
              {cards.length > 0 && (
                <button className="btn" onClick={() => startReview(false)}>
                  Practise all
                </button>
              )}
            </div>
            <p className="field-hint">Each right answer in review: +2 XP and +1 ❤️. Cards you keep getting right come back less often.</p>
          </section>

          {mine.length === 0 && <p className="muted center">No courses yet. Tap the button below to pick some 📚</p>}
          {[
            ['school', '📚 School'],
            ['lang', '🌍 Languages'],
            ['skills', '✨ Skills & knowledge'],
          ].map(([key, title]) =>
            mine.some((c) => sectionOf(c) === key) ? (
              <div key={key} className="stack-sm">
                <h2 className="section-title">{title}</h2>
                {mine
                  .filter((c) => sectionOf(c) === key)
                  .map((c) => (
                    <CourseCard key={c.id} c={c} onOpen={() => setOpen(c.id)} />
                  ))}
              </div>
            ) : null,
          )}

          <button className="btn btn-ghost full" onClick={() => setManaging(true)}>
            ＋ Add or remove courses
          </button>

          {COMING_SOON.length > 0 && (
            <div className="soon-grid">
              {COMING_SOON.map((c) => (
                <div key={c.name} className="soon">
                  <span>{c.icon}</span>
                  {c.name}
                  <span className="muted small">soon</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {managing && (
        <div className="sheet-backdrop modal" onClick={() => setManaging(false)}>
          <div className="sheet modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="My courses">
            <div className="sheet-handle" />
            <h2>My courses</h2>
            <p className="field-hint">Ticked courses show in Study. Your progress is kept even if you hide one.</p>
            {COURSES.map((c) => (
              <label key={c.id} className="toggle">
                <input type="checkbox" checked={mine.includes(c)} onChange={() => toggleCourse(c.id)} />
                <span>
                  {c.icon} {c.name}
                </span>
              </label>
            ))}
            <button className="btn btn-primary full" onClick={() => setManaging(false)}>
              Done
            </button>
          </div>
        </div>
      )}

      {playing && <LessonPlayer courseId={playing.courseId} lesson={playing.lesson} review={playing.review} color={playing.color} lang={playing.lang} onClose={() => setPlaying(null)} />}
    </>
  )
}
