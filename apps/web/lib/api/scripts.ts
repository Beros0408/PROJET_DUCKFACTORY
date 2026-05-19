export interface Script {
  id: string
  user_id: string
  character_id: string
  title: string
  topic: string
  content: string
  format: string
  tone: string
  audience: string
  language: 'fr' | 'en'
  estimated_duration: number | null
  segments: Record<string, unknown> | null
  status: 'draft' | 'ready' | 'used'
  tokens_used: number | null
  created_at: string
  updated_at: string
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `API error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const fetchScripts = (characterId?: string): Promise<Script[]> =>
  apiFetch(`/api/scripts${characterId ? `?character_id=${encodeURIComponent(characterId)}` : ''}`)

export const fetchScript = (id: string): Promise<Script> =>
  apiFetch(`/api/scripts/${id}`)

export const deleteScript = (id: string): Promise<void> =>
  apiFetch(`/api/scripts/${id}`, { method: 'DELETE' })
