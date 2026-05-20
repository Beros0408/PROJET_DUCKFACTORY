import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export const maxDuration = 60

interface RouteContext {
  params: { id: string }
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: script, error: scriptError } = await supabase
    .from('scripts')
    .select('id, content, user_id')
    .eq('id', params.id)
    .single()

  if (scriptError || !script) return new Response('Not Found', { status: 404 })

  const voiceId = process.env.ELEVENLABS_VOICE_ID!
  const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: script.content,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })

  if (!elevenRes.ok) {
    const errBody = await elevenRes.text()
    return Response.json({ detail: `ElevenLabs error: ${errBody}` }, { status: 502 })
  }

  const audioBuffer = await elevenRes.arrayBuffer()

  const storagePath = `${user.id}/${params.id}/voice.mp3`
  const { error: uploadError } = await supabase.storage
    .from('voiceovers')
    .upload(storagePath, audioBuffer, { contentType: 'audio/mpeg', upsert: true })

  if (uploadError) {
    return Response.json({ detail: `Storage error: ${uploadError.message}` }, { status: 500 })
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('voiceovers')
    .createSignedUrl(storagePath, 31536000)

  if (signedUrlError || !signedUrlData) {
    return Response.json({ detail: 'Failed to create signed URL' }, { status: 500 })
  }

  const { data: voiceover, error: insertError } = await supabase
    .from('voiceovers')
    .insert({
      user_id: user.id,
      script_id: params.id,
      audio_url: signedUrlData.signedUrl,
      voice_id: voiceId,
      model_id: 'eleven_multilingual_v2',
      characters_used: script.content.length,
      status: 'ready',
    })
    .select()
    .single()

  if (insertError) {
    return Response.json({ detail: `DB error: ${insertError.message}` }, { status: 500 })
  }

  return Response.json(voiceover, { status: 201 })
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: voiceover } = await supabase
    .from('voiceovers')
    .select('*')
    .eq('script_id', params.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return Response.json(voiceover ?? null)
}
