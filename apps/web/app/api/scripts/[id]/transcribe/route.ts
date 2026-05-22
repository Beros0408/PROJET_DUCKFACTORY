import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

interface RouteContext {
  params: { id: string }
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: script } = await supabase
    .from('scripts')
    .select('id, user_id, language')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!script) return Response.json({ detail: 'Script not found' }, { status: 404 })

  const { data: voiceover } = await supabase
    .from('voiceovers')
    .select('audio_url')
    .eq('script_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!voiceover?.audio_url) {
    return Response.json(
      { detail: 'Voiceover required. Generate voice first.' },
      { status: 400 },
    )
  }

  // Download the MP3 from Supabase Storage (signed URL)
  const audioResponse = await fetch(voiceover.audio_url)
  if (!audioResponse.ok) {
    return Response.json({ detail: 'Failed to download audio' }, { status: 502 })
  }
  const audioBuffer = await audioResponse.arrayBuffer()

  // Call OpenAI Whisper with word-level timestamps
  const form = new FormData()
  form.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'voice.mp3')
  form.append('model', 'whisper-1')
  form.append('response_format', 'verbose_json')
  form.append('timestamp_granularities[]', 'word')
  form.append('language', script.language ?? 'fr')

  const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  })

  if (!whisperRes.ok) {
    const errText = await whisperRes.text()
    return Response.json({ detail: `Whisper error: ${errText}` }, { status: 502 })
  }

  const transcription = await whisperRes.json()
  const words: Array<{ word: string; start: number; end: number }> =
    transcription.words ?? []

  // Save subtitles to scripts table
  const { error: updateErr } = await supabase
    .from('scripts')
    .update({ subtitles: words })
    .eq('id', params.id)

  if (updateErr) {
    return Response.json({ detail: updateErr.message }, { status: 500 })
  }

  return Response.json({
    subtitles: words,
    duration: transcription.duration ?? null,
  })
}
