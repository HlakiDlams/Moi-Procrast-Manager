import { Flame } from 'lucide-react'
import type { XpStats } from '../lib/xp'

const LETTER = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** Streak + Mon–Sun fire strip (full fire = active, half fire = forgiven day) + today's XP goal. */
export default function StreakCard({ stats, goal }: { stats: XpStats; goal: number }) {
  const { streakInfo: s, fireWeek } = stats
  const pct = Math.min(100, Math.round((stats.today / Math.max(1, goal)) * 100))
  let note = 'Do anything today to keep it going.'
  if (!s.todayPending) note = 'Today counts.'
  else if (s.atRisk) note = 'You missed yesterday. Do something today or the streak resets.'
  else if (s.count === 0) note = 'Start a streak today. Two minutes is enough.'

  return (
    <section className="card streak-card">
      <div className="streak-top">
        <span className={'streak-fire' + (s.todayPending ? ' dim' : '')}>
          <Flame size={36} fill="currentColor" strokeWidth={1.5} />
        </span>
        <div className="streak-num">
          <span className="stat-num">{s.count}</span>
          <span className="muted small">day streak</span>
        </div>
        <div className="streak-goal">
          <span className="muted small">
            {stats.today}/{goal} XP today
          </span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <div className="fire-week" role="list" aria-label="This week">
        {fireWeek.map((d, i) => (
          <div key={d.day} className={'fire-day ' + d.status + (d.isToday ? ' is-today' : '')} role="listitem" aria-label={`${LETTER[i]}: ${d.status}`}>
            <span className="fire-icon">{d.status === 'active' || d.status === 'mercy' ? <Flame size={20} fill="currentColor" strokeWidth={1.5} /> : null}</span>
            <span className="fire-letter">{LETTER[i]}</span>
          </div>
        ))}
      </div>
      <p className={'small ' + (s.atRisk ? 'warn-text' : 'muted')}>
        {note} <span className="muted">One missed day is forgiven (half flame); two in a row resets.</span>
      </p>
    </section>
  )
}
