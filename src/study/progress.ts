import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, localDay } from '../lib/db'
import { addXp } from '../lib/xp'

// ---------------- hearts ----------------

export const MAX_HEARTS = 5
const REFILL_MS = 30 * 60_000

interface HeartState {
  n: number
  at: number // when n was last set
}

function current(h: HeartState | undefined, now = Date.now()): { n: number; nextIn: number | null } {
  if (!h) return { n: MAX_HEARTS, nextIn: null }
  const gained = Math.floor((now - h.at) / REFILL_MS)
  const n = Math.min(MAX_HEARTS, h.n + gained)
  return { n, nextIn: n >= MAX_HEARTS ? null : REFILL_MS - ((now - h.at) % REFILL_MS) }
}

async function readHearts() {
  return (await db.settings.get('hearts'))?.value as HeartState | undefined
}

export function useHearts() {
  const h = useLiveQuery(readHearts, [])
  return current(h)
}

export async function changeHearts(delta: number) {
  const now = Date.now()
  const h = await readHearts()
  const cur = current(h, now)
  // keep partial refill progress when losing a heart
  const keepAt = h && cur.n < MAX_HEARTS ? now - ((now - h.at) % REFILL_MS) : now
  const n = Math.max(0, Math.min(MAX_HEARTS, cur.n + delta))
  await db.settings.put({ key: 'hearts', value: { n, at: keepAt } satisfies HeartState })
  return n
}

// ---------------- lessons ----------------

export function useLessonsDone(courseId: string) {
  return useLiveQuery(() => db.lessons.where('courseId').equals(courseId).toArray(), [courseId]) ?? []
}

export const XP_LESSON = 10
export const XP_PERFECT = 5
export const XP_REVIEW = 2

export async function finishLesson(courseId: string, lessonId: string, score: number) {
  const prev = await db.lessons.get(lessonId)
  await db.lessons.put({ lessonId, courseId, at: new Date().toISOString(), best: Math.max(prev?.best ?? 0, score), times: (prev?.times ?? 0) + 1 })
  const xp = XP_LESSON + (score === 100 ? XP_PERFECT : 0)
  await addXp(xp, 'study', `Lesson ${lessonId}`)
  return xp
}

// ---------------- spaced repetition (Leitner boxes) ----------------

/** Days until you see a card again, by box. */
const GAP = [0, 1, 2, 4, 8, 16]

export async function addMistake(courseId: string, qid: string) {
  const key = `${courseId}:${qid}`
  const c = await db.cards.get(key)
  await db.cards.put({ key, courseId, qid, box: 1, due: addDays(localDay(), 1), lapses: (c?.lapses ?? 0) + 1 })
}

/** Review result. Box 5 + correct = mastered (removed). */
export async function reviewResult(key: string, correct: boolean) {
  const c = await db.cards.get(key)
  if (!c) return
  if (!correct) {
    await db.cards.update(key, { box: 1, due: addDays(localDay(), 1), lapses: c.lapses + 1 })
    return
  }
  if (c.box >= 5) {
    await db.cards.delete(key)
  } else {
    const box = c.box + 1
    await db.cards.update(key, { box, due: addDays(localDay(), GAP[box]) })
  }
  await addXp(XP_REVIEW, 'study', 'Review')
  await changeHearts(+1)
}

export function useDueCards(courseId?: string) {
  const today = localDay()
  return (
    useLiveQuery(async () => {
      const due = await db.cards.where('due').belowOrEqual(today).toArray()
      return courseId ? due.filter((c) => c.courseId === courseId) : due
    }, [today, courseId]) ?? []
  )
}

export function useAllCards() {
  return useLiveQuery(() => db.cards.toArray(), []) ?? []
}
