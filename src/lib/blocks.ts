import { atTime, db, localDay, type Block, type BlockKind } from './db'
import { addXp } from './xp'

export const KINDS: { id: BlockKind; label: string; icon: string; color: string }[] = [
  { id: 'study', label: 'Study', icon: '📚', color: '#FF8AC8' },
  { id: 'homework', label: 'Homework', icon: '✏️', color: '#FFD166' },
  { id: 'break', label: 'Break', icon: '☕', color: '#FFB3C7' },
  { id: 'meal', label: 'Meal', icon: '🍽️', color: '#FFB3C7' },
  { id: 'play', label: 'Play', icon: '🎮', color: '#C77DFF' },
  { id: 'exercise', label: 'Exercise', icon: '💪', color: '#FF3B5C' },
  { id: 'selfcare', label: 'Self-care', icon: '🧴', color: '#FFB3C7' },
  { id: 'prayer', label: 'Prayer', icon: '🙏', color: '#FFE3A3' },
  { id: 'sleep', label: 'Sleep', icon: '😴', color: '#9B8CFF' },
  { id: 'other', label: 'Other', icon: '📌', color: '#D6249F' },
]

export const kindInfo = (k: BlockKind) => KINDS.find((x) => x.id === k) ?? KINDS[KINDS.length - 1]

export function blockEnd(b: Block): Date {
  return new Date(atTime(b.day, b.start).getTime() + b.minutes * 60_000)
}

export type BlockState = 'done' | 'skipped' | 'now' | 'missed' | 'upcoming'

export function blockState(b: Block, now = new Date()): BlockState {
  if (b.status !== 'planned') return b.status
  const start = atTime(b.day, b.start)
  if (now < start) return 'upcoming'
  if (now < blockEnd(b)) return 'now'
  return 'missed'
}

/** The block happening now, else the next upcoming one today. */
export function nextBlock(blocks: Block[], now = new Date()): Block | undefined {
  const today = localDay(now)
  const todays = blocks.filter((b) => b.day === today && b.kind !== 'sleep').sort((a, b) => a.start.localeCompare(b.start))
  return todays.find((b) => blockState(b, now) === 'now') ?? todays.find((b) => blockState(b, now) === 'upcoming')
}

const XP_FOR_DONE = 10

export async function setBlockDone(b: Block, done: boolean) {
  if (b.id === undefined) return
  await db.blocks.update(b.id, { status: done ? 'done' : 'planned', doneAt: done ? new Date().toISOString() : undefined })
  await addXp(done ? XP_FOR_DONE : -XP_FOR_DONE, 'today', `${done ? 'Done' : 'Undone'}: ${b.title}`)
}
