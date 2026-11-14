/** Lesson content format. Built-in courses live in src/study/content/. */

interface QBase {
  id: string
  prompt: string
  /** shown after answering, right or wrong */
  explain: string
  /** a reading passage shown above the question (comprehension) */
  context?: string
  /** text the 🔊 button reads aloud in the course language */
  say?: string
  /** a code snippet shown in a monospace box above the prompt */
  code?: string
  /** ear training: frequencies (Hz) played one after another with ▶ */
  tones?: number[]
}

export interface MCQ extends QBase {
  type: 'mcq'
  options: string[]
  /** index into options */
  answer: number
}

export interface InputQ extends QBase {
  type: 'input'
  /** accepted answers (compared after normalising spaces, minus signs, x= etc.) */
  answers: string[]
  /** compare as numbers (fractions like 3/4 allowed) */
  numeric?: boolean
  tolerance?: number
  placeholder?: string
}

export interface MatchQ extends QBase {
  type: 'match'
  pairs: [string, string][]
}

export interface OrderQ extends QBase {
  type: 'order'
  /** in the correct order */
  steps: string[]
}

/** Think of the answer, reveal it, then say honestly if you knew it (homework mistakes, AI cards). */
export interface RecallQ extends QBase {
  type: 'recall'
  answer: string
}

export type Question = MCQ | InputQ | MatchQ | OrderQ | RecallQ

export interface Lesson {
  id: string
  title: string
  /** short "teach me" card before the questions */
  teach: { text: string[]; example?: string[]; /** read aloud with 🔊 */ say?: string }
  questions: Question[]
}

export interface Unit {
  id: string
  title: string
  icon: string
  description: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  name: string
  icon: string
  color: string
  /** matches a Planner subject name so study blocks can open it */
  subjectName?: string
  group: 'school' | 'extra'
  /** BCP-47 language for text-to-speech, e.g. 'af-ZA' */
  lang?: string
  /** heading the course is listed under on the Study home */
  section?: 'Languages' | 'Skills & knowledge'
  /** short intro shown at the top of the course */
  blurb?: string
  /** daily practice prompts (e.g. sketch ideas): one is picked per day */
  prompts?: string[]
  units: Unit[]
}
