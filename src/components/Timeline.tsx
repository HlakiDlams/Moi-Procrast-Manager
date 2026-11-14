import { Check, GripVertical } from '../icons'
import { useRef, useState, type CSSProperties } from 'react'
import { db, type Block } from '../lib/db'
import { blockState, kindInfo } from '../lib/blocks'
import { fromMin, toMin } from '../lib/scheduler'

const REM_PER_HOUR = 4
const SNAP = 5

function remPx() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
}

interface Drag {
  id: number
  mode: 'move' | 'resize'
  y0: number
  start0: number
  len0: number
}

/**
 * Vertical day timeline. Drag the handle to move a block, drag the bottom edge to resize,
 * tap a block to edit it.
 */
export default function Timeline({ blocks, fromHour, toHour, now, onEdit }: { blocks: Block[]; fromHour: number; toHour: number; now: Date | null; onEdit: (b: Block) => void }) {
  const [drag, setDrag] = useState<Drag | null>(null)
  const [preview, setPreview] = useState<{ start: number; len: number } | null>(null)
  const moved = useRef(false)
  const pxPerMin = (REM_PER_HOUR * remPx()) / 60
  const top0 = fromHour * 60
  const hours = Array.from({ length: toHour - fromHour + 1 }, (_, i) => fromHour + i)

  function onDown(e: React.PointerEvent, b: Block, mode: Drag['mode']) {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    moved.current = false
    setDrag({
      id: b.id!,
      mode,
      y0: e.clientY,
      start0: toMin(b.start),
      len0: b.minutes,
    })
    setPreview({ start: toMin(b.start), len: b.minutes })
  }

  function onMove(e: React.PointerEvent) {
    if (!drag) return
    const dMin = Math.round((e.clientY - drag.y0) / pxPerMin / SNAP) * SNAP
    if (dMin !== 0) moved.current = true
    if (drag.mode === 'move') {
      const st = Math.min(toHour * 60 - drag.len0, Math.max(top0, drag.start0 + dMin))
      setPreview({ start: st, len: drag.len0 })
    } else {
      setPreview({
        start: drag.start0,
        len: Math.max(10, Math.min(toHour * 60 - drag.start0, drag.len0 + dMin)),
      })
    }
  }

  async function onUp() {
    if (drag && preview && moved.current) {
      // Moving a block by hand makes it "yours", so re-generating the week keeps it.
      await db.blocks.update(drag.id, {
        start: fromMin(preview.start),
        minutes: preview.len,
        generated: false,
      })
      navigator.vibrate?.(15)
    }
    setDrag(null)
    setPreview(null)
    // the click event fires right after pointerup: ignore that one, then allow taps again
    setTimeout(() => (moved.current = false), 0)
  }

  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : null

  return (
    <div
      className="timeline"
      style={
        {
          height: `${(toHour - fromHour) * REM_PER_HOUR + 1}rem`,
        } as CSSProperties
      }
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {hours.map((h) => (
        <div key={h} className="tl-hour" style={{ top: `${(h - fromHour) * REM_PER_HOUR}rem` }}>
          <span>{String(h % 24).padStart(2, '0')}:00</span>
        </div>
      ))}
      {nowMin !== null && nowMin >= top0 && nowMin <= toHour * 60 && <div className="tl-now" style={{ top: `${((nowMin - top0) / 60) * REM_PER_HOUR}rem` }} />}
      {blocks
        .filter((b) => b.kind !== 'sleep')
        .map((b) => {
          const isDrag = drag?.id === b.id && preview
          const st = isDrag ? preview!.start : toMin(b.start)
          const len = isDrag ? preview!.len : b.minutes
          const k = kindInfo(b.kind)
          const state = now ? blockState(b, now) : b.status === 'planned' ? 'upcoming' : b.status
          return (
            <div
              key={b.id}
              className={`tl-block st-${state}${b.fixed ? ' fixed' : ''}${isDrag ? ' dragging' : ''}`}
              style={
                {
                  top: `${((st - top0) / 60) * REM_PER_HOUR}rem`,
                  height: `${Math.max(1.4, (len / 60) * REM_PER_HOUR - 0.15)}rem`,
                  '--k': k.color,
                } as CSSProperties
              }
              onClick={() => !moved.current && onEdit(b)}
            >
              <span className="tl-handle" onPointerDown={(e) => onDown(e, b, 'move')} aria-label="Drag to move">
                <GripVertical size={16} />
              </span>
              <div className="tl-text">
                <span className="tl-title">
                  {b.status === 'done' ? <Check size={14} className="kind-icon" /> : null}
                  <k.Icon size={14} className="kind-icon" /> {b.title}
                  {b.reschedules ? '' : ''}
                </span>
                <span className="tl-time">
                  {fromMin(st)}–{fromMin(st + len)}
                </span>
              </div>
              {!b.fixed && <span className="tl-resize" onPointerDown={(e) => onDown(e, b, 'resize')} aria-label="Drag to resize" />}
            </div>
          )
        })}
    </div>
  )
}
