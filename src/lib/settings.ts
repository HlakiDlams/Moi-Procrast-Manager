import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'

export interface Settings {
  name: string
  /** Stored only in this browser's IndexedDB; never sent anywhere except api.mistral.ai */
  mistralApiKey: string
  mistralTextModel: string
  mistralVisionModel: string
  /** main countdown on Today (was Matric-only) */
  countdownLabel: string
  matricStart: string // YYYY-MM-DD, the countdown date
  showCountdown: boolean
  /** Planner: max study minutes on Mon-Fri / Sat-Sun */
  studyCapWeekday: number
  studyCapWeekend: number
  /** length of one study block and the break after it */
  studyBlock: number
  breakMin: number
  /** 0=Sun..6=Sat */
  exerciseDays: number[]
  exerciseMin: number
  exerciseWhen: 'morning' | 'evening'
  /** hour from which you focus best (hard subjects go after this) */
  focusFrom: number
  autoReschedule: boolean
  /** display size in %, like the phone's own display zoom */
  uiScale: number
  pomodoroWork: number // minutes
  pomodoroBreak: number
  dailyXpGoal: number
  bedtime: string // HH:MM
  wakeTime: string
  waterGoal: number // glasses
  /** master switch for reminders */
  notifications: boolean
  remindTasks: boolean
  remindWater: boolean
  /** minutes between water reminders (between wake and bedtime) */
  waterEvery: number
  remindBedtime: boolean
  /** keep the screen on while a focus timer runs */
  keepAwake: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  name: 'Hlaki',
  mistralApiKey: '',
  mistralTextModel: 'mistral-medium-latest',
  mistralVisionModel: 'mistral-medium-latest',
  // NSC final exams usually start late October / early November.
  countdownLabel: 'Matric finals',
  matricStart: '2027-10-27',
  showCountdown: true,
  uiScale: 80,
  studyCapWeekday: 360,
  studyCapWeekend: 270,
  studyBlock: 50,
  breakMin: 10,
  exerciseDays: [1, 2, 4, 6],
  exerciseMin: 30,
  exerciseWhen: 'morning',
  focusFrom: 12,
  autoReschedule: true,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  dailyXpGoal: 50,
  bedtime: '21:00',
  wakeTime: '04:00',
  waterGoal: 8,
  notifications: false,
  remindTasks: true,
  remindWater: true,
  waterEvery: 90,
  remindBedtime: true,
  keepAwake: true,
}

export async function getSettings(): Promise<Settings> {
  const rows = await db.settings.toArray()
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS }
  for (const r of rows) if (r.key in DEFAULT_SETTINGS) out[r.key] = r.value
  return out as unknown as Settings
}

export async function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  await db.settings.put({ key, value })
}

/** Live settings: re-renders whenever any setting changes. */
export function useSettings(): Settings {
  const s = useLiveQuery(getSettings, [])
  return s ?? DEFAULT_SETTINGS
}

const SCALE_KEY = 'hp-ui-scale'

/** Apply display size by scaling the root font size (the whole UI is in rem). */
export function applyScale(pct: number) {
  const v = Math.min(130, Math.max(60, pct || 100))
  document.documentElement.style.fontSize = `${(16 * v) / 100}px`
  try {
    localStorage.setItem(SCALE_KEY, String(v))
  } catch {
    /* ignore */
  }
}

/** Called before React renders, so the app doesn't flash at the wrong size. */
export function applySavedScale() {
  let v = DEFAULT_SETTINGS.uiScale
  try {
    v = Number(localStorage.getItem(SCALE_KEY)) || v
  } catch {
    /* ignore */
  }
  applyScale(v)
}
