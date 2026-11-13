import Dexie, { type Table } from 'dexie'

/** Key/value settings (API key, timer lengths, exam date, etc.). */
export interface SettingRow {
  key: string
  value: unknown
}

/** Every XP gain in any tab is logged here, so XP + streaks are shared app-wide. */
export interface XpEvent {
  id?: number
  /** ISO timestamp */
  at: string
  /** Local date YYYY-MM-DD (used for streaks + charts) */
  day: string
  amount: number
  /** Which tab earned it: today | study | planner | selfcare | play | exercise | homework | profile */
  source: string
  note?: string
}

export type BlockKind = 'study' | 'homework' | 'break' | 'meal' | 'play' | 'exercise' | 'selfcare' | 'prayer' | 'sleep' | 'other'

/** A time block on a given day. Today shows them; the Planner (later stage) generates them. */
export interface Block {
  id?: number
  day: string // YYYY-MM-DD
  start: string // HH:MM
  minutes: number
  title: string
  kind: BlockKind
  subject?: string
  status: 'planned' | 'done' | 'skipped'
  doneAt?: string
  subjectId?: number
  /** made by the auto-planner (can be regenerated) */
  generated?: boolean
  /** a fixed commitment (church, work, chores, meals) */
  fixed?: boolean
  /** how many times it was auto-moved after being missed */
  reschedules?: number
  origDay?: string
  origStart?: string
}

/** Something you study: a school subject or an extra (language, chess...). */
export interface Subject {
  id?: number
  name: string
  icon: string
  color: string
  /** 1 = keep it ticking, 2 = needs work, 3 = top priority */
  priority: 1 | 2 | 3
  examDate: string // YYYY-MM-DD ('' = none)
  currentMark: number | null
  targetMark: number
  active: boolean
  group: 'school' | 'extra'
}

/** A repeating fixed thing in your week: church, work, chores, meals. */
export interface Commitment {
  id?: number
  title: string
  /** 0=Sun ... 6=Sat */
  days: number[]
  start: string
  end: string
  /** minutes to get there (blocked before and after) */
  travelMin: number
  kind: BlockKind
  active: boolean
}

/** A finished (or partly finished) focus session from the 2-minute starter / Pomodoro. */
export interface FocusLog {
  id?: number
  day: string
  at: string
  minutes: number
  kind: 'starter' | 'work'
  title: string
  blockId?: number
}

export interface WaterLog {
  id?: number
  day: string
  at: string
}

/** A repeating alarm. 'app' = rung by this app; 'clock' = handed to the phone's Clock app. */
export interface Alarm {
  id?: number
  time: string // HH:MM
  label: string
  /** 0=Sun ... 6=Sat. Empty = every day. */
  days: number[]
  enabled: boolean
  mode: 'app' | 'clock'
}

/** One weigh-in. Height is stored with it so BMI history stays correct as you grow. */
export interface WeightLog {
  id?: number
  day: string
  kg: number
  heightCm?: number
}

/** A finished lesson (best score kept). */
export interface LessonDone {
  lessonId: string
  courseId: string
  at: string
  best: number // 0-100
  times: number
}

/** A question you got wrong, in the spaced-repetition review deck. */
export interface ReviewCard {
  key: string // courseId:questionId
  courseId: string
  qid: string
  /** Leitner box 1-5: higher = longer gap before you see it again */
  box: number
  due: string // YYYY-MM-DD
  lapses: number
}

// ---------------- self-care ----------------

export type MealKind = 'breakfast' | 'lunch' | 'supper' | 'snack'

export interface MealLog {
  id?: number
  day: string
  at: string
  meal: MealKind
  note?: string
}

/** Sleep for the night that ENDS on `day` (the morning you woke up). */
export interface SleepLog {
  day: string
  bed: string // HH:MM
  wake: string // HH:MM
  hours: number
  quality?: number // 1-5
}

