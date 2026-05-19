import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const FORMAT_DESCRIPTIONS: Record<string, string> = {
  tiktok_60s:   'TikTok vertical, 60 secondes',
  reel_30s:     'Instagram Reel vertical, 30 secondes',
  youtube_5min: 'YouTube horizontal, 5 minutes',
  short_15s:    'Short vertical, 15 secondes',
}

const AUDIENCE_LABELS: Record<string, { fr: string; en: string }> = {
  kids:    { fr: 'enfants (6-12 ans)',         en: 'kids (6-12 years)' },
  teens:   { fr: 'adolescents (13-17 ans)',    en: 'teenagers (13-17 years)' },
  adults:  { fr: 'adultes (18-35 ans)',        en: 'adults (18-35 years)' },
  experts: { fr: 'professionnels et experts', en: 'professionals and experts' },
}

function pad2(n: number) { return String(Math.floor(n)).padStart(2, '0') }
function toTimecode(secs: number) { return `${pad2(secs / 60)}:${pad2(secs % 60)}` }

function buildSystemPrompt(
  character: {
    name: string
    personality: string
    catchphrase: string | null
    tic_verbal: string | null
    description: string | null
    language: string
  },
  format: string,
  tone: string,
  audience: string,
  durationSec: number,
): string {
  const lang = character.language === 'fr' ? 'fr' : 'en'
  const audienceLabel = AUDIENCE_LABELS[audience]?.[lang] ?? audience
  const formatLabel = FORMAT_DESCRIPTIONS[format] ?? format
  const ctaAt = toTimecode(durationSec * 0.85)

  const lines = [
    `Tu incarnes ${character.name}, un créateur de contenu vidéo IA.`,
    character.description ? `Contexte : ${character.description}` : null,
    `Personnalité : ${character.personality} | Audience : ${audienceLabel} | Ton : ${tone}`,
    character.catchphrase ? `Phrase culte : "${character.catchphrase}"` : null,
    character.tic_verbal  ? `Tic verbal : "${character.tic_verbal}" (à placer naturellement)` : null,
    '',
    `FORMAT : ${formatLabel} (~${durationSec}s)`,
    `LANGUE : ${character.language === 'fr' ? 'Français uniquement' : 'English only'}`,
    '',
    'STRUCTURE DU SCRIPT :',
    '[00:00] HOOK — accroche irrésistible, force l\'arrêt du scroll (3 secondes max)',
    '[00:03] DÉVELOPPEMENT — contenu à valeur, rythme soutenu',
    `[${ctaAt}] CALL-TO-ACTION — like, commentaire, abonnement`,
    '',
    `Règles : hook percutant en 3s · reste dans le personnage · catchphrase placée naturellement · écris UNIQUEMENT le script, aucun préambule.`,
  ]

  return lines.filter(l => l !== null).join('\n')
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    topic,
    characterId,
    format    = 'tiktok_60s',
    tone      = 'drole',
    audience  = 'adults',
    durationSec = 60,
  } = body as {
    topic: string
    characterId: string
    format?: string
    tone?: string
    audience?: string
    durationSec?: number
  }

  if (!topic || !characterId) {
    return NextResponse.json({ detail: 'topic and characterId are required' }, { status: 400 })
  }

  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('name, personality, catchphrase, tic_verbal, description, language')
    .eq('id', characterId)
    .eq('user_id', user.id)
    .single()

  if (charError || !character) {
    return NextResponse.json({ detail: 'Character not found' }, { status: 404 })
  }

  const systemPrompt = buildSystemPrompt(character, format, tone, audience, Number(durationSec))

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    prompt: `Sujet : ${topic}`,
    maxOutputTokens: 2000,
    onFinish: async ({ text, totalUsage }) => {
      await supabase.from('scripts').insert({
        user_id:            user.id,
        character_id:       characterId,
        title:              topic.length > 80 ? topic.slice(0, 77) + '...' : topic,
        topic,
        content:            text,
        format,
        tone,
        audience,
        language:           character.language,
        estimated_duration: Number(durationSec),
        tokens_used:        totalUsage.totalTokens ?? null,
        status:             'draft',
      })
    },
  })

  return result.toTextStreamResponse()
}
