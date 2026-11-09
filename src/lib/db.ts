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

export type BlockKind = 'study' | 'homework' | 'break' | 'meal' | 'play' | 'exercise' | 'selfcare' | 'sleep' | 'other'

/** A time block on a given day. Today shows them; the Planner (later stage) generates them. */
export interface Block {
  id?: number
  day: string // YYYY-MM-DD
  start: string // HH:MM
  minutes: number
  title: string
  kind: BlockKind
  subject?: string
  status: 'planned' | 'done' | 'skipped'
  doneAt?: string
}

/** A finished (or partly finished) focus session from the 2-minute starter / Pomodoro. */
export interface FocusLog {
  id?: number
  day: string
  at: string
  minutes: number
  kind: 'starter' | 'work'
  title: string
  blockId?: number
}

export interface WaterLog {
  id?: number
  day: string
  at: string
}

/** A repeating alarm. 'app' = rung by this app; 'clock' = handed to the phone's Clock app. */
export interface Alarm {
  id?: number
  time: string // HH:MM
  label: string
  /** 0=Sun ... 6=Sat. Empty = every day. */
  days: number[]
  enabled: boolean
  mode: 'app' | 'clock'
}

/** One weigh-in. Height is stored with it so BMI history stays correct as you grow. */
export interface WeightLog {
  id?: number
  day: string
  kg: number
  heightCm?: number
}

class PlannerDB extends Dexie {
  settings!: Table<SettingRow, string>
  xp!: Table<XpEvent, number>
  blocks!: Table<Block, number>
  focus!: Table<FocusLog, number>
  water!: Table<WaterLog, number>
  alarms!: Table<Alarm, number>
  weights!: Table<WeightLog, number>

  constructor() {
    super('hlakis-planner')
    this.version(1).stores({
      settings: 'key',
      xp: '++id, day, source',
    })
    this.version(2).stores({
      blocks: '++id, day, [day+start], status',
      focus: '++id, day',
      water: '++id, day',
      alarms: '++id',
    })
    this.version(3).stores({
      weights: '++id, day',
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

export function addDays(day: string, n: number): string {
  const d = new Date(day + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return localDay(d)
}

/** "HH:MM" on a given local day -> Date */
export function atTime(day: string, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(day + 'T00:00:00')
  d.setHours(h, m, 0, 0)
  return d
}

export function fmtTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
