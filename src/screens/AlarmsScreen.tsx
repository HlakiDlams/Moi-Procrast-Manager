import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Alarm } from '../lib/db'
import { setSetting, useSettings } from '../lib/settings'
import { pendingCount, permissionState, requestPermission, scheduleOne, TEST_ID } from '../lib/notify'
import { Clock, isAndroid, isIOS, isNative } from '../lib/platform'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function daysText(d: number[]) {
  if (!d.length || d.length === 7) return 'Every day'
  if (d.length === 5 && [1, 2, 3, 4, 5].every((x) => d.includes(x))) return 'Weekdays'
  if (d.length === 2 && d.includes(0) && d.includes(6)) return 'Weekends'
  return [...d].sort().map((x) => DAY_NAMES[x]).join(', ')
}

async function sendToClock(a: Pick<Alarm, 'time' | 'label' | 'days'>) {
  const [hour, minute] = a.time.split(':').map(Number)
  // Android Clock wants 1=Sun..7=Sat
  const days = a.days.length && a.days.length < 7 ? a.days.map((d) => d + 1) : undefined
  await Clock.setAlarm({ hour, minute, label: a.label || 'Un-procrast-inator', days, skipUi: false })
}

function AlarmEditor({ onDone }: { onDone: () => void }) {
  const [time, setTime] = useState('06:00')
  const [label, setLabel] = useState('')
  const [days, setDays] = useState<number[]>([])
  const [mode, setMode] = useState<Alarm['mode']>(isAndroid ? 'clock' : 'app')
  const [err, setErr] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const a: Alarm = { time, label: label.trim() || 'Alarm', days, enabled: true, mode }
    if (mode === 'clock') {
      try {
        await sendToClock(a)
      } catch {
        setErr("Couldn't open the Clock app. Try 'Ring in this app' instead.")
        return
      }
    }
    await db.alarms.add(a)
    onDone()
  }

  return (
    <form className="add-block" onSubmit={save}>
      <div className="grid-2">
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required aria-label="Alarm time" />
        <input placeholder="Label e.g. Morning workout" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} />
      </div>
      <div className="day-picker" role="group" aria-label="Repeat on">
        {DAYS.map((d, i) => (
          <button
            type="button"
            key={i}
            className={'day-chip' + (days.includes(i) ? ' on' : '')}
            onClick={() => setDays((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))}
            aria-pressed={days.includes(i)}
            aria-label={DAY_NAMES[i]}
          >
            {d}
          </button>
        ))}
      </div>
      <p className="muted small">{daysText(days)}</p>
      <div className="seg" role="radiogroup">
        <button type="button" className={mode === 'clock' ? 'on' : ''} onClick={() => setMode('clock')} disabled={!isAndroid} aria-pressed={mode === 'clock'}>
          📱 Phone's Clock app
        </button>
        <button type="button" className={mode === 'app' ? 'on' : ''} onClick={() => setMode('app')} aria-pressed={mode === 'app'}>
          💕 Ring in this app
        </button>
      </div>
      <p className="field-hint">
        {mode === 'clock'
          ? 'Loudest + most reliable: Huawei Clock rings even if this app is closed. Edit or delete it later in the Clock app.'
          : isAndroid
            ? 'Rings as a high-priority notification, plus a full alarm screen when the app is open.'
            : 'In the browser, alarms ring only while the app is open or in the background. Use the Android app for closed-app alarms.'}
      </p>
      {err && <p className="small">{err}</p>}
      <div className="btn-row">
        <button className="btn btn-primary" type="submit">
          Save alarm
        </button>
        <button className="btn btn-ghost" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AlarmsScreen() {
  const s = useSettings()
  const alarms = useLiveQuery(() => db.alarms.toArray(), []) ?? []
  const [adding, setAdding] = useState(false)
  const [perm, setPerm] = useState<string>('…')
  const [pending, setPending] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    permissionState().then(setPerm)
    const id = setTimeout(() => pendingCount().then(setPending), 800)
    return () => clearTimeout(id)
  }, [s, alarms.length])

  async function toggleMaster(on: boolean) {
    if (on) {
      const ok = await requestPermission()
      setPerm(await permissionState())
      if (!ok) {
        setMsg(isIOS ? 'Notifications are blocked. Allow them in Settings → Notifications → Un-procrast-inator.' : isNative ? 'Notifications are blocked. Allow them in Settings → Apps → Un-procrast-inator → Notifications.' : 'Notifications are blocked in your browser settings for this site.')
        return
      }
    }
    setMsg('')
    await setSetting('notifications', on)
  }

  async function test() {
    if (perm !== 'granted' && !(await requestPermission())) {
      setMsg('Allow notifications first.')
      return
    }
    await scheduleOne({ id: TEST_ID, at: new Date(Date.now() + 10_000), title: '💕 Test reminder', body: "If you see this, reminders work! You can close the app and they'll still come.", channel: 'reminders' })
    setMsg(isNative ? 'Sent! Close the app now. It should pop up in 10 seconds.' : 'Sent! It will pop up in 10 seconds.')
  }

  async function wakeToClock() {
    try {
      await sendToClock({ time: s.wakeTime, label: 'Wake up, Hlaki 🌸', days: [] })
    } catch {
      setMsg("Couldn't open the Clock app.")
    }
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>Reminders</h2>
        <label className="toggle">
          <input type="checkbox" checked={s.notifications} onChange={(e) => toggleMaster(e.target.checked)} />
          <span>Gentle reminders on</span>
        </label>
        <div className={'sub-toggles' + (s.notifications ? '' : ' disabled')}>
          <label className="toggle">
            <input type="checkbox" checked={s.remindTasks} onChange={(e) => setSetting('remindTasks', e.target.checked)} />
            <span>Task starting (5 min before + at start)</span>
          </label>
          <label className="toggle">
            <input type="checkbox" checked={s.remindWater} onChange={(e) => setSetting('remindWater', e.target.checked)} />
            <span>Drink water every</span>
            <select className="inline-select" value={s.waterEvery} onChange={(e) => setSetting('waterEvery', Number(e.target.value))}>
              {[45, 60, 90, 120, 180].map((m) => (
                <option key={m} value={m}>
                  {m < 60 ? `${m} min` : `${m / 60} h`}
                </option>
              ))}
            </select>
          </label>
          <label className="toggle">
            <input type="checkbox" checked={s.remindBedtime} onChange={(e) => setSetting('remindBedtime', e.target.checked)} />
            <span>Bedtime ({s.bedtime}, plus 30-min wind-down)</span>
          </label>
          <label className="toggle">
            <input type="checkbox" checked={s.keepAwake} onChange={(e) => setSetting('keepAwake', e.target.checked)} />
            <span>Keep screen on during focus timer</span>
          </label>
        </div>
        <p className="muted small">
          Breaks are reminded automatically when a Pomodoro ends. Permission: {perm}
          {pending !== null && ` · ${pending} reminders scheduled`}
        </p>
        <div className="btn-row">
          <button className="btn" onClick={test}>
            🔔 Test in 10 s
          </button>
        </div>
        {msg && <p className="small">{msg}</p>}
      </section>

      <section className="card">
        <div className="row-between">
          <h2>Alarms</h2>
          {isAndroid && (
            <button className="btn btn-ghost" onClick={() => Clock.showAlarms().catch(() => {})}>
              Open Clock
            </button>
          )}
        </div>
        {alarms.length === 0 && !adding && <p className="muted small">No alarms yet.</p>}
        <ul className="blocks">
          {alarms.map((a) => (
            <li key={a.id} className={'block-row' + (a.enabled ? '' : ' st-skipped')}>
              <div className="alarm-time">{a.time}</div>
              <div className="block-main">
                <div className="block-title">{a.label}</div>
                <div className="muted small">
                  {daysText(a.days)} · {a.mode === 'clock' ? '📱 Clock app' : '💕 in app'}
                </div>
              </div>
              <div className="block-actions">
                {a.mode === 'app' ? (
                  <label className="switch" aria-label="Enabled">
                    <input type="checkbox" checked={a.enabled} onChange={(e) => db.alarms.update(a.id!, { enabled: e.target.checked })} />
                  </label>
                ) : (
                  <button className="icon-btn subtle" onClick={() => sendToClock(a).catch(() => {})} aria-label="Send to Clock again">
                    ↻
                  </button>
                )}
                <button
                  className="icon-btn subtle"
                  onClick={() => {
                    if (!confirm(a.mode === 'clock' ? 'Remove from this list? (Delete it in the Clock app too.)' : `Delete ${a.time} alarm?`)) return
                    db.alarms.delete(a.id!)
                  }}
                  aria-label="Delete alarm"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
        {adding ? (
          <AlarmEditor onDone={() => setAdding(false)} />
        ) : (
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => setAdding(true)}>
              + New alarm
            </button>
            {isAndroid && (
              <button className="btn" onClick={wakeToClock}>
                🌅 Wake-up alarm ({s.wakeTime})
              </button>
            )}
          </div>
        )}
      </section>

      {isIOS ? (
        <section className="card warn-card">
          <h2>📱 iPhone tips</h2>
          <ol className="small steps">
            <li>
              Allow notifications: <b>Settings → Notifications → Un-procrast-inator</b> → Allow, with Sounds and Banners on
            </li>
            <li>Focus modes (Sleep, Do Not Disturb) can hide reminders. Add the app to "Allowed apps" if you want them anyway</li>
            <li>iPhone doesn't let apps put alarms in the Clock app, so use "Ring in this app" alarms here</li>
            <li>Tap "Test in 10 s" above and lock the phone to check it works</li>
          </ol>
        </section>
      ) : isAndroid ? (
        <section className="card warn-card">
          <h2>📱 Huawei: one-time setup</h2>
          <p className="small">Huawei closes background apps to save battery, which can block reminders. Do this once:</p>
          <ol className="small steps">
            <li>
              Open <b>Settings → Battery → App launch</b>
            </li>
            <li>
              Find <b>Un-procrast-inator</b> and switch it to <b>Manage manually</b>
            </li>
            <li>
              Turn <b>on</b> Auto-launch, Secondary launch and Run in background
            </li>
            <li>
              In <b>Settings → Apps → Un-procrast-inator → Notifications</b>, allow notifications and banners
            </li>
            <li>Tap "Test in 10 s" above and close the app to check it works</li>
          </ol>
        </section>
      ) : (
        <section className="card warn-card">
          <h2>ℹ️ Browser version</h2>
          <p className="small">
            Here, reminders and alarms only work while the app is open or recently used. Install the Android app for reminders that come even when it's closed, plus alarms in your Clock app.
          </p>
        </section>
      )}
    </div>
  )
}
