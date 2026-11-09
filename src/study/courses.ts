import type { Course, Lesson, Question } from './types'
import { MATHS } from './content/maths'
import { AFRIKAANS } from './content/afrikaans'

/** Built-in courses. More get added stage by stage. */
export const COURSES: Course[] = [MATHS, AFRIKAANS]

/** Shown on the Study home as "coming soon" until their content is written. */
export const COMING_SOON: { name: string; icon: string; group: 'school' | 'extra' }[] = [
  { name: 'EGD', icon: '📏', group: 'school' },
  { name: 'Information Technology', icon: '💻', group: 'school' },
  { name: 'English', icon: '📖', group: 'extra' },
  { name: 'CAT', icon: '🖥️', group: 'extra' },
  { name: 'Japanese', icon: '🇯🇵', group: 'extra' },
  { name: 'Korean', icon: '🇰🇷', group: 'extra' },
  { name: 'Mandarin', icon: '🇨🇳', group: 'extra' },
  { name: 'Portuguese', icon: '🇵🇹', group: 'extra' },
  { name: 'Spanish', icon: '🇪🇸', group: 'extra' },
  { name: 'Hebrew', icon: '🇮🇱', group: 'extra' },
  { name: 'French', icon: '🇫🇷', group: 'extra' },
  { name: 'Art', icon: '🎨', group: 'extra' },
  { name: 'Chess', icon: '♟️', group: 'extra' },
  { name: 'Music', icon: '🎵', group: 'extra' },
  { name: 'Personal finance', icon: '💳', group: 'extra' },
]

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
