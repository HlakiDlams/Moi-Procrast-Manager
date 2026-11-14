import type { Course, Lesson, Question } from './types'
import { MATHS } from './content/maths'
import { AFRIKAANS } from './content/afrikaans'
import { EGD } from './content/egd'
import { IT } from './content/it'
import { ENGLISH } from './content/english'
import { JAPANESE, KOREAN, MANDARIN, SPANISH, PORTUGUESE, FRENCH, HEBREW } from './content/languages'
import { ART, CHESS, MUSIC, FINANCE } from './content/skills'
import { COURSE_LINKS } from './links'

/** Built-in courses. More get added stage by stage. */
export const COURSES: Course[] = ([MATHS, AFRIKAANS, EGD, IT, ENGLISH, JAPANESE, KOREAN, MANDARIN, SPANISH, PORTUGUESE, FRENCH, HEBREW, FINANCE, ART, CHESS, MUSIC] as Course[]).map((c) => ({
  ...c,
  links: COURSE_LINKS[c.id],
}))

/** Shown on the Study home as "coming soon" until their content is written. */
export const COMING_SOON: { name: string; icon: string; group: 'school' | 'extra' }[] = []

export const courseById = (id: string) => COURSES.find((c) => c.id === id)

export function allLessons(c: Course): Lesson[] {
  return c.units.flatMap((u) => u.lessons)
}

export function findQuestion(courseId: string, qid: string): { q: Question; lesson: Lesson } | undefined {
  const c = courseById(courseId)
  if (!c) return
  for (const l of allLessons(c)) {
    const q = l.questions.find((x) => x.id === qid)
    if (q) return { q, lesson: l }
  }
}
