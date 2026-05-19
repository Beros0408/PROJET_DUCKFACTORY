'use client'

import { useEffect, useState } from 'react'
import BackButton from '@/components/common/BackButton'
import ScriptGenerator from '@/components/scripts/ScriptGenerator'
import { fetchCharacters, type Character } from '@/lib/api/characters'

const tr = {
  fr: {
    title:    'Nouveau script ✨',
    subtitle: 'Génère un script viral dans le style de ton personnage.',
    loading:  'Chargement des personnages...',
    error:    'Impossible de charger les personnages.',
  },
  en: {
    title:    'New script ✨',
    subtitle: 'Generate a viral script in the style of your character.',
    loading:  'Loading characters...',
    error:    'Failed to load characters.',
  },
}

export default function NewScriptPage() {
  const [lang]                          = useState<'fr' | 'en'>('fr')
  const [characters, setCharacters]     = useState<Character[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const t = tr[lang]

  useEffect(() => {
    fetchCharacters()
      .then(setCharacters)
      .catch(() => setError(t.error))
      .finally(() => setLoading(false))
  }, [t.error])

  return (
    <div className="p-8">
      <BackButton href="/scripts" label={lang === 'fr' ? 'Mes scripts' : 'My scripts'} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-gray-500 mt-1">{t.subtitle}</p>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400">{t.loading}</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
          {error}
        </div>
      ) : (
        <ScriptGenerator characters={characters} lang={lang} />
      )}
    </div>
  )
}
