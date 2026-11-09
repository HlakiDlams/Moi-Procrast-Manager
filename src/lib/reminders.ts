import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { App as CapApp } from '@capacitor/app'
import { addDays, atTime, db, localDay, type Alarm, type Block } from './db'
import { getSettings, type Settings } from './settings'
import { replaceAll, type Reminder } from './notify'
import { isNative } from './platform'
import { blockEnd, kindInfo } from './blocks'

const fmtEnd = (b: Block) => {
  const e = blockEnd(b)
  return `${String(e.getHours()).padStart(2, '0')}:${String(e.getMinutes()).padStart(2, '0')}`
}

const HORIZON_DAYS = 3

/** Pure function: everything that should ring in the next few days. */
export function buildReminders(s: Settings, blocks: Block[], alarms: Alarm[], now = new Date()): Reminder[] {
  const out: Omit<Reminder, 'id'>[] = []
  const today = localDay(now)
  const days = Array.from({ length: HORIZON_DAYS }, (_, i) => addDays(today, i))

  for (const a of alarms) {
    if (!a.enabled || a.mode !== 'app') continue
    for (const day of days) {
      const at = atTime(day, a.time)
      if (a.days.length && !a.days.includes(at.getDay())) continue
      out.push({ at, title: `⏰ ${a.label || 'Alarm'}`, body: `It's ${a.time}. Tap to start.`, channel: 'alarms', extra: { kind: 'alarm', label: a.label } })
    }
  }

  if (s.notifications) {
    if (s.remindTasks) {
      for (const b of blocks) {
        if (b.status !== 'planned' || b.kind === 'sleep') continue
        const start = atTime(b.day, b.start)
        const k = kindInfo(b.kind)
        if (b.kind === 'prayer') {
          out.push({ at: start, title: `🙏 ${b.title}`, body: 'Time to pray. Take a quiet moment with God.', channel: 'reminders', extra: { kind: 'prayer' } })
          continue
        }
        const actionable = !b.fixed && b.kind !== 'meal'
        out.push({
          at: new Date(start.getTime() - 5 * 60_000),
          title: `${k.icon} Starting in 5 min: ${b.title}`,
          body: actionable ? `At ${b.start} for ${b.minutes} min. Get your stuff ready 💕` : `At ${b.start}.`,
          channel: 'reminders',
          extra: { kind: 'block', blockId: b.id },
        })
        out.push({
          at: start,
          title: `${k.icon} Time for ${b.title}`,
          body: actionable ? 'Just 2 minutes. Tap to start the timer.' : `Until ${fmtEnd(b)}.`,
          channel: 'reminders',
          extra: { kind: 'block', blockId: b.id, start: actionable },
        })
      }
    }

    if (s.remindWater && s.waterEvery >= 30) {
      for (const day of days) {
        const wake = atTime(day, s.wakeTime)
        const bed = atTime(day, s.bedtime)
        if (bed <= wake) bed.setDate(bed.getDate() + 1)
        for (let t = wake.getTime() + s.waterEvery * 60_000; t < bed.getTime() - 30 * 60_000; t += s.waterEvery * 60_000) {
          out.push({ at: new Date(t), title: '💧 Water break', body: 'Drink a glass of water, then tap +1 in the app.', channel: 'reminders', extra: { kind: 'water' } })
        }
      }
    }

    if (s.remindBedtime) {
      for (const day of days) {
        const bed = atTime(day, s.bedtime)
        if (bed.getHours() < 12) bed.setDate(bed.getDate() + 1) // bedtime after midnight
        out.push({ at: new Date(bed.getTime() - 30 * 60_000), title: '🌙 Wind down', body: `Bedtime in 30 min (${s.bedtime}). Screens down soon, skincare time.`, channel: 'reminders', extra: { kind: 'bedtime' } })
        out.push({ at: bed, title: '😴 Bedtime', body: `Sleep now to wake at ${s.wakeTime} feeling good.`, channel: 'reminders', extra: { kind: 'bedtime' } })
      }
    }
  }

  return out
    .filter((r) => r.at.getTime() > now.getTime())
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, 400) // Android allows ~500 pending alarms per app
    .map((r, i) => ({ ...r, id: i + 1 }))
}

async function resync() {
  const s = await getSettings()
  const today = localDay()
  const blocks = await db.blocks.where('day').between(today, addDays(today, HORIZON_DAYS), true, false).toArray()
  const alarms = await db.alarms.toArray()
  await replaceAll(buildReminders(s, blocks, alarms))
}

let timer: number | undefined
export function scheduleResync(delay = 400) {
  clearTimeout(timer)
  timer = window.setTimeout(() => resync().catch((e) => console.warn('reminder sync failed', e)), delay)
}

/** Mount once in <App>: keeps scheduled reminders in step with the data. */
export function useReminderSync() {
  // Fingerprint of everything reminders depend on; changes trigger a resync.
  const fp = useLiveQuery(async () => {
    const [settings, blocks, alarms] = await Promise.all([db.settings.toArray(), db.blocks.where('day').aboveOrEqual(localDay()).toArray(), db.alarms.toArray()])
    return JSON.stringify([settings.filter((r) => r.key !== 'focus'), blocks, alarms])
  }, [])

  useEffect(() => {
    if (fp !== undefined) scheduleResync()
  }, [fp])

  useEffect(() => {
    // Top up the rolling window every hour, and whenever the app comes back.
    const id = window.setInterval(() => scheduleResync(0), 60 * 60_000)
    const onVis = () => document.visibilityState === 'visible' && scheduleResync(0)
    document.addEventListener('visibilitychange', onVis)
    let remove: (() => void) | undefined
    if (isNative) {
      CapApp.addListener('resume', () => scheduleResync(0)).then((h) => (remove = () => h.remove()))
    }
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
      remove?.()
    }
  }, [])
}
