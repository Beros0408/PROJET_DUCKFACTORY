'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BackButton from '@/components/common/BackButton'
import ScriptCard from '@/components/scripts/ScriptCard'
import { fetchScripts, deleteScript, type Script } from '@/lib/api/scripts'

const tr = {
  fr: {
    title:    'Mes scripts 📝',
    subtitle: 'Tes scripts vidéo générés par IA.',
    create:   '+ Nouveau script',
    loading:  'Chargement...',
    empty:    'Aucun script pour l\'instant.',
    emptySub: 'Génère ton premier script viral !',
    emptyBtn: '+ Créer un script',
    error:    'Impossible de charger les scripts.',
    delError: 'Suppression échouée.',
  },
  en: {
    title:    'My scripts 📝',
    subtitle: 'Your AI-generated video scripts.',
    create:   '+ New script',
    loading:  'Loading...',
    empty:    'No scripts yet.',
    emptySub: 'Generate your first viral script!',
    emptyBtn: '+ Create a script',
    error:    'Failed to load scripts.',
    delError: 'Delete failed.',
  },
}

export default function ScriptsPage() {
  const [lang]                        = useState<'fr' | 'en'>('fr')
  const [scripts, setScripts]         = useState<Script[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const t = tr[lang]

  useEffect(() => {
    fetchScripts()
      .then(setScripts)
      .catch(() => setError(t.error))
      .finally(() => setLoading(false))
  }, [t.error])

  async function handleDelete(id: string) {
    try {
      await deleteScript(id)
      setScripts(prev => prev.filter(s => s.id !== id))
    } catch {
      setError(t.delError)
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <BackButton href="/dashboard" label={lang === 'fr' ? 'Tableau de bord' : 'Dashboard'} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        <Link
          href="/scripts/new"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          {t.create}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-24 text-gray-400">{t.loading}</div>
      ) : scripts.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-700 font-semibold text-lg mb-1">{t.empty}</p>
          <p className="text-gray-400 text-sm mb-6">{t.emptySub}</p>
          <Link
            href="/scripts/new"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            {t.emptyBtn}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {scripts.map(script => (
            <ScriptCard
              key={script.id}
              script={script}
              lang={lang}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
