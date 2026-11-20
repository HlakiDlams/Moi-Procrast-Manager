import { addDays, type PeriodLog } from './db'

/**
 * Period / cycle predictions. Estimates only: NOT medical advice and NOT contraception.
 * Uses the average of your last cycles once you have logged at least two periods.
 */
export const DEFAULT_CYCLE = 28
export const DEFAULT_PERIOD = 5

export const daysBetween = (a: string, b: string) => Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86_400_000)

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

export interface CycleInfo {
  hasData: boolean
  avgCycle: number
  avgPeriod: number
  /** true when the averages came from your own history */
  learned: boolean
  lastStart?: string
  /** 1 = first day of the last period */
  cycleDay?: number
  onPeriod: boolean
  periodDay?: number
  nextStart?: string
  daysUntilNext?: number
  /** days late if the predicted date has passed with no new period logged */
  lateBy: number
  ovulation?: string
  fertileStart?: string
  fertileEnd?: string
  /** cycle lengths used for the average */
  cycles: number[]
  /** worth mentioning to a clinic: very short/long or very irregular cycles */
  irregular: boolean
}

export function cycleInfo(periods: PeriodLog[], today: string, defaults = { cycle: DEFAULT_CYCLE, period: DEFAULT_PERIOD }): CycleInfo {
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start))
  // cycle lengths between consecutive starts; ignore impossible gaps (forgot to log)
  const cycles: number[] = []
  for (let i = 1; i < sorted.length; i++) {
    const len = daysBetween(sorted[i - 1].start, sorted[i].start)
    if (len >= 15 && len <= 60) cycles.push(len)
  }
  const recent = cycles.slice(-6)
  const lengths = sorted.filter((p) => p.end).map((p) => daysBetween(p.start, p.end!) + 1).filter((n) => n >= 1 && n <= 12)
  const avgCycle = recent.length ? Math.round(mean(recent)) : defaults.cycle
  const avgPeriod = lengths.length ? Math.round(mean(lengths.slice(-6))) : defaults.period
  const base: CycleInfo = { hasData: sorted.length > 0, avgCycle, avgPeriod, learned: recent.length > 0, onPeriod: false, lateBy: 0, cycles: recent, irregular: false }
  if (!sorted.length) return base

  const last = sorted[sorted.length - 1]
  const cycleDay = daysBetween(last.start, today) + 1
  // still bleeding: no end logged yet and within a sensible window, or today is between start and end
  const onPeriod = cycleDay >= 1 && (last.end ? today <= last.end : cycleDay <= Math.max(avgPeriod + 2, 7))
  const nextStart = addDays(last.start, avgCycle)
  const daysUntilNext = daysBetween(today, nextStart)
  const lateBy = daysUntilNext < 0 ? -daysUntilNext : 0
  const ovulation = addDays(nextStart, -14)
  const spread = recent.length >= 3 ? Math.max(...recent) - Math.min(...recent) : 0
  return {
    ...base,
    lastStart: last.start,
    cycleDay,
    onPeriod,
    periodDay: onPeriod ? cycleDay : undefined,
    nextStart,
    daysUntilNext,
    lateBy,
    ovulation,
    fertileStart: addDays(ovulation, -5),
    fertileEnd: addDays(ovulation, 1),
    irregular: recent.length > 0 && (avgCycle < 21 || avgCycle > 35 || spread > 9),
  }
}
