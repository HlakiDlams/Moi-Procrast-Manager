import { BookOpen, Coffee, Dumbbell, Gamepad2, HandHeart, Moon, PencilLine, Pin, Sparkles, Utensils, type LucideIcon } from 'lucide-react'
import { atTime, db, localDay, type Block, type BlockKind } from './db'
import { addXp } from './xp'

export const KINDS: {
  id: BlockKind
  label: string
  icon: string
  Icon: LucideIcon
  color: string
}[] = [
  {
    id: 'study',
    label: 'Study',
    icon: '',
    Icon: BookOpen,
    color: 'var(--c2)',
  },
  {
    id: 'homework',
    label: 'Homework',
    icon: '',
    Icon: PencilLine,
    color: 'var(--c3)',
  },
  { id: 'break', label: 'Break', icon: '', Icon: Coffee, color: 'var(--c4)' },
  { id: 'meal', label: 'Meal', icon: '', Icon: Utensils, color: 'var(--c4)' },
  { id: 'play', label: 'Play', icon: '', Icon: Gamepad2, color: 'var(--c5)' },
  {
    id: 'exercise',
    label: 'Exercise',
    icon: '',
    Icon: Dumbbell,
    color: 'var(--c1)',
  },
  {
    id: 'selfcare',
    label: 'Self-care',
    icon: '',
    Icon: Sparkles,
    color: 'var(--c4)',
  },
  {
    id: 'prayer',
    label: 'Prayer',
    icon: '',
    Icon: HandHeart,
    color: 'var(--c3)',
  },
  { id: 'sleep', label: 'Sleep', icon: '', Icon: Moon, color: 'var(--c5)' },
  { id: 'other', label: 'Other', icon: '', Icon: Pin, color: 'var(--c3)' },
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
  await db.blocks.update(b.id, {
    status: done ? 'done' : 'planned',
    doneAt: done ? new Date().toISOString() : undefined,
  })
  await addXp(done ? XP_FOR_DONE : -XP_FOR_DONE, 'today', `${done ? 'Done' : 'Undone'}: ${b.title}`)
}
