import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

interface RouteContext {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('script_id', params.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return Response.json(video ?? null)
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  // Fetch script + character avatar
  const { data: script } = await supabase
    .from('scripts')
    .select('id, user_id, subtitles, characters(avatar_url)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!script) return Response.json({ detail: 'Script not found' }, { status: 404 })

  // Check voiceover
  const { data: voiceover } = await supabase
    .from('voiceovers')
    .select('id, audio_url')
    .eq('script_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!voiceover?.audio_url) {
    return Response.json(
      { detail: 'No voiceover found. Generate voice first.' },
      { status: 400 },
    )
  }

  // Transcribe if subtitles are missing
  let subtitles = script.subtitles as Array<{ word: string; start: number; end: number }> | null

  if (!subtitles || subtitles.length === 0) {
    const audioRes = await fetch(voiceover.audio_url)
    if (!audioRes.ok) {
      return Response.json({ detail: 'Failed to download audio for transcription' }, { status: 502 })
    }
    const audioBuffer = await audioRes.arrayBuffer()

    const form = new FormData()
    form.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'voice.mp3')
    form.append('model', 'whisper-1')
    form.append('response_format', 'verbose_json')
    form.append('timestamp_granularities[]', 'word')

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    })

    if (!whisperRes.ok) {
      const errText = await whisperRes.text()
      return Response.json({ detail: `Transcription failed: ${errText}` }, { status: 502 })
    }

    const transcription = await whisperRes.json()
    subtitles = transcription.words ?? []

    await supabase.from('scripts').update({ subtitles }).eq('id', params.id)
  }

  // Mascot image URL
  const charactersData = script.characters as
    | { avatar_url: string | null }
    | Array<{ avatar_url: string | null }>
    | null
  const mascotImageUrl = Array.isArray(charactersData)
    ? (charactersData[0]?.avatar_url ?? null)
    : (charactersData?.avatar_url ?? null)

  // Insert videos row
  const { data: videoRow, error: insertErr } = await supabase
    .from('videos')
    .insert({ user_id: user.id, script_id: params.id, status: 'pending' })
    .select()
    .single()

  if (insertErr) {
    return Response.json({ detail: insertErr.message }, { status: 500 })
  }

  return Response.json(
    {
      videoId: videoRow.id,
      command: `pnpm --filter render render -- --script-id=${params.id}`,
      audioUrl: voiceover.audio_url,
      subtitles,
      mascotImageUrl,
      video: videoRow,
    },
    { status: 201 },
  )
}
