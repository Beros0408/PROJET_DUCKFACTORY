'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchCharacters, deleteCharacter, type Character } from '@/lib/api/characters'
import CharacterCard from '@/components/characters/CharacterCard'
import BackButton from '@/components/common/BackButton'

const t = {
  fr: {
    title: 'Mes personnages',
    subtitle: 'Tes avatars IA pour produire du contenu viral.',
    create: '+ Créer un personnage',
    loading: 'Chargement...',
    empty: 'Aucun personnage pour l\'instant.',
    emptySub: 'Crée ton premier personnage IA et donne-lui vie !',
    emptyBtn: 'Créer Cancan le Canard 🦆',
    error: 'Impossible de charger les personnages.',
  },
  en: {
    title: 'My characters',
    subtitle: 'Your AI avatars for producing viral content.',
    create: '+ Create a character',
    loading: 'Loading...',
    empty: 'No characters yet.',
    emptySub: 'Create your first AI character and bring them to life!',
    emptyBtn: 'Create Cancan the Duck 🦆',
    error: 'Failed to load characters.',
  },
}

export default function CharactersPage() {
  const [lang] = useState<'fr' | 'en'>('fr')
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const tr = t[lang]

  useEffect(() => {
    fetchCharacters()
      .then(setCharacters)
      .catch(() => setError(tr.error))
      .finally(() => setLoading(false))
  }, [tr.error])

  async function handleDelete(id: string) {
    try {
      await deleteCharacter(id)
      setCharacters(prev => prev.filter(c => c.id !== id))
    } catch {
      setError(lang === 'fr' ? 'Suppression échouée.' : 'Delete failed.')
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <BackButton href="/dashboard" label={lang === 'fr' ? 'Tableau de bord' : 'Dashboard'} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tr.title} 🎭</h1>
          <p className="text-gray-500 mt-1">{tr.subtitle}</p>
        </div>
        <Link
          href="/characters/new"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          {tr.create}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-24 text-gray-400">{tr.loading}</div>
      ) : characters.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🦆</div>
          <p className="text-gray-700 font-semibold text-lg mb-1">{tr.empty}</p>
          <p className="text-gray-400 text-sm mb-6">{tr.emptySub}</p>
          <Link
            href="/characters/new"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            {tr.emptyBtn}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              lang={lang}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
