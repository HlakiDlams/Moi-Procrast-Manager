import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import { chat, MistralError, parseJson } from './mistral'
import type { Lesson, Question } from '../study/types'

/** Lessons written by the AI live under this course id (progress, review cards). */
export const AI_COURSE = 'ai'
const KEY = 'aiLessons'

export interface AiLesson {
  /** subject or course the learner picked, e.g. "Mathematics" */
  subject: string
  topic: string
  at: string
  lesson: Lesson
  /** set when the lesson belongs to an AI-made course */
  courseId?: string
}

export interface AiCourse {
  id: string
  name: string
  subject: string
  topic: string
  at: string
  /** lesson titles planned by the AI, in order */
  plan: string[]
}

const COURSE_KEY = 'aiCourses'

export function useAiCourses(): AiCourse[] {
  return useLiveQuery(async () => ((await db.settings.get(COURSE_KEY))?.value as AiCourse[] | undefined) ?? [], []) ?? []
}

async function courses(): Promise<AiCourse[]> {
  return ((await db.settings.get(COURSE_KEY))?.value as AiCourse[] | undefined) ?? []
}

export function useAiLessons(): AiLesson[] {
  return useLiveQuery(async () => ((await db.settings.get(KEY))?.value as AiLesson[] | undefined) ?? [], []) ?? []
}

async function save(list: AiLesson[]) {
  await db.settings.put({ key: KEY, value: list })
}

export async function deleteAiLesson(id: string) {
  const list = ((await db.settings.get(KEY))?.value as AiLesson[] | undefined) ?? []
  const gone = list.find((x) => x.lesson.id === id)
  await save(list.filter((x) => x.lesson.id !== id))
  if (gone) await db.customQuestions.bulkDelete(gone.lesson.questions.map((q) => q.id))
}

interface Raw {
  title?: unknown
  teach?: unknown
  example?: unknown
  questions?: unknown
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '')
const strs = (v: unknown, max: number) => (Array.isArray(v) ? v.map(str).filter(Boolean).slice(0, max) : [])

/** Turn the AI's reply into a lesson, dropping anything malformed. */
export function toLesson(raw: Raw, id: string, fallbackTitle: string): Lesson {
  const questions: Question[] = []
  for (const item of Array.isArray(raw.questions) ? raw.questions : []) {
    const r = item as Record<string, unknown>
    const qid = `${id}-${questions.length + 1}`
    const prompt = str(r.prompt)
    const explain = str(r.explain)
    if (!prompt) continue
    if (r.type === 'input') {
      const answers = strs(r.answers, 6)
      if (answers.length) questions.push({ id: qid, type: 'input', prompt, explain, answers })
    } else {
      const options = strs(r.options, 5)
      const answer = Number(r.answer)
      if (options.length >= 2 && Number.isInteger(answer) && answer >= 0 && answer < options.length) questions.push({ id: qid, type: 'mcq', prompt, explain, options, answer })
    }
  }
  const text = strs(raw.teach, 6)
  if (questions.length < 3 || !text.length) throw new MistralError('bad-reply', 'The AI did not send a complete lesson. Try again, or word the topic differently.')
  const example = strs(raw.example, 8)
  return { id, title: str(raw.title) || fallbackTitle, teach: { text, ...(example.length ? { example } : {}) }, questions: questions.slice(0, 10) }
}

/** Ask the AI for a short advanced lesson and save it. */
export async function createAiLesson(subject: string, topic: string, level: string, signal?: AbortSignal, courseId?: string): Promise<AiLesson> {
  const reply = await chat(
    [
      {
        role: 'system',
        content: `You write short, accurate lessons for a learner in South Africa${level ? ` (${level})` : ''}. Subject: ${subject}. This is the ADVANCED track: go past the basics and aim at exam-level understanding, common traps and applying the idea, but stay clear and correct. Where the subject is a school subject, follow the CAPS curriculum.
Reply with JSON only, in this shape:
{"title": "short lesson title", "teach": ["3 to 5 short teaching points, one sentence each"], "example": ["an optional worked example, one line per step"], "questions": [{"type": "mcq", "prompt": "...", "options": ["4 options"], "answer": 0, "explain": "why, in one or two sentences"}, {"type": "input", "prompt": "a question with a short exact answer", "answers": ["accepted answer", "another accepted spelling"], "explain": "..."}]}
Rules: 8 questions, 6 mcq then 2 input. "answer" is the index of the correct option, and the correct option must not always be first. Input answers must be short (a number or a word or two). Plain text only: no markdown, no LaTeX; write maths like x^2 and 3/4. Every answer must be checked and correct.`,
      },
      { role: 'user', content: `Write the lesson on: ${topic}` },
    ],
    { json: true, signal, maxTokens: 3000 },
  )
  const id = 'ai' + Date.now().toString(36)
  const lesson = toLesson(parseJson<Raw>(reply), id, topic)
  const row: AiLesson = { subject, topic, at: new Date().toISOString(), lesson, ...(courseId ? { courseId } : {}) }
  const list = ((await db.settings.get(KEY))?.value as AiLesson[] | undefined) ?? []
  await save([row, ...list].slice(0, 200))
  // so mistakes from this lesson can come back in Review
  await db.customQuestions.bulkPut(lesson.questions.map((q) => ({ id: q.id, courseId: AI_COURSE, q })))
  return row
}

export async function deleteAiCourse(id: string) {
  const list = ((await db.settings.get(KEY))?.value as AiLesson[] | undefined) ?? []
  const gone = list.filter((x) => x.courseId === id)
  await save(list.filter((x) => x.courseId !== id))
  await db.customQuestions.bulkDelete(gone.flatMap((x) => x.lesson.questions.map((q) => q.id)))
  await db.settings.put({ key: COURSE_KEY, value: (await courses()).filter((c) => c.id !== id) })
}

/**
 * Ask the AI for a short course outline, then write each lesson one after another.
 * Lessons that finish are kept even if you cancel or something fails part-way.
 */
export async function createAiCourse(subject: string, topic: string, level: string, onProgress: (done: number, total: number, title: string) => void, signal?: AbortSignal): Promise<AiCourse> {
  const reply = await chat(
    [
      {
        role: 'system',
        content: `You plan short courses for a learner in South Africa${level ? ` (${level})` : ''}. Subject area: ${subject}. Reply with JSON only: {"name": "short course name", "lessons": ["5 lesson titles, from the basics up, each a specific topic"]}. Exactly 5 lessons. Plain text only.`,
      },
      { role: 'user', content: `Plan a course on: ${topic}` },
    ],
    { json: true, signal, maxTokens: 500 },
  )
  const raw = parseJson<{ name?: unknown; lessons?: unknown }>(reply)
  const plan = (Array.isArray(raw.lessons) ? raw.lessons.map(str).filter(Boolean) : []).slice(0, 6)
  if (plan.length < 2) throw new MistralError('bad-reply', 'The AI did not send a usable course outline. Try again, or word the topic differently.')
  const course: AiCourse = { id: 'ac' + Date.now().toString(36), name: str(raw.name) || topic, subject, topic, at: new Date().toISOString(), plan }
  await db.settings.put({ key: COURSE_KEY, value: [course, ...(await courses())].slice(0, 50) })
  for (let i = 0; i < plan.length; i++) {
    onProgress(i, plan.length, plan[i])
    await createAiLesson(subject, `${course.name}: ${plan[i]}`, level, signal, course.id)
  }
  onProgress(plan.length, plan.length, '')
  return course
}
