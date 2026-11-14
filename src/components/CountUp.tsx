import { useEffect, useRef, useState } from 'react'

/** A number that counts to its new value when it changes (it does not animate on first show). */
export default function CountUp({ value, ms = 600 }: { value: number; ms?: number }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = from.current
    if (start === value) return
    // with reduced motion the count lands in a single step
    const dur = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : ms
    let raf = 0
    const t0 = performance.now()
    const step = (t: number) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1
      const v = Math.round(start + (value - start) * (1 - (1 - k) ** 3))
      from.current = v
      setShown(v)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return <>{shown}</>
}
