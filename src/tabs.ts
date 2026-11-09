export type TabId =
  | 'today'
  | 'study'
  | 'planner'
  | 'selfcare'
  | 'play'
  | 'exercise'
  | 'homework'
  | 'profile'
  | 'alarms'
  | 'settings'

export interface TabDef {
  id: TabId
  label: string
  icon: string
  accent: string
  /** shown in the bottom bar (others live under "More") */
  primary: boolean
}

export const TABS: TabDef[] = [
  { id: 'today', label: 'Today', icon: '🌸', accent: '#FF2E93', primary: true },
  { id: 'study', label: 'Study', icon: '📚', accent: '#FF8AC8', primary: true },
  { id: 'planner', label: 'Planner', icon: '🗓️', accent: '#D6249F', primary: true },
  { id: 'selfcare', label: 'Self-Care', icon: '💧', accent: '#FFB3C7', primary: true },
  { id: 'play', label: 'Play', icon: '🎮', accent: '#C77DFF', primary: false },
  { id: 'exercise', label: 'Exercise', icon: '💪', accent: '#FF3B5C', primary: false },
  { id: 'homework', label: 'Homework Checker', icon: '✅', accent: '#FFD166', primary: false },
  { id: 'profile', label: 'Profile & Goals', icon: '🎯', accent: '#FF5FA2', primary: false },
  { id: 'alarms', label: 'Alarms & Reminders', icon: '⏰', accent: '#FF2E93', primary: false },
  { id: 'settings', label: 'Settings', icon: '⚙️', accent: '#FFB3D9', primary: false },
]

export const tabById = (id: string) => TABS.find((t) => t.id === id)
