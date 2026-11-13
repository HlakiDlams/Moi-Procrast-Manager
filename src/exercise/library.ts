/** Home, no-equipment exercises. Every high-impact move has a low-impact swap. */

export interface Exercise {
  id: string
  name: string
  icon: string
  cues: string[]
  type: 'reps' | 'time'
  /** reps/time are per side (do both sides) */
  perSide?: boolean
  impact: 'low' | 'high'
  /** low-impact replacement used in low-impact mode */
  lowAlt?: string
}

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(
  (
    [
      // warm-up
      { id: 'march', name: 'March on the spot', icon: '🚶🏾‍♀️', cues: ['Lift knees to hip height', 'Swing your arms', 'Breathe in through the nose'], type: 'time', impact: 'low' },
      { id: 'arm-circles', name: 'Arm circles', icon: '🔄', cues: ['Arms out to the sides', 'Small circles, then bigger', 'Switch direction halfway'], type: 'time', impact: 'low' },
      { id: 'hip-circles', name: 'Hip circles', icon: '⭕', cues: ['Hands on hips', 'Slow big circles', 'Switch direction halfway'], type: 'time', impact: 'low' },
      // strength
      { id: 'squat', name: 'Squats', icon: '🍑', cues: ['Feet shoulder-width', 'Sit back like into a chair', 'Knees follow your toes', 'Push through your heels to stand'], type: 'reps', impact: 'low' },
      { id: 'pushup', name: 'Push-ups (knees OK)', icon: '💪', cues: ['Hands under shoulders', 'Body in a straight line', 'Lower chest to the floor, push back up', 'On your knees is a real push-up too'], type: 'reps', impact: 'low' },
      { id: 'bridge', name: 'Glute bridges', icon: '🌉', cues: ['Lie on your back, knees bent', 'Squeeze your glutes and lift your hips', 'Hold 1 second at the top'], type: 'reps', impact: 'low' },
      { id: 'lunge', name: 'Reverse lunges', icon: '🦵', cues: ['Step one foot back', 'Lower until both knees are about 90°', 'Push back up through the front heel'], type: 'reps', perSide: true, impact: 'low' },
      { id: 'plank', name: 'Plank', icon: '📏', cues: ['Forearms on the floor', 'Straight line from head to heels', 'Squeeze your tummy, keep breathing'], type: 'time', impact: 'low' },
      { id: 'wall-sit', name: 'Wall sit', icon: '🧱', cues: ['Back flat against the wall', 'Slide down until thighs are level', 'Hold, keep breathing'], type: 'time', impact: 'low' },
      { id: 'dips', name: 'Chair dips', icon: '🪑', cues: ['Hands on a sturdy chair behind you', 'Bend elbows straight back', 'Push back up'], type: 'reps', impact: 'low' },
      { id: 'superman', name: 'Superman', icon: '🦸🏾‍♀️', cues: ['Lie on your tummy', 'Lift arms and legs a little', 'Hold 2 seconds, lower slowly'], type: 'reps', impact: 'low' },
      // toning
      { id: 'donkey', name: 'Donkey kicks', icon: '🫏', cues: ['On hands and knees', 'Kick one heel up to the ceiling', 'Keep your back flat'], type: 'reps', perSide: true, impact: 'low' },
      { id: 'hydrant', name: 'Fire hydrants', icon: '🚒', cues: ['On hands and knees', 'Lift one bent knee out to the side', 'Lower slowly'], type: 'reps', perSide: true, impact: 'low' },
      { id: 'leg-lift', name: 'Side-lying leg lifts', icon: '🦿', cues: ['Lie on your side', 'Lift the top leg, toes forward', 'Lower with control'], type: 'reps', perSide: true, impact: 'low' },
      { id: 'bicycle', name: 'Bicycle crunches', icon: '🚲', cues: ['Lie on your back, hands by your ears', 'Elbow towards the opposite knee', 'Slow and controlled beats fast'], type: 'reps', impact: 'low' },
      { id: 'leg-raise', name: 'Leg raises', icon: '⬆️', cues: ['Lie on your back, hands under hips', 'Raise straight legs up', 'Lower slowly, back stays down'], type: 'reps', impact: 'low' },
      // cardio
      { id: 'step-jack', name: 'Step jacks (low impact)', icon: '⭐', cues: ['Step one foot out as arms go up', 'Step back in, switch sides', 'No jumping, kind to lungs and knees'], type: 'time', impact: 'low' },
      { id: 'jumping-jack', name: 'Jumping jacks', icon: '🌟', cues: ['Jump feet out, arms up', 'Jump back in'], type: 'time', impact: 'high', lowAlt: 'step-jack' },
      { id: 'knee-march', name: 'Fast knee march', icon: '🏃🏾‍♀️', cues: ['Fast march, knees high', 'Pump your arms', 'One foot always on the floor'], type: 'time', impact: 'low' },
      { id: 'high-knees', name: 'High knees', icon: '🔥', cues: ['Run on the spot', 'Knees to hip height'], type: 'time', impact: 'high', lowAlt: 'knee-march' },
      { id: 'climber-slow', name: 'Slow mountain climbers', icon: '⛰️', cues: ['Plank position', 'Step one knee in at a time', 'Steady breathing'], type: 'time', impact: 'low' },
      { id: 'step-skater', name: 'Step skaters', icon: '⛸️', cues: ['Step wide to one side', 'Swing the back leg behind', 'Switch sides'], type: 'time', impact: 'low' },
      // martial arts
      { id: 'shadow-box', name: 'Shadow boxing (jab–cross)', icon: '🥊', cues: ['Fighting stance, hands up by your chin', 'Jab with the front hand, cross with the back', 'Turn your hips into the cross'], type: 'time', impact: 'low' },
      { id: 'front-kick', name: 'Front kicks', icon: '🦶🏾', cues: ['Lift knee high', 'Snap the foot forward, toes pulled back', 'Return the knee, then the foot'], type: 'reps', perSide: true, impact: 'low' },
      { id: 'knee-strike', name: 'Knee strikes', icon: '🦵🏾', cues: ['Hands up as if holding a shoulder', 'Drive the knee up and forward', 'Pull the hands down to meet it'], type: 'reps', perSide: true, impact: 'low' },
      { id: 'horse', name: 'Horse stance hold', icon: '🐎', cues: ['Feet wide, toes forward', 'Sink low like sitting on a horse', 'Back straight, fists at your hips'], type: 'time', impact: 'low' },
      { id: 'sprawl-slow', name: 'Slow sprawls', icon: '🤸🏾‍♀️', cues: ['Hands to the floor', 'Step (don\'t jump) feet back to a plank', 'Step back in and stand'], type: 'reps', impact: 'low' },
      { id: 'burpee', name: 'Burpees', icon: '💥', cues: ['Squat, jump feet back', 'Jump in, jump up'], type: 'reps', impact: 'high', lowAlt: 'sprawl-slow' },
      // flexibility
      { id: 'cat-cow', name: 'Cat–cow', icon: '🐈', cues: ['Hands and knees', 'Breathe in: drop belly, look up', 'Breathe out: round your back'], type: 'time', impact: 'low' },
      { id: 'child', name: "Child's pose", icon: '🧘🏾‍♀️', cues: ['Knees wide, sit back on heels', 'Arms long in front', 'Slow, deep breaths'], type: 'time', impact: 'low' },
      { id: 'hamstring', name: 'Hamstring stretch', icon: '🙆🏾‍♀️', cues: ['Sit, one leg straight', 'Reach towards your toes', 'Gentle: no bouncing'], type: 'time', perSide: true, impact: 'low' },
      { id: 'hip-flexor', name: 'Hip flexor stretch', icon: '🧎🏾‍♀️', cues: ['Kneel on one knee', 'Shift hips forward gently', 'Tall chest'], type: 'time', perSide: true, impact: 'low' },
      { id: 'butterfly', name: 'Butterfly stretch', icon: '🦋', cues: ['Sit, soles of feet together', 'Let knees drop', 'Sit tall'], type: 'time', impact: 'low' },
      { id: 'chest-open', name: 'Chest opener', icon: '🫁', cues: ['Hands clasped behind your back', 'Open your chest, shoulders down', 'Deep breaths in through the nose'], type: 'time', impact: 'low' },
    ] as Exercise[]
  ).map((e) => [e.id, e]),
)

