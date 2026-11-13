import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, type PeriodLog } from '../lib/db'
import { cycleInfo, daysBetween } from '../lib/cycle'
import { SYMPTOMS } from '../lib/selfcare'

const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** Private period tracker. Predictions are estimates from your own logs. */
export default function PeriodCard({ today }: { today: string }) {
  const periods = useLiveQuery(() => db.periods.orderBy('start').toArray(), []) ?? []
  const sym = useLiveQuery(() => db.symptoms.get(today), [today])
  const [showPast, setShowPast] = useState(false)
  const [pastStart, setPastStart] = useState('')
  const [pastEnd, setPastEnd] = useState('')
  const c = cycleInfo(periods, today)
  const last: PeriodLog | undefined = periods[periods.length - 1]

  async function startToday() {
    await db.periods.add({ start: today })
  }
  async function endPeriod(day: string) {
    if (last?.id !== undefined) await db.periods.update(last.id, { end: day < last.start ? last.start : day })
  }
  async function setFlow(flow: PeriodLog['flow']) {
    if (last?.id !== undefined) await db.periods.update(last.id, { flow })
  }
  async function toggleSymptom(x: string) {
    const items = sym?.items ?? []
    await db.symptoms.put({ day: today, items: items.includes(x) ? items.filter((y) => y !== x) : [...items, x], note: sym?.note })
  }
  async function addPast(e: React.FormEvent) {
    e.preventDefault()
    if (!pastStart || pastStart > today) return
    await db.periods.add({ start: pastStart, end: pastEnd && pastEnd >= pastStart ? pastEnd : undefined })
    setPastStart('')
    setPastEnd('')
    setShowPast(false)
  }

  // 14-day look-ahead strip
  const strip = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today, i)
    let kind: 'period' | 'predicted' | 'fertile' | '' = ''
    if (c.onPeriod && c.lastStart && daysBetween(c.lastStart, d) < c.avgPeriod && d >= today && (!last?.end || d <= last.end)) kind = 'period'
    else if (c.nextStart && d >= c.nextStart && daysBetween(c.nextStart, d) < c.avgPeriod) kind = 'predicted'
    else if (c.fertileStart && c.fertileEnd && d >= c.fertileStart && d <= c.fertileEnd) kind = 'fertile'
    return { d, kind }
  })

  let headline = 'Log your period to start predictions'
  let sub = 'Tap "Period started" on day 1. After 2 periods, predictions use your own average.'
  if (c.onPeriod) {
    headline = `Period · day ${c.periodDay} 🌸`
    sub = 'Rest, stay hydrated, and go easy on yourself today.'
  } else if (c.hasData && c.lateBy > 0) {
    headline = `${c.lateBy} day${c.lateBy === 1 ? '' : 's'} later than predicted`
    sub = 'Cycles shift with stress, sleep and illness. Log it when it starts.'
  } else if (c.hasData && c.daysUntilNext !== undefined) {
    headline = c.daysUntilNext === 0 ? 'Period may start today' : `Next period in ~${c.daysUntilNext} day${c.daysUntilNext === 1 ? '' : 's'}`
    sub = `Around ${fmt(c.nextStart!)} · cycle day ${c.cycleDay}`
  }

  return (
    <section className="card period-card">
      <div className="row-between">
        <h2>🌸 Cycle</h2>
        <span className="muted small">🔒 only on this phone</span>
      </div>
      <div className="period-head">
        <div className="period-big">{c.onPeriod ? c.periodDay : c.cycleDay ?? '–'}</div>
        <div>
          <strong>{headline}</strong>
          <div className="muted small">{sub}</div>
        </div>
      </div>

      <div className="period-strip" aria-label="Next 14 days">
        {strip.map(({ d, kind }, i) => (
          <div key={d} className={'p-day ' + kind + (i === 0 ? ' is-today' : '')} title={kind || 'day'}>
            <span className="fire-letter">{DOW[new Date(d + 'T12:00:00').getDay()]}</span>
            <span className="p-num">{Number(d.slice(8))}</span>
          </div>
        ))}
      </div>
      <div className="p-legend small muted">
        <span>
          <i className="dot period" /> period
        </span>
        <span>
          <i className="dot predicted" /> predicted
        </span>
        <span>
          <i className="dot fertile" /> fertile (estimate)
        </span>
      </div>

      {c.onPeriod ? (
        <>
          <div className="seg seg-3">
            {(['light', 'medium', 'heavy'] as const).map((f) => (
              <button key={f} className={last?.flow === f ? 'on' : ''} onClick={() => setFlow(f)}>
                {f === 'light' ? '💧 Light' : f === 'medium' ? '💧💧 Medium' : '💧💧💧 Heavy'}
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button className="btn" onClick={() => endPeriod(today)}>
              ✅ Ended today
            </button>
            <button className="btn btn-ghost" onClick={() => endPeriod(addDays(today, -1))}>
              Ended yesterday
            </button>
          </div>
        </>
      ) : (
        <button className="btn btn-primary full" onClick={startToday}>
          🩸 Period started today
        </button>
      )}

      <span className="field-label">How's your body today?</span>
      <div className="chip-wrap">
        {SYMPTOMS.map((x) => (
          <button key={x} className={'tag-chip' + (sym?.items.includes(x) ? ' on' : '')} onClick={() => toggleSymptom(x)} aria-pressed={sym?.items.includes(x)}>
            {x}
          </button>
        ))}
      </div>

      <div className="muted small">
        Average cycle <b>{c.avgCycle} days</b> · period <b>{c.avgPeriod} days</b> {c.learned ? '(from your logs)' : '(typical, until you log 2 periods)'}
      </div>
      {c.irregular && <p className="small warn-text">Your cycles look very short, long or irregular. That's common, but worth mentioning at a clinic, especially with very heavy bleeding or bad pain.</p>}

      <button className="link-btn small" onClick={() => setShowPast((v) => !v)}>
        {showPast ? 'Close' : '+ Log a past period / history'}
      </button>
      {showPast && (
        <>
          <form className="weigh-form" onSubmit={addPast}>
            <input type="date" value={pastStart} onChange={(e) => setPastStart(e.target.value)} max={today} aria-label="Start date" required />
            <input type="date" value={pastEnd} onChange={(e) => setPastEnd(e.target.value)} max={today} aria-label="End date" />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </form>
          <ul className="history small">
            {[...periods].reverse().map((p, i, arr) => (
              <li key={p.id}>
                <span>
                  {fmt(p.start)}
                  {p.end ? ` – ${fmt(p.end)}` : ''}
                </span>
                <span className="muted">{arr[i + 1] ? `${daysBetween(arr[i + 1].start, p.start)}-day cycle` : ''}</span>
                <button className="icon-btn subtle" onClick={() => confirm('Delete this period?') && db.periods.delete(p.id!)} aria-label="Delete">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="field-hint">Predictions are estimates from your own logs. They are not medical advice and not a form of contraception.</p>
    </section>
  )
}
