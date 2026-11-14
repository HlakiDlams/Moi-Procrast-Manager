import type { CourseLink } from './types'

/**
 * Free outside sites for each course, for when the built-in lessons run out.
 * Only well-known sites with stable addresses. They open in the browser.
 */
const SIYAVULA: CourseLink = { name: 'Siyavula', url: 'https://www.siyavula.com', note: 'Free CAPS textbooks and practice, Grades 10 to 12' }
const DBE: CourseLink = { name: 'Department of Basic Education', url: 'https://www.education.gov.za', note: 'Past NSC exam papers and memos (Curriculum, NSC Examinations)' }
const WCED: CourseLink = { name: 'WCED ePortal', url: 'https://wcedeportal.co.za', note: 'Notes, videos and past papers by subject and grade' }
const MINDSET: CourseLink = { name: 'Mindset Learn', url: 'https://learn.mindset.africa', note: 'CAPS video lessons and revision shows' }
const DUOLINGO: CourseLink = { name: 'Duolingo', url: 'https://www.duolingo.com', note: 'Daily bite-size practice with a full course tree' }
const LANGUAGE_TRANSFER: CourseLink = { name: 'Language Transfer', url: 'https://www.languagetransfer.org', note: 'Free audio course that teaches you to build sentences' }

export const COURSE_LINKS: Record<string, CourseLink[]> = {
  maths: [SIYAVULA, { name: 'Khan Academy: Maths', url: 'https://www.khanacademy.org/math', note: 'Videos and exercises for every topic, from basics up' }, MINDSET, DBE],
  afrikaans: [DBE, WCED, MINDSET],
  egd: [DBE, WCED],
  it: [
    DBE,
    { name: 'W3Schools: SQL', url: 'https://www.w3schools.com/sql/', note: 'SQL lessons you can try in the browser' },
    { name: 'Khan Academy: Computing', url: 'https://www.khanacademy.org/computing', note: 'Programming thinking, algorithms and how computers work' },
  ],
  english: [
    { name: 'Khan Academy: Grammar', url: 'https://www.khanacademy.org/humanities/grammar', note: 'Parts of speech, punctuation and sentence structure' },
    { name: 'Project Gutenberg', url: 'https://www.gutenberg.org', note: 'Thousands of free classic books to read' },
    DBE,
  ],
  japanese: [
    DUOLINGO,
    { name: 'NHK World: Easy Japanese', url: 'https://www.nhk.or.jp/lesson/en/', note: 'Free audio lessons from Japan’s public broadcaster' },
    { name: 'Tae Kim’s Guide', url: 'https://guidetojapanese.org', note: 'Clear grammar guide, start to intermediate' },
  ],
  korean: [
    DUOLINGO,
    { name: 'Talk To Me In Korean', url: 'https://talktomeinkorean.com', note: 'Short lessons with audio; the core levels are free' },
    { name: 'How to Study Korean', url: 'https://www.howtostudykorean.com', note: 'Detailed free lessons from Hangul onwards' },
  ],
  mandarin: [DUOLINGO],
  spanish: [DUOLINGO, LANGUAGE_TRANSFER],
  portuguese: [DUOLINGO],
  french: [DUOLINGO, LANGUAGE_TRANSFER],
  hebrew: [DUOLINGO],
  finance: [{ name: 'Khan Academy: Personal finance', url: 'https://www.khanacademy.org/college-careers-more/personal-finance', note: 'Saving, interest, budgeting, tax and investing' }],
  art: [
    { name: 'Drawabox', url: 'https://drawabox.com', note: 'Free structured drawing fundamentals with exercises' },
    { name: 'Ctrl+Paint', url: 'https://www.ctrlpaint.com', note: 'Free short videos on drawing and digital painting' },
  ],
  chess: [
    { name: 'Lichess: Learn', url: 'https://lichess.org/learn', note: 'Interactive basics, free with no ads' },
    { name: 'Lichess: Practice', url: 'https://lichess.org/practice', note: 'Checkmates, tactics and endgames to drill' },
  ],
  music: [
    { name: 'musictheory.net', url: 'https://www.musictheory.net/lessons', note: 'Free theory lessons and ear-training exercises' },
    { name: 'teoria', url: 'https://www.teoria.com', note: 'Theory tutorials and exercises' },
  ],
}
