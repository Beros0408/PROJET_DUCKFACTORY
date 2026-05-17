import { createClient } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

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

async function getToken(): Promise<string> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')
  return session.access_token
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
  apiFetch('/api/v1/characters')

export const fetchCharacter = (id: string): Promise<Character> =>
  apiFetch(`/api/v1/characters/${id}`)

export const createCharacter = (data: CreateCharacterInput): Promise<Character> =>
  apiFetch('/api/v1/characters', { method: 'POST', body: JSON.stringify(data) })

export const updateCharacter = (id: string, data: Partial<CreateCharacterInput>): Promise<Character> =>
  apiFetch(`/api/v1/characters/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteCharacter = (id: string): Promise<void> =>
  apiFetch(`/api/v1/characters/${id}`, { method: 'DELETE' })
