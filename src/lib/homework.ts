import { db, localDay, type HomeworkCheck, type HomeworkResult } from './db'
import { chat, parseJson, MistralError } from './mistral'
import { COURSES } from '../study/courses'
import { addMistake } from '../study/progress'
import { addXp } from './xp'
import type { Question } from '../study/types'

export type { HomeworkResult }

/** Resize a photo to keep uploads small (max side `max` px, JPEG). Returns a data URL. */
export function shrinkImage(file: Blob, max = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      const ctx = c.getContext('2d')
      if (!ctx) return reject(new Error('no canvas'))
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("That file isn't a picture we can read."))
    }
    img.src = url
  })
}

/** Course id for a Planner subject name; subjects without lessons get their own review group. */
export function courseIdForSubject(name: string): string {
  return COURSES.find((c) => (c.subjectName ?? c.name) === name)?.id ?? `custom:${name}`
}

const SYSTEM = (subject: string, grade: string) => `You are a kind, encouraging South African teacher marking a ${grade ? `Grade ${grade} ` : ''}learner's homework for ${subject} (CAPS curriculum where it applies). You get photo(s) of handwritten or printed work.

1. Find every question and the learner's answer. Do not invent questions that are not on the page.
2. If something can't be read, mark that item "unreadable" instead of guessing.
3. Mark each answer: "correct", "partial" or "wrong". Use the marks printed on the paper if you can see them; otherwise 1 mark per short answer and more for multi-step working.
4. For every answer that is not fully correct: explain the mistake in simple, friendly English as short numbered steps, then give the correct answer. For Afrikaans, give the Afrikaans answer and explain in English.
5. Keep it encouraging: mention what was done well.

Reply with ONLY a JSON object, no other text:
{"readable": true, "summary": "one or two sentences", "score": {"earned": 0, "total": 0}, "items": [{"question": "", "learnerAnswer": "", "verdict": "correct|partial|wrong|unreadable", "marks": {"earned": 0, "total": 0}, "feedback": "", "steps": [""], "correctAnswer": ""}], "tips": [""]}`

/** Normalise whatever came back so the screen never breaks on a missing field. */
function clean(r: Partial<HomeworkResult>): HomeworkResult {
  const items = (Array.isArray(r.items) ? r.items : []).map((it) => ({
    question: String(it?.question ?? ''),
    learnerAnswer: String(it?.learnerAnswer ?? ''),
    verdict: (['correct', 'partial', 'wrong', 'unreadable'].includes(String(it?.verdict)) ? it.verdict : 'wrong') as HomeworkResult['items'][number]['verdict'],
    marks: { earned: Math.max(0, Number(it?.marks?.earned) || 0), total: Math.max(0, Number(it?.marks?.total) || 0) },
    feedback: String(it?.feedback ?? ''),
    steps: Array.isArray(it?.steps) ? it.steps.map(String).filter(Boolean) : [],
    correctAnswer: String(it?.correctAnswer ?? ''),
  }))
  const sumE = items.reduce((n, i) => n + i.marks.earned, 0)
  const sumT = items.reduce((n, i) => n + i.marks.total, 0)
  const earned = Number(r.score?.earned)
  const total = Number(r.score?.total)
  const score = total > 0 && Number.isFinite(earned) ? { earned: Math.min(earned, total), total } : { earned: sumE, total: sumT }
  return {
    readable: r.readable !== false,
    summary: String(r.summary ?? ''),
    score,
    items,
    tips: Array.isArray(r.tips) ? r.tips.map(String).filter(Boolean) : [],
  }
}

export async function markHomework(images: string[], subject: string, task: string, grade: string, signal?: AbortSignal): Promise<HomeworkResult> {
  const text = await chat(
    [
      { role: 'system', content: SYSTEM(subject, grade) },
      {
        role: 'user',
        content: [{ type: 'text', text: `${task.trim() ? `The task was: ${task.trim()}\n` : ''}Please mark my ${subject} homework (${images.length} page${images.length === 1 ? '' : 's'}).` }, ...images.map((u) => ({ type: 'image_url' as const, image_url: u }))],
      },
    ],
    { vision: true, json: true, signal, maxTokens: 6000 },
  )
  const r = clean(parseJson<Partial<HomeworkResult>>(text))
  if (!r.items.length && r.readable) throw new MistralError('bad-reply', "Mistral couldn't find any questions in the photo. Try a clearer, closer photo.")
  return r
}

/** Save a check, turn mistakes into review cards, give XP. Returns how many cards were added. */
export async function saveCheck(subject: string, task: string, thumb: string, result: HomeworkResult): Promise<{ id: number; cards: number }> {
  const at = new Date()
  const courseId = courseIdForSubject(subject)
  const id = await db.homework.add({ at: at.toISOString(), day: localDay(at), subject, task, thumb, result } satisfies HomeworkCheck)
  let cards = 0
  for (const [i, it] of result.items.entries()) {
    if (it.verdict === 'correct' || it.verdict === 'unreadable' || !it.question) continue
    const qid = `hw-${id}-${i}`
    const q: Question = {
      id: qid,
      type: 'recall',
      prompt: it.question,
      answer: it.correctAnswer || '(see explanation)',
      explain: [it.feedback, ...it.steps.map((s, n) => `${n + 1}. ${s}`)].filter(Boolean).join('\n'),
    }
    await db.customQuestions.put({ id: qid, courseId, q })
    await addMistake(courseId, qid)
    cards++
  }
  await addXp(10, 'homework', `Checked ${subject} homework`)
  return { id, cards }
}
