import { THEMES, MODES, resolveTheme, type Mode } from '../lib/themes'

/** Palette strips (like a colour-palette site) + Dark / Gray / Light switch. */
export default function ThemePicker({ theme, mode, onTheme, onMode }: { theme: string; mode: Mode; onTheme: (id: string) => void; onMode: (m: Mode) => void }) {
  const current = resolveTheme(theme, mode).theme.id
  return (
    <div className="stack-sm">
      <div className="seg seg-3" role="radiogroup" aria-label="Mode">
        {MODES.map((m) => (
          <button key={m.id} type="button" className={mode === m.id ? 'on' : ''} onClick={() => onMode(m.id)} aria-pressed={mode === m.id}>
            <m.Icon size={16} /> {m.label}
          </button>
        ))}
      </div>
      <div className="palette-grid" role="radiogroup" aria-label="Colour theme">
        {THEMES.map((t) => (
          <button key={t.id} type="button" className={'palette-card' + (current === t.id ? ' on' : '')} onClick={() => onTheme(t.id)} aria-pressed={current === t.id}>
            <span className="palette-strip">
              {t.palette.map((c, i) => (
                <i key={i} style={{ background: c }} />
              ))}
            </span>
            <span className="palette-name">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
