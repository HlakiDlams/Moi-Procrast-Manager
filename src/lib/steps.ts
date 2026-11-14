import { useEffect } from 'react'
import { App as CapApp } from '@capacitor/app'
import { db, localDay } from './db'
import { getSettings, setSetting } from './settings'
import { isNative, Steps, type StepsSync } from './platform'
import { xpOnce } from './selfcare'

/** Copy sensor step counts into the steps log. A higher manual number (e.g. from a watch) wins. */
export async function applyStepSync(r: StepsSync) {
  const s = await getSettings()
  const today = localDay()
  for (const [day, auto] of Object.entries(r.days)) {
    const cur = await db.steps.get(day)
    const steps = Math.max(cur?.steps ?? 0, auto)
    if (steps !== cur?.steps) await db.steps.put({ day, steps })
    if (day === today && steps >= s.stepsGoal) await xpOnce(today, 'steps', 5)
  }
}

export async function syncSteps(): Promise<StepsSync | null> {
  if (!isNative) return null
  const s = await getSettings()
  if (!s.autoSteps) return null
  try {
    const r = await Steps.sync()
    await applyStepSync(r)
    return r
  } catch {
    return null
  }
}

/** Turn automatic counting on: asks for the "physical activity" permission first. */
export async function enableAutoSteps(): Promise<'on' | 'no-sensor' | 'denied' | 'web'> {
  if (!isNative) return 'web'
  const st = await Steps.status()
  if (!st.available) return 'no-sensor'
  const p = st.granted ? st : await Steps.requestPermission()
  if (!p.granted) return 'denied'
  await setSetting('autoSteps', true)
  const r = await Steps.start()
  await applyStepSync(r)
  return 'on'
}

export async function disableAutoSteps() {
  await setSetting('autoSteps', false)
  if (isNative) await Steps.stop().catch(() => {})
}

/** Mount once: sync when the app opens, comes back to the front, and every 15 min while open. */
export function useStepSync() {
  useEffect(() => {
    if (!isNative) return
    const run = () => syncSteps()
    const first = setTimeout(run, 2000)
    const id = setInterval(run, 15 * 60_000)
    let remove: (() => void) | undefined
    CapApp.addListener('resume', run).then((h) => (remove = () => h.remove()))
    return () => {
      clearTimeout(first)
      clearInterval(id)
      remove?.()
    }
  }, [])
}
