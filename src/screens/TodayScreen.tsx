import { useEffect, useState } from 'react'
import { useSettings } from '../lib/settings'
import { useXpStats } from '../lib/xp'
import type { TabId } from '../tabs'
import WeekChart from '../components/WeekChart'

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(id)
  }, [ms])
  return now
}

function greeting(h: number) {
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function TodayScreen({ go }: { go: (t: TabId) => void }) {
  const s = useSettings()
  const stats = useXpStats()
  const now = useNow(30_000)

  const exam = new Date(s.matricStart + 'T09:00:00')
  const msLeft = exam.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86_400_000))
  const weeksLeft = Math.floor(daysLeft / 7)
  const goalPct = Math.min(100, Math.round((stats.today / Math.max(1, s.dailyXpGoal)) * 100))
  const lvlPct = Math.round((stats.level.into / stats.level.need) * 100)

  return (
    <div className="stack">
      <section className="card hero">
        <p className="muted small">
          {now.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} ·{' '}
          {now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <h1>
          {greeting(now.getHours())}, {s.name} 💕
        </h1>
      </section>

      <section className="card countdown">
        <div>
          <div className="big-num">{daysLeft}</div>
          <div className="muted small">days to Matric finals</div>
        </div>
        <div className="countdown-side">
          <div className="pill">{weeksLeft} weeks</div>
          <div className="muted small">
            from {exam.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </section>

      <div className="grid-2">
        <section className="card stat">
          <div className="stat-icon">🔥</div>
          <div className="stat-num">{stats.streak}</div>
          <div className="muted small">day streak</div>
        </section>
        <section className="card stat">
          <div className="stat-icon">⭐</div>
          <div className="stat-num">Lv {stats.level.level}</div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${lvlPct}%` }} />
          </div>
          <div className="muted small">
            {stats.level.into}/{stats.level.need} XP
          </div>
        </section>
      </div>

      <section className="card">
        <div className="row-between">
          <h2>Daily XP goal</h2>
          <span className="muted small">
            {stats.today}/{s.dailyXpGoal}
          </span>
        </div>
        <div className="bar thick">
          <div className="bar-fill" style={{ width: `${goalPct}%` }} />
        </div>
      </section>

      <section className="card">
        <h2>This week</h2>
        <WeekChart data={stats.week} />
      </section>

      <button className="btn btn-primary btn-xl" onClick={() => go('study')}>
        ⏱️ Just 2 minutes
        <span className="btn-sub">Timer + schedule arrive in the next stage</span>
      </button>
    </div>
  )
}
