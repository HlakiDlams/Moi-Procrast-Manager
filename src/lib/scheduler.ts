import { addDays, localDay, type Block, type Commitment, type Subject } from './db'
import type { Settings } from './settings'

/** Pure scheduling logic: no database calls here, so it's easy to test. */

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export const fromMin = (n: number) => {
  const v = ((Math.round(n) % 1440) + 1440) % 1440
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`
}

export interface Interval {
  s: number
  e: number
}

/** free - busy, all in minutes from midnight. Returned sorted. */
export function subtract(free: Interval[], busy: Interval[]): Interval[] {
  let out = free.filter((f) => f.e > f.s)
  for (const b of busy) {
    const next: Interval[] = []
    for (const f of out) {
      if (b.e <= f.s || b.s >= f.e) next.push(f)
      else {
        if (b.s > f.s) next.push({ s: f.s, e: b.s })
        if (b.e < f.e) next.push({ s: b.e, e: f.e })
      }
    }
    out = next
  }
  return out.sort((a, b) => a.s - b.s)
}

/** Monday of the week containing `day`. */
export function mondayOf(day: string): string {
  const d = new Date(day + 'T12:00:00')
  const dow = (d.getDay() + 6) % 7 // Mon=0
  return addDays(day, -dow)
}

export const weekDays = (monday: string) => Array.from({ length: 7 }, (_, i) => addDays(monday, i))

const isWeekend = (day: string) => {
  const g = new Date(day + 'T12:00:00').getDay()
  return g === 0 || g === 6
}
const dow = (day: string) => new Date(day + 'T12:00:00').getDay()

/** Busy interval for a block (sleep is ignored: it sits outside the day window). */
const blockInterval = (b: Block): Interval => ({ s: toMin(b.start), e: toMin(b.start) + b.minutes })

/**
 * How much of the study time a subject deserves.
 * priority x how far below target x how soon the exam is.
 */
export function subjectWeight(sub: Subject, today: string): number {
  if (!sub.active) return 0
  const pri = { 1: 1, 2: 2, 3: 3.5 }[sub.priority]
  const mark = sub.currentMark ?? Math.max(0, sub.targetMark - 20)
  const gap = Math.min(60, Math.max(0, sub.targetMark - mark))
  // no exam = learning for fun/knowledge: steady but light
  let urgency = 0.5
  if (sub.examDate) {
    const days = (new Date(sub.examDate + 'T12:00:00').getTime() - new Date(today + 'T12:00:00').getTime()) / 86_400_000
    urgency = days < 0 ? 0.3 : Math.min(2.5, Math.max(0.6, 150 / Math.max(7, days)))
  }
  return pri * (1 + gap / 40) * urgency
}

export interface GenerateInput {
  days: string[] // the week
  today: string
  nowMin: number
  settings: Pick<Settings, 'wakeTime' | 'bedtime' | 'studyCapWeekday' | 'studyCapWeekend' | 'studyBlock' | 'breakMin' | 'exerciseDays' | 'exerciseMin' | 'exerciseWhen' | 'focusFrom'> & Partial<Pick<Settings, 'playEvery' | 'playBreakMin'>>
  subjects: Subject[]
  commitments: Commitment[]
  existing: Block[] // blocks already on these days
}

export interface GenerateResult {
  remove: number[]
  add: Omit<Block, 'id'>[]
}

/**
 * Build a balanced week. Keeps anything you made yourself or already did,
 * replaces the planner's own future blocks.
 */
export function generateWeek(inp: GenerateInput): GenerateResult {
  const { settings: s } = inp
  const remove: number[] = []
  const add: Omit<Block, 'id'>[] = []
  const wake = toMin(s.wakeTime)
  let bed = toMin(s.bedtime)
  if (bed <= wake) bed += 1440

  const subjects = inp.subjects.filter((x) => x.active && x.id !== undefined)
  const weights = new Map(subjects.map((x) => [x.id!, subjectWeight(x, inp.today)]))
  const totalW = [...weights.values()].reduce((a, b) => a + b, 0) || 1

  const futureDays = inp.days.filter((d) => d >= inp.today)
  const weekCap = futureDays.reduce((n, d) => n + (isWeekend(d) ? s.studyCapWeekend : s.studyCapWeekday), 0)
  const target = new Map(subjects.map((x) => [x.id!, (weekCap * weights.get(x.id!)!) / totalW]))
  const allocated = new Map<number, number>(subjects.map((x) => [x.id!, 0]))

  for (const day of futureDays) {
    const isToday = day === inp.today
    const startFrom = isToday ? Math.max(wake, Math.ceil((inp.nowMin + 5) / 5) * 5) : wake
    const onDay = inp.existing.filter((b) => b.day === day)

    // Drop the planner's own not-yet-started blocks; keep yours + anything done/started.
    const kept: Block[] = []
    for (const b of onDay) {
      const replaceable = b.generated && b.status === 'planned' && (!isToday || toMin(b.start) >= startFrom || b.kind === 'sleep')
      if (replaceable && b.id !== undefined) remove.push(b.id)
      else kept.push(b)
    }
    for (const b of kept) if (b.subjectId !== undefined && b.kind === 'study') allocated.set(b.subjectId, (allocated.get(b.subjectId) ?? 0) + b.minutes)

    const busy: Interval[] = kept.filter((b) => b.kind !== 'sleep').map(blockInterval)

    // 1. fixed commitments
    for (const c of inp.commitments) {
      if (!c.active || !c.days.includes(dow(day))) continue
      const cs = toMin(c.start)
      const ce = toMin(c.end) > cs ? toMin(c.end) : toMin(c.end) + 1440
      busy.push({ s: cs - c.travelMin, e: ce + c.travelMin })
      const already = kept.some((b) => b.fixed && b.start === c.start && b.title === c.title)
      if (!already && (!isToday || cs >= startFrom)) {
        add.push({ day, start: c.start, minutes: ce - cs, title: c.title, kind: c.kind, status: 'planned', generated: true, fixed: true })
      }
    }

    // 2. exercise
    // a sport practice / class in your fixed week counts as that day's workout
    const sportToday = inp.commitments.some((c) => c.active && c.kind === 'exercise' && c.days.includes(dow(day)))
    if (s.exerciseDays.includes(dow(day)) && !sportToday && !kept.some((b) => b.kind === 'exercise')) {
      const free = subtract([{ s: startFrom, e: bed - 15 }], busy)
      const fits = free.filter((f) => f.e - f.s >= s.exerciseMin)
      const slot = s.exerciseWhen === 'morning' ? fits[0] : fits[fits.length - 1]
      if (slot) {
        const st = s.exerciseWhen === 'morning' ? slot.s : slot.e - s.exerciseMin
        add.push({ day, start: fromMin(st), minutes: s.exerciseMin, title: 'Workout', kind: 'exercise', status: 'planned', generated: true })
        busy.push({ s: st, e: st + s.exerciseMin + 5 })
      }
    }

    // 3. study blocks: cut free time into block-sized slots, fill the best-focus
    //    slots first (afternoon/evening), then assign subjects in time order.
    let capLeft = (isWeekend(day) ? s.studyCapWeekend : s.studyCapWeekday) - kept.filter((b) => b.kind === 'study').reduce((n, b) => n + b.minutes, 0)
    const free = subtract([{ s: startFrom, e: bed - 15 }], busy)
    // Optional reward breaks: after every N study slots in a row, a play slot.
    // A play slot is only used if the N study slots before it are actually chosen.
    const every = s.playEvery ?? 0
    const playLen = s.playBreakMin ?? 15
    const slots: (Interval & { i: number })[] = []
    const plays: { s: number; e: number; deps: number[] }[] = []
    for (const f of free) {
      let t = f.s
      let run: number[] = []
      while (f.e - t >= 25) {
        if (every > 0 && run.length === every && f.e - t >= playLen) {
          plays.push({ s: t, e: t + playLen, deps: run })
          run = []
          t += playLen + 5
          continue
        }
        const len = Math.min(s.studyBlock, f.e - t)
        const i = slots.length
        slots.push({ s: t, e: t + len, i })
        run.push(i)
        t += len + s.breakMin
      }
    }
    const focusAt = s.focusFrom * 60
    const chosen: Interval[] = []
    const chosenIdx = new Set<number>()
    for (const sl of [...slots].sort((x, y) => {
      const gx = x.s >= focusAt
      const gy = y.s >= focusAt
      if (gx !== gy) return gx ? -1 : 1
      // best-focus slots in time order; other slots closest to focus time first
      return gx ? x.s - y.s : y.s - x.s
    })) {
      if (capLeft < 25) break
      const len = Math.min(sl.e - sl.s, capLeft)
      if (len < 25) continue
      chosen.push({ s: sl.s, e: sl.s + len })
      chosenIdx.add(sl.i)
      capLeft -= len
    }
    for (const pl of plays) {
      if (pl.deps.every((i) => chosenIdx.has(i))) add.push({ day, start: fromMin(pl.s), minutes: pl.e - pl.s, title: 'Reward break 🎮', kind: 'play', status: 'planned', generated: true })
    }
    chosen.sort((x, y) => x.s - y.s)

    let prev: number | undefined
    const usedToday = new Map<number, number>()
    for (const sl of chosen) {
      const len = sl.e - sl.s
      const good = sl.s >= focusAt
      let best: Subject | undefined
      let bestScore = -Infinity
      for (const sub of subjects) {
        const id = sub.id!
        const tg = target.get(id) || 1
        let score = (tg - (allocated.get(id) ?? 0)) / tg
        if (sub.priority === 3) score += good ? 0.35 : -0.15
        // exam subjects get the best-focus hours, extras lean to the other slots
        if (sub.group === 'extra' || !sub.examDate) score += good ? -0.4 : 0.3
        if (id === prev) score -= 1
        score -= (usedToday.get(id) ?? 0) * 0.3
        if (score > bestScore) {
          bestScore = score
          best = sub
        }
      }
      if (!best) break
      add.push({ day, start: fromMin(sl.s), minutes: len, title: best.name, kind: 'study', subjectId: best.id, status: 'planned', generated: true })
      allocated.set(best.id!, (allocated.get(best.id!) ?? 0) + len)
      usedToday.set(best.id!, (usedToday.get(best.id!) ?? 0) + 1)
      prev = best.id
    }

    // 4. sleep
    if (!kept.some((b) => b.kind === 'sleep')) {
      add.push({ day, start: fromMin(bed), minutes: wake + 1440 - bed, title: 'Sleep', kind: 'sleep', status: 'planned', generated: true })
    }
  }
  return { remove, add }
}

/** Earliest free slot of `minutes` from `fromDay`/`fromMin` within the next `daysAhead` days. */
export function findFreeSlot(
  minutes: number,
  fromDay: string,
  fromMinute: number,
  blocks: Block[],
  s: Pick<Settings, 'wakeTime' | 'bedtime'>,
  daysAhead = 6,
): { day: string; start: string } | null {
  const wake = toMin(s.wakeTime)
  let bed = toMin(s.bedtime)
  if (bed <= wake) bed += 1440
  for (let i = 0; i <= daysAhead; i++) {
    const day = addDays(fromDay, i)
    const startFrom = i === 0 ? Math.max(wake, Math.ceil(fromMinute / 5) * 5) : wake
    const busy = blocks
      .filter((b) => b.day === day && b.kind !== 'sleep' && b.status !== 'skipped')
      .map((b) => ({ s: blockInterval(b).s - 5, e: blockInterval(b).e + 5 }))
    const slot = subtract([{ s: startFrom, e: bed - 15 }], busy).find((f) => f.e - f.s >= minutes)
    if (slot) return { day, start: fromMin(slot.s) }
  }
  return null
}

export const RESCHEDULABLE = new Set(['study', 'homework', 'exercise'])
export const MAX_RESCHEDULES = 2

/** Which blocks were missed and where they should go now. */
export function planReschedules(blocks: Block[], now: Date, s: Pick<Settings, 'wakeTime' | 'bedtime'>) {
  const today = localDay(now)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const weekAgo = addDays(today, -7)
  const working = blocks.map((b) => ({ ...b }))
  const moves: { id: number; title: string; from: string; to: { day: string; start: string } | null }[] = []
  const missed = working
    .filter((b) => b.status === 'planned' && RESCHEDULABLE.has(b.kind) && b.day >= weekAgo)
    .filter((b) => b.day < today || (b.day === today && toMin(b.start) + b.minutes <= nowMin))
    .sort((a, b) => (a.day + a.start).localeCompare(b.day + b.start))
  for (const b of missed) {
    if (b.id === undefined) continue
    const from = `${b.day} ${b.start}`
    if ((b.reschedules ?? 0) >= MAX_RESCHEDULES) {
      moves.push({ id: b.id, title: b.title, from, to: null })
      continue
    }
    // A missed workout only moves within the same day: the next workout day is coming anyway.
    const slot = b.kind === 'exercise' && b.day !== today ? null : findFreeSlot(b.minutes, today, nowMin + 10, working, s, b.kind === 'exercise' ? 0 : 6)
    moves.push({ id: b.id, title: b.title, from, to: slot })
    if (slot) {
      b.day = slot.day
      b.start = slot.start
    }
  }
  return moves
}
