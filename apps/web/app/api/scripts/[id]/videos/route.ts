import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

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
