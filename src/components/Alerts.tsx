import { AlarmClock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { onFired, scheduleOne, SNOOZE_ID, type FiredDetail } from '../lib/notify'
import { chime, startAlarmSound } from '../lib/sound'
import { startStarter } from '../lib/focus'
import { stripEmoji } from '../lib/text'

interface Toast extends FiredDetail {
  key: number
}

/** In-app layer: ringing alarm screen + small reminder toasts. */
export default function Alerts() {
  const [alarm, setAlarm] = useState<(FiredDetail & { time: string }) | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(
    () =>
      onFired((d) => {
        if (d.channel === 'alarms') {
          setAlarm({
            ...d,
            time: new Date().toLocaleTimeString('en-ZA', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          })
        } else if (d.channel === 'reminders') {
          chime()
          const key = Date.now() + Math.random()
          setToasts((t) => [...t, { ...d, key }])
          setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), 8000)
        }
      }),
    [],
  )

  useEffect(() => {
    if (!alarm) return
    return startAlarmSound()
  }, [alarm])

  async function snooze() {
    if (!alarm) return
    await scheduleOne({
      id: SNOOZE_ID,
      at: new Date(Date.now() + 5 * 60_000),
      title: alarm.title,
      body: 'Snoozed 5 min. Time now!',
      channel: 'alarms',
      extra: alarm.extra,
    })
    setAlarm(null)
  }

  return (
    <>
      {alarm && (
        <div className="alarm-overlay" role="alertdialog" aria-label="Alarm">
          <div className="alarm-bell">
            <AlarmClock size={64} strokeWidth={1.5} />
          </div>
          <h1 className="center">{stripEmoji(alarm.title)}</h1>
          <p className="muted center">{alarm.time}</p>
          <div className="alarm-actions">
            <button
              className="btn btn-primary btn-xl"
              onClick={() => {
                const label = String(alarm.extra?.label || stripEmoji(alarm.title))
                setAlarm(null)
                startStarter(label)
              }}
            >
              Start 2 minutes
            </button>
            <div className="btn-row center-row">
              <button className="btn" onClick={snooze}>
                Snooze 5
              </button>
              <button className="btn btn-ghost" onClick={() => setAlarm(null)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" key={t.key} onClick={() => setToasts((x) => x.filter((y) => y.key !== t.key))}>
            <strong>{t.title}</strong>
            <span className="muted small">{t.body}</span>
          </div>
        ))}
      </div>
    </>
  )
}
