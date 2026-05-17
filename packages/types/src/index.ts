// DuckFactory — Shared TypeScript Types

export type Locale = 'fr' | 'en'

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook'

export type Personality = 'drole' | 'serieux' | 'sage' | 'naif'

export type Tone = 'kid' | 'teen' | 'adult' | 'expert'

export interface User {
  id: string
  email: string
  created_at: string
  plan: 'free' | 'creator' | 'pro' | 'agency'
}

export interface Character {
  id: string
  user_id: string
  name: string
  description: string | null
  personality: Personality
  tone: Tone
  catchphrase: string | null
  tic_verbal: string | null
  avatar_url: string | null
  voice_id: string | null
  language: Locale
  created_at: string
  updated_at: string
}

export interface Script {
  id: string
  character_id: string
  user_id: string
  hook: string
  body: string
  punchline: string
  hashtags: string[]
  voice_url?: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  script_id: string
  character_id: string
  user_id: string
  status: VideoStatus
  video_url?: string
  thumbnail_url?: string
  duration_seconds?: number
  created_at: string
  updated_at: string
}

export interface Publication {
  id: string
  video_id: string
  user_id: string
  platform: Platform
  platform_video_id?: string
  title: string
  description: string
  tags: string[]
  published_at?: string
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  detail: string
  status_code: number
}

export interface HealthResponse {
  status: 'ok' | 'error'
  service: string
}
