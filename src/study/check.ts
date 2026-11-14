import type { InputQ } from './types'

/** Normalise typed maths: spaces, unicode minus/×, superscripts, leading "x=". */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/×/g, '*')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .replace(/^r(?=[\d.])/, '') // "R1300" -> "1300"
    .replace(/^[a-z]=/, '') // "x=5" -> "5"
}

/** "3/4", "1 1/2", "-2.5", "1,5" -> number. NaN if not a number. */
export function parseNumber(raw: string): number {
  const s = raw.trim().replace(/[−–]/g, '-').replace(/,/g, '.').replace(/^[a-zA-Z]\s*=\s*/, '').replace(/^R\s*/i, '')
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) {
    const v = Number(mixed[2]) + Number(mixed[3]) / Number(mixed[4])
    return mixed[1] ? -v : v
  }
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/)
  if (frac) return Number(frac[1]) / Number(frac[2])
  if (!/^-?\d*\.?\d+$/.test(s)) return NaN
  return Number(s)
}

export function checkInput(q: InputQ, given: string): boolean {
  if (!given.trim()) return false
  if (q.numeric) {
    const v = parseNumber(given)
    if (Number.isNaN(v)) return false
    const tol = q.tolerance ?? 1e-9
    return q.answers.some((a) => Math.abs(parseNumber(a) - v) <= tol)
  }
  const g = normalise(given)
  return q.answers.some((a) => normalise(a) === g)
}
