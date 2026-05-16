import { createClient } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  return headers
}

export const api = {
  async get<T>(path: string): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}${path}`, { headers })
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
    return res.json()
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
    return res.json()
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
    return res.json()
  },

  async delete<T>(path: string): Promise<T> {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers,
    })
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
    return res.json()
  },
}
