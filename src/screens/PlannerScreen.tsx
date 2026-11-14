import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addDays, db, localDay, type Block, type BlockKind, type Commitment, type Subject } from '../lib/db'
import { KINDS, kindInfo } from '../lib/blocks'
import { mondayOf, toMin, weekDays } from '../lib/scheduler'
import { generateAndSave, rescheduleMissed } from '../lib/planner'
import { setSetting, useSettings, type Settings } from '../lib/settings'
import { startStarter } from '../lib/focus'
import Timeline from '../components/Timeline'
import { paletteVar } from '../lib/themes'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const COUNTED = new Set<BlockKind>(['study', 'homework', 'exercise', 'selfcare', 'play'])

function useNow(ms: number) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms)
    return () => clearInterval(id)
  }, [ms])
  return now
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="sheet-backdrop modal" onClick={onClose}>
      <div className="sheet modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="sheet-handle" />
        <div className="row-between">
          <h2>{title}</h2>
          <button className="icon-btn subtle" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  )
}

function DayPicker({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  return (
    <div className="day-picker" role="group">
      {DAY_LETTER.map((d, i) => (
        <button
          type="button"
          key={i}
          className={'day-chip' + (value.includes(i) ? ' on' : '')}
          onClick={() => onChange(value.includes(i) ? value.filter((x) => x !== i) : [...value, i].sort())}
          aria-pressed={value.includes(i)}
          aria-label={DOW[i]}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

// ---------------- block editor ----------------

function BlockEditor({ block, week, subjects, onClose }: { block: Block | Omit<Block, 'id'>; week: string[]; subjects: Subject[]; onClose: () => void }) {
  const [b, setB] = useState(block)
  const isNew = !('id' in block) || block.id === undefined
  const set = (p: Partial<Block>) => setB((x) => ({ ...x, ...p }))

  async function save() {
    // anything you edit by hand is kept when the week is regenerated
    const row = { ...b, generated: false, title: b.title.trim() || kindInfo(b.kind).label }
    if (isNew) await db.blocks.add(row as Block)
    else await db.blocks.put(row as Block)
    onClose()
  }

  return (
    <Sheet title={isNew ? 'New block' : 'Edit block'} onClose={onClose}>
      <div className="stack-sm">
        <Field label="Type">
          <select value={b.kind} onChange={(e) => set({ kind: e.target.value as BlockKind })}>
            {KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.icon} {k.label}
              </option>
            ))}
          </select>
        </Field>
        {b.kind === 'study' && (
          <Field label="Subject">
            <select
              value={b.subjectId ?? ''}
              onChange={(e) => {
                const sub = subjects.find((x) => x.id === Number(e.target.value))
                set({ subjectId: sub?.id, title: sub ? sub.name : b.title })
              }}
            >
              <option value="">—</option>
              {subjects.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.icon} {x.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Title">
          <input value={b.title} onChange={(e) => set({ title: e.target.value })} maxLength={80} />
        </Field>
        <div className="grid-3">
          <Field label="Day">
            <select value={b.day} onChange={(e) => set({ day: e.target.value })}>
              {week.map((d) => (
                <option key={d} value={d}>
                  {DOW[new Date(d + 'T12:00:00').getDay()]} {d.slice(8)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Start">
            <input type="time" value={b.start} onChange={(e) => set({ start: e.target.value })} />
          </Field>
          <Field label="Minutes">
            <input type="number" inputMode="numeric" value={b.minutes} min={5} max={720} onChange={(e) => set({ minutes: Math.max(5, Number(e.target.value) || 5) })} />
          </Field>
        </div>
        {!isNew && (
          <div className="seg seg-3">
            {(['planned', 'done', 'skipped'] as const).map((st) => (
              <button key={st} type="button" className={b.status === st ? 'on' : ''} onClick={() => set({ status: st })}>
                {st === 'planned' ? '🗓️ Planned' : st === 'done' ? '✅ Done' : '⏭️ Skipped'}
              </button>
            ))}
          </div>
        )}
        {b.origDay && (
          <p className="muted small">
            🔁 Auto-moved from {b.origDay} {b.origStart}
          </p>
        )}
        <div className="btn-row">
          <button className="btn btn-primary" onClick={save}>
            Save
          </button>
          {!isNew && b.status === 'planned' && b.kind !== 'sleep' && (
            <button
              className="btn"
              onClick={() => {
                startStarter(b.title, (b as Block).id)
                onClose()
              }}
            >
              ⏱️ Start 2 min
            </button>
          )}
          {!isNew && (
            <button
              className="btn btn-danger"
              onClick={async () => {
                if (confirm(`Delete "${b.title}"?`)) {
                  await db.blocks.delete((b as Block).id!)
                  onClose()
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Sheet>
  )
}

// ---------------- subjects ----------------

function SubjectsEditor({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState<number | 'new' | null>(null)
  const upd = (id: number, p: Partial<Subject>) => db.subjects.update(id, p)
  return (
    <div className="stack-sm">
      {subjects.map((s, si) => (
        <div key={s.id} className={'subject-row' + (s.active ? '' : ' off')} style={{ '--k': paletteVar(si) } as CSSProperties}>
          <button className="subject-head" onClick={() => setOpen(open === s.id ? null : s.id!)}>
            <span>
              {s.icon} {s.name}
            </span>
            <span className="muted small">
              {['', 'Keep ticking', 'Needs work', 'Top priority'][s.priority]}
              {s.currentMark !== null ? ` · ${s.currentMark}%→${s.targetMark}%` : ''} ›
            </span>
          </button>
          {open === s.id && (
            <div className="subject-body">
              <div className="seg seg-3">
                {([1, 2, 3] as const).map((p) => (
                  <button key={p} type="button" className={s.priority === p ? 'on' : ''} onClick={() => upd(s.id!, { priority: p })}>
                    {['', 'Low', 'Medium', 'High'][p]}
                  </button>
                ))}
              </div>
              <div className="grid-3">
                <Field label="My mark %">
                  <input type="number" inputMode="numeric" value={s.currentMark ?? ''} onChange={(e) => upd(s.id!, { currentMark: e.target.value === '' ? null : Number(e.target.value) })} />
                </Field>
                <Field label="Target %">
                  <input type="number" inputMode="numeric" value={s.targetMark} onChange={(e) => upd(s.id!, { targetMark: Number(e.target.value) || 0 })} />
                </Field>
                <Field label="Exam date">
                  <input type="date" value={s.examDate} onChange={(e) => upd(s.id!, { examDate: e.target.value })} />
                </Field>
              </div>
              <div className="grid-2">
                <Field label="Name">
                  <input value={s.name} onChange={(e) => upd(s.id!, { name: e.target.value })} maxLength={40} />
                </Field>
                <Field label="Icon">
                  <input value={s.icon} onChange={(e) => upd(s.id!, { icon: e.target.value })} maxLength={4} />
                </Field>
              </div>
              <div className="btn-row">
                <label className="toggle">
                  <input type="checkbox" checked={s.active} onChange={(e) => upd(s.id!, { active: e.target.checked })} />
                  <span>Plan study time for this</span>
                </label>
                <button className="btn btn-danger" onClick={() => confirm(`Delete ${s.name}?`) && db.subjects.delete(s.id!)}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        className="btn btn-ghost full"
        onClick={async () => {
          const id = await db.subjects.add({ name: 'New subject', icon: '📘', color: '#FF8AC8', priority: 2, examDate: '', currentMark: null, targetMark: 50, active: true, group: 'extra' })
          setOpen(id)
        }}
      >
        + Add a subject
      </button>
    </div>
  )
}

// ---------------- commitments ----------------

function CommitmentsEditor({ items }: { items: Commitment[] }) {
  const [edit, setEdit] = useState<Commitment | null>(null)
  return (
    <div className="stack-sm">
      <ul className="blocks">
        {items.map((c) => (
          <li key={c.id} className={'block-row' + (c.active ? '' : ' st-skipped')} style={{ '--k': kindInfo(c.kind).color } as CSSProperties} onClick={() => setEdit(c)}>
            <div className="block-main">
              <div className="block-title">
                {kindInfo(c.kind).icon} {c.title}
              </div>
              <div className="muted small">
                {c.days.length === 7 ? 'Every day' : c.days.map((d) => DOW[d]).join(', ')} · {c.start}–{c.end}
                {c.travelMin ? ` · +${c.travelMin} min travel` : ''}
              </div>
            </div>
            <span className="muted">›</span>
          </li>
        ))}
      </ul>
      <button className="btn btn-ghost full" onClick={() => setEdit({ title: '', days: [1, 2, 3, 4, 5], start: '08:00', end: '09:00', travelMin: 0, kind: 'other', active: true })}>
        + Add a fixed commitment
      </button>
      {edit && (
        <Sheet title={edit.id ? 'Edit commitment' : 'New commitment'} onClose={() => setEdit(null)}>
          <div className="stack-sm">
            <Field label="What">
              <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="e.g. Work shift" maxLength={40} />
            </Field>
            <DayPicker value={edit.days} onChange={(days) => setEdit({ ...edit, days })} />
            <div className="grid-3">
              <Field label="From">
                <input type="time" value={edit.start} onChange={(e) => setEdit({ ...edit, start: e.target.value })} />
              </Field>
              <Field label="To">
                <input type="time" value={edit.end} onChange={(e) => setEdit({ ...edit, end: e.target.value })} />
              </Field>
              <Field label="Travel (min)">
                <input type="number" inputMode="numeric" value={edit.travelMin} onChange={(e) => setEdit({ ...edit, travelMin: Math.max(0, Number(e.target.value) || 0) })} />
              </Field>
            </div>
            <Field label="Type">
              <select value={edit.kind} onChange={(e) => setEdit({ ...edit, kind: e.target.value as BlockKind })}>
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.icon} {k.label}
                  </option>
                ))}
              </select>
            </Field>
            <label className="toggle">
              <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />
              <span>Active</span>
            </label>
            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!edit.title.trim() || !edit.days.length) return
                  await db.commitments.put({ ...edit, title: edit.title.trim() })
                  setEdit(null)
                }}
              >
                Save
              </button>
              {edit.id && (
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (confirm(`Delete ${edit.title}?`)) {
                      await db.commitments.delete(edit.id!)
                      setEdit(null)
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </div>
            <p className="field-hint">Tap "Generate week" after changing commitments to rebuild the plan around them.</p>
          </div>
        </Sheet>
      )}
    </div>
  )
}

// ---------------- planner settings ----------------

function PlannerSettings({ s }: { s: Settings }) {
  const hours = (k: 'studyCapWeekday' | 'studyCapWeekend') => (
    <select value={s[k]} onChange={(e) => setSetting(k, Number(e.target.value))}>
      {[60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 420, 480].map((m) => (
        <option key={m} value={m}>
          {m / 60} h
        </option>
      ))}
    </select>
  )
  return (
    <div className="stack-sm">
      <div className="grid-2">
        <Field label="Wake up">
          <input type="time" value={s.wakeTime} onChange={(e) => setSetting('wakeTime', e.target.value)} />
        </Field>
        <Field label="Sleep">
          <input type="time" value={s.bedtime} onChange={(e) => setSetting('bedtime', e.target.value)} />
        </Field>
        <Field label="Study Mon–Fri">{hours('studyCapWeekday')}</Field>
        <Field label="Study Sat–Sun">{hours('studyCapWeekend')}</Field>
        <Field label="Block length">
          <select value={s.studyBlock} onChange={(e) => setSetting('studyBlock', Number(e.target.value))}>
            {[25, 30, 45, 50, 55, 60, 90].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </Field>
        <Field label="Break after">
          <select value={s.breakMin} onChange={(e) => setSetting('breakMin', Number(e.target.value))}>
            {[5, 10, 15, 20].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </Field>
        <Field label="Best focus from">
          <select value={s.focusFrom} onChange={(e) => setSetting('focusFrom', Number(e.target.value))}>
            {[5, 6, 8, 10, 12, 14, 16, 18].map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </Field>
        <Field label="Workout">
          <select value={s.exerciseMin} onChange={(e) => setSetting('exerciseMin', Number(e.target.value))}>
            {[15, 20, 30, 45, 60].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </Field>
      </div>
      <span className="field-label">Workout days</span>
      <DayPicker value={s.exerciseDays} onChange={(v) => setSetting('exerciseDays', v)} />
      <div className="seg">
        {(['morning', 'evening'] as const).map((w) => (
          <button key={w} type="button" className={s.exerciseWhen === w ? 'on' : ''} onClick={() => setSetting('exerciseWhen', w)}>
            {w === 'morning' ? '🌅 Early morning' : '🌙 Evening'}
          </button>
        ))}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={s.autoReschedule} onChange={(e) => setSetting('autoReschedule', e.target.checked)} />
        <span>Auto-move missed blocks to the next free slot</span>
      </label>
    </div>
  )
}

// ---------------- screen ----------------

function Collapsible({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="card">
      <button className="collapse-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <h2>{title}</h2>
        <span className="muted">{open ? '▾' : '▸'}</span>
      </button>
      {open && children}
    </section>
  )
}

export default function PlannerScreen() {
  const s = useSettings()
  const now = useNow(60_000)
  const today = localDay(now)
  const [monday, setMonday] = useState(() => mondayOf(localDay()))
  const week = weekDays(monday)
  const [day, setDay] = useState(() => localDay())
  const [editing, setEditing] = useState<Block | Omit<Block, 'id'> | null>(null)
  const [msg, setMsg] = useState('')

  const blocks = useLiveQuery(() => db.blocks.where('day').between(week[0], week[6], true, true).toArray(), [monday]) ?? []
  const subjects = useLiveQuery(() => db.subjects.toArray(), []) ?? []
  const commitments = useLiveQuery(() => db.commitments.toArray(), []) ?? []

  const dayBlocks = blocks.filter((b) => b.day === day).sort((a, b) => a.start.localeCompare(b.start))
  const wakeH = Math.floor(toMin(s.wakeTime) / 60)
  let bedH = Math.ceil(toMin(s.bedtime) / 60)
  if (bedH <= wakeH) bedH += 24
  const firstH = Math.min(wakeH, ...dayBlocks.filter((b) => b.kind !== 'sleep').map((b) => Math.floor(toMin(b.start) / 60)))
  const lastH = Math.max(bedH, ...dayBlocks.filter((b) => b.kind !== 'sleep').map((b) => Math.ceil((toMin(b.start) + b.minutes) / 60)))

  const counted = (bs: Block[]) => bs.filter((b) => COUNTED.has(b.kind))
  const minutes = (bs: Block[]) => bs.reduce((n, b) => n + b.minutes, 0)
  const weekPlanned = minutes(counted(blocks).filter((b) => b.status !== 'skipped'))
  const weekDone = minutes(counted(blocks).filter((b) => b.status === 'done'))

  const bySubject = subjects
    .map((sub) => {
      const bs = blocks.filter((b) => b.kind === 'study' && b.subjectId === sub.id)
      return { sub, planned: minutes(bs.filter((b) => b.status !== 'skipped')), done: minutes(bs.filter((b) => b.status === 'done')) }
    })
    .filter((x) => x.planned > 0)

  async function generate() {
    const hasPlan = blocks.some((b) => b.generated && b.status === 'planned' && b.day >= today)
    if (hasPlan && !confirm('Rebuild the rest of this week? Blocks you made or moved yourself, and finished ones, are kept.')) return
    const n = await generateAndSave(monday)
    setMsg(`✨ Planned ${n} blocks. Drag ⠿ to move, tap to edit.`)
  }

  const h = (m: number) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`

  return (
    <div className="stack">
      <section className="card">
        <div className="row-between">
          <button className="icon-btn subtle" onClick={() => setMonday(addDays(monday, -7))} aria-label="Previous week">
            ‹
          </button>
          <div className="center">
            <div className="week-title">{monday === mondayOf(today) ? 'This week' : `Week of ${monday.slice(5).replace('-', '/')}`}</div>
            <div className="muted small">
              {h(weekDone)} done of {h(weekPlanned)} planned
            </div>
          </div>
          <button className="icon-btn subtle" onClick={() => setMonday(addDays(monday, 7))} aria-label="Next week">
            ›
          </button>
        </div>
        <div className="bar thick">
          <div className="bar-fill" style={{ width: `${weekPlanned ? Math.round((weekDone / weekPlanned) * 100) : 0}%` }} />
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={generate}>
            ✨ Generate week
          </button>
          <button className="btn" onClick={() => setEditing({ day, start: '14:00', minutes: s.studyBlock, title: '', kind: 'study', status: 'planned' })}>
            + Block
          </button>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              const n = await rescheduleMissed()
              setMsg(n ? `🔁 Moved ${n} missed block${n === 1 ? '' : 's'}.` : 'Nothing missed. Lekker! 🌸')
            }}
          >
            🔁
          </button>
        </div>
        {msg && <p className="small">{msg}</p>}
      </section>

      <div className="day-tabs" role="tablist">
        {week.map((d) => {
          const bs = counted(blocks.filter((b) => b.day === d))
          const pl = minutes(bs.filter((b) => b.status !== 'skipped'))
          const dn = minutes(bs.filter((b) => b.status === 'done'))
          return (
            <button key={d} role="tab" aria-selected={d === day} className={'day-tab' + (d === day ? ' on' : '') + (d === today ? ' today' : '')} onClick={() => setDay(d)}>
              <span>{DOW[new Date(d + 'T12:00:00').getDay()]}</span>
              <strong>{d.slice(8)}</strong>
              <span className="day-dot" style={{ '--p': pl ? dn / pl : 0 } as CSSProperties} />
            </button>
          )
        })}
      </div>

      <section className="card tl-card">
        {dayBlocks.length === 0 ? (
          <p className="muted small center">Nothing planned for this day. Tap ✨ Generate week.</p>
        ) : (
          <Timeline blocks={dayBlocks} fromHour={firstH} toHour={lastH} now={day === today ? now : null} onEdit={setEditing} />
        )}
        {dayBlocks.some((b) => b.kind === 'study' && b.status === 'planned' && day === today) && (
          <p className="muted small center">Tap a block → ⏱️ Start 2 min. Tick it done when finished.</p>
        )}
      </section>

      {bySubject.length > 0 && (
        <section className="card">
          <h2>Planned vs done</h2>
          <div className="stack-sm">
            {bySubject.map(({ sub, planned, done }) => (
              <div key={sub.id}>
                <div className="row-between small">
                  <span>
                    {sub.icon} {sub.name}
                  </span>
                  <span className="muted">
                    {h(done)} / {h(planned)}
                  </span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${Math.round((done / planned) * 100)}%`, background: paletteVar(subjects.indexOf(sub)) }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Collapsible title="📚 Subjects & priorities">
        <p className="muted small">The planner gives more time to high-priority subjects, big gaps between your mark and target, and close exam dates. Hard subjects go in your best-focus hours.</p>
        <SubjectsEditor subjects={subjects} />
      </Collapsible>

      <Collapsible title="📌 Fixed commitments">
        <CommitmentsEditor items={commitments} />
      </Collapsible>

      <Collapsible title="⚙️ Planner settings">
        <PlannerSettings s={s} />
      </Collapsible>

      {editing && <BlockEditor block={editing} week={week} subjects={subjects} onClose={() => setEditing(null)} />}
    </div>
  )
}

