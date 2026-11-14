import { useEffect } from 'react'
import { db, localDay } from './db'
import { getSettings } from './settings'
import { generateWeek, planReschedules, weekDays } from './scheduler'
import { emitFired } from './notify'

/** Generate (or regenerate) the week starting `monday`. Returns how many blocks were added. */
export async function generateAndSave(monday: string): Promise<number> {
  const days = weekDays(monday)
  const [settings, subjects, commitments, existing] = await Promise.all([
    getSettings(),
    db.subjects.toArray(),
    db.commitments.toArray(),
    db.blocks.where('day').between(days[0], days[6], true, true).toArray(),
  ])
  const now = new Date()
  const res = generateWeek({
    days,
    today: localDay(now),
    nowMin: now.getHours() * 60 + now.getMinutes(),
    settings,
    subjects,
    commitments,
    existing,
  })
  await db.transaction('rw', db.blocks, async () => {
    await db.blocks.bulkDelete(res.remove)
    await db.blocks.bulkAdd(res.add)
  })
  return res.add.length
}

/** Move missed study/exercise blocks into the next free slot. */
export async function rescheduleMissed(): Promise<number> {
  const s = await getSettings()
  if (!s.autoReschedule) return 0
  const now = new Date()
  const from = localDay(new Date(now.getTime() - 8 * 86_400_000))
  const blocks = await db.blocks.where('day').aboveOrEqual(from).toArray()
  const moves = planReschedules(blocks, now, s)
  if (!moves.length) return 0
  let moved = 0
  await db.transaction('rw', db.blocks, async () => {
    for (const m of moves) {
      const b = blocks.find((x) => x.id === m.id)!
      if (m.to) {
        await db.blocks.update(m.id, {
          day: m.to.day,
          start: m.to.start,
          reschedules: (b.reschedules ?? 0) + 1,
          origDay: b.origDay ?? b.day,
          origStart: b.origStart ?? b.start,
        })
        moved++
      } else {
        await db.blocks.update(m.id, { status: 'skipped' })
      }
    }
  })
  const first = moves.find((m) => m.to)
  if (first?.to) {
    emitFired({
      title: `Moved ${moved} missed block${moved === 1 ? '' : 's'}`,
      body: `${first.title} is now ${first.to.day === localDay(now) ? 'today' : new Date(first.to.day + 'T12:00:00').toLocaleDateString('en-ZA', { weekday: 'long' })} at ${first.to.start}${moved > 1 ? ', and more' : ''}.`,
      channel: 'reminders',
    })
  }
  return moved
}

/** Mount once: checks for missed blocks on open, on return to the app, and every 15 min. */
export function useAutoReschedule() {
  useEffect(() => {
    const run = () => rescheduleMissed().catch((e) => console.warn('reschedule failed', e))
    const first = setTimeout(run, 1500)
    const id = setInterval(run, 15 * 60_000)
    const onVis = () => document.visibilityState === 'visible' && run()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearTimeout(first)
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])
}
