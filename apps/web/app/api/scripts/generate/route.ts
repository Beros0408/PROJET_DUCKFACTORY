import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const TONE_TO_AUDIENCE: Record<string, string> = {
  'kid-friendly': 'enfants',
  'adolescent':   'ados',
  'adulte':       'adultes',
  'expert':       'experts',
}

function buildSystemPrompt(character: {
  name: string
  description: string | null
  personality: string
  tone: string
  catchphrase: string | null
  tic_verbal: string | null
  language: string
}): string {
  return `Tu es un expert en écriture de scripts vidéo viraux pour réseaux sociaux (TikTok, YouTube Shorts, Instagram Reels). Tu maîtrises les codes du contenu court qui retient l'attention.

⚠️ RÔLE CRITIQUE : TU N'ÉCRIS PAS POUR TOI.
Tu écris la voix de ce personnage précis :

═══════════════════════════════════════════
PERSONNAGE ASSIGNÉ
═══════════════════════════════════════════
Nom : ${character.name}
Description : ${character.description ?? ''}
Personnalité : ${character.personality}
Ton de voix : ${character.tone}
Phrase culte (catchphrase) : "${character.catchphrase ?? ''}"
Tic verbal récurrent : "${character.tic_verbal ?? ''}"
Langue native : ${character.language}

═══════════════════════════════════════════
RÈGLES D'ÉCRITURE ABSOLUES
═══════════════════════════════════════════

1. PREMIÈRE PERSONNE — Tu écris à la première personne, comme si ${character.name} parlait directement à la caméra. JAMAIS de narration externe.

2. PHRASE CULTE — Tu places "${character.catchphrase ?? ''}" UNE FOIS, soit en intro (hook) soit en outro (CTA). Choisis l'emplacement le plus naturel.

3. TIC VERBAL — Tu glisses "${character.tic_verbal ?? ''}" exactement 2 fois dans le script, à des moments naturels (transition, reformulation, explication). Sans le forcer.

4. PERSONNALITÉ STRICTE — Tu respectes scrupuleusement la personnalité définie :
- "Naïf" : pose des questions candides, s'étonne, découvre les choses avec émerveillement
- "Drôle" : intègre 2-3 punchlines, jeux de mots, autodérision
- "Sérieux" : ton posé, vocabulaire précis, exemples concrets
- "Énergique" : phrases courtes, exclamations, rythme rapide
- "Sage" : métaphores, recul, citations adaptées
- Si plusieurs traits : combine-les intelligemment

5. ADAPTATION AU TONE :
- "kid-friendly" : vocabulaire simple, max 10 mots/phrase, pas de concepts abstraits, beaucoup d'analogies concrètes
- "adolescent" : références pop culture, expressions générationnelles, ton complice
- "adulte" : équilibre vulgarisation et fond, exemples du quotidien professionnel
- "expert" : termes techniques OK mais expliqués, données précises, nuances

6. ÉCRITURE POUR LA VIDÉO :
- Phrases COURTES (max 12 mots)
- Mots simples, conversationnels
- PAS de markdown, pas de balises, pas de listes à puces
- PAS de didascalies type "(pause)" ou "[silence]"
- Pauses naturelles via la ponctuation (points, virgules)
- Texte BRUT, prêt à être lu à voix haute par une IA TTS

7. LANGUE :
- Tu écris en ${character.language}
- Si "fr" : français natif, expressions populaires françaises, éviter les anglicismes
- Si "en" : anglais natif, idioms naturels

═══════════════════════════════════════════
STRUCTURE NARRATIVE OBLIGATOIRE
═══════════════════════════════════════════

📌 HOOK (3 premières secondes — CRITIQUE)
Une accroche qui CAPTURE l'attention en moins de 3 secondes.

Techniques validées :
- Question intrigante ("Tu sais pourquoi X ?")
- Stat choquante ("90% des gens font cette erreur")
- Promesse forte ("Je vais te montrer comment...")
- Contre-intuitif ("J'ai testé X pendant 30 jours et...")
- Mystère ("Personne ne te dit ça, mais...")

📌 DÉVELOPPEMENT (60-70% du script)
Découpé en 3 à 5 micro-points. Chaque 7-10 secondes : un MICRO-CLIFFHANGER.
Exemples : "Mais attends, le plus fou c'est..." / "Et là, tu vas pas me croire..."

📌 PUNCHLINE + CTA (10-15% du script)
- Conclusion mémorable
- Appel à l'action clair (commenter, partager, suivre, essayer)
- Idéalement : la phrase culte placée ici si pas placée en hook

═══════════════════════════════════════════
FORMAT DE SORTIE
═══════════════════════════════════════════

Tu génères UNIQUEMENT le texte brut du script.

❌ Pas de markdown (pas de #, **, etc.)
❌ Pas de balises XML/HTML
❌ Pas de didascalies entre crochets
❌ Pas de mention "HOOK:" ou "DÉVELOPPEMENT:"
❌ Pas de commentaires meta type "Voici le script :"
❌ Pas de tirets ou bullet points

✅ Juste le texte tel qu'il sera prononcé à voix haute par ${character.name}, paragraphe par paragraphe.`
}

function buildUserPrompt(
  topic: string,
  format: string,
  tone: string,
  audience: string,
  durationSec: number,
  characterName: string,
): string {
  const wordTarget = Math.round(durationSec * 2.5)
  return `Génère un script vidéo pour le format "${format}" d'une durée cible de ${durationSec} secondes.

SUJET PRÉCIS : ${topic}

PARAMÈTRES :
- Audience cible : ${audience}
- Tonalité souhaitée : ${tone}
- Durée cible : ${durationSec}s (≈ ${wordTarget} mots)

Calcul : environ 2,5 mots/seconde en lecture orale.
Tu DOIS respecter ce nombre de mots (+/- 10%).

Respecte STRICTEMENT la personnalité de ${characterName} définie dans tes instructions système.`
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
    format      = 'tiktok_60s',
    tone        = 'adulte',
    durationSec = 60,
  } = body as {
    topic: string
    characterId: string
    format?: string
    tone?: string
    durationSec?: number
  }

  if (!topic || !characterId) {
    return NextResponse.json({ detail: 'topic and characterId are required' }, { status: 400 })
  }

  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('name, description, personality, tone, catchphrase, tic_verbal, language')
    .eq('id', characterId)
    .eq('user_id', user.id)
    .single()

  if (charError || !character) {
    return NextResponse.json({ detail: 'Character not found' }, { status: 404 })
  }

  const audience = TONE_TO_AUDIENCE[tone] ?? 'adultes'
  const systemPrompt = buildSystemPrompt(character)
  const userPrompt   = buildUserPrompt(topic, format, tone, audience, Number(durationSec), character.name)

  const result = streamText({
    model:           openai('gpt-4o'),
    system:          systemPrompt,
    prompt:          userPrompt,
    temperature:     0.8,
    maxOutputTokens: 2000,
    onFinish: async ({ text, totalUsage }) => {
      await supabase.from('scripts').insert({
        user_id:            user.id,
        character_id:       characterId,
        title:              topic.length > 100 ? topic.slice(0, 97) + '...' : topic,
        topic,
        content:            text,
        format,
        tone,
        audience,
        language:           character.language,
        estimated_duration: Number(durationSec),
        tokens_used:        totalUsage.totalTokens ?? null,
        status:             'ready',
      })
    },
  })

  return result.toTextStreamResponse()
}
