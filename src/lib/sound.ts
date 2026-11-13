/** Tiny Web Audio sounds, so we don't need audio files (works offline). */
let ctx: AudioContext | null = null

function ac() {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(freq: number, start: number, dur: number, vol = 0.25) {
  const c = ac()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'sine'
  o.frequency.value = freq
  g.gain.setValueAtTime(0, c.currentTime + start)
  g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur)
  o.connect(g).connect(c.destination)
  o.start(c.currentTime + start)
  o.stop(c.currentTime + start + dur + 0.05)
}

/** Soft "ding-ding" for timer ends and reminders. */
export function chime() {
  try {
    tone(880, 0, 0.5)
    tone(1318.5, 0.18, 0.7)
  } catch {
    /* audio not available */
  }
}

/** Repeating alarm sound. Returns a stop function. */
export function startAlarmSound(): () => void {
  let stopped = false
  const ring = () => {
    if (stopped) return
    try {
      tone(988, 0, 0.18, 0.4)
      tone(988, 0.25, 0.18, 0.4)
      tone(1318.5, 0.5, 0.3, 0.4)
    } catch {
      /* ignore */
    }
    navigator.vibrate?.([300, 150, 300])
  }
  ring()
  const id = setInterval(ring, 1500)
  return () => {
    stopped = true
    clearInterval(id)
    navigator.vibrate?.(0)
  }
}

/** Play notes one after another (ear training). */
export function playTones(freqs: number[], each = 0.7) {
  try {
    freqs.forEach((f, i) => tone(f, i * (each + 0.15), each, 0.3))
  } catch {
    /* audio not available */
  }
}
