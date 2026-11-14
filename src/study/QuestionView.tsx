import { useMemo, useState } from 'react'
import type { Question } from './types'
import { checkInput } from './check'
import { canSpeak, speak } from '../lib/speech'
import { playTones } from '../lib/sound'

function shuffle<T>(a: T[], seed: string): T[] {
  // deterministic per question so re-renders don't reshuffle
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0
  const out = [...a]
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0
    const j = Math.abs(h) % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export interface Answered {
  correct: boolean
  /** what to show as the right answer */
  solution: string
  /** what the learner gave (for "Explain more") */
  given?: string
}

/**
 * Renders one question. Calls onCheck once the learner taps "Check".
 * `locked` = already checked (show result, no more input).
 */
export default function QuestionView({ q, attempt, locked, lang, onCheck }: { q: Question; attempt: number; locked: boolean; lang?: string; onCheck: (a: Answered) => void }) {
  const seed = q.id + attempt
  // MCQ
  const order = useMemo(() => (q.type === 'mcq' ? shuffle(q.options.map((_, i) => i), seed) : []), [q, seed])
  const [pick, setPick] = useState<number | null>(null)
  // input
  const [text, setText] = useState('')
  // match
  const rights = useMemo(() => (q.type === 'match' ? shuffle(q.pairs.map((p) => p[1]), seed) : []), [q, seed])
  const [leftSel, setLeftSel] = useState<number | null>(null)
  const [pairs, setPairs] = useState<Record<number, number>>({}) // left index -> right index
  // order
  const pool = useMemo(() => (q.type === 'order' ? shuffle(q.steps.map((_, i) => i), seed) : []), [q, seed])
  const [seq, setSeq] = useState<number[]>([])
  // recall
  const [shown, setShown] = useState(false)

  let ready = false
  let check: () => Answered = () => ({ correct: false, solution: '' })

  if (q.type === 'mcq') {
    ready = pick !== null
    check = () => ({ correct: pick === q.answer, solution: q.options[q.answer], given: pick !== null ? q.options[pick] : '' })
  } else if (q.type === 'input') {
    ready = text.trim().length > 0
    check = () => ({ correct: checkInput(q, text), solution: q.answers[0], given: text })
  } else if (q.type === 'match') {
    ready = Object.keys(pairs).length === q.pairs.length
    check = () => ({
      correct: q.pairs.every((p, i) => rights[pairs[i]] === p[1]),
      solution: q.pairs.map((p) => `${p[0]} → ${p[1]}`).join('  ·  '),
      given: q.pairs.map((p, i) => `${p[0]} → ${rights[pairs[i]] ?? '?'}`).join('  ·  '),
    })
  } else if (q.type === 'recall') {
    ready = false
  } else {
    ready = seq.length === q.steps.length
    check = () => ({ correct: seq.every((v, i) => v === i), solution: q.steps.map((s, i) => `${i + 1}. ${s}`).join('\n'), given: seq.map((v, i) => `${i + 1}. ${q.steps[v]}`).join('\n') })
  }

  const submit = () => ready && !locked && onCheck(check())

  return (
    <div className="q">
      {q.context && <div className="q-context">{q.context}</div>}
      {q.code && <pre className="q-code">{q.code}</pre>}
      {q.tones && (
        <button className="btn btn-xl q-play" type="button" onClick={() => playTones(q.tones!)}>
          ▶ Play {q.tones.length > 1 ? `${q.tones.length} notes` : 'note'}
        </button>
      )}
      <div className="q-prompt-row">
        <h2 className="q-prompt" dir="auto">
          {q.prompt}
        </h2>
        {q.say && canSpeak && (
          <button className="icon-btn" onClick={() => speak(q.say!, lang)} aria-label="Listen">
            🔊
          </button>
        )}
      </div>

      {q.type === 'mcq' && (
        <div className="q-options">
          {order.map((i) => (
            <button
              key={i}
              className={'q-opt' + (pick === i ? ' on' : '') + (locked && i === q.answer ? ' right' : '') + (locked && pick === i && i !== q.answer ? ' wrong' : '')}
              onClick={() => !locked && setPick(i)}
              disabled={locked}
            >
              <bdi>{q.options[i]}</bdi>
            </button>
          ))}
        </div>
      )}

      {q.type === 'input' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <input
            className="q-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={q.placeholder ?? 'Your answer'}
            disabled={locked}
            autoFocus
            inputMode={q.numeric ? 'decimal' : 'text'}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {q.numeric && <p className="field-hint">Fractions like 3/4 are fine. Use − or - for negatives.</p>}
        </form>
      )}

      {q.type === 'match' && (
        <div className="q-match">
          <div className="q-col">
            {q.pairs.map((p, i) => (
              <button
                key={i}
                className={'q-opt' + (leftSel === i ? ' on' : '') + (pairs[i] !== undefined ? ' paired' : '')}
                disabled={locked}
                onClick={() => {
                  if (pairs[i] !== undefined) {
                    const n = { ...pairs }
                    delete n[i]
                    setPairs(n)
                  }
                  setLeftSel(i)
                }}
              >
                {p[0]}
                {pairs[i] !== undefined && <span className="q-tag">{Object.keys(pairs).indexOf(String(i)) + 1}</span>}
              </button>
            ))}
          </div>
          <div className="q-col">
            {rights.map((r, j) => {
              const owner = Object.entries(pairs).find(([, v]) => v === j)?.[0]
              return (
                <button
                  key={j}
                  className={'q-opt' + (owner !== undefined ? ' paired' : '')}
                  disabled={locked || leftSel === null}
                  onClick={() => {
                    if (leftSel === null) return
                    const n = Object.fromEntries(Object.entries(pairs).filter(([, v]) => v !== j)) as Record<number, number>
                    n[leftSel] = j
                    setPairs(n)
                    setLeftSel(null)
                  }}
                >
                  {r}
                  {owner !== undefined && <span className="q-tag">{Object.keys(pairs).indexOf(owner) + 1}</span>}
                </button>
              )
            })}
          </div>
          {!locked && <p className="field-hint q-span">Tap a left item, then its match on the right. Tap again to undo.</p>}
        </div>
      )}

      {q.type === 'order' && (
        <div className="q-order">
          <ol className="q-seq">
            {seq.map((i) => (
              <li key={i}>
                <button className="q-opt on" disabled={locked} onClick={() => setSeq(seq.filter((x) => x !== i))}>
                  {q.steps[i]}
                </button>
              </li>
            ))}
            {seq.length === 0 && <li className="muted small">Tap the steps below in the right order</li>}
          </ol>
          <div className="q-options">
            {pool
              .filter((i) => !seq.includes(i))
              .map((i) => (
                <button key={i} className="q-opt" disabled={locked} onClick={() => setSeq([...seq, i])}>
                  {q.steps[i]}
                </button>
              ))}
          </div>
        </div>
      )}

      {q.type === 'recall' && (
        <div className="q-recall">
          {!shown ? (
            <>
              <p className="muted small">Think of the answer (or work it out on paper), then tap Show.</p>
              <button className="btn btn-primary btn-xl" onClick={() => setShown(true)}>
                👀 Show answer
              </button>
            </>
          ) : (
            <>
              <div className="q-context">{q.answer}</div>
              {!locked && (
                <div className="btn-row">
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onCheck({ correct: true, solution: q.answer })}>
                    ✅ I knew it
                  </button>
                  <button className="btn" style={{ flex: 1 }} onClick={() => onCheck({ correct: false, solution: q.answer })}>
                    ❌ Not yet
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!locked && q.type !== 'recall' && (
        <button className="btn btn-primary btn-xl q-check" disabled={!ready} onClick={submit}>
          Check
        </button>
      )}
    </div>
  )
}