export interface Step {
  ex: string
  sets: number
  /** reps per set (reps exercises) */
  reps?: number
  /** seconds per set (time exercises) */
  secs?: number
  /** rest after each set, seconds */
  rest: number
}

export type Goal = 'strength' | 'tone' | 'cardio' | 'flex' | 'martial'

export interface Workout {
  id: string
  name: string
  goal: Goal
  icon: string
  desc: string
  steps: Step[]
}

export const GOALS: { id: Goal; label: string; icon: string }[] = [
  { id: 'strength', label: 'Strength', icon: '💪' },
  { id: 'tone', label: 'Tone & sculpt', icon: '🍑' },
  { id: 'cardio', label: 'Cardio', icon: '❤️' },
  { id: 'flex', label: 'Flexibility', icon: '🧘🏾‍♀️' },
  { id: 'martial', label: 'Martial arts', icon: '🥋' },
]

export const WARMUP: Step[] = [
  { ex: 'march', sets: 1, secs: 60, rest: 5 },
  { ex: 'arm-circles', sets: 1, secs: 30, rest: 5 },
  { ex: 'hip-circles', sets: 1, secs: 30, rest: 10 },
]

export const WORKOUTS: Workout[] = [
  {
    id: 'strength-a',
    name: 'Full-body strength',
    goal: 'strength',
    icon: '💪',
    desc: 'Squats, push-ups, bridges, lunges, plank',
    steps: [
      { ex: 'squat', sets: 3, reps: 12, rest: 45 },
      { ex: 'pushup', sets: 3, reps: 8, rest: 45 },
      { ex: 'bridge', sets: 3, reps: 15, rest: 40 },
      { ex: 'lunge', sets: 3, reps: 10, rest: 45 },
      { ex: 'plank', sets: 3, secs: 30, rest: 40 },
    ],
  },
  {
    id: 'strength-b',
    name: 'Upper body & back',
    goal: 'strength',
    icon: '🦾',
    desc: 'Push-ups, dips, superman, wall sit',
    steps: [
      { ex: 'pushup', sets: 3, reps: 10, rest: 45 },
      { ex: 'dips', sets: 3, reps: 10, rest: 45 },
      { ex: 'superman', sets: 3, reps: 12, rest: 30 },
      { ex: 'wall-sit', sets: 3, secs: 30, rest: 40 },
      { ex: 'plank', sets: 2, secs: 40, rest: 40 },
    ],
  },
  {
    id: 'tone-a',
    name: 'Glutes & core sculpt',
    goal: 'tone',
    icon: '🍑',
    desc: 'Bridges, donkey kicks, hydrants, leg lifts, crunches',
    steps: [
      { ex: 'bridge', sets: 3, reps: 15, rest: 30 },
      { ex: 'donkey', sets: 3, reps: 12, rest: 30 },
      { ex: 'hydrant', sets: 3, reps: 12, rest: 30 },
      { ex: 'leg-lift', sets: 3, reps: 15, rest: 30 },
      { ex: 'bicycle', sets: 3, reps: 20, rest: 30 },
      { ex: 'leg-raise', sets: 2, reps: 10, rest: 30 },
    ],
  },
  {
    id: 'cardio-a',
    name: 'Low-impact cardio',
    goal: 'cardio',
    icon: '❤️',
    desc: 'No jumping: kind to lungs and knees',
    steps: [
      { ex: 'step-jack', sets: 3, secs: 40, rest: 20 },
      { ex: 'knee-march', sets: 3, secs: 40, rest: 20 },
      { ex: 'shadow-box', sets: 3, secs: 40, rest: 20 },
      { ex: 'climber-slow', sets: 3, secs: 30, rest: 20 },
      { ex: 'step-skater', sets: 3, secs: 40, rest: 30 },
    ],
  },
  {
    id: 'cardio-b',
    name: 'Cardio burner',
    goal: 'cardio',
    icon: '🔥',
    desc: 'Jumping moves (auto-swapped in low-impact mode)',
    steps: [
      { ex: 'jumping-jack', sets: 3, secs: 30, rest: 20 },
      { ex: 'high-knees', sets: 3, secs: 30, rest: 20 },
      { ex: 'burpee', sets: 3, reps: 6, rest: 30 },
      { ex: 'climber-slow', sets: 3, secs: 30, rest: 20 },
    ],
  },
  {
    id: 'flex-a',
    name: 'Stretch & breathe',
    goal: 'flex',
    icon: '🧘🏾‍♀️',
    desc: 'Gentle full-body stretch, great before bed or on rest days',
    steps: [
      { ex: 'cat-cow', sets: 1, secs: 60, rest: 5 },
      { ex: 'child', sets: 1, secs: 60, rest: 5 },
      { ex: 'hamstring', sets: 1, secs: 45, rest: 5 },
      { ex: 'hip-flexor', sets: 1, secs: 45, rest: 5 },
      { ex: 'butterfly', sets: 1, secs: 60, rest: 5 },
      { ex: 'chest-open', sets: 1, secs: 45, rest: 0 },
    ],
  },
  {
    id: 'martial-a',
    name: 'Fighter conditioning',
    goal: 'martial',
    icon: '🥋',
    desc: 'Shadow boxing, kicks, knees, stance holds',
    steps: [
      { ex: 'shadow-box', sets: 3, secs: 60, rest: 30 },
      { ex: 'front-kick', sets: 2, reps: 12, rest: 30 },
      { ex: 'horse', sets: 3, secs: 30, rest: 30 },
      { ex: 'knee-strike', sets: 2, reps: 15, rest: 30 },
      { ex: 'sprawl-slow', sets: 2, reps: 8, rest: 40 },
    ],
  },
]