export interface MoodLog {
  day: string
  mood: number // 1-5
  energy: number // 1-5
  note?: string
}

export interface StepsLog {
  day: string
  steps: number
}

export interface Routine {
  id?: number
  name: string
  icon: string
  items: { id: string; label: string }[]
  /** 0=Sun..6=Sat; empty = every day */
  days: number[]
  /** optional reminder time HH:MM */
  time?: string
  active: boolean
}

export interface RoutineCheck {
  key: string // day:routineId:itemId
  day: string
  routineId: number
  itemId: string
}

export interface PeriodLog {
  id?: number
  start: string // YYYY-MM-DD
  end?: string // YYYY-MM-DD (last day of bleeding)
  flow?: 'light' | 'medium' | 'heavy'
}

export interface SymptomLog {
  day: string
  items: string[]
  note?: string
}

/** A finished (or partly finished) workout. */
export interface WorkoutLog {
  id?: number
  day: string
  at: string
  workoutId: string
  name: string
  minutes: number
  /** what was actually done, per exercise */
  sets: { ex: string; reps?: number; secs?: number }[]
  programmeWeek?: number
  completed: boolean
}

/** A hobby / game / fun activity you spend earned play time on. */
export interface Hobby {
  id?: number
  name: string
  icon: string
  /** default session length in minutes */
  minutes: number
  active: boolean
}

export interface PlayLog {
  id?: number
  day: string
  at: string
  hobbyId?: number
  name: string
  minutes: number
  /** came back when the timer said so */
  onTime: boolean
}

class PlannerDB extends Dexie {
  settings!: Table<SettingRow, string>
  xp!: Table<XpEvent, number>
  blocks!: Table<Block, number>
  focus!: Table<FocusLog, number>
  water!: Table<WaterLog, number>
  alarms!: Table<Alarm, number>
  weights!: Table<WeightLog, number>
  subjects!: Table<Subject, number>
  commitments!: Table<Commitment, number>
  lessons!: Table<LessonDone, string>
  cards!: Table<ReviewCard, string>
  meals!: Table<MealLog, number>
  sleep!: Table<SleepLog, string>
  moods!: Table<MoodLog, string>
  steps!: Table<StepsLog, string>
  routines!: Table<Routine, number>
  routineChecks!: Table<RoutineCheck, string>
  periods!: Table<PeriodLog, number>
  symptoms!: Table<SymptomLog, string>
  workouts!: Table<WorkoutLog, number>
  hobbies!: Table<Hobby, number>
  playLogs!: Table<PlayLog, number>

  constructor() {
    super('hlakis-planner')
    this.version(1).stores({
      settings: 'key',
      xp: '++id, day, source',
    })
    this.version(2).stores({
      blocks: '++id, day, [day+start], status',
      focus: '++id, day',
      water: '++id, day',
      alarms: '++id',
    })
    this.version(3).stores({
      weights: '++id, day',
    })
    this.version(4).stores({
      subjects: '++id, group',
      commitments: '++id',
    })
    this.version(5).stores({
      lessons: 'lessonId, courseId',
      cards: 'key, courseId, due',
    })
    this.version(6).stores({
      meals: '++id, day',
      sleep: 'day',
      moods: 'day',
      steps: 'day',
      routines: '++id',
      routineChecks: 'key, day',
      periods: '++id, start',
      symptoms: 'day',
    })
    this.version(7).stores({
      workouts: '++id, day, workoutId',
    })
    this.version(8).stores({
      hobbies: '++id',
      playLogs: '++id, day',
    })
  }
}

export const db = new PlannerDB()

/** Local date string YYYY-MM-DD (not UTC, so midnight in SA is midnight). */
export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(day: string, n: number): string {
  const d = new Date(day + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return localDay(d)
}

/** "HH:MM" on a given local day -> Date */
export function atTime(day: string, hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(day + 'T00:00:00')
  d.setHours(h, m, 0, 0)
  return d
}

export function fmtTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
