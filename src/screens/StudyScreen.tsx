import { Check, ChevronLeft, ChevronRight, Crown, Heart, Lock, Play, Plus, Star } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { COMING_SOON, COURSES, allLessons, findQuestion } from '../study/courses'
import { db } from '../lib/db'
import type { Course, Lesson, Question } from '../study/types'
import { MAX_HEARTS, useAllCards, useDueCards, useHearts, useLessonsDone } from '../study/progress'
import LessonPlayer from '../study/LessonPlayer'
import { useXpStats } from '../lib/xp'
import { setSetting, useSettings } from '../lib/settings'
import { paletteVar, useTheme } from '../lib/themes'

type Playing = {
  courseId: string
  vars: CSSProperties
  lang?: string
  lesson?: Lesson
  review?: { key: string; q: import('../study/types').Question }[]
}

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
    <button className="course-card" style={{ '--k': paletteVar(COURSES.indexOf(c)) } as CSSProperties} onClick={onOpen}>
      <span className="course-main">
        <strong>{c.name}</strong>
        <span className="muted small">
          {done.length}/{total} lessons{due ? ` · ${due} to review` : ''}
        </span>
        <span className="bar">
          <span
            className="bar-fill"
            style={{
              width: `${pct}%`,
              background: paletteVar(COURSES.indexOf(c)),
              display: 'block',
            }}
          />
        </span>
      </span>
      <ChevronRight size={18} className="muted" />
    </button>
  )
}

