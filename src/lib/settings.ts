import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'

export interface Settings {
  name: string
  /** Stored only in this browser's IndexedDB; never sent anywhere except api.mistral.ai */
  mistralApiKey: string
  mistralTextModel: string
  mistralVisionModel: string
  matricStart: string // YYYY-MM-DD
  pomodoroWork: number // minutes
  pomodoroBreak: number
  dailyXpGoal: number
  bedtime: string // HH:MM
  wakeTime: string
  waterGoal: number // glasses
  notifications: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  name: 'Hlaki',
  mistralApiKey: '',
  mistralTextModel: 'mistral-medium-latest',
  mistralVisionModel: 'mistral-medium-latest',
  // NSC final exams usually start late October / early November.
  matricStart: '2027-10-27',
  pomodoroWork: 25,
  pomodoroBreak: 5,
  dailyXpGoal: 50,
  bedtime: '22:00',
  wakeTime: '06:00',
  waterGoal: 8,
  notifications: false,
}

export async function getSettings(): Promise<Settings> {
  const rows = await db.settings.toArray()
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS }
  for (const r of rows) out[r.key] = r.value
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
