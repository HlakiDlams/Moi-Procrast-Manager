import { Check, Play } from '../icons'
import { useEffect, useRef, useState } from 'react'
import { completePhase, msLeft, pause, resume, startBreak, startWork, stop, useFocus, type FocusState } from '../lib/focus'
import { setBlockDone } from '../lib/blocks'
import { db } from '../lib/db'
import { useSettings } from '../lib/settings'
import { chime } from '../lib/sound'

function useTick(ms: number, on: boolean) {
  const [, set] = useState(0)
  useEffect(() => {
    if (!on) return
    const id = setInterval(() => set((n) => n + 1), ms)
    return () => clearInterval(id)
  }, [ms, on])
}

/** Keeps the screen on while the timer runs (where supported). */
function useWakeLock(on: boolean) {
  const lock = useRef<WakeLockSentinel | null>(null)
  useEffect(() => {
    if (!on || !('wakeLock' in navigator)) return
    let cancelled = false
    const get = () =>
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          if (cancelled) l.release()
          else lock.current = l
        })
        .catch(() => {})
    get()
    const onVis = () => document.visibilityState === 'visible' && get()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVis)
      lock.current?.release().catch(() => {})
      lock.current = null
    }
  }, [on])
}

const LABEL = { starter: 'Just 2 minutes', work: 'Focus', break: 'Break' }

function Ring({ pct, children }: { pct: number; children: React.ReactNode }) {
  const r = 108
  const c = 2 * Math.PI * r
  return (
    <div className="ring">
      <svg viewBox="0 0 240 240" aria-hidden>
        <circle cx="120" cy="120" r={r} className="ring-track" />
        <circle cx="120" cy="120" r={r} className="ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="ring-inner">{children}</div>
    </div>
  )
}

export default function FocusOverlay() {
  const f = useFocus()
  const s = useSettings()
  const running = !!f && !f.finished && f.pausedLeft === undefined
  useTick(250, running)
  useWakeLock(running && s.keepAwake)
  const [earned, setEarned] = useState<number | null>(null)

  const left = f ? msLeft(f) : 0
  useEffect(() => {
    if (f && !f.finished && f.pausedLeft === undefined && left <= 0) {
      completePhase().then((xp) => {
        if (document.visibilityState === 'visible') chime()
        navigator.vibrate?.([200, 100, 200])
        setEarned(xp)
      })
    }
  }, [f, left])

  if (!f) return null

  const total = f.length * 60_000
  const pct = f.finished ? 1 : 1 - left / total
  const mm = Math.floor(left / 60_000)
  const ss = Math.floor((left % 60_000) / 1000)

  async function markDone(st: FocusState) {
    if (st.blockId !== undefined) {
      const b = await db.blocks.get(st.blockId)
      if (b && b.status === 'planned') await setBlockDone(b, true)
    }
    await stop()
  }

  return (
    <div className={'focus-overlay phase-' + f.phase} role="dialog" aria-label="Focus timer">
      <div className="focus-top">
        <span className="pill">
          {LABEL[f.phase]}
          {f.rounds > 0 && ` · ${f.rounds} done`}
        </span>
        <button className="btn btn-ghost" onClick={() => stop()}>
          Stop
        </button>
      </div>

      <h2 className="focus-title">{f.title}</h2>

      <Ring pct={pct}>
        {f.finished ? (
          <div className="focus-done">
            <Check size={64} strokeWidth={1.75} />
          </div>
        ) : (
          <div className="focus-time">
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </div>
        )}
        {f.pausedLeft !== undefined && <div className="muted small">paused</div>}
      </Ring>

      {!f.finished ? (
        <div className="focus-actions">
          {f.pausedLeft !== undefined ? (
            <button className="btn btn-primary btn-xl" onClick={() => resume()}>
              <Play size={16} fill="currentColor" /> Resume
            </button>
          ) : (
            <button className="btn btn-xl" onClick={() => pause()}>
              Pause
            </button>
          )}
          {f.phase === 'starter' && <p className="muted small center">Only 2 minutes. You can stop after that, promise.</p>}
          {f.phase === 'break' && <p className="muted small center">Stand up, stretch, drink water</p>}
        </div>
      ) : (
        <div className="focus-actions">
          {earned ? <p className="xp-pop">+{earned} XP</p> : null}
          {f.phase === 'starter' && (
            <>
              <p className="center">You started! Keep the momentum?</p>
              <button className="btn btn-primary btn-xl" onClick={() => startWork()}>
                Keep going ({s.pomodoroWork} min)
              </button>
            </>
          )}
          {f.phase === 'work' && <p className="center small muted">That Pomodoro earned you play time. Check the Play tab.</p>}
          {f.phase === 'work' && (
            <button className="btn btn-primary btn-xl" onClick={() => startBreak()}>
              Take a {s.pomodoroBreak}-min break
            </button>
          )}
          {f.phase === 'break' && (
            <button className="btn btn-primary btn-xl" onClick={() => startWork()}>
              Another round
            </button>
          )}
          <div className="btn-row center-row">
            {f.blockId !== undefined && (
              <button className="btn" onClick={() => markDone(f)}>
                Task done
              </button>
            )}
            <button className="btn btn-ghost" onClick={() => stop()}>
              Stop for now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
