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

/** Consecutive days (ending today, or yesterday if nothing yet today) with any XP. */
export function streakFromDays(days: Set<string>, today = new Date()): number {
  const d = new Date(today)
  if (!days.has(localDay(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(localDay(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export interface XpStats {
  total: number
  today: number
  streak: number
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
  return {
    total,
    today: byDay.get(today) ?? 0,
    streak: streakFromDays(active),
    level: levelFromXp(total),
    week,
  }
}

export function useXpStats(): XpStats {
  const events = useLiveQuery(() => db.xp.toArray(), [])
  return summarise(events ?? [])
}
