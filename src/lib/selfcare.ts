import { db, type Routine } from './db'
import { addXp } from './xp'

/** Give XP for something only once per day (e.g. logging mood). */
export async function xpOnce(day: string, key: string, amount: number) {
  const note = `once:${key}`
  const already = await db.xp
    .where('day')
    .equals(day)
    .filter((e) => e.note === note)
    .count()
  if (!already) await addXp(amount, 'selfcare', note)
}

export const DEFAULT_ROUTINES: Omit<Routine, 'id'>[] = [
  {
    name: 'Morning skincare',
    icon: '',
    items: [
      { id: 'cleanse', label: 'Cleanse' },
      { id: 'moisturise', label: 'Moisturise' },
      { id: 'spf', label: 'Sunscreen (SPF 30+)' },
      { id: 'lips', label: 'Lip balm' },
    ],
    days: [],
    active: true,
  },
  {
    name: 'Night skincare',
    icon: '',
    items: [
      { id: 'cleanse', label: 'Cleanse (remove the day)' },
      { id: 'moisturise', label: 'Moisturise' },
      { id: 'teeth', label: 'Brush teeth' },
    ],
    days: [],
    active: true,
  },
  {
    name: 'Hair care',
    icon: '',
    items: [
      { id: 'moist', label: 'Moisturise hair / ends' },
      { id: 'bonnet', label: 'Satin bonnet or scarf for sleep' },
    ],
    days: [],
    active: true,
  },
  {
    name: 'Wash day',
    icon: '',
    items: [
      { id: 'wash', label: 'Wash' },
      { id: 'condition', label: 'Deep condition' },
      { id: 'detangle', label: 'Detangle gently' },
      { id: 'scalp', label: 'Oil scalp' },
    ],
    days: [6],
    active: true,
  },
]

export async function ensureRoutinesSeeded() {
  await db.transaction('rw', db.routines, db.settings, async () => {
    if (await db.settings.get('routinesSeeded')) return
    if ((await db.routines.count()) === 0) await db.routines.bulkAdd(DEFAULT_ROUTINES)
    await db.settings.put({ key: 'routinesSeeded', value: true })
  })
}

export const routineDueOn = (r: Routine, day: string) => r.active && (!r.days.length || r.days.includes(new Date(day + 'T12:00:00').getDay()))

/** Hours slept between bed (HH:MM, previous evening) and wake (HH:MM). */
export function sleepHours(bed: string, wake: string): number {
  const [bh, bm] = bed.split(':').map(Number)
  const [wh, wm] = wake.split(':').map(Number)
  let mins = wh * 60 + wm - (bh * 60 + bm)
  if (mins <= 0) mins += 1440
  return Math.round((mins / 60) * 10) / 10
}

export const SYMPTOMS = ['Cramps', 'Headache', 'Bloating', 'Back pain', 'Tired', 'Moody', 'Acne', 'Cravings', 'Tender breasts', 'Nausea']
