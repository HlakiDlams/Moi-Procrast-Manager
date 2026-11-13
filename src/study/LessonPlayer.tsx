import { useState } from 'react'
import type { Lesson, Question } from './types'
import QuestionView, { type Answered } from './QuestionView'
import { addMistake, changeHearts, finishLesson, MAX_HEARTS, reviewResult, useHearts } from './progress'
import { chime } from '../lib/sound'
import { canSpeak, speak } from '../lib/speech'

interface Item {
  q: Question
  attempt: number
  /** review mode: the card key */
  key?: string
  lang?: string
}

/**
 * Full-screen player for a lesson (with teach card + hearts) or a review session.
 * Wrong answers come back once at the end of the lesson, like Duolingo.
 */
export default function LessonPlayer({
  courseId,
  lesson,
  review,
  color,
  lang,
  onClose,
}: {
  lang?: string
  courseId: string
  lesson?: Lesson
  review?: { key: string; q: Question; lang?: string }[]
  color: string
  onClose: () => void
}) {
  const hearts = useHearts()
  const [queue, setQueue] = useState<Item[]>(() => (lesson ? lesson.questions.map((q) => ({ q, attempt: 0 })) : review!.map((r) => ({ q: r.q, attempt: 0, key: r.key, lang: r.lang }))))
  const [idx, setIdx] = useState(0)
  const [teach, setTeach] = useState(!!lesson)
  const [result, setResult] = useState<Answered | null>(null)
  const [firstTry, setFirstTry] = useState({ right: 0, total: lesson ? lesson.questions.length : review!.length })
  const [wrongOnce] = useState(() => new Set<string>())
  const [done, setDone] = useState<{ xp: number; score: number } | null>(null)
  const [outOfHearts, setOutOfHearts] = useState(false)

  const total = queue.length
  const item = queue[idx]
  const isReview = !lesson

  async function onCheck(a: Answered) {
    setResult(a)
    if (a.correct) {
      chime()
      if (item.attempt === 0) setFirstTry((f) => ({ ...f, right: f.right + 1 }))
    } else {
      navigator.vibrate?.([80, 60, 80])
    }
    if (isReview) {
      await reviewResult(item.key!, a.correct)
      return
    }
    if (!a.correct) {
      if (!wrongOnce.has(item.q.id)) {
        wrongOnce.add(item.q.id)
        await addMistake(courseId, item.q.id)
        // see it again at the end of the lesson
        setQueue((qs) => [...qs, { q: item.q, attempt: item.attempt + 1 }])
      }
      const left = await changeHearts(-1)
      if (left <= 0) setOutOfHearts(true)
    }
  }

  async function next() {
    if (outOfHearts) return
    setResult(null)
    if (idx + 1 < queue.length) {
      setIdx(idx + 1)
      return
    }
    const score = Math.round((firstTry.right / Math.max(1, firstTry.total)) * 100)
    const xp = lesson ? await finishLesson(courseId, lesson.id, score) : firstTry.right * 2
    setDone({ xp, score })
  }

  const pct = done ? 100 : Math.round((idx / Math.max(1, total)) * 100)

  return (
    <div className="player" style={{ '--accent': color } as React.CSSProperties} role="dialog" aria-label={lesson?.title ?? 'Review'}>
      <div className="player-top">
        <button className="icon-btn subtle" onClick={() => (done || confirm('Quit this lesson? Progress in it is lost.') ? onClose() : null)} aria-label="Close">
          ✕
        </button>
        <div className="bar thick player-bar">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {!isReview && <span className="hearts">❤️ {hearts.n}</span>}
      </div>

      {teach && lesson && (
        <div className="player-body">
          <div className="teach">
            <div className="teach-badge">💡 Learn</div>
            <div className="row-between">
              <h1>{lesson.title}</h1>
              {lesson.teach.say && canSpeak && (
                <button className="icon-btn" onClick={() => speak(lesson.teach.say!, lang)} aria-label="Listen">
                  🔊
                </button>
              )}
            </div>
            <ul>
              {lesson.teach.text.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            {lesson.teach.example && (
              <div className="teach-example">
                <div className="muted small">Example</div>
                {lesson.teach.example.map((l, i) => (
                  <div key={i}>{l || ' '}</div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-xl" onClick={() => setTeach(false)}>
            Got it, let's go
          </button>
        </div>
      )}

      {!teach && !done && item && (
        <div className="player-body">
          {item.attempt > 0 && <div className="pill retry-pill">🔁 Try this one again</div>}
          <QuestionView key={`${idx}-${item.q.id}-${item.attempt}`} q={item.q} attempt={item.attempt} locked={!!result} lang={item.lang ?? lang} onCheck={onCheck} />
        </div>
      )}

      {result && !done && (
        <div className={'feedback ' + (result.correct ? 'ok' : 'bad')}>
          <strong>{result.correct ? ['Lekker! ✨', 'Correct! 💕', 'Yes!! 🎉', 'Nailed it 🔥'][idx % 4] : 'Not quite'}</strong>
          {!result.correct && <div className="fb-solution">Answer: {result.solution}</div>}
          <div className="fb-explain">{item.q.explain}</div>
          {outOfHearts ? (
            <div className="stack-sm">
              <p className="small">You're out of hearts 💔 They refill 1 every 30 min, or earn them back by reviewing mistakes.</p>
              <button className="btn btn-xl" onClick={onClose}>
                OK
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-xl" onClick={next}>
              Continue
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="player-body center">
          <div className="done-emoji">{done.score === 100 ? '🏆' : done.score >= 70 ? '🎉' : '💪'}</div>
          <h1>{isReview ? 'Review done!' : 'Lesson complete!'}</h1>
          <p className="muted">
            {firstTry.right}/{firstTry.total} right first time · {done.score}%
          </p>
          <p className="xp-pop">+{done.xp} XP</p>
          {!isReview && done.score < 100 && <p className="small muted">Your mistakes are saved in Review, so you'll see them again in a day or two.</p>}
          {!isReview && hearts.n < MAX_HEARTS && <p className="small muted">❤️ Review mistakes to earn hearts back.</p>}
          <button className="btn btn-primary btn-xl" onClick={onClose}>
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
