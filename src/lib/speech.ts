/**
 * Text-to-speech using the phone's own voices (works offline if the voice is installed).
 * Falls back to the closest voice, or the default one, if the language isn't installed.
 */
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  const base = lang.split('-')[0].toLowerCase()
  return voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ?? voices.find((v) => v.lang.toLowerCase().startsWith(base))
}

export function hasVoice(lang: string): boolean {
  return canSpeak && !!pickVoice(lang)
}

export function speak(text: string, lang = 'en-ZA', rate = 0.9) {
  if (!canSpeak) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  const v = pickVoice(lang)
  if (v) u.voice = v
  speechSynthesis.speak(u)
}

// some browsers load voices async
if (canSpeak) speechSynthesis.getVoices()
