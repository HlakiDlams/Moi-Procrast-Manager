import type { Course, Lesson, Question, Unit } from '../types'

/** Short builders for lesson content. Question ids are made from the lesson id. */
type Draft = Question extends infer Q ? (Q extends Question ? Omit<Q, 'id'> : never) : never
type Extra = { say?: string; code?: string; context?: string }

/** Multiple choice. The FIRST option is the right one (options are shuffled on screen). */
export const mc = (prompt: string, options: string[], explain: string, extra: Extra = {}): Draft => ({ type: 'mcq', prompt, options, answer: 0, explain, ...extra })

/** Typed answer. */
export const inp = (prompt: string, answers: string[], explain: string, extra: Extra & { numeric?: boolean } = {}): Draft => ({ type: 'input', prompt, answers, explain, ...extra })

/** Match left to right. */
export const pair = (prompt: string, pairs: [string, string][], explain: string): Draft => ({ type: 'match', prompt, pairs, explain })

/** Put the steps in order (give them in the right order). */
export const seq = (prompt: string, steps: string[], explain: string): Draft => ({ type: 'order', prompt, steps, explain })

export function lesson(id: string, title: string, teach: string[], questions: Draft[], opts: { example?: string[]; say?: string } = {}): Lesson {
  return { id, title, teach: { text: teach, ...opts }, questions: questions.map((q, i) => ({ ...q, id: `${id}-${i + 1}` }) as Question) }
}

export const unit = (id: string, title: string, description: string, lessons: Lesson[]): Unit => ({ id, title, icon: '', description, lessons })

export function schoolCourse(id: string, name: string, blurb: string, units: Unit[]): Course {
  return { id, name, icon: '', color: '#888888', group: 'school', subjectName: name, blurb, units }
}
