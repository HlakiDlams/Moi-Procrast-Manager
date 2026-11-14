import { CloudFog, Moon, Sun, type LucideIcon } from '../icons'
import { createContext, useContext, type CSSProperties } from 'react'
import type { TabId } from '../tabs'
import { buttonSafe, contrast, ensureContrast, mix } from './color'

/**
 * Themes are 5-colour palettes. Every colour in the app (tabs, subjects, courses, block types)
 * comes from the palette, and each theme works in dark, gray and light mode.
 * Colours are nudged automatically so text and buttons stay readable in every mode.
 */
export interface Theme {
  id: string
  name: string
  /** most important colour first */
  palette: [string, string, string, string, string]
}

export type Mode = 'dark' | 'gray' | 'light'

export const THEMES: Theme[] = [
  { id: 'rose', name: 'Rose Petal', palette: ['#C9233F', '#0D5157', '#A0163A', '#87173A', '#800F1F'] },
  { id: 'fiery-ocean', name: 'Fiery Ocean', palette: ['#C1121F', '#669BBC', '#003049', '#780000', '#4E3215'] },
  { id: 'summer', name: 'Summer Fun', palette: ['#0899A8', '#F2850E', '#B8861B', '#1B6B7F', '#022F40'] },
  { id: 'olive', name: 'Olive Garden', palette: ['#BC6C25', '#606C38', '#B0703A', '#3F3A17', '#283618'] },
  { id: 'meadow', name: 'Meadow', palette: ['#3A8A6E', '#5B8A3A', '#2A9D96', '#0B6E8A', '#1A4A62'] },
  { id: 'black-gold', name: 'Black & Gold', palette: ['#FCA311', '#14213D', '#E5E5E5', '#3A3A3A', '#0A0A0A'] },
  { id: 'purple-rain', name: 'Purple Rain', palette: ['#9B1D9B', '#CC0066', '#5B1E94', '#1F3EA0', '#0093A8'] },
  { id: 'daybreak', name: 'Daybreak', palette: ['#E8860F', '#463A72', '#F0B02A', '#1D2380', '#E05A00'] },
  { id: 'vintage', name: 'Vintage Charm', palette: ['#00776E', '#C40C0C', '#6A9A8C', '#8B4513', '#0D2526'] },
  { id: 'dreamy', name: 'Dreamy Hues', palette: ['#A06A72', '#2E3A6A', '#8A5A6E', '#545060', '#333333'] },
]

export const MODES: { id: Mode; label: string; Icon: LucideIcon }[] = [
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'gray', label: 'Gray', Icon: CloudFog },
  { id: 'light', label: 'Light', Icon: Sun },
]

/** Old theme ids (before palettes) → closest new theme. */
const LEGACY: Record<string, string> = { pink: 'rose', purple: 'purple-rain', blue: 'fiery-ocean', mint: 'meadow', sunset: 'daybreak', red: 'fiery-ocean' }

export const themeById = (id: string) => THEMES.find((t) => t.id === (LEGACY[id] ?? id)) ?? THEMES[0]

/** Which palette colour each tab uses. */
const TAB_INDEX: Record<TabId, number> = { today: 0, study: 1, planner: 2, selfcare: 3, play: 4, exercise: 1, homework: 2, profile: 0, alarms: 0, settings: 3 }

const BASE: Record<Mode, { bg: string; card: string; card2: string; line: string; text: string; muted: string; success: string; warn: string; danger: string }> = {
  dark: { bg: '#111113', card: '#1B1B1E', card2: '#25252A', line: '#323238', text: '#F4F2EF', muted: '#A7A3AB', success: '#6BD9A0', warn: '#F2C14E', danger: '#FF6170' },
  gray: { bg: '#38393D', card: '#444549', card2: '#4F5055', line: '#5C5D63', text: '#F6F6F6', muted: '#C9C9CE', success: '#7BE3AE', warn: '#F5CC66', danger: '#FF7A86' },
  light: { bg: '#F6F3EE', card: '#FFFFFF', card2: '#EEE9E2', line: '#DCD5CB', text: '#1D1A17', muted: '#68625B', success: '#1E7F4C', warn: '#8A6100', danger: '#B8202F' },
}

