import { useLiveQuery } from 'dexie-react-hooks'
import { db, localDay, type XpEvent } from './db'

export async function addXp(amount: number, source: string, note?: string) {
  const now = new Date()
  await db.xp.add({ at: now.toISOString(), day: localDay(now), amount, source, note })
}

/** XP needed to reach a level grows gently: L1→2 = 100, L2→3 = 150, ... */
export function levelFromXp(total: number) {
  let level = 1
  let need = 100
  let rest = total
  while (rest >= need) {
    rest -= need
    level++
    need = 100 + (level - 1) * 50
  }
  return { level, into: rest, need }
}

export type DayStatus = 'active' | 'mercy' | 'missed' | 'today' | 'future'

export interface StreakInfo {
  /** number of active days in the current streak */
  count: number
  /** days that were missed but forgiven (one-day mercy gap) */
  mercy: Set<string>
  /** today has no XP yet */
  todayPending: boolean
  /** yesterday was already a mercy day: missing today resets the streak */
  atRisk: boolean
}

/**
 * Streak with a one-day mercy gap: missing ONE day keeps the fire going
 * (shown as a half fire); missing two days in a row resets it.
 * Today never breaks the streak until it is over.
 */
export function computeStreak(active: Set<string>, today = new Date()): StreakInfo {
  const todayKey = localDay(today)
  const todayPending = !active.has(todayKey)
  let count = todayPending ? 0 : 1
  const mercy = new Set<string>()
  const d = new Date(today)
  let gap: string | null = null
  for (let i = 0; i < 3660; i++) {
    d.setDate(d.getDate() - 1)
    const k = localDay(d)
    if (active.has(k)) {
      if (gap) mercy.add(gap)
      gap = null
      count++
    } else if (gap) {
      break // second missed day in a row: the streak ends here
    } else {
      gap = k
    }
  }
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const atRisk = todayPending && count > 0 && mercy.has(localDay(yesterday))
  if (count === 0) mercy.clear()
  return { count, mercy, todayPending, atRisk }
}

/** Kept for older callers: just the number. */
export function streakFromDays(days: Set<string>, today = new Date()): number {
  return computeStreak(days, today).count
}

/** Mon–Sun of the current week with a status per day, for the fire strip. */
export function weekStatus(active: Set<string>, info: StreakInfo, today = new Date()) {
  const todayKey = localDay(today)
  const monday = new Date(today)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const k = localDay(d)
    let status: DayStatus
    if (active.has(k)) status = 'active'
    else if (k === todayKey) status = 'today'
    else if (k > todayKey) status = 'future'
    else if (info.mercy.has(k)) status = 'mercy'
    else status = 'missed'
    return { day: k, status, isToday: k === todayKey }
  })
}

export interface XpStats {
  total: number
  today: number
  streak: number
  streakInfo: StreakInfo
  /** Mon–Sun this week with fire status */
  fireWeek: ReturnType<typeof weekStatus>
  level: ReturnType<typeof levelFromXp>
  /** last 7 days, oldest first */
  week: { day: string; xp: number }[]
}

function summarise(events: XpEvent[]): XpStats {
  const today = localDay()
  const byDay = new Map<string, number>()
  let total = 0
  for (const e of events) {
    total += e.amount
    byDay.set(e.day, (byDay.get(e.day) ?? 0) + e.amount)
  }
  const week: XpStats['week'] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const k = localDay(d)
    week.push({ day: k, xp: byDay.get(k) ?? 0 })
  }
  const active = new Set([...byDay].filter(([, v]) => v > 0).map(([k]) => k))
  const info = computeStreak(active)
  return {
    total,
    today: byDay.get(today) ?? 0,
    streak: info.count,
    streakInfo: info,
    fireWeek: weekStatus(active, info),
    level: levelFromXp(total),
    week,
  }
}

export function useXpStats(): XpStats {
  const events = useLiveQuery(() => db.xp.toArray(), [])
  return summarise(events ?? [])
}
