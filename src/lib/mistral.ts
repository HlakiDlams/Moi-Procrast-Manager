import { getSettings } from './settings'

/**
 * Mistral API (https://api.mistral.ai). The key is stored only on this device and sent
 * only to Mistral. Inside the phone app, requests go through native HTTP (no CORS issues).
 */
const URL = 'https://api.mistral.ai/v1/chat/completions'
const VISION_FALLBACK = 'mistral-small-latest'

type Part = { type: 'text'; text: string } | { type: 'image_url'; image_url: string }
export interface Msg {
  role: 'system' | 'user' | 'assistant'
  content: string | Part[]
}

export class MistralError extends Error {
  kind: 'no-key' | 'bad-key' | 'rate-limit' | 'model' | 'network' | 'bad-reply' | 'other'
  constructor(kind: MistralError['kind'], message: string) {
    super(message)
    this.kind = kind
  }
}

export async function hasKey() {
  return !!(await getSettings()).mistralApiKey.trim()
}

async function call(body: object, key: string, signal?: AbortSignal): Promise<string> {
  let r: Response
  try {
    r = await fetch(URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new MistralError('network', "Couldn't reach Mistral. Check your internet connection.")
  }
  if (r.status === 401 || r.status === 403) throw new MistralError('bad-key', 'Mistral says the API key is not valid. Check it in Settings → Mistral AI.')
  if (r.status === 429) throw new MistralError('rate-limit', 'Mistral is busy or your free limit is used up for now. Wait a minute and try again.')
  const text = await r.text()
  if (!r.ok) {
    const model = /model|image|vision|multimodal/i.test(text)
    throw new MistralError(model ? 'model' : 'other', `Mistral error ${r.status}: ${text.slice(0, 200)}`)
  }
  try {
    const data = JSON.parse(text)
    return String(data.choices?.[0]?.message?.content ?? '')
  } catch {
    throw new MistralError('bad-reply', 'Mistral sent back something unexpected. Try again.')
  }
}

/** Chat completion. With `json`, asks for (and returns) a JSON string. */
export async function chat(messages: Msg[], opts: { vision?: boolean; json?: boolean; signal?: AbortSignal; maxTokens?: number } = {}): Promise<string> {
  const s = await getSettings()
  const key = s.mistralApiKey.trim()
  if (!key) throw new MistralError('no-key', 'Add your Mistral API key in Settings first.')
  const model = opts.vision ? s.mistralVisionModel || 'mistral-medium-latest' : s.mistralTextModel || 'mistral-medium-latest'
  const body = (m: string) => ({
    model: m,
    messages,
    temperature: 0.2,
    max_tokens: opts.maxTokens ?? 4000,
    ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
  })
  try {
    return await call(body(model), key, opts.signal)
  } catch (e) {
    // if the chosen model can't read images, try a known vision model once
    if (opts.vision && e instanceof MistralError && e.kind === 'model' && model !== VISION_FALLBACK) return call(body(VISION_FALLBACK), key, opts.signal)
    throw e
  }
}

/** Pull a JSON object out of a reply (handles ```json fences and stray text). */
export function parseJson<T>(text: string): T {
  const t = text.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim()
  try {
    return JSON.parse(t) as T
  } catch {
    const a = t.indexOf('{')
    const b = t.lastIndexOf('}')
    if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1)) as T
    throw new MistralError('bad-reply', "Couldn't read Mistral's answer. Try again.")
  }
}

/** A short, kind explanation for a wrong answer in a lesson. */
export async function explainMistake(q: { prompt: string; context?: string; code?: string }, given: string, correct: string, subject: string, signal?: AbortSignal) {
  return chat(
    [
      {
        role: 'system',
        content: `You are a patient South African tutor (CAPS curriculum) helping a learner with ${subject}. Explain step by step, in simple English, why the right answer is right and where the learner's thinking probably went wrong. Max 120 words. Use short numbered steps. No markdown headings.`,
      },
      {
        role: 'user',
        content: [q.context ? `Text: ${q.context}` : '', q.code ? `Code:\n${q.code}` : '', `Question: ${q.prompt}`, `My answer: ${given || '(none)'}`, `Correct answer: ${correct}`].filter(Boolean).join('\n'),
      },
    ],
    { signal, maxTokens: 500 },
  )
}
