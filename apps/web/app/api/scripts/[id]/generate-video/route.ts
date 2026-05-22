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

  // Fetch script
  const { data: script } = await supabase
    .from('scripts')
    .select('id, user_id, subtitles')
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
      { status: 404 },
    )
  }

  // Require subtitles — caller must run /transcribe first
  const subtitles = script.subtitles as Array<{ word: string; start: number; end: number }> | null
  if (!subtitles || subtitles.length === 0) {
    return Response.json(
      { detail: 'Run /transcribe first. No subtitles found for this script.' },
      { status: 400 },
    )
  }

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
      status: 'pending',
      renderCommand: `pnpm --filter render render -- --script-id=${params.id}`,
      message: 'Run this command locally to render the video',
    },
    { status: 201 },
  )
}