function CoursePath({ c, onPlay, onBack }: { c: Course; onPlay: (l: Lesson) => void; onBack: () => void }) {
  const theme = useTheme()
  const done = new Map(useLessonsDone(c.id).map((d) => [d.lessonId, d]))
  const lessons = allLessons(c)
  const nextIdx = lessons.findIndex((l) => !done.has(l.id))
  const indexOf = new Map(lessons.map((l, i) => [l.id, i]))
  return (
    <div className="stack">
      <section className="card hero" style={theme.accentVars(COURSES.indexOf(c))}>
        <button className="link-btn small" onClick={onBack}>
          <ChevronLeft size={16} /> All subjects
        </button>
        <h1>{c.name}</h1>
        {c.blurb && <p className="small">{c.blurb}</p>}
        <p className="muted small">
          {done.size}/{lessons.length} lessons · tap the glowing one to continue
        </p>
        {nextIdx >= 0 && (
          <button className="btn btn-primary btn-xl" onClick={() => onPlay(lessons[nextIdx])}>
            <Play size={16} fill="currentColor" /> {lessons[nextIdx].title}
            <span className="btn-sub">about 5 minutes</span>
          </button>
        )}
      </section>

      {c.prompts && c.prompts.length > 0 && (
        <section className="card prompt-card" style={{ '--k': paletteVar(COURSES.indexOf(c)) } as CSSProperties}>
          <div className="muted small">Today's practice prompt</div>
          <p className="prompt-text">{c.prompts[dayNumber() % c.prompts.length]}</p>
          <p className="field-hint">A new one every day. Set a 10–15 min timer and just start.</p>
        </section>
      )}

      {c.units.map((u, ui) => (
        <section
          key={u.id}
          className="card unit"
          style={
            {
              ...theme.accentVars(COURSES.indexOf(c)),
              '--k': 'var(--accent)',
            } as CSSProperties
          }
        >
          <div className="unit-head">
            <span className="unit-icon">{String(ui + 1).padStart(2, '0')}</span>
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
                <div
                  key={l.id}
                  className="path-row"
                  style={
                    {
                      '--off': `${[0, 1.6, 0, -1.6][n % 4]}rem`,
                    } as CSSProperties
                  }
                >
                  <button
                    className={'path-node' + (d ? ' done' : '') + (isNext ? ' next' : '') + (locked ? ' locked' : '')}
                    onClick={() => (!locked || confirm(`Skip ahead to "${l.title}"? (You can, if you already know the earlier stuff.)`)) && onPlay(l)}
                    aria-label={`${l.title}${d ? `, done, best ${d.best}%` : locked ? ', locked' : ''}`}
                  >
                    {d ? d.best === 100 ? <Crown size={22} /> : <Check size={24} /> : locked ? <Lock size={20} /> : <Star size={24} />}
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

      <section className="sec">
        <h2 className="section-title">Add your own</h2>
        <div className="card">
          <p className="muted small">Adding your own units and questions (and Mistral-generated lessons) is coming in the next Study update.</p>
        </div>
      </section>
    </div>
  )
}

export default function StudyScreen() {
  const theme = useTheme()
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

  async function startReview(onlyDue: boolean) {
    const list = (onlyDue ? due : cards).slice(0, 10)
    const items: { key: string; q: Question; lang?: string }[] = []
    for (const c of list) {
      // built-in lesson questions first, then app-made cards (e.g. homework mistakes)
      const q = findQuestion(c.courseId, c.qid)?.q ?? (await db.customQuestions.get(c.qid))?.q
      if (q)
        items.push({
          key: c.key,
          q,
          lang: COURSES.find((x) => x.id === c.courseId)?.lang,
        })
    }
    if (!items.length) return
    setPlaying({
      courseId: list[0].courseId,
      vars: theme.tabVars('study'),
      review: items,
    })
  }

  function play(c: Course, l: Lesson) {
    if (hearts.n <= 0) {
      alert(`You're out of hearts. Next one in ${mins(hearts.nextIn ?? 0)} min, or review your mistakes to earn hearts now.`)
      return
    }
    setPlaying({
      courseId: c.id,
      vars: theme.accentVars(COURSES.indexOf(c)),
      lang: c.lang,
      lesson: l,
    })
  }

  return (
    <>
      {course ? (
        <CoursePath c={course} onPlay={(l) => play(course, l)} onBack={() => setOpen(null)} />
      ) : (
        <div className="stack">
          <div className="study-summary">
            <div className="row-between">
              <span>
                <strong className="stat-num">{stats.today}</strong>
                <span className="muted"> / {s.dailyXpGoal} XP today</span>
              </span>
              <span className="muted small hearts-line">
                <Heart size={14} fill="currentColor" /> {hearts.n}/{MAX_HEARTS}
                {hearts.nextIn ? ` · +1 in ${mins(hearts.nextIn)}m` : ''}
              </span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: `${goalPct}%` }} />
            </div>
            {stats.streakInfo.atRisk && <p className="small warn-text">Your {stats.streak}-day streak ends tonight unless you do a lesson.</p>}
          </div>

          <section className="card review-card">
            <div className="row-between">
              <div>
                <h2>Review my mistakes</h2>
                <p className="muted small">{due.length ? `${due.length} due today` : cards.length ? `Nothing due. ${cards.length} in your deck.` : 'Wrong answers land here so you can fix them.'}</p>
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
            <p className="field-hint">Each right answer in review: +2 XP and +1 heart. Cards you keep getting right come back less often.</p>
          </section>

          {mine.length === 0 && <p className="muted center">No courses yet. Tap the button below to pick some</p>}
          {[
            ['school', 'School'],
            ['lang', 'Languages'],
            ['skills', 'Skills & knowledge'],
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
            <Plus size={16} /> Add or remove courses
          </button>

          {COMING_SOON.length > 0 && (
            <div className="soon-grid">
              {COMING_SOON.map((c) => (
                <div key={c.name} className="soon">
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
                <span>{c.name}</span>
              </label>
            ))}
            <button className="btn btn-primary full" onClick={() => setManaging(false)}>
              Done
            </button>
          </div>
        </div>
      )}

      {playing && <LessonPlayer courseId={playing.courseId} lesson={playing.lesson} review={playing.review} vars={playing.vars} lang={playing.lang} onClose={() => setPlaying(null)} />}
    </>
  )
}
