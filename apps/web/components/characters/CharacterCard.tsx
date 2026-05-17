'use client'

import Link from 'next/link'
import type { Character } from '@/lib/api/characters'
import CharacterAvatar from './CharacterAvatar'

const PERSONALITY_LABELS: Record<string, { fr: string; en: string }> = {
  drole:   { fr: 'Drôle',   en: 'Funny'   },
  serieux: { fr: 'Sérieux', en: 'Serious' },
  sage:    { fr: 'Sage',    en: 'Wise'    },
  naif:    { fr: 'Naïf',    en: 'Naive'   },
}

const TONE_LABELS: Record<string, { fr: string; en: string }> = {
  kid:    { fr: 'Enfants', en: 'Kids'    },
  teen:   { fr: 'Ados',    en: 'Teens'   },
  adult:  { fr: 'Adultes', en: 'Adults'  },
  expert: { fr: 'Experts', en: 'Experts' },
}

interface CharacterCardProps {
  character: Character
  lang: 'fr' | 'en'
  onDelete: (id: string) => void
}

export default function CharacterCard({ character, lang, onDelete }: CharacterCardProps) {
  const personalityLabel = PERSONALITY_LABELS[character.personality]?.[lang] ?? character.personality
  const toneLabel = TONE_LABELS[character.tone]?.[lang] ?? character.tone
  const createdAt = new Date(character.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  function handleDelete() {
    const confirmed = window.confirm(
      lang === 'fr'
        ? `Supprimer "${character.name}" ? Cette action est irréversible.`
        : `Delete "${character.name}"? This cannot be undone.`
    )
    if (confirmed) onDelete(character.id)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <CharacterAvatar name={character.name} personality={character.personality} avatarUrl={character.avatar_url} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{character.name}</h3>
          {character.description && (
            <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{character.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full font-medium">
              {personalityLabel}
            </span>
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
              {toneLabel}
            </span>
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase font-semibold tracking-wide">
              {character.language}
            </span>
          </div>
        </div>
      </div>

      {character.catchphrase && (
        <p className="text-sm text-gray-600 italic border-l-2 border-yellow-300 pl-3">
          &ldquo;{character.catchphrase}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">{createdAt}</span>
        <div className="flex gap-2">
          <Link
            href={`/characters/${character.id}`}
            className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            {lang === 'fr' ? 'Voir' : 'View'} →
          </Link>
          <button
            onClick={handleDelete}
            className="text-xs font-semibold text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            {lang === 'fr' ? 'Supprimer' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
