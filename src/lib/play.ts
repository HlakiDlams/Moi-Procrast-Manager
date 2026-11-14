import { useLiveQuery } from 'dexie-react-hooks'
import { db, localDay, type Hobby } from './db'
import type { Settings } from './settings'
import { addXp } from './xp'
import { cancelOne, scheduleOne } from './notify'

/**
 * Fun is earned: focus minutes, lessons and workouts earn play minutes.
 * Earned time resets every day so it can't pile up.
 */
export const PLAY_TIMER_ID = 9004
const LESSON_MIN = 5

export interface PlayBalance {
  effortMin: number
  focusMin: number
  lessons: number
  workoutMin: number
  earned: number
  used: number
  left: number
}

export async function playBalance(s: Pick<Settings, 'playRatio' | 'playBase'>, day = localDay()): Promise<PlayBalance> {
  const [focus, xp, workouts, plays] = await Promise.all([
    db.focus.where('day').equals(day).toArray(),
    db.xp.where('day').equals(day).toArray(),
    db.workouts.where('day').equals(day).toArray(),
    db.playLogs.where('day').equals(day).toArray(),
  ])
  const focusMin = focus.reduce((n, f) => n + f.minutes, 0)
  const lessons = xp.filter((e) => e.source === 'study' && e.note?.startsWith('Lesson')).length
  const workoutMin = workouts.reduce((n, w) => n + w.minutes, 0)
  const effortMin = focusMin + lessons * LESSON_MIN + workoutMin
  const earned = Math.floor(effortMin / Math.max(1, s.playRatio)) + s.playBase
  const used = plays.reduce((n, p) => n + p.minutes, 0)
  return {
    effortMin,
    focusMin,
    lessons,
    workoutMin,
    earned,
    used,
    left: earned - used,
  }
}

export function usePlayBalance(s: Pick<Settings, 'playRatio' | 'playBase'>) {
  return useLiveQuery(() => playBalance(s), [s.playRatio, s.playBase])
}

export const DEFAULT_HOBBIES: Omit<Hobby, 'id'>[] = [
  { name: 'Video games', icon: '', minutes: 20, active: true },
  { name: 'Series / anime', icon: '', minutes: 25, active: true },
  { name: 'Phone & socials', icon: '', minutes: 10, active: true },
  { name: 'Music', icon: '', minutes: 15, active: true },
  { name: 'Drawing', icon: '', minutes: 20, active: true },
  { name: 'Reading for fun', icon: '', minutes: 20, active: true },
]

export async function ensureHobbiesSeeded() {
  await db.transaction('rw', db.hobbies, db.settings, async () => {
    if (await db.settings.get('hobbiesSeeded')) return
    if ((await db.hobbies.count()) === 0) await db.hobbies.bulkAdd(DEFAULT_HOBBIES)
    await db.settings.put({ key: 'hobbiesSeeded', value: true })
  })
}

// ---------------- running play session (survives closing the app) ----------------

export interface PlayState {
  hobbyId?: number
  name: string
  icon: string
  minutes: number
  startedAt: number
  endAt: number
  /** timer ran out, waiting for you to come back */
  finished?: boolean
}

const KEY = 'play'

export function usePlayState(): PlayState | null | undefined {
  return useLiveQuery(async () => ((await db.settings.get(KEY))?.value as PlayState | undefined) ?? null, [])
}

export async function startPlay(h: Pick<Hobby, 'id' | 'name' | 'icon'>, minutes: number) {
  const now = Date.now()
  const st: PlayState = {
    hobbyId: h.id,
    name: h.name,
    icon: h.icon,
    minutes,
    startedAt: now,
    endAt: now + minutes * 60_000,
  }
  await db.settings.put({ key: KEY, value: st })
  await scheduleOne({
    id: PLAY_TIMER_ID,
    at: new Date(st.endAt),
    title: "Play time's up",
    body: 'Back to it: start with 2 minutes.',
    channel: 'timer',
    extra: { kind: 'play' },
  }).catch(() => {})
}

export async function markPlayFinished() {
  const st = (await db.settings.get(KEY))?.value as PlayState | undefined
  if (st && !st.finished) await db.settings.put({ key: KEY, value: { ...st, finished: true } })
}

export async function extendPlay(minutes: number) {
  const st = (await db.settings.get(KEY))?.value as PlayState | undefined
  if (!st) return
  const endAt = Math.max(Date.now(), st.endAt) + minutes * 60_000
  await db.settings.put({
    key: KEY,
    value: { ...st, endAt, minutes: st.minutes + minutes, finished: false },
  })
  await scheduleOne({
    id: PLAY_TIMER_ID,
    at: new Date(endAt),
    title: "Play time's up",
    body: 'Back to it: start with 2 minutes.',
    channel: 'timer',
    extra: { kind: 'play' },
  }).catch(() => {})
}

/** End the session: log the minutes actually used. Returns XP for coming back on time. */
export async function endPlay(): Promise<number> {
  const st = (await db.settings.get(KEY))?.value as PlayState | undefined
  await cancelOne(PLAY_TIMER_ID).catch(() => {})
  await db.settings.delete(KEY)
  if (!st) return 0
  const now = Date.now()
  const used = Math.max(1, Math.round((Math.min(now, Math.max(st.endAt, now)) - st.startedAt) / 60_000))
  // within 2 minutes of the timer counts as on time
  const onTime = now <= st.endAt + 2 * 60_000
  await db.playLogs.add({
    day: localDay(),
    at: new Date().toISOString(),
    hobbyId: st.hobbyId,
    name: st.name,
    minutes: used,
    onTime,
  })
  if (onTime) {
    await addXp(3, 'play', 'Back on time')
    return 3
  }
  return 0
}
