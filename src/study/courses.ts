import type { Course, Lesson, Question } from './types'
import { MATHS } from './content/maths'
import { AFRIKAANS } from './content/afrikaans'
import { EGD } from './content/egd'
import { IT } from './content/it'
import { ENGLISH } from './content/english'
import { JAPANESE, KOREAN, MANDARIN, SPANISH, PORTUGUESE, FRENCH, HEBREW } from './content/languages'
import { ART, CHESS, MUSIC, FINANCE } from './content/skills'
import { COURSE_LINKS } from './links'
import { MATHLIT, PHYSCI, LIFESCI } from './content/school1'
import { GEOGRAPHY, HISTORY, ACCOUNTING } from './content/school2'
import { BUSINESS, ECONOMICS, CAT, LIFE_ORIENTATION } from './content/school3'
import { EXTRA_UNITS } from './content/extras'

/** Built-in courses. More get added stage by stage. */
export const COURSES: Course[] = (
  [
    MATHS,
    AFRIKAANS,
    EGD,
    IT,
    MATHLIT,
    PHYSCI,
    LIFESCI,
    GEOGRAPHY,
    HISTORY,
    ACCOUNTING,
    BUSINESS,
    ECONOMICS,
    CAT,
    LIFE_ORIENTATION,
    ENGLISH,
    JAPANESE,
    KOREAN,
    MANDARIN,
    SPANISH,
    PORTUGUESE,
    FRENCH,
    HEBREW,
    FINANCE,
    ART,
    CHESS,
    MUSIC,
  ] as Course[]
).map((c) => ({
  ...c,
  units: [...c.units, ...(EXTRA_UNITS[c.id] ?? [])],
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
