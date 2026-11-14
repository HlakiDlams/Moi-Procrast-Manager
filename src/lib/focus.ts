import { useLiveQuery } from 'dexie-react-hooks'
import { db, localDay } from './db'
import { addXp } from './xp'
import { cancelOne, scheduleOne, FOCUS_TIMER_ID } from './notify'
import { getSettings } from './settings'

/**
 * Anti-procrastination flow:
 *   starter (2 min) -> ask "keep going?" -> work (25) -> break (5) -> work -> ...
 * State lives in IndexedDB so closing the app doesn't lose the timer.
 */
export type Phase = 'starter' | 'work' | 'break'

export interface FocusState {
  title: string
  blockId?: number
  phase: Phase
  /** running: ms timestamp when the phase ends */
  endAt?: number
  /** paused: ms left */
  pausedLeft?: number
  /** phase length in minutes */
  length: number
  /** completed work rounds this session */
  rounds: number
  /** the phase just finished and we're waiting for a decision */
  finished?: boolean
}

const KEY = 'focus'
export const STARTER_MIN = 2

export function useFocus(): FocusState | null | undefined {
  return useLiveQuery(async () => ((await db.settings.get(KEY))?.value as FocusState | undefined) ?? null, [])
}

async function save(s: FocusState | null) {
  if (s) await db.settings.put({ key: KEY, value: s })
  else await db.settings.delete(KEY)
}

async function load(): Promise<FocusState | null> {
  return ((await db.settings.get(KEY))?.value as FocusState | undefined) ?? null
}

const MESSAGES: Record<Phase, [string, string]> = {
  starter: ['2 minutes done', "You started, that's the hardest part. Keep going?"],
  work: ['Pomodoro done', 'Take your break now.'],
  break: ['Break over', 'Ready for another round?'],
}

async function startPhase(base: Omit<FocusState, 'phase' | 'length' | 'endAt' | 'finished' | 'pausedLeft'>, phase: Phase, length: number) {
  const endAt = Date.now() + length * 60_000
  const st: FocusState = { ...base, phase, length, endAt, finished: false }
  await save(st)
  const [title, body] = MESSAGES[phase]
  await scheduleOne({
    id: FOCUS_TIMER_ID,
    at: new Date(endAt),
    title,
    body,
    channel: 'timer',
    extra: { kind: 'focus' },
  }).catch(() => {})
}

export async function startStarter(title: string, blockId?: number) {
  await startPhase({ title, blockId, rounds: 0 }, 'starter', STARTER_MIN)
}

export async function startWork() {
  const s = await load()
  const cfg = await getSettings()
  if (!s) return
  await startPhase(s, 'work', cfg.pomodoroWork)
}

export async function startBreak() {
  const s = await load()
  const cfg = await getSettings()
  if (!s) return
  await startPhase(s, 'break', cfg.pomodoroBreak)
}

export function msLeft(s: FocusState, now = Date.now()): number {
  if (s.finished) return 0
  if (s.pausedLeft !== undefined) return s.pausedLeft
  return Math.max(0, (s.endAt ?? now) - now)
}

export async function pause() {
  const s = await load()
  if (!s || s.finished || s.pausedLeft !== undefined) return
  await save({ ...s, pausedLeft: msLeft(s), endAt: undefined })
  await cancelOne(FOCUS_TIMER_ID)
}

export async function resume() {
  const s = await load()
  if (!s || s.pausedLeft === undefined) return
  const endAt = Date.now() + s.pausedLeft
  await save({ ...s, endAt, pausedLeft: undefined })
  const [title, body] = MESSAGES[s.phase]
  await scheduleOne({
    id: FOCUS_TIMER_ID,
    at: new Date(endAt),
    title,
    body,
    channel: 'timer',
    extra: { kind: 'focus' },
  })
}

async function logFocus(s: FocusState, minutes: number) {
  if (minutes <= 0 || s.phase === 'break') return
  const now = new Date()
  await db.focus.add({
    day: localDay(now),
    at: now.toISOString(),
    minutes,
    kind: s.phase === 'starter' ? 'starter' : 'work',
    title: s.title,
    blockId: s.blockId,
  })
}

/** Called by the timer UI when time runs out. Idempotent. Returns XP earned. */
export async function completePhase(): Promise<number> {
  const s = await load()
  if (!s || s.finished || msLeft(s) > 0) return 0
  let xp = 0
  if (s.phase === 'starter') xp = 5
  if (s.phase === 'work') xp = s.length + 5
  await logFocus(s, s.phase === 'break' ? 0 : s.length)
  if (xp) await addXp(xp, 'today', `${s.phase === 'starter' ? '2-min start' : 'Pomodoro'}: ${s.title}`)
  await save({
    ...s,
    finished: true,
    rounds: s.phase === 'work' ? s.rounds + 1 : s.rounds,
  })
  return xp
}

/** Stop early. Partial work minutes still count (1 XP per full minute). */
export async function stop(): Promise<number> {
  const s = await load()
  await cancelOne(FOCUS_TIMER_ID)
  if (!s) return 0
  let xp = 0
  if (!s.finished && s.phase !== 'break') {
    const done = Math.floor((s.length * 60_000 - msLeft(s)) / 60_000)
    if (done > 0) {
      await logFocus(s, done)
      xp = done
      await addXp(xp, 'today', `Focus: ${s.title}`)
    }
  }
  await save(null)
  return xp
}
