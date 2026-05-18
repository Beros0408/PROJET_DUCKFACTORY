export interface Character {
  id: string
  user_id: string
  name: string
  description: string | null
  personality: string
  tone: string
  catchphrase: string | null
  tic_verbal: string | null
  avatar_url: string | null
  voice_id: string | null
  language: 'fr' | 'en'
  created_at: string
  updated_at: string
}

export interface CreateCharacterInput {
  name: string
  description?: string
  personality: string
  tone: string
  catchphrase?: string
  tic_verbal?: string
  language: 'fr' | 'en'
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

export const fetchCharacters = (): Promise<Character[]> =>
  apiFetch('/api/characters')

export const fetchCharacter = (id: string): Promise<Character> =>
  apiFetch(`/api/characters/${id}`)

export const createCharacter = (data: CreateCharacterInput): Promise<Character> =>
  apiFetch('/api/characters', { method: 'POST', body: JSON.stringify(data) })

export const updateCharacter = (id: string, data: Partial<CreateCharacterInput>): Promise<Character> =>
  apiFetch(`/api/characters/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteCharacter = (id: string): Promise<void> =>
  apiFetch(`/api/characters/${id}`, { method: 'DELETE' })
