import { db, type Commitment, type Subject } from './db'

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6]
const MON_FRI = [1, 2, 3, 4, 5]

/** Hlaki's fixed week. Editable in Planner → Fixed commitments. */
export const PRAYERS: Omit<Commitment, 'id'>[] = [
  { title: 'Morning prayer', days: EVERY_DAY, start: '04:00', end: '04:15', travelMin: 0, kind: 'prayer', active: true },
  { title: 'Noon prayer', days: MON_FRI, start: '12:00', end: '12:15', travelMin: 0, kind: 'prayer', active: true },
  { title: 'Noon prayer', days: [0, 6], start: '13:35', end: '13:40', travelMin: 0, kind: 'prayer', active: true },
  { title: 'Night prayer', days: EVERY_DAY, start: '20:45', end: '21:00', travelMin: 0, kind: 'prayer', active: true },
]

export const DEFAULT_COMMITMENTS: Omit<Commitment, 'id'>[] = [
  ...PRAYERS,
  { title: 'Chores', days: EVERY_DAY, start: '05:00', end: '06:00', travelMin: 0, kind: 'other', active: true },
  { title: 'Breakfast', days: EVERY_DAY, start: '06:00', end: '06:20', travelMin: 0, kind: 'meal', active: true },
  { title: 'Lunch', days: MON_FRI, start: '12:30', end: '13:00', travelMin: 0, kind: 'meal', active: true },
  { title: 'Lunch', days: [0, 6], start: '13:40', end: '14:10', travelMin: 0, kind: 'meal', active: true },
  { title: 'Church', days: MON_FRI, start: '17:00', end: '18:00', travelMin: 5, kind: 'other', active: true },
  { title: 'Church', days: [0, 6], start: '07:00', end: '13:30', travelMin: 5, kind: 'other', active: true },
  { title: 'Work', days: [1, 2, 3, 4, 5, 6], start: '18:00', end: '19:00', travelMin: 0, kind: 'other', active: true },
  { title: 'Supper', days: EVERY_DAY, start: '19:00', end: '19:30', travelMin: 0, kind: 'meal', active: true },
]

// Dates are placeholders until the official 2027 timetables are out (editable in the Planner).
const JUNE_REWRITE = '2027-05-20'
const NOV_FINALS = '2027-10-27'

/** CAPS subjects. Marks are left blank on purpose: you fill them in on your phone. */
export const DEFAULT_SUBJECTS: Omit<Subject, 'id'>[] = [
  { name: 'Mathematics', icon: '', color: '#FF2E93', priority: 3, examDate: JUNE_REWRITE, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'Afrikaans EAT', icon: '', color: '#FF8AC8', priority: 3, examDate: JUNE_REWRITE, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'EGD', icon: '', color: '#FFD166', priority: 2, examDate: NOV_FINALS, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'Information Technology', icon: '', color: '#C77DFF', priority: 2, examDate: NOV_FINALS, currentMark: null, targetMark: 40, active: true, group: 'school' },
  // Done with these for school; kept for growing knowledge (no exam, light time)
  { name: 'English', icon: '', color: '#FFB3C7', priority: 1, examDate: '', currentMark: null, targetMark: 60, active: true, group: 'extra' },
  { name: 'CAT', icon: '', color: '#D6249F', priority: 1, examDate: '', currentMark: null, targetMark: 60, active: true, group: 'extra' },
  { name: 'Life Orientation', icon: '', color: '#9B8CFF', priority: 1, examDate: '', currentMark: null, targetMark: 50, active: false, group: 'extra' },
]

/** Fill the planner tables the first time only. */
export async function ensurePlannerSeeded() {
  await db.transaction('rw', db.subjects, db.commitments, db.settings, async () => {
    const done = await db.settings.get('plannerSeeded')
    if (done) return
    if ((await db.subjects.count()) === 0) await db.subjects.bulkAdd(DEFAULT_SUBJECTS)
    if ((await db.commitments.count()) === 0) await db.commitments.bulkAdd(DEFAULT_COMMITMENTS)
    await db.settings.put({ key: 'plannerSeeded', value: true })
  })
  await migrateV2()
  await migrateV3()
}

/**
 * v3: profile defaults no longer say "Impaq / Grade 12" for everyone,
 * so write them explicitly for the original install if they were never changed.
 */
async function migrateV3() {
  if (await db.settings.get('profileMigV3')) return
  const p = ((await db.settings.get('profile'))?.value as Record<string, unknown> | undefined) ?? {}
  const patch: Record<string, unknown> = {}
  if (!('school' in p)) patch.school = 'Impaq'
  if (!('grade' in p)) patch.grade = '12'
  await db.settings.put({ key: 'profile', value: { ...p, ...patch } })
  await db.settings.put({ key: 'profileMigV3', value: true })
}

/**
 * v2: English/CAT/LO are for knowledge only (no exam), add prayer times.
 */
async function migrateV2() {
  await db.transaction('rw', db.subjects, db.commitments, db.settings, async () => {
    if (await db.settings.get('plannerSeedV2')) return
    for (const s of await db.subjects.toArray()) {
      if (s.examDate === NOV_FINALS && ['English HL', 'CAT', 'Life Orientation'].includes(s.name)) {
        await db.subjects.update(s.id!, { examDate: '', group: 'extra', priority: 1, name: s.name === 'English HL' ? 'English' : s.name })
      }
    }
    const cs = await db.commitments.toArray()
    if (!cs.some((c) => c.kind === 'prayer')) await db.commitments.bulkAdd(PRAYERS)
    await db.settings.put({ key: 'plannerSeedV2', value: true })
  })
}
