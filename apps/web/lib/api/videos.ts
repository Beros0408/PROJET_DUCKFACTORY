export interface Video {
  id: string
  user_id: string
  script_id: string
  video_url: string | null
  duration_seconds: number | null
  file_size_bytes: number | null
  status: 'pending' | 'rendering' | 'ready' | 'failed'
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface VideoGenerationResult {
  videoId: string
  command: string
  audioUrl: string
  subtitles: Array<{ word: string; start: number; end: number }>
  mascotImageUrl: string | null
  video: Video
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

export const fetchVideo = (scriptId: string): Promise<Video | null> =>
  apiFetch(`/api/scripts/${scriptId}/generate-video`)

export const generateVideo = (scriptId: string): Promise<VideoGenerationResult> =>
  apiFetch(`/api/scripts/${scriptId}/generate-video`, { method: 'POST' })
