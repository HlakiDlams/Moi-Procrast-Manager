import { addDays } from './db'
import { daysBetween } from './cycle'

/** Pure goal maths: pace, projection, and the two "behind?" options. No database here. */

/** Healthy limit for body-weight change (loss or gain). */
export const MAX_KG_PER_WEEK = 0.5

export type GoalStatus = 'done' | 'early' | 'ahead' | 'on-track' | 'behind' | 'overdue'

export interface Pace {
  status: GoalStatus
  current: number
  /** progress still needed (always ≥ 0, in the goal's unit) */
  remaining: number
  pct: number
  /** progress per week so far (positive = towards the target) */
  rate: number
  /** progress per week needed from now to hit the date */
  neededRate: number
  /** the pace the original plan assumed */
  plannedRate: number
  weeksLeft: number
  projected?: string
  /** option (a): a realistic new date */
  newDate?: string
  /** the weekly pace option (a) assumes */
  assumedRate?: number
  /** option (b): how much faster you'd need to go (×) */
  factor?: number
  /** option (b) is not offered (e.g. unsafe weight change) */
  loadUnsafe?: boolean
}

const roundUpToSunday = (day: string) => {
  const dow = new Date(day + 'T12:00:00').getDay()
  return addDays(day, (7 - dow) % 7)
}

export function pace(
  g: { startValue: number; target: number; startDate: string; targetDate: string; done?: boolean },
  current: number,
  today: string,
  opts: { maxRate?: number } = {},
): Pace {
  const dir = Math.sign(g.target - g.startValue) || 1
  const total = Math.abs(g.target - g.startValue)
  const progress = (current - g.startValue) * dir
  const remaining = Math.max(0, (g.target - current) * dir)
  const pct = total ? Math.max(0, Math.min(100, Math.round((progress / total) * 100))) : 100
  const daysIn = Math.max(0, daysBetween(g.startDate, today))
  const daysLeft = daysBetween(today, g.targetDate)
  const weeksLeft = Math.max(0, daysLeft) / 7
  const totalWeeks = Math.max(1 / 7, daysBetween(g.startDate, g.targetDate) / 7)
  const plannedRate = total / totalWeeks
  const rate = daysIn >= 1 ? progress / (daysIn / 7) : 0
  const neededRate = remaining / Math.max(weeksLeft, 1 / 7)
  const base: Pace = { status: 'on-track', current, remaining, pct, rate, neededRate, plannedRate, weeksLeft }

  if (g.done || remaining <= 0) return { ...base, status: 'done', pct: 100 }

  const projected = rate > 0 ? addDays(today, Math.ceil((remaining / rate) * 7)) : undefined
  base.projected = projected

  if (daysLeft < 0 || (daysLeft === 0 && remaining > 0)) {
    base.status = 'overdue'
  } else if (daysIn < 7) {
    return { ...base, status: 'early' }
  } else if (projected && projected <= addDays(g.targetDate, -7)) {
    return { ...base, status: 'ahead' }
  } else if (projected && projected <= g.targetDate) {
    return { ...base, status: 'on-track' }
  } else {
    base.status = 'behind'
  }

  // ---- behind or overdue: work out the two options ----
  const cap = opts.maxRate
  // (a) new date at your real pace (or the original planned pace if you haven't started), never faster than the safe cap
  // your real pace, but assume you can get back to at least half the planned pace
  let paceForDate = rate > 0 ? Math.max(rate, plannedRate * 0.5) : plannedRate
  if (cap) paceForDate = Math.min(paceForDate, cap)
  base.assumedRate = paceForDate
  base.newDate = roundUpToSunday(addDays(today, Math.ceil((remaining / paceForDate) * 7)))
  // (b) speed up to keep the date (only if there's time left and it's safe)
  if (daysLeft > 0) {
    base.factor = rate > 0 ? neededRate / rate : undefined
    if (cap && neededRate > cap) base.loadUnsafe = true
  } else base.loadUnsafe = true
  return base
}

export interface WeightCheck {
  ok: boolean
  /** kg per week the goal asks for */
  perWeek: number
  /** a safer date if the goal is too fast */
  saferDate?: string
  /** healthy weight range for the height, if known */
  healthyMin?: number
  healthyMax?: number
  /** target is below the healthy range: we won't set it */
  belowHealthy?: boolean
}

/** Safety check for body-weight goals: max 0.5 kg/week, and not below a healthy weight. */
export function checkWeightGoal(startKg: number, targetKg: number, startDate: string, targetDate: string, heightCm?: number | null, age?: number | null): WeightCheck {
  const weeks = Math.max(1 / 7, daysBetween(startDate, targetDate) / 7)
  const perWeek = Math.abs(targetKg - startKg) / weeks
  const out: WeightCheck = { ok: true, perWeek }
  if (perWeek > MAX_KG_PER_WEEK + 1e-9) {
    out.ok = false
    out.saferDate = roundUpToSunday(addDays(startDate, Math.ceil((Math.abs(targetKg - startKg) / MAX_KG_PER_WEEK) * 7)))
  }
  if (heightCm && (age === null || age === undefined || age >= 18)) {
    const m2 = (heightCm / 100) ** 2
    out.healthyMin = Math.ceil(18.5 * m2 * 10) / 10
    out.healthyMax = Math.floor(24.9 * m2 * 10) / 10
    if (targetKg < out.healthyMin) {
      out.ok = false
      out.belowHealthy = true
    }
  }
  return out
}
