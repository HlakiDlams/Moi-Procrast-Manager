import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { endPlay, extendPlay, markPlayFinished, usePlayState } from '../lib/play'
import { startStarter } from '../lib/focus'
import { db, localDay } from '../lib/db'
import { nextBlock } from '../lib/blocks'
import { chime } from '../lib/sound'

/** Full-screen play timer. When it ends, it nudges you straight back into a 2-minute start. */
export default function PlayOverlay() {
  const st = usePlayState()
  const today = localDay()
  const blocks = useLiveQuery(() => db.blocks.where('day').equals(today).toArray(), [today]) ?? []
  const [now, setNow] = useState(() => Date.now())
  const [xp, setXp] = useState<number | null>(null)
  const running = !!st && !st.finished

  useEffect(() => {
    if (!running || !st) return
    const id = setInterval(() => {
      if (Date.now() >= st.endAt) {
        clearInterval(id)
        chime()
        setTimeout(chime, 700)
        navigator.vibrate?.([300, 150, 300])
        markPlayFinished()
      } else setNow(Date.now())
    }, 500)
    return () => clearInterval(id)
  }, [running, st])

  if (!st) return null
  // "now" is refreshed by the timer; never earlier than the start, so a fresh session shows the right time
  const left = Math.max(0, st.endAt - Math.max(now, st.startedAt))
  const mm = Math.floor(left / 60_000)
  const ss = Math.floor((left % 60_000) / 1000)
  const next = nextBlock(blocks)

  async function backToIt() {
    const got = await endPlay()
    setXp(got)
    await startStarter(next?.title ?? 'Back to it', next?.id)
  }

  return (
    <div className="focus-overlay play-overlay" role="dialog" aria-label="Play timer">
      <div className="focus-top">
        <span className="pill">Play time</span>
        {!st.finished && (
          <button className="btn btn-ghost" onClick={() => endPlay().then(setXp)}>
            End early
          </button>
        )}
      </div>
      <h2 className="focus-title">{st.name}</h2>
      {!st.finished ? (
        <>
          <div className="focus-time">
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </div>
          <p className="muted center">You earned this. You'll get a nudge when time's up.</p>
        </>
      ) : (
        <div className="focus-actions">
          <h1 className="center">Break's up</h1>
          <p className="center muted">Come back on time for +3 XP.{next ? ` Next up: ${next.title}.` : ''}</p>
          <button className="btn btn-primary btn-xl" onClick={backToIt}>
            Back to it: just 2 minutes
          </button>
          <div className="btn-row center-row">
            <button className="btn" onClick={() => extendPlay(5)}>
              +5 min
            </button>
            <button className="btn btn-ghost" onClick={() => endPlay().then(setXp)}>
              I'm done
            </button>
          </div>
        </div>
      )}
      {xp ? <p className="xp-pop">+{xp} XP</p> : null}
    </div>
  )
}
