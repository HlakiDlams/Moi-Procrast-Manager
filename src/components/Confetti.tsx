import { useEffect, useRef } from 'react'

/** One short burst of paper in the theme's five colours. Purely decorative. */
export default function Confetti({ pieces = 44 }: { pieces?: number }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = box.current
    if (!el || !el.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const made: HTMLElement[] = []
    for (let i = 0; i < pieces; i++) {
      const b = document.createElement('i')
      b.style.background = `var(--c${(i % 5) + 1})`
      el.appendChild(b)
      made.push(b)
      const ang = Math.random() * Math.PI * 2
      const d = 90 + Math.random() * 170
      b.animate(
        [
          { opacity: 1, transform: 'translate(-50%, -50%) rotate(0deg)' },
          { opacity: 1, offset: 0.7 },
          { opacity: 0, transform: `translate(${Math.cos(ang) * d}px, ${Math.sin(ang) * d + 90}px) rotate(${Math.random() * 720}deg)` },
        ],
        { duration: 1000 + Math.random() * 600, easing: 'cubic-bezier(0.1, 0.7, 0.3, 1)', fill: 'forwards' },
      )
    }
    return () => made.forEach((b) => b.remove())
  }, [pieces])
  return <div className="confetti" ref={box} aria-hidden="true" />
}
