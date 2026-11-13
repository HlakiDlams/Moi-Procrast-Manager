import type { XpStats } from '../lib/xp'

const LETTER = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/** Big streak number + Mon–Sun fire strip (🔥 active, half fire = forgiven day). */
export default function StreakCard({ stats }: { stats: XpStats }) {
  const { streakInfo: s, fireWeek } = stats
  let note = 'Earn any XP today to keep the fire going.'
  if (!s.todayPending) note = 'Today counts! 🎉'
  else if (s.atRisk) note = '⚠️ You missed yesterday. Do something today or the fire resets!'
  else if (s.count === 0) note = 'Start a streak today: just 2 minutes counts.'

  return (
    <section className="card streak-card">
      <div className="streak-top">
        <span className={'streak-fire' + (s.todayPending ? ' dim' : '')}>🔥</span>
        <div>
          <div className="stat-num">{s.count}</div>
          <div className="muted small">day streak</div>
        </div>
      </div>
      <div className="fire-week" role="list" aria-label="This week">
        {fireWeek.map((d, i) => (
          <div key={d.day} className={'fire-day ' + d.status + (d.isToday ? ' is-today' : '')} role="listitem" aria-label={`${LETTER[i]}: ${d.status}`}>
            <span className="fire-icon">{d.status === 'active' || d.status === 'mercy' ? '🔥' : d.status === 'missed' ? '·' : ''}</span>
            <span className="fire-letter">{LETTER[i]}</span>
          </div>
        ))}
      </div>
      <p className={'small ' + (s.atRisk ? 'warn-text' : 'muted')}>{note}</p>
      <p className="field-hint">Half fire = a missed day that was forgiven. Miss two days in a row and the streak resets.</p>
    </section>
  )
}
