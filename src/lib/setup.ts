import { db, localDay, type Commitment, type Subject } from './db'
import { COURSES } from '../study/courses'
import { setSetting } from './settings'
import { generateAndSave } from './planner'
import { mondayOf, fromMin, toMin } from './scheduler'

/** School subjects that don't have lessons yet but can still get planner time. */
export const MORE_SCHOOL_SUBJECTS = ['Tourism', 'Consumer Studies', 'Agricultural Sciences', 'Visual Arts', 'Dramatic Arts', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana', 'Sepedi']

/** The Planner subject name a course maps to. */
export const subjectNameOf = (courseId: string) => {
  const c = COURSES.find((x) => x.id === courseId)
  return c ? (c.subjectName ?? c.name) : courseId
}

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6]

export interface SetupChoices {
  courseIds: string[]
  /** extra subject names (from MORE_SCHOOL_SUBJECTS or typed) */
  extraSubjects: string[]
  prayers: boolean
  wake: string
  bed: string
  /** existing commitments to keep */
  keepCommitmentIds: number[]
}

/** Apply the welcome choices to subjects, commitments and the plan. Keeps marks of subjects you keep. */
export async function applySetup(ch: SetupChoices) {
  const wanted = new Map<string, Omit<Subject, 'id'>>()
  for (const id of ch.courseIds) {
    const c = COURSES.find((x) => x.id === id)
    if (!c) continue
    wanted.set(subjectNameOf(id), {
      name: subjectNameOf(id),
      icon: c.icon,
      color: c.color,
      priority: c.group === 'school' ? 2 : 1,
      examDate: '',
      currentMark: null,
      targetMark: 50,
      active: true,
      group: c.group,
    })
  }
  for (const name of ch.extraSubjects) {
    if (!wanted.has(name)) wanted.set(name, { name, icon: '', color: '#FF8AC8', priority: 2, examDate: '', currentMark: null, targetMark: 50, active: true, group: 'school' })
  }

  await db.transaction('rw', [db.subjects, db.commitments, db.settings], async () => {
    // subjects: keep the ones still wanted (with their marks), remove the rest, add new ones
    const existing = await db.subjects.toArray()
    for (const s of existing) {
      if (!wanted.has(s.name)) await db.subjects.delete(s.id!)
      else wanted.delete(s.name)
    }
    if (wanted.size) await db.subjects.bulkAdd([...wanted.values()])

    // commitments: remove the ones you un-ticked
    const cs = await db.commitments.toArray()
    for (const c of cs) if (!ch.keepCommitmentIds.includes(c.id!)) await db.commitments.delete(c.id!)
    const kept = await db.commitments.toArray()
    const add: Omit<Commitment, 'id'>[] = []
    const wake = toMin(ch.wake)
    let bed = toMin(ch.bed)
    if (bed <= wake) bed += 1440
    if (!kept.some((c) => c.kind === 'meal')) {
      add.push({ title: 'Breakfast', days: EVERY_DAY, start: fromMin(wake + 30), end: fromMin(wake + 50), travelMin: 0, kind: 'meal', active: true })
      add.push({ title: 'Lunch', days: EVERY_DAY, start: '12:30', end: '13:00', travelMin: 0, kind: 'meal', active: true })
      add.push({ title: 'Supper', days: EVERY_DAY, start: '18:30', end: '19:00', travelMin: 0, kind: 'meal', active: true })
    }
    const hasPrayer = kept.some((c) => c.kind === 'prayer')
    if (ch.prayers && !hasPrayer) {
      add.push({ title: 'Morning prayer', days: EVERY_DAY, start: fromMin(wake), end: fromMin(wake + 15), travelMin: 0, kind: 'prayer', active: true })
      add.push({ title: 'Noon prayer', days: EVERY_DAY, start: '12:00', end: '12:10', travelMin: 0, kind: 'prayer', active: true })
      add.push({ title: 'Night prayer', days: EVERY_DAY, start: fromMin(bed - 15), end: fromMin(bed), travelMin: 0, kind: 'prayer', active: true })
    }
    if (!ch.prayers && hasPrayer) {
      for (const c of kept) if (c.kind === 'prayer') await db.commitments.delete(c.id!)
    }
    if (add.length) await db.commitments.bulkAdd(add)

    // never run the old one-person seed or its migrations on this install
    for (const key of ['plannerSeeded', 'plannerSeedV2', 'profileMigV3']) await db.settings.put({ key, value: true })
  })

  await setSetting('myCourses', ch.courseIds)
  await setSetting('wakeTime', ch.wake)
  await setSetting('bedtime', ch.bed)

  // rebuild this week's plan around the new setup
  await generateAndSave(mondayOf(localDay()))
}
