import { addDays } from '../lib/db'
import { daysBetween } from '../lib/cycle'

/**
 * 12-week early-morning programme. Three phases; each training day maps to a workout,
 * with reps/time scaled up as you get fitter. Other days: rest or a stretch.
 */
export interface Phase {
  name: string
  weeks: [number, number]
  /** 0=Sun..6=Sat → workout id */
  days: Record<number, string>
  factor: number
  extraSet: number
}

export const PHASES: Phase[] = [
  { name: 'Foundation', weeks: [1, 4], days: { 1: 'strength-a', 3: 'cardio-a', 5: 'tone-a' }, factor: 1, extraSet: 0 },
  { name: 'Build', weeks: [5, 8], days: { 1: 'strength-a', 2: 'cardio-a', 4: 'tone-a', 6: 'martial-a' }, factor: 1.2, extraSet: 0 },
  { name: 'Strong', weeks: [9, 12], days: { 1: 'strength-b', 2: 'cardio-a', 4: 'strength-a', 6: 'martial-a' }, factor: 1.35, extraSet: 1 },
]

export interface ProgrammeDay {
  week: number // 1..12 (13+ = finished)
  phase?: Phase
  workoutId?: string
  restDay: boolean
  finished: boolean
}

export function programmeDay(start: string, day: string): ProgrammeDay {
  const d = daysBetween(start, day)
  const week = Math.floor(d / 7) + 1
  if (d < 0) return { week: 0, restDay: true, finished: false }
  if (week > 12) return { week, restDay: true, finished: true }
  const phase = PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1])!
  const dow = new Date(day + 'T12:00:00').getDay()
  const workoutId = phase.days[dow]
  return { week, phase, workoutId, restDay: !workoutId, finished: false }
}

/** Training days (0=Sun..6=Sat) of the phase you're in, for the Planner. */
export function phaseDays(start: string, day: string): number[] {
  const p = programmeDay(start, day).phase ?? PHASES[0]
  return Object.keys(p.days).map(Number)
}

/** Monday on/after a date, so the programme starts cleanly at the start of a week. */
export function nextMonday(day: string): string {
  const dow = new Date(day + 'T12:00:00').getDay()
  return addDays(day, dow === 1 ? 0 : (8 - dow) % 7)
}
