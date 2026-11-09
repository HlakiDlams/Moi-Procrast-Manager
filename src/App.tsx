import { useEffect, useState, type CSSProperties } from 'react'
import { TABS, tabById, type TabId } from './tabs'
import { useHashTab } from './lib/useHashTab'
import { useXpStats } from './lib/xp'
import { applyScale, useSettings } from './lib/settings'
import TodayScreen from './screens/TodayScreen'
import SettingsScreen from './screens/SettingsScreen'
import ComingSoon from './screens/ComingSoon'
import AlarmsScreen from './screens/AlarmsScreen'
import ProfileScreen from './screens/ProfileScreen'
import PlannerScreen from './screens/PlannerScreen'
import { useAutoReschedule } from './lib/planner'
import { ensurePlannerSeeded } from './lib/plannerSeed'
import FocusOverlay from './components/FocusOverlay'
import Alerts from './components/Alerts'
import { useReminderSync } from './lib/reminders'
import { onTapped } from './lib/notify'
import { startStarter } from './lib/focus'
import { db } from './lib/db'

function Screen({ tab, go }: { tab: TabId; go: (t: TabId) => void }) {
  switch (tab) {
    case 'today':
      return <TodayScreen go={go} />
    case 'settings':
      return <SettingsScreen />
    case 'alarms':
      return <AlarmsScreen />
    case 'profile':
      return <ProfileScreen />
    case 'planner':
      return <PlannerScreen />
    default:
      return <ComingSoon tab={tab} />
  }
}

export default function App() {
  const [tab, navigate] = useHashTab()
  const [moreOpen, setMoreOpen] = useState(false)
  const go = (t: TabId) => {
    setMoreOpen(false)
    navigate(t)
  }
  const stats = useXpStats()
  const settings = useSettings()
  const def = tabById(tab)!
  useReminderSync()
  useAutoReschedule()
  useEffect(() => {
    ensurePlannerSeeded().catch((e) => console.warn('seed failed', e))
  }, [])
  useEffect(() => applyScale(settings.uiScale), [settings.uiScale])

  // Tapping a notification: jump to the right place (and start the 2-min timer for a task).
  useEffect(
    () =>
      onTapped(async (extra) => {
        if (extra.kind === 'water') return navigate('selfcare')
        navigate('today')
        if (extra.kind === 'block' && extra.start && typeof extra.blockId === 'number') {
          const b = await db.blocks.get(extra.blockId)
          if (b && b.status === 'planned') startStarter(b.title, b.id)
        }
      }),
    [navigate],
  )

  const primary = TABS.filter((t) => t.primary)
  const secondary = TABS.filter((t) => !t.primary)
  const onSecondary = !def.primary

  return (
    <div className="app" style={{ '--accent': def.accent } as CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={() => go('profile')} aria-label="Open my profile">
          <span className="brand-dot" />
          <span>
            <span className="brand-name">{settings.name}'s Planner</span>
            <span className="brand-tab">
              {def.icon} {def.label}
            </span>
          </span>
        </button>
        <div className="chips">
          <span className="chip" title="Day streak">
            🔥 {stats.streak}
          </span>
          <span className="chip" title={`Level ${stats.level.level}`}>
            ⭐ {stats.total} XP
          </span>
        </div>
      </header>

      <main className="screen" key={tab}>
        <Screen tab={tab} go={go} />
      </main>

      <FocusOverlay />
      <Alerts />

      {moreOpen && (
        <div className="sheet-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More tabs">
            <div className="sheet-handle" />
            <div className="more-grid">
              {secondary.map((t) => (
                <button
                  key={t.id}
                  className="more-item"
                  style={{ '--accent': t.accent } as CSSProperties}
                  onClick={() => go(t.id)}
                >
                  <span className="more-icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="bottomnav" aria-label="Main">
        {primary.map((t) => (
          <button
            key={t.id}
            className={'nav-btn' + (tab === t.id ? ' active' : '')}
            style={{ '--accent': t.accent } as CSSProperties}
            onClick={() => go(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
        <button
          className={'nav-btn' + (onSecondary || moreOpen ? ' active' : '')}
          style={{ '--accent': onSecondary ? def.accent : '#FF2E93' } as CSSProperties}
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
        >
          <span className="nav-icon">{onSecondary ? def.icon : '✨'}</span>
          <span className="nav-label">{onSecondary ? def.label.split(' ')[0] : 'More'}</span>
        </button>
      </nav>
    </div>
  )
}
