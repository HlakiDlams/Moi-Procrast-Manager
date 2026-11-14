import { AlarmClock, BookOpen, CalendarDays, Dumbbell, Gamepad2, HeartPulse, ScanText, Settings, Sun, UserRound, type LucideIcon } from './icons'

export type TabId = 'today' | 'study' | 'planner' | 'selfcare' | 'play' | 'exercise' | 'homework' | 'profile' | 'alarms' | 'settings'

export interface TabDef {
  id: TabId
  label: string
  icon: LucideIcon
  /** shown in the bottom bar (others live under "More") */
  primary: boolean
}

export const TABS: TabDef[] = [
  { id: 'today', label: 'Today', icon: Sun, primary: true },
  { id: 'study', label: 'Study', icon: BookOpen, primary: true },
  { id: 'planner', label: 'Planner', icon: CalendarDays, primary: true },
  { id: 'selfcare', label: 'Self-Care', icon: HeartPulse, primary: true },
  { id: 'play', label: 'Play', icon: Gamepad2, primary: false },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell, primary: false },
  { id: 'homework', label: 'Homework', icon: ScanText, primary: false },
  { id: 'profile', label: 'Profile', icon: UserRound, primary: false },
  { id: 'alarms', label: 'Reminders', icon: AlarmClock, primary: false },
  { id: 'settings', label: 'Settings', icon: Settings, primary: false },
]

export const tabById = (id: string) => TABS.find((t) => t.id === id)
