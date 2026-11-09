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
