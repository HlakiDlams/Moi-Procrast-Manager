import { db, type Commitment, type Subject } from './db'

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6]
const MON_FRI = [1, 2, 3, 4, 5]

/** Hlaki's fixed week. Editable in Planner → Fixed commitments. */
export const DEFAULT_COMMITMENTS: Omit<Commitment, 'id'>[] = [
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
  { name: 'Mathematics', icon: '📐', color: '#FF2E93', priority: 3, examDate: JUNE_REWRITE, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'Afrikaans EAT', icon: '🗣️', color: '#FF8AC8', priority: 3, examDate: JUNE_REWRITE, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'EGD', icon: '📏', color: '#FFD166', priority: 2, examDate: NOV_FINALS, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'Information Technology', icon: '💻', color: '#C77DFF', priority: 2, examDate: NOV_FINALS, currentMark: null, targetMark: 40, active: true, group: 'school' },
  { name: 'English HL', icon: '📖', color: '#FFB3C7', priority: 1, examDate: NOV_FINALS, currentMark: null, targetMark: 50, active: true, group: 'school' },
  { name: 'CAT', icon: '🖥️', color: '#D6249F', priority: 1, examDate: NOV_FINALS, currentMark: null, targetMark: 60, active: true, group: 'school' },
  { name: 'Life Orientation', icon: '🌱', color: '#9B8CFF', priority: 1, examDate: NOV_FINALS, currentMark: null, targetMark: 50, active: false, group: 'school' },
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
}
