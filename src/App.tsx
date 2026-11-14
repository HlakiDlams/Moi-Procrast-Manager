import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, TriangleAlert } from './icons'
import { TABS, tabById, type TabId } from './tabs'
import { useHashTab } from './lib/useHashTab'
import { useXpStats } from './lib/xp'
import { applyScale, useSettings, useSettingsLoaded } from './lib/settings'
import Welcome from './components/Welcome'
import ErrorBoundary from './components/ErrorBoundary'
import { applyTheme, resolveTheme, ThemeContext } from './lib/themes'
import TodayScreen from './screens/TodayScreen'
import SettingsScreen from './screens/SettingsScreen'
import AlarmsScreen from './screens/AlarmsScreen'
import ProfileScreen from './screens/ProfileScreen'
import PlannerScreen from './screens/PlannerScreen'
import StudyScreen from './screens/StudyScreen'
import SelfCareScreen from './screens/SelfCareScreen'
import ExerciseScreen from './screens/ExerciseScreen'
import PlayScreen from './screens/PlayScreen'
import HomeworkScreen from './screens/HomeworkScreen'
import PlayOverlay from './components/PlayOverlay'
import { useAutoReschedule } from './lib/planner'
import { ensurePlannerSeeded } from './lib/plannerSeed'
import FocusOverlay from './components/FocusOverlay'
import Alerts from './components/Alerts'
import { useReminderSync } from './lib/reminders'
import { useStepSync } from './lib/steps'
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
    case 'study':
      return <StudyScreen />
    case 'selfcare':
      return <SelfCareScreen />
    case 'exercise':
      return <ExerciseScreen />
    case 'play':
      return <PlayScreen />
    case 'homework':
      return <HomeworkScreen go={go} />
    default:
      return null
  }
}

/** Short date for the Today header, e.g. "Mon, 16 Nov". */
function headerDate() {
  return new Date().toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
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
  const loaded = useSettingsLoaded()
  const def = tabById(tab)!
  useReminderSync()
  useAutoReschedule()
  useStepSync()
  // Existing installs keep their original setup (and get one-time migrations).
  // New installs are set up by the welcome screen instead.
  const onboarded = loaded?.onboarded
  useEffect(() => {
    if (onboarded) ensurePlannerSeeded().catch((e) => console.warn('seed failed', e))
  }, [onboarded])
  useEffect(() => applyScale(settings.uiScale), [settings.uiScale])
  const theme = useMemo(() => resolveTheme(settings.theme, settings.mode), [settings.theme, settings.mode])
  useEffect(() => applyTheme(theme), [theme])

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
    <ThemeContext.Provider value={theme}>
      <div className="app" style={theme.tabVars(def.id)}>
        <header className="topbar">
          <button className="brand" onClick={() => go('profile')} aria-label="Open my profile">
            {tab === 'today' && <span className="brand-name">Un-procrast-inator</span>}
            <span className="page-title">{tab === 'today' ? headerDate() : def.label}</span>
          </button>
          {stats.streakInfo.atRisk && (
            <div className="chips">
              <span className="chip chip-warn" title="Streak at risk: do something today">
                <TriangleAlert size={15} /> {stats.streak}-day streak at risk
              </span>
            </div>
          )}
        </header>

        <main className="screen" key={tab}>
          <ErrorBoundary key={tab} onHome={() => go('today')}>
            <Screen tab={tab} go={go} />
          </ErrorBoundary>
        </main>

        {loaded && !loaded.onboarded && <Welcome s={loaded} />}
        <FocusOverlay />
        <PlayOverlay />
        <Alerts />

        {moreOpen && (
          <div className="sheet-backdrop" onClick={() => setMoreOpen(false)}>
            <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More tabs">
              <div className="sheet-handle" />
              <div className="more-grid">
                {secondary.map((t) => (
                  <button key={t.id} className="more-item" style={theme.tabVars(t.id)} onClick={() => go(t.id)}>
                    <span className="more-icon">
                      <t.icon size={22} strokeWidth={1.75} />
                    </span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <nav className="bottomnav" aria-label="Main">
          {primary.map((t) => (
            <button key={t.id} className={'nav-btn' + (tab === t.id ? ' active' : '')} style={theme.tabVars(t.id)} onClick={() => go(t.id)} aria-current={tab === t.id ? 'page' : undefined}>
              <span className="nav-icon">
                <t.icon size={22} strokeWidth={tab === t.id ? 2.2 : 1.75} />
              </span>
              <span className="nav-label">{t.label}</span>
            </button>
          ))}
          <button
            className={'nav-btn' + (onSecondary || moreOpen ? ' active' : '')}
            style={theme.tabVars(onSecondary ? def.id : 'today')}
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
          >
            <span className="nav-icon">{onSecondary ? <def.icon size={22} strokeWidth={2.2} /> : <LayoutGrid size={22} strokeWidth={1.75} />}</span>
            <span className="nav-label">{onSecondary ? def.label.split(' ')[0] : 'More'}</span>
          </button>
        </nav>
      </div>
    </ThemeContext.Provider>
  )
}
