/** Tiny colour helpers: mixing, WCAG contrast, and nudging a colour until it's readable. */

export type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase()
}

/** Mix `a` towards `b` by t (0 = a, 1 = b). */
export function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a)
  const y = hexToRgb(b)
  return rgbToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t])
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Nudge `fg` lighter (on dark bg) or darker (on light bg) until it reaches `ratio` against `bg`. */
export function ensureContrast(fg: string, bg: string, ratio: number): string {
  if (contrast(fg, bg) >= ratio) return fg
  const target = luminance(bg) < 0.4 ? '#FFFFFF' : '#000000'
  for (let t = 0.05; t <= 1; t += 0.05) {
    const c = mix(fg, target, t)
    if (contrast(c, bg) >= ratio) return c
  }
  return target
}

/** Readable text colour to put ON a coloured fill. */
export function onColor(fill: string): string {
  return contrast(fill, '#FFFFFF') >= contrast(fill, '#141414') ? '#FFFFFF' : '#141414'
}

/**
 * Make a fill safe for button text: nudge it lighter (for dark text) or darker (for white text),
 * whichever needs the smaller change, while keeping it visible against the background.
 */
export function buttonSafe(fill: string, bg: string, minBg: number): { fill: string; on: string } {
  const tryDir = (target: string, text: string) => {
    for (let t = 0; t <= 1.0001; t += 0.04) {
      const c = mix(fill, target, t)
      if (contrast(text, c) >= 4.5 && contrast(c, bg) >= minBg) return { fill: c, on: text, t }
    }
    return null
  }
  const a = tryDir('#FFFFFF', '#141414')
  const b = tryDir('#000000', '#FFFFFF')
  const best = a && b ? (a.t <= b.t ? a : b) : (a ?? b)
  return best ? { fill: best.fill, on: best.on } : { fill, on: onColor(fill) }
}
