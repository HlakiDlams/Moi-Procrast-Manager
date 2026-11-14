import { ChevronRight, Play, Trophy, Wind } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { EXERCISES, WARMUP, type Step } from './library'
import { db, localDay } from '../lib/db'
import { addXp } from '../lib/xp'
import { chime } from '../lib/sound'

interface Item {
  step: Step
  set: number
  side?: 'left' | 'right'
  warmup: boolean
}

function beep(freq = 880) {
  try {
    const c = new AudioContext()
    const o = c.createOscillator()
    const g = c.createGain()
    o.frequency.value = freq
    g.gain.setValueAtTime(0.2, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
    o.connect(g).connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.16)
    setTimeout(() => c.close(), 400)
  } catch {
    /* no audio */
  }
}

/** Full-screen guided workout: warm-up → sets with timers/reps → rest countdowns → summary. */
export default function WorkoutPlayer({
  workoutId,
  name,
  steps,
  programmeWeek,
  vars,
  onClose,
}: {
  workoutId: string
  name: string
  steps: Step[]
  programmeWeek?: number
  vars: React.CSSProperties
  onClose: () => void
}) {
  const items = useMemo(() => {
    const out: Item[] = []
    const add = (list: Step[], warmup: boolean) => {
      for (const st of list) {
        const e = EXERCISES[st.ex]
        for (let i = 1; i <= st.sets; i++) {
          if (e.type === 'time' && e.perSide) {
            out.push({ step: st, set: i, side: 'left', warmup }, { step: st, set: i, side: 'right', warmup })
          } else out.push({ step: st, set: i, warmup })
        }
      }
    }
    add(WARMUP, true)
    add(steps, false)
    return out
  }, [steps])

  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'work' | 'rest' | 'done'>('work')
  const [endAt, setEndAt] = useState<number | null>(null) // running timer
  const [paused, setPaused] = useState<number | null>(null) // ms left when paused
  const [reps, setReps] = useState<number | null>(null)
  const [, tick] = useState(0)
  const [log, setLogState] = useState<{ ex: string; reps?: number; secs?: number }[]>([])
  // ref copy so finishing on the last set saves it too (state updates are async)
  const logRef = useRef<typeof log>([])
  const setLog = (f: (l: typeof log) => typeof log) => {
    logRef.current = f(logRef.current)
    setLogState(logRef.current)
  }
  const startedAt = useRef(Date.now())
  const lastBeep = useRef(-1)
  const [saved, setSaved] = useState<number | null>(null)

  const item = items[idx]
  const ex = item ? EXERCISES[item.step.ex] : undefined
  const next = items[idx + 1]
  const left = endAt ? Math.max(0, endAt - Date.now()) : (paused ?? 0)
  const secsLeft = Math.ceil(left / 1000)

  // keep the screen on
  useEffect(() => {
    let lock: WakeLockSentinel | null = null
    navigator.wakeLock
      ?.request('screen')
      .then((l) => (lock = l))
      .catch(() => {})
    return () => {
      lock?.release().catch(() => {})
    }
  }, [])

  // when a timer runs out: finish the set, or end the rest
  const onTimeUp = useRef<() => void>(() => {})
  useLayoutEffect(() => {
    onTimeUp.current = () => {
      setEndAt(null)
      lastBeep.current = -1
      if (phase === 'work') finishSet()
      else goNext()
    }
  })

  // ticking + 3-2-1 beeps (the clock is the "external system" here)
  useEffect(() => {
    if (!endAt) return
    const id = setInterval(() => {
      const ms = endAt - Date.now()
      const sec = Math.ceil(ms / 1000)
      if (sec <= 3 && sec > 0 && lastBeep.current !== sec) {
        lastBeep.current = sec
        beep(660)
      }
      if (ms <= 0) {
        clearInterval(id)
        onTimeUp.current()
      } else tick((n) => n + 1)
    }, 200)
    return () => clearInterval(id)
  }, [endAt])

  function startTimer(secs: number) {
    setPaused(null)
    setEndAt(Date.now() + secs * 1000)
  }

  function finishSet() {
    if (!item || !ex) return
    chime()
    navigator.vibrate?.(120)
    if (!item.warmup) setLog((l) => [...l, ex.type === 'time' ? { ex: ex.id, secs: item.step.secs } : { ex: ex.id, reps: reps ?? item.step.reps }])
    setReps(null)
    if (idx + 1 >= items.length) return finishWorkout(true)
    if (item.step.rest > 0) {
      setPhase('rest')
      startTimer(item.step.rest)
    } else goNext()
  }

  function goNext() {
    beep(990)
    const n = idx + 1
    if (n >= items.length) return finishWorkout(true)
    setIdx(n)
    setPhase('work')
    const e = EXERCISES[items[n].step.ex]
    // timed sets start by themselves after a rest; rep sets wait for you
    if (e.type === 'time') startTimer(items[n].step.secs ?? 30)
  }

  async function finishWorkout(completed: boolean) {
    setEndAt(null)
    setPhase('done')
    const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60_000))
    const sets = logRef.current
    if (!completed && sets.length === 0) {
      setSaved(0)
      return
    }
    const now = new Date()
    await db.workouts.add({
      day: localDay(now),
      at: now.toISOString(),
      workoutId,
      name,
      minutes,
      sets,
      programmeWeek,
      completed,
    })
    const xp = completed ? 15 : 5
    await addXp(xp, 'exercise', `${completed ? 'Workout' : 'Part workout'}: ${name}`)
    setSaved(xp)
  }

  const total = items.length
  const pct = phase === 'done' ? 100 : Math.round((idx / total) * 100)

  return (
    <div className="player workout" style={vars} role="dialog" aria-label={name}>
      <div className="player-top">
        <button
          className="icon-btn subtle"
          onClick={() => {
            if (phase === 'done') return onClose()
            if (confirm('Stop the workout? What you did so far will be saved.')) finishWorkout(false)
          }}
          aria-label="Stop"
        ></button>
        <div className="bar thick player-bar">
          <div className="bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="muted small">
          {Math.min(idx + 1, total)}/{total}
        </span>
      </div>

      {phase !== 'done' && item && ex && (
        <div className="player-body center wk-body">
          <div className="pill">{item.warmup ? 'Warm-up' : `Set ${item.set} of ${item.step.sets}`}</div>
          {phase === 'work' ? (
            <>
              <h1>{ex.name}</h1>
              {item.side && <div className="pill">{item.side === 'left' ? 'Left side' : 'Right side'}</div>}
              {ex.type === 'time' ? (
                <>
                  <div className="wk-timer">{endAt || paused !== null ? secsLeft : item.step.secs}s</div>
                  {!endAt && paused === null && (
                    <button className="btn btn-primary btn-xl" onClick={() => startTimer(item.step.secs ?? 30)}>
                      <Play size={16} fill="currentColor" /> Start
                    </button>
                  )}
                  {endAt && (
                    <button
                      className="btn btn-xl"
                      onClick={() => {
                        setPaused(left)
                        setEndAt(null)
                      }}
                    >
                      Pause
                    </button>
                  )}
                  {!endAt && paused !== null && (
                    <button className="btn btn-primary btn-xl" onClick={() => startTimer(paused / 1000)}>
                      <Play size={16} fill="currentColor" /> Resume
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="wk-reps">
                    <button className="icon-btn" onClick={() => setReps(Math.max(0, (reps ?? item.step.reps ?? 10) - 1))} aria-label="One less">
                      −
                    </button>
                    <span className="wk-timer">{reps ?? item.step.reps}</span>
                    <button className="icon-btn" onClick={() => setReps((reps ?? item.step.reps ?? 10) + 1)} aria-label="One more">
                      +
                    </button>
                  </div>
                  <div className="muted small">reps{ex.perSide ? ' each side' : ''}: adjust to what you actually did</div>
                  <button className="btn btn-primary btn-xl" onClick={finishSet}>
                    Done
                  </button>
                </>
              )}
              <ul className="wk-cues">
                {ex.cues.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="wk-icon">
                <Wind size={56} strokeWidth={1.5} />
              </div>
              <h1>Rest</h1>
              <div className="wk-timer">{secsLeft}s</div>
              <div className="btn-row center-row">
                <button className="btn" onClick={() => setEndAt((e) => (e ?? Date.now()) + 15_000)}>
                  +15 s
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEndAt(null)
                    goNext()
                  }}
                >
                  Skip <ChevronRight size={16} />
                </button>
              </div>
              {next && (
                <p className="muted">
                  Next: {EXERCISES[next.step.ex].name}
                  {next.step.reps ? ` × ${next.step.reps}` : next.step.secs ? ` · ${next.step.secs}s` : ''}
                </p>
              )}
              <p className="small soft-note">Breathe in through your nose, out slowly through your mouth. Sip some water</p>
            </>
          )}
          <p className="field-hint">Stop straight away if you feel wheezy, dizzy, have chest pain or a nosebleed.</p>
        </div>
      )}

      {phase === 'done' && (
        <div className="player-body center">
          <div className="done-emoji">{saved ? <Trophy size={64} strokeWidth={1.5} /> : null}</div>
          <h1>{saved === 15 ? 'Workout done!' : saved ? 'Nice effort!' : 'Stopped'}</h1>
          {saved ? (
            <>
              <p className="muted">
                {log.length} sets · {Math.max(1, Math.round((Date.now() - startedAt.current) / 60_000))} min
              </p>
              <p className="xp-pop">+{saved} XP</p>
            </>
          ) : (
            <p className="muted">Nothing logged. Even 2 minutes counts next time</p>
          )}
          <p className="small muted">Cool down: a slow walk and a few deep breaths. Drink water.</p>
          <button className="btn btn-primary btn-xl" onClick={onClose}>
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