export interface ResolvedTheme {
  theme: Theme
  mode: Mode
  bg: string
  /** palette colours adjusted to be visible as fills/borders on this background */
  fills: string[]
  /** palette colours adjusted to be readable as text */
  inks: string[]
  /** readable text colour on top of each fill */
  ons: string[]
  rootVars: Record<string, string>
  /** CSS vars for palette colour i (accent, readable accent text, text on accent) */
  accentVars: (i: number) => CSSProperties
  tabVars: (tab: TabId) => CSSProperties
  tabColor: (tab: TabId) => string
}

export function resolveTheme(id: string, mode: Mode): ResolvedTheme {
  const theme = themeById(id)
  const b = BASE[mode] ?? BASE.dark
  const p0 = theme.palette[0]
  // a whisper of the main colour in the surfaces so each theme feels like its own room
  const tint = mode === 'light' ? 0.035 : 0.05
  const bg = mix(b.bg, p0, tint)
  const card = mix(b.card, p0, tint * 0.8)
  const card2 = mix(b.card2, p0, tint)
  const line = mix(b.line, p0, tint * 1.5)
  const minBg = mode === 'light' ? 2.2 : 2.6
  const safe = theme.palette.map((c) => buttonSafe(ensureContrast(c, bg, minBg), bg, minBg))
  const fills = safe.map((x) => x.fill)
  const ons = safe.map((x) => x.on)
  const inks = theme.palette.map((c) => ensureContrast(c, card, 4.5))
  const soft = mode === 'light' ? ensureContrast(mix(p0, '#000000', 0.25), card, 5) : ensureContrast(mix(p0, '#FFFFFF', 0.65), card, 7)
  const accentVars = (i: number): CSSProperties => {
    const k = ((i % 5) + 5) % 5
    return { '--accent': fills[k], '--accent-ink': inks[k], '--on-accent': ons[k] } as CSSProperties
  }
  const rootVars: Record<string, string> = {
    '--bg': bg,
    '--card': card,
    '--card-2': card2,
    '--line': line,
    '--text': b.text,
    '--muted': ensureContrast(b.muted, card, 4.5),
    '--soft': soft,
    '--success': b.success,
    '--warn': b.warn,
    '--danger': b.danger,
    '--nav-bg': mode === 'light' ? 'rgba(255,255,255,0.92)' : `color-mix(in srgb, ${mix(b.bg, '#000000', 0.15)} 92%, transparent)`,
    '--code-bg': mode === 'light' ? '#F2EEE8' : mix(bg, '#000000', 0.45),
    '--shadow': mode === 'light' ? 'rgba(60, 40, 20, 0.12)' : 'rgba(0, 0, 0, 0.5)',
    ...Object.fromEntries(fills.map((c, i) => [`--c${i + 1}`, c])),
    ...(accentVars(0) as Record<string, string>),
  }
  return {
    theme,
    mode,
    bg,
    fills,
    inks,
    ons,
    rootVars,
    accentVars,
    tabVars: (tab) => accentVars(TAB_INDEX[tab] ?? 0),
    tabColor: (tab) => fills[TAB_INDEX[tab] ?? 0],
  }
}

/** Put a resolved theme on the page root (and remember it for the next launch). */
export function applyTheme(r: ResolvedTheme) {
  const root = document.documentElement
  for (const [k, v] of Object.entries(r.rootVars)) root.style.setProperty(k, v)
  root.style.colorScheme = r.mode === 'light' ? 'light' : 'dark'
  root.dataset.mode = r.mode
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', r.bg)
  try {
    localStorage.setItem('hp-theme', r.theme.id)
    localStorage.setItem('hp-mode', r.mode)
  } catch {
    /* ignore */
  }
}

/** Before React renders, so there's no flash of the wrong colours. */
export function applySavedTheme() {
  let id = 'rose'
  let mode: Mode = 'dark'
  try {
    id = localStorage.getItem('hp-theme') || id
    mode = (localStorage.getItem('hp-mode') as Mode) || mode
  } catch {
    /* ignore */
  }
  applyTheme(resolveTheme(id, mode))
}

export const ThemeContext = createContext<ResolvedTheme>(resolveTheme('rose', 'dark'))
export const useTheme = () => useContext(ThemeContext)

/** Colour for the i-th item of a list (subjects, courses…): cycles through the palette. */
export const paletteVar = (i: number) => `var(--c${(((i % 5) + 5) % 5) + 1})`

export { contrast }
