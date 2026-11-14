import { getSettings } from './settings'

/**
 * AI chat API. Mistral by default; OpenAI or any OpenAI-compatible service also works.
 * The key is stored only on this device and sent only to the chosen service.
 * Inside the phone app, requests go through native HTTP (no CORS issues).
 */
export const PROVIDERS = {
  mistral: {
    name: 'Mistral',
    base: 'https://api.mistral.ai/v1',
    text: 'mistral-medium-latest',
    vision: 'mistral-medium-latest',
    visionFallback: 'mistral-small-latest',
    keyHint: 'Paste your key from console.mistral.ai',
  },
  openai: { name: 'OpenAI', base: 'https://api.openai.com/v1', text: 'gpt-4o-mini', vision: 'gpt-4o-mini', visionFallback: '', keyHint: 'Paste your key from platform.openai.com' },
  custom: { name: 'your AI service', base: '', text: '', vision: '', visionFallback: '', keyHint: 'Paste the API key for your service' },
} as const
export type ProviderId = keyof typeof PROVIDERS

/** Name and base URL of the service in use. */
export function providerOf(s: { aiProvider?: string; aiBaseUrl?: string }) {
  const id = (s.aiProvider && s.aiProvider in PROVIDERS ? s.aiProvider : 'mistral') as ProviderId
  const p = PROVIDERS[id]
  const base = (id === 'custom' ? (s.aiBaseUrl ?? '').trim() : p.base).replace(/\/+$/, '').replace(/\/chat\/completions$/, '')
  let name: string = p.name
  if (id === 'custom') {
    try {
      name = new URL(base).hostname
    } catch {
      name = p.name
    }
  }
  return { id, name, base, preset: p }
}

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

async function call(url: string, name: string, body: object, key: string, signal?: AbortSignal): Promise<string> {
  let r: Response
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new MistralError('network', `Couldn't reach ${name}. Check your internet connection.`)
  }
  if (r.status === 401 || r.status === 403) throw new MistralError('bad-key', `${name} says the API key is not valid. Check it in Settings → AI.`)
  if (r.status === 429) throw new MistralError('rate-limit', `${name} is busy or your limit is used up for now. Wait a minute and try again.`)
  const text = await r.text()
  if (!r.ok) {
    const model = /model|image|vision|multimodal/i.test(text)
    throw new MistralError(model ? 'model' : 'other', `${name} error ${r.status}: ${text.slice(0, 200)}`)
  }
  try {
    const data = JSON.parse(text)
    return String(data.choices?.[0]?.message?.content ?? '')
  } catch {
    throw new MistralError('bad-reply', `${name} sent back something unexpected. Try again.`)
  }
}

/** Chat completion. With `json`, asks for (and returns) a JSON string. */
export async function chat(messages: Msg[], opts: { vision?: boolean; json?: boolean; signal?: AbortSignal; maxTokens?: number } = {}): Promise<string> {
  const s = await getSettings()
  const key = s.mistralApiKey.trim()
  if (!key) throw new MistralError('no-key', 'Add your AI API key in Settings first.')
  const pr = providerOf(s)
  if (!pr.base) throw new MistralError('other', 'Add the address of your AI service in Settings → AI.')
  const url = pr.base + '/chat/completions'
  const model = (opts.vision ? s.mistralVisionModel || pr.preset.vision : s.mistralTextModel || pr.preset.text) || 'mistral-medium-latest'
  // Mistral takes the image as a plain string; OpenAI-style services want { url }
  const msgs =
    pr.id === 'mistral'
      ? messages
      : messages.map((m) => (typeof m.content === 'string' ? m : { ...m, content: m.content.map((c) => (c.type === 'image_url' ? { type: 'image_url', image_url: { url: c.image_url } } : c)) }))
  const body = (m: string) => ({
    model: m,
    messages: msgs,
    temperature: 0.2,
    max_tokens: opts.maxTokens ?? 4000,
    ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
  })
  try {
    return await call(url, pr.name, body(model), key, opts.signal)
  } catch (e) {
    // if the chosen model can't read images, try a known vision model once
    const fb = pr.preset.visionFallback
    if (opts.vision && fb && e instanceof MistralError && e.kind === 'model' && model !== fb) return call(url, pr.name, body(fb), key, opts.signal)
    throw e
  }
}

/** Pull a JSON object out of a reply (handles ```json fences and stray text). */
export function parseJson<T>(text: string): T {
  const t = text
    .replace(/^\s*```(?:json)?/i, '')
    .replace(/```\s*$/, '')
    .trim()
  try {
    return JSON.parse(t) as T
  } catch {
    const a = t.indexOf('{')
    const b = t.lastIndexOf('}')
    if (a >= 0 && b > a) return JSON.parse(t.slice(a, b + 1)) as T
    throw new MistralError('bad-reply', "Couldn't read the AI's answer. Try again.")
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
        content: [q.context ? `Text: ${q.context}` : '', q.code ? `Code:\n${q.code}` : '', `Question: ${q.prompt}`, `My answer: ${given || '(none)'}`, `Correct answer: ${correct}`]
          .filter(Boolean)
          .join('\n'),
      },
    ],
    { signal, maxTokens: 500 },
  )
}