export const workoutById = (id: string) => WORKOUTS.find((w) => w.id === id)

/** Swap high-impact moves for their low-impact versions. */
export function lowImpact(steps: Step[]): Step[] {
  return steps.map((s) => {
    const e = EXERCISES[s.ex]
    if (e.impact === 'high' && e.lowAlt) {
      const alt = EXERCISES[e.lowAlt]
      // keep the same effort: reps → time if the swap is timed
      if (alt.type === 'time' && !s.secs) return { ...s, ex: alt.id, secs: 30, reps: undefined }
      if (alt.type === 'reps' && !s.reps) return { ...s, ex: alt.id, reps: 10, secs: undefined }
      return { ...s, ex: alt.id }
    }
    return s
  })
}

/** Scale reps/time (programme progression) and optionally add a set. */
export function scaleSteps(steps: Step[], factor: number, extraSet = 0): Step[] {
  return steps.map((s) => ({
    ...s,
    sets: s.sets > 1 ? s.sets + extraSet : s.sets,
    reps: s.reps ? Math.max(1, Math.round(s.reps * factor)) : undefined,
    secs: s.secs ? Math.max(10, Math.round((s.secs * factor) / 5) * 5) : undefined,
  }))
}

export function estMinutes(steps: Step[]): number {
  let secs = 0
  for (const s of steps) {
    const e = EXERCISES[s.ex]
    const work = s.secs ?? (s.reps ?? 10) * 3
    secs += s.sets * (work * (e.perSide ? 2 : 1) + s.rest)
  }
  return Math.max(1, Math.round(secs / 60))
}
