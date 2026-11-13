import type { TabId } from '../tabs'

/**
 * Colour themes. Every theme keeps the near-black background and gives each tab
 * its own highlight colour, like the original pink design.
 */
export interface Theme {
  id: string
  name: string
  emoji: string
  /** soft text colour (headings) and muted text colour */
  soft: string
  muted: string
  accents: Record<TabId, string>
}

const shared = { homework: '#FFD166' }

export const THEMES: Theme[] = [
  {
    id: 'pink',
    name: 'Pink',
    emoji: '🌸',
    soft: '#FFD6E8',
    muted: '#B39AA8',
    accents: { today: '#FF2E93', study: '#FF8AC8', planner: '#D6249F', selfcare: '#FFB3C7', play: '#C77DFF', exercise: '#FF3B5C', profile: '#FF5FA2', alarms: '#FF2E93', settings: '#FFB3D9', ...shared },
  },
  {
    id: 'purple',
    name: 'Purple',
    emoji: '🔮',
    soft: '#E6DAFF',
    muted: '#A99BC0',
    accents: { today: '#9B5CFF', study: '#C9A2FF', planner: '#7B2FF7', selfcare: '#E2C6FF', play: '#FF8AC8', exercise: '#FF5C8A', profile: '#B07CFF', alarms: '#9B5CFF', settings: '#D7C2FF', ...shared },
  },
  {
    id: 'blue',
    name: 'Blue',
    emoji: '🌊',
    soft: '#D6E8FF',
    muted: '#93A6BF',
    accents: { today: '#2F8CFF', study: '#7DB9FF', planner: '#1E5BD8', selfcare: '#A8D5FF', play: '#8C7DFF', exercise: '#FF5C6C', profile: '#5AA2FF', alarms: '#2F8CFF', settings: '#A8C8FF', ...shared },
  },
  {
    id: 'mint',
    name: 'Mint',
    emoji: '🌿',
    soft: '#D4F7EA',
    muted: '#93B8AC',
    accents: { today: '#2ED3A0', study: '#7FE7C4', planner: '#16A37E', selfcare: '#B5F2DD', play: '#7DB9FF', exercise: '#FF6B6B', profile: '#52E0B4', alarms: '#2ED3A0', settings: '#A8EBD3', ...shared },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    soft: '#FFE3D1',
    muted: '#C0A493',
    accents: { today: '#FF7A2E', study: '#FFB37D', planner: '#E0532B', selfcare: '#FFD2B3', play: '#C77DFF', exercise: '#FF3B5C', profile: '#FF9A5C', alarms: '#FF7A2E', settings: '#FFC9A6', ...shared },
  },
  {
    id: 'red',
    name: 'Red',
    emoji: '🍒',
    soft: '#FFD9D9',
    muted: '#BF9C9C',
    accents: { today: '#FF3B3B', study: '#FF8A8A', planner: '#C81E3A', selfcare: '#FFB8B8', play: '#C77DFF', exercise: '#FF6B3B', profile: '#FF5C5C', alarms: '#FF3B3B', settings: '#FFB3B3', ...shared },
  },
]

export const themeById = (id: string) => THEMES.find((t) => t.id === id) ?? THEMES[0]

/** Put the theme's text colours on the page root. Tab accents are applied per screen. */
export function applyTheme(t: Theme) {
  const r = document.documentElement.style
  r.setProperty('--soft', t.soft)
  r.setProperty('--muted', t.muted)
  r.setProperty('--accent', t.accents.today)
  try {
    localStorage.setItem('hp-theme', t.id)
  } catch {
    /* ignore */
  }
}

/** Before React renders, so there's no pink flash for a blue theme. */
export function applySavedTheme() {
  let id = 'pink'
  try {
    id = localStorage.getItem('hp-theme') || id
  } catch {
    /* ignore */
  }
  applyTheme(themeById(id))
}
