import Dexie, { type Table } from 'dexie'

/** Key/value settings (API key, timer lengths, exam date, etc.). */
export interface SettingRow {
  key: string
  value: unknown
}

/** Every XP gain in any tab is logged here, so XP + streaks are shared app-wide. */
export interface XpEvent {
  id?: number
  /** ISO timestamp */
  at: string
  /** Local date YYYY-MM-DD (used for streaks + charts) */
  day: string
  amount: number
  /** Which tab earned it: today | study | planner | selfcare | play | exercise | homework | profile */
  source: string
  note?: string
}

class PlannerDB extends Dexie {
  settings!: Table<SettingRow, string>
  xp!: Table<XpEvent, number>

  constructor() {
    super('hlakis-planner')
    this.version(1).stores({
      settings: 'key',
      xp: '++id, day, source',
    })
  }
}

export const db = new PlannerDB()

/** Local date string YYYY-MM-DD (not UTC, so midnight in SA is midnight). */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
