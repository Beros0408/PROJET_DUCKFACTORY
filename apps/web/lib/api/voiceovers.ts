export interface Voiceover {
  id: string
  user_id: string
  script_id: string
  audio_url: string | null
  duration_seconds: number | null
  voice_id: string | null
  model_id: string | null
  characters_used: number | null
  status: 'pending' | 'ready' | 'error'
  error_message: string | null
  created_at: string
  updated_at: string
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `API error ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const fetchVoiceover = (scriptId: string): Promise<Voiceover | null> =>
  apiFetch(`/api/scripts/${scriptId}/generate-voice`)

export const generateVoice = (scriptId: string): Promise<Voiceover> =>
  apiFetch(`/api/scripts/${scriptId}/generate-voice`, { method: 'POST' })
