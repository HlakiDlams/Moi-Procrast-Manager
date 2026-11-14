import { Capacitor, registerPlugin } from '@capacitor/core'

/** True inside the Android app (APK), false in a normal browser / PWA. */
export const isNative = Capacitor.isNativePlatform()

export interface ClockPlugin {
  /** days: 1=Sun ... 7=Sat (Android AlarmClock format) */
  setAlarm(o: { hour: number; minute: number; label: string; days?: number[]; skipUi?: boolean }): Promise<{ ok: boolean }>
  setTimer(o: { seconds: number; label: string }): Promise<{ ok: boolean }>
  showAlarms(): Promise<{ ok: boolean }>
}

/** Native plugin in android/app/src/main/java/za/hlaki/planner/ClockPlugin.java */
export const Clock = registerPlugin<ClockPlugin>('Clock')

export interface StepsPlugin {
  status(): Promise<{ available: boolean; granted: boolean }>
  requestPermission(): Promise<{ available: boolean; granted: boolean }>
  start(): Promise<StepsSync>
  stop(): Promise<void>
  sync(): Promise<StepsSync>
}

export interface StepsSync {
  ok: boolean
  /** steps per local day, e.g. { "2026-11-14": 4312 } */
  days: Record<string, number>
  lastReading: number
}

/** Native plugin in android/app/src/main/java/za/hlaki/planner/StepsPlugin.java */
export const Steps = registerPlugin<StepsPlugin>('Steps')
