'use client'

import { useState } from 'react'
import { generateVoice, type Voiceover } from '@/lib/api/voiceovers'

const tr = {
  fr: {
    generate:   '🎤 Générer la voix',
    generating: 'Génération en cours...',
    title:      'Voix Cancan',
    error:      'Erreur lors de la génération de la voix.',
    success:    'Voix générée avec succès !',
  },
  en: {
    generate:   '🎤 Generate voice',
    generating: 'Generating...',
    title:      'Cancan Voice',
    error:      'Voice generation failed.',
    success:    'Voice generated successfully!',
  },
}

interface Props {
  scriptId: string
  existingVoiceover?: Voiceover | null
  lang: 'fr' | 'en'
}

export default function VoicePlayer({ scriptId, existingVoiceover, lang }: Props) {
  const [voiceover, setVoiceover] = useState<Voiceover | null>(existingVoiceover ?? null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const t = tr[lang]

  async function handleGenerate() {
    setLoading(true)
    setError('')
    try {
      const result = await generateVoice(scriptId)
      setVoiceover(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-yellow-200 p-6 mt-6">
      <h2 className="font-bold text-slate-900 mb-4">🎙️ {t.title}</h2>

      {voiceover?.audio_url ? (
        <audio controls src={voiceover.audio_url} className="w-full" />
      ) : loading ? (
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <span className="inline-block w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          {t.generating}
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold text-sm px-5 py-3 rounded-xl transition-colors min-h-[44px]"
        >
          {t.generate}
        </button>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
    </div>
  )
}
