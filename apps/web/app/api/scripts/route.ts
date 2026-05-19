import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const characterId = searchParams.get('character_id')

  let query = supabase
    .from('scripts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (characterId) {
    query = query.eq('character_id', characterId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ detail: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
