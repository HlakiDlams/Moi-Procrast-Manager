/** Pictographic emoji (plus joiners/variation selectors). Chess pieces, arrows and maths symbols are left alone. */
const EMOJI = /(?:\p{Extended_Pictographic}(?<![\u2654-\u265F\u00A9\u00AE\u2122\u2190-\u21FF])|\u200D|\uFE0F|\u20E3)/gu

/** Removes emoji from text saved by older versions of the app (titles, names) and tidies the spaces left behind. */
export function stripEmoji(s: string): string {
  return s.replace(EMOJI, '').replace(/\s{2,}/g, ' ').trim()
}
