import { LocalNotifications } from '@capacitor/local-notifications'
import { isNative } from './platform'

/**
 * One API for reminders on both platforms:
 * - Android app: real scheduled notifications (fire even when the app is closed).
 * - Browser/PWA: an in-page scheduler that fires while the app is open or in the background.
 */

export type Channel = 'reminders' | 'alarms' | 'timer'

export interface Reminder {
  id: number
  at: Date
  title: string
  body: string
  channel: Channel
  /** extra data passed back when tapped */
  extra?: Record<string, unknown>
}

/** Fixed ids outside the 1..8999 range used by the reminder planner */
export const FOCUS_TIMER_ID = 9001
export const TEST_ID = 9002
export const SNOOZE_ID = 9003

// ---------- in-app events (alarm overlay, toasts) ----------

export interface FiredDetail {
  title: string
  body: string
  channel: Channel
  extra?: Record<string, unknown>
}

export function emitFired(d: FiredDetail) {
  window.dispatchEvent(new CustomEvent<FiredDetail>('planner-fired', { detail: d }))
}

export function onFired(fn: (d: FiredDetail) => void) {
  const h = (e: Event) => fn((e as CustomEvent<FiredDetail>).detail)
  window.addEventListener('planner-fired', h)
  return () => window.removeEventListener('planner-fired', h)
}

export function emitTapped(extra: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent('planner-tapped', { detail: extra }))
}

export function onTapped(fn: (extra: Record<string, unknown>) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Record<string, unknown>>).detail)
  window.addEventListener('planner-tapped', h)
  return () => window.removeEventListener('planner-tapped', h)
}

// ---------- permission ----------

export async function permissionState(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
  if (isNative) {
    const p = await LocalNotifications.checkPermissions()
    return p.display === 'granted' ? 'granted' : p.display === 'denied' ? 'denied' : 'prompt'
  }
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission === 'default' ? 'prompt' : Notification.permission
}

export async function requestPermission(): Promise<boolean> {
  if (isNative) {
    const p = await LocalNotifications.requestPermissions()
    return p.display === 'granted'
  }
  if (!('Notification' in window)) return false
  return (await Notification.requestPermission()) === 'granted'
}

// ---------- native setup ----------

let nativeReady: Promise<void> | null = null

function setupNative() {
  if (nativeReady) return nativeReady
  nativeReady = (async () => {
    await LocalNotifications.createChannel({
      id: 'reminders',
      name: 'Reminders',
      description: 'Tasks starting, water, breaks and bedtime',
      importance: 4,
      visibility: 1,
      vibration: true,
    })
    await LocalNotifications.createChannel({
      id: 'alarms',
      name: 'Alarms',
      description: 'Alarms you set in the planner',
      importance: 5,
      visibility: 1,
      vibration: true,
    })
    await LocalNotifications.createChannel({
      id: 'timer',
      name: 'Focus timer',
      description: 'When a 2-minute starter, Pomodoro or break ends',
      importance: 5,
      visibility: 1,
      vibration: true,
    })
    // App open: show alarms/timers in-app too
    await LocalNotifications.addListener('localNotificationReceived', (n) => {
      emitFired({
        title: n.title,
        body: n.body,
        channel: (n.channelId as Channel) ?? 'reminders',
        extra: n.extra,
      })
    })
    await LocalNotifications.addListener('localNotificationActionPerformed', (a) => {
      emitTapped({ ...(a.notification.extra ?? {}), channel: a.notification.channelId })
    })
  })()
  return nativeReady
}

if (isNative) setupNative().catch(() => {})

// ---------- web scheduler ----------

let webQueue: Reminder[] = []
const webFired = new Set<string>()
let webTimer: number | undefined

async function showWebNotification(r: Reminder) {
  emitFired({ title: r.title, body: r.body, channel: r.channel, extra: r.extra })
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  // Don't double-up with the in-app overlay when the page is visible
  if (document.visibilityState === 'visible') return
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    const opts: NotificationOptions = { body: r.body, icon: './icon-192.png', tag: String(r.id), data: r.extra }
    if (reg) await reg.showNotification(r.title, opts)
    else new Notification(r.title, opts)
  } catch {
    /* ignore */
  }
}

function webTick() {
  const now = Date.now()
  for (const r of webQueue) {
    const key = `${r.id}@${r.at.getTime()}`
    const t = r.at.getTime()
    // fire if due within the last 2 minutes (don't fire stale ones after a long sleep)
    if (t <= now && now - t < 120_000 && !webFired.has(key)) {
      webFired.add(key)
      showWebNotification(r)
    }
  }
}

function ensureWebTicker() {
  if (webTimer === undefined) {
    webTimer = window.setInterval(webTick, 5_000)
    document.addEventListener('visibilitychange', webTick)
  }
}

// ---------- public scheduling API ----------

/** Replace all planner reminders (ids 1..8999) with this list. */
export async function replaceAll(list: Reminder[]) {
  const future = list.filter((r) => r.at.getTime() > Date.now())
  if (isNative) {
    await setupNative()
    const pending = await LocalNotifications.getPending()
    const old = pending.notifications.filter((n) => n.id < 9000).map((n) => ({ id: n.id }))
    if (old.length) await LocalNotifications.cancel({ notifications: old })
    if (future.length) await LocalNotifications.schedule({ notifications: future.map(toNative) })
  } else {
    webQueue = [...webQueue.filter((r) => r.id >= 9000), ...future]
    ensureWebTicker()
  }
}

/** Schedule (or reschedule) a single reminder with a fixed id. */
export async function scheduleOne(r: Reminder) {
  if (isNative) {
    await setupNative()
    await LocalNotifications.cancel({ notifications: [{ id: r.id }] })
    await LocalNotifications.schedule({ notifications: [toNative(r)] })
  } else {
    webQueue = [...webQueue.filter((x) => x.id !== r.id), r]
    ensureWebTicker()
  }
}

export async function cancelOne(id: number) {
  if (isNative) {
    await LocalNotifications.cancel({ notifications: [{ id }] })
  } else {
    webQueue = webQueue.filter((x) => x.id !== id)
  }
}

export async function pendingCount(): Promise<number> {
  if (isNative) return (await LocalNotifications.getPending()).notifications.length
  return webQueue.filter((r) => r.at.getTime() > Date.now()).length
}

function toNative(r: Reminder) {
  return {
    id: r.id,
    title: r.title,
    body: r.body,
    channelId: r.channel,
    schedule: { at: r.at, allowWhileIdle: true },
    extra: r.extra,
    smallIcon: 'ic_stat_planner',
    iconColor: '#FF2E93',
    autoCancel: true,
    ongoing: false,
  }
}
