'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchCharacter, updateCharacter, type Character } from '@/lib/api/characters'
import CharacterAvatar from '@/components/characters/CharacterAvatar'

const PERSONALITY_LABELS: Record<string, { fr: string; en: string; emoji: string }> = {
  drole:   { fr: 'Drôle',   en: 'Funny',   emoji: '😄' },
  serieux: { fr: 'Sérieux', en: 'Serious', emoji: '🎯' },
  sage:    { fr: 'Sage',    en: 'Wise',    emoji: '🦉' },
  naif:    { fr: 'Naïf',    en: 'Naive',   emoji: '🐥' },
}

const TONE_LABELS: Record<string, { fr: string; en: string; emoji: string }> = {
  kid:    { fr: 'Enfants', en: 'Kids',    emoji: '👶' },
  teen:   { fr: 'Ados',    en: 'Teens',   emoji: '🧑' },
  adult:  { fr: 'Adultes', en: 'Adults',  emoji: '👨' },
  expert: { fr: 'Experts', en: 'Experts', emoji: '🎓' },
}

const t = {
  fr: {
    back: '← Mes personnages',
    edit: 'Modifier',
    cancel: 'Annuler',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    loading: 'Chargement...',
    notFound: 'Personnage introuvable.',
    personality: 'Personnalité',
    tone: 'Audience',
    catchphrase: 'Phrase culte',
    tic: 'Tic verbal',
    language: 'Langue',
    createdAt: 'Créé le',
    none: '—',
    saveError: 'Erreur lors de l\'enregistrement.',
  },
  en: {
    back: '← My characters',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    loading: 'Loading...',
    notFound: 'Character not found.',
    personality: 'Personality',
    tone: 'Audience',
    catchphrase: 'Catchphrase',
    tic: 'Verbal tic',
    language: 'Language',
    createdAt: 'Created',
    none: '—',
    saveError: 'Failed to save.',
  },
}

export default function CharacterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [lang] = useState<'fr' | 'en'>('fr')
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editForm, setEditForm] = useState({ name: '', description: '', catchphrase: '', tic_verbal: '' })
  const tr = t[lang]

  useEffect(() => {
    fetchCharacter(id)
      .then(c => {
        setCharacter(c)
        setEditForm({
          name: c.name,
          description: c.description ?? '',
          catchphrase: c.catchphrase ?? '',
          tic_verbal: c.tic_verbal ?? '',
        })
      })
      .catch(() => setError(tr.notFound))
      .finally(() => setLoading(false))
  }, [id, tr.notFound])

  async function handleSave() {
    if (!editForm.name.trim()) return
    setSaving(true)
    setError('')
    try {
      const updated = await updateCharacter(id, {
        name: editForm.name.trim(),
        ...(editForm.description.trim() && { description: editForm.description.trim() }),
        ...(editForm.catchphrase.trim() && { catchphrase: editForm.catchphrase.trim() }),
        ...(editForm.tic_verbal.trim() && { tic_verbal: editForm.tic_verbal.trim() }),
      })
      setCharacter(updated)
      setEditing(false)
    } catch {
      setError(tr.saveError)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">{tr.loading}</div>
  if (!character || error) return (
    <div className="p-8">
      <p className="text-red-500 mb-4">{error || tr.notFound}</p>
      <Link href="/characters" className="text-yellow-600 hover:text-yellow-700 font-semibold">{tr.back}</Link>
    </div>
  )

  const pMeta = PERSONALITY_LABELS[character.personality]
  const tMeta = TONE_LABELS[character.tone]
  const createdAt = new Date(character.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/characters" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          {tr.back}
        </Link>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            {tr.edit}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setError('') }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              {tr.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              {saving ? tr.saving : tr.save}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-5">
          <CharacterAvatar name={character.name} personality={character.personality} avatarUrl={character.avatar_url} size="lg" />
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className="w-full text-2xl font-bold text-gray-900 border-b-2 border-yellow-400 bg-transparent focus:outline-none pb-1"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{character.name}</h1>
            )}
            {editing ? (
              <textarea
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder={lang === 'fr' ? 'Description...' : 'Description...'}
                className="w-full mt-2 text-sm text-gray-500 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
            ) : character.description ? (
              <p className="text-gray-500 text-sm mt-1">{character.description}</p>
            ) : null}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {pMeta && (
            <span className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium">
              {pMeta.emoji} {pMeta[lang]}
            </span>
          )}
          {tMeta && (
            <span className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
              {tMeta.emoji} {tMeta[lang]}
            </span>
          )}
          <span className="inline-flex items-center text-sm px-3 py-1 bg-gray-100 text-gray-500 rounded-full uppercase font-semibold tracking-wide">
            {character.language}
          </span>
        </div>

        {/* Catchphrase + Tic */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{tr.catchphrase}</p>
            {editing ? (
              <input
                type="text"
                value={editForm.catchphrase}
                onChange={e => setEditForm(f => ({ ...f, catchphrase: e.target.value }))}
                placeholder="Coin coin !"
                className="w-full text-sm font-medium bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ) : (
              <p className="text-gray-800 font-medium italic">
                {character.catchphrase ? `"${character.catchphrase}"` : <span className="text-gray-400 not-italic">{tr.none}</span>}
              </p>
            )}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{tr.tic}</p>
            {editing ? (
              <input
                type="text"
                value={editForm.tic_verbal}
                onChange={e => setEditForm(f => ({ ...f, tic_verbal: e.target.value }))}
                placeholder="En fait, c'est très simple..."
                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {character.tic_verbal || <span className="text-gray-400 font-normal">{tr.none}</span>}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <p className="text-xs text-gray-400">{tr.createdAt} {createdAt}</p>
      </div>
    </div>
  )
}
