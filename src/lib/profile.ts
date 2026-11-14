import { Backpack, Briefcase, BriefcaseBusiness, Globe, GraduationCap, Sparkles, type LucideIcon } from '../icons'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'

export type LifeStage = 'school' | 'tertiary' | 'working' | 'work-study' | 'gap' | 'other'

export const LIFE_STAGES: { id: LifeStage; label: string; Icon: LucideIcon }[] = [
  { id: 'school', label: 'At school (Matric)', Icon: Backpack },
  {
    id: 'tertiary',
    label: 'Studying (uni / college / online)',
    Icon: GraduationCap,
  },
  { id: 'working', label: 'Working', Icon: Briefcase },
  { id: 'work-study', label: 'Working + studying', Icon: BriefcaseBusiness },
  { id: 'gap', label: 'Gap year / between things', Icon: Globe },
  { id: 'other', label: 'Other', Icon: Sparkles },
]

export interface Profile {
  fullName: string
  dob: string // YYYY-MM-DD
  gender: string
  race: string
  pronouns: string
  heightCm: number | null
  /** what life looks like right now; the Planner uses this for fixed blocks */
  lifeStage: LifeStage
  school: string
  grade: string
  /** tertiary / part-time studies */
  course: string
  institution: string
  jobTitle: string
  employer: string
  workHoursPerWeek: number | null
  languages: string
  allergies: string
  conditions: string
  notes: string
}

export const EMPTY_PROFILE: Profile = {
  fullName: '',
  dob: '',
  gender: '',
  race: '',
  pronouns: '',
  heightCm: null,
  lifeStage: 'school',
  school: '',
  grade: '',
  course: '',
  institution: '',
  jobTitle: '',
  employer: '',
  workHoursPerWeek: null,
  languages: '',
  allergies: '',
  conditions: '',
  notes: '',
}

const KEY = 'profile'

export function useProfile(): Profile {
  const p = useLiveQuery(async () => (await db.settings.get(KEY))?.value as Partial<Profile> | undefined, [])
  return { ...EMPTY_PROFILE, ...(p ?? {}) }
}

export async function saveProfile(patch: Partial<Profile>) {
  const cur = ((await db.settings.get(KEY))?.value as Partial<Profile> | undefined) ?? {}
  await db.settings.put({ key: KEY, value: { ...cur, ...patch } })
}

/** Whole years between dob and `at`. */
export function ageOn(dob: string, at = new Date()): number | null {
  if (!dob) return null
  const d = new Date(dob + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return null
  let age = at.getFullYear() - d.getFullYear()
  const m = at.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && at.getDate() < d.getDate())) age--
  return age
}

export function bmi(kg: number, heightCm: number): number {
  const m = heightCm / 100
  return kg / (m * m)
}

/** From this age the adult BMI scale is used (NHS uses 18; WHO teen charts end at 19; US CDC uses 20). */
export const ADULT_BMI_AGE = 18

/** Under 18, BMI must be read on age-and-sex percentile charts, so we don't label it. */
export function bmiLabel(value: number, age: number | null): { label: string; tone: 'ok' | 'warn' | 'info' } {
  if (age === null) return { label: 'Add your date of birth', tone: 'info' }
  if (age < ADULT_BMI_AGE) return { label: 'Teen BMI: see note', tone: 'info' }
  if (value < 18.5) return { label: 'Below the healthy range', tone: 'warn' }
  if (value < 25) return { label: 'Healthy range', tone: 'ok' }
  if (value < 30) return { label: 'Above the healthy range', tone: 'warn' }
  return { label: 'Well above the healthy range', tone: 'warn' }
}

/** Adult healthy weight range for a height (BMI 18.5–24.9). */
export function healthyRange(heightCm: number): [number, number] {
  const m2 = (heightCm / 100) ** 2
  return [18.5 * m2, 24.9 * m2]
}
