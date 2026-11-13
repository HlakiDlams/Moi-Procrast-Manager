import { useLiveQuery } from 'dexie-react-hooks'
import { db, localDay } from '../lib/db'
import { cycleInfo } from '../lib/cycle'
import { useSettings } from '../lib/settings'
import { useProfile } from '../lib/profile'
import type { TabId } from '../tabs'

/** One-line cycle status on Today (only when the period tracker is on). Tap → Self-Care. */
export default function CycleMini({ go }: { go: (t: TabId) => void }) {
  const s = useSettings()
  const p = useProfile()
  const periods = useLiveQuery(() => db.periods.toArray(), []) ?? []
  const on = s.trackPeriods === 'on' || (s.trackPeriods === 'auto' && p.gender === 'Female')
  if (!on) return null
  const c = cycleInfo(periods, localDay())
  let text = 'Tap to log your period'
  if (c.onPeriod) text = `Period · day ${c.periodDay}`
  else if (c.lateBy > 0) text = `${c.lateBy} day${c.lateBy === 1 ? '' : 's'} later than predicted`
  else if (c.daysUntilNext !== undefined) text = c.daysUntilNext === 0 ? 'Period may start today' : `Next period in ~${c.daysUntilNext} days`
  return (
    <button className="card link-card" onClick={() => go('selfcare')}>
      <span>🌸 {text}</span>
      <span className="muted small">Cycle ›</span>
    </button>
  )
}
