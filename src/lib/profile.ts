import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'

export interface Profile {
  fullName: string
  dob: string // YYYY-MM-DD
  gender: string
  race: string
  pronouns: string
  heightCm: number | null
  school: string
  grade: string
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
  school: 'Impaq',
  grade: '12',
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

/**
 * Adult BMI labels (WHO) are only meaningful from age 20.
 * Under 20, BMI must be read on age-and-sex percentile charts, so we don't label it.
 */
export function bmiLabel(value: number, age: number | null): { label: string; tone: 'ok' | 'warn' | 'info' } {
  if (age === null || age < 20) return { label: 'Teen BMI: see note', tone: 'info' }
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
