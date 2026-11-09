import { tabById, type TabId } from '../tabs'

const PLANNED: Partial<Record<TabId, string[]>> = {
  study: ['Skill trees for all 6 CAPS subjects', 'Languages, art, chess, music, finance', '5-minute lessons, hearts, streak freezes', 'Review my mistakes (spaced repetition)', 'Mistral-generated lessons (optional)'],
  planner: ['Mon–Sun time blocks', 'Auto-generated balanced timetable', 'Drag to edit blocks', 'Planned vs done + auto-reschedule'],
  selfcare: ['Water tap counter', 'Meals & sleep log', 'Skin/hair routines', 'Mood & energy check'],
  play: ['Earned reward breaks with timers', 'Your own hobbies'],
  exercise: ['Routines by goal', 'Sets, reps & rest timers', '12-week early-morning programme'],
  homework: ['Photo upload / camera', 'Mistral vision marking & score', 'Mistakes sent to Study review'],
  profile: ['Age, height, weight', 'Goals with target dates', 'Behind? Push the date or up the load', 'Healthy-rate safety checks'],
}

export default function ComingSoon({ tab }: { tab: TabId }) {
  const def = tabById(tab)!
  return (
    <div className="stack">
      <section className="card hero">
        <div className="hero-icon">{def.icon}</div>
        <h1>{def.label}</h1>
        <p className="muted">This tab is being built next. Here's what's coming:</p>
      </section>
      <section className="card">
        <ul className="checklist">
          {(PLANNED[tab] ?? []).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
