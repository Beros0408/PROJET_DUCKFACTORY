'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '@/components/common/BackButton'
import { fetchScript, deleteScript, type Script } from '@/lib/api/scripts'

const FORMAT_LABELS: Record<string, string> = {
  tiktok_60s:   'TikTok 60s',
  reel_30s:     'Reel 30s',
  youtube_5min: 'YouTube 5min',
  short_15s:    'Short 15s',
}

const AUDIENCE_LABELS: Record<string, { fr: string; en: string }> = {
  kids:    { fr: 'Enfants',              en: 'Kids' },
  teens:   { fr: 'Adolescents',         en: 'Teens' },
  adults:  { fr: 'Adultes',             en: 'Adults' },
  experts: { fr: 'Experts',             en: 'Experts' },
}

const tr = {
  fr: {
    loading:       'Chargement...',
    notFound:      'Script introuvable.',
    topic:         'Sujet',
    format:        'Format',
    audience:      'Audience',
    duration:      'Durée estimée',
    tokens:        'Tokens utilisés',
    createdAt:     'Créé le',
    script:        'Script',
    delete:        'Supprimer',
    deleting:      'Suppression...',
    deleteConfirm: 'Supprimer ce script définitivement ?',
    deleteError:   'Suppression échouée.',
    backLabel:     'Mes scripts',
  },
  en: {
    loading:       'Loading...',
    notFound:      'Script not found.',
    topic:         'Topic',
    format:        'Format',
    audience:      'Audience',
    duration:      'Estimated duration',
    tokens:        'Tokens used',
    createdAt:     'Created',
    script:        'Script',
    delete:        'Delete',
    deleting:      'Deleting...',
    deleteConfirm: 'Permanently delete this script?',
    deleteError:   'Delete failed.',
    backLabel:     'My scripts',
  },
}

export default function ScriptDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const id      = params.id as string
  const [lang]                    = useState<'fr' | 'en'>('fr')
  const [script, setScript]       = useState<Script | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [deleting, setDeleting]   = useState(false)
  const t = tr[lang]

  useEffect(() => {
    fetchScript(id)
      .then(setScript)
      .catch(() => setError(t.notFound))
      .finally(() => setLoading(false))
  }, [id, t.notFound])

  async function handleDelete() {
    if (!confirm(t.deleteConfirm)) return
    setDeleting(true)
    try {
      await deleteScript(id)
      router.push('/scripts')
    } catch {
      setError(t.deleteError)
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">{t.loading}</div>
  if (!script || error) return (
    <div className="p-8">
      <BackButton href="/scripts" label={t.backLabel} />
      <p className="text-red-500">{error || t.notFound}</p>
    </div>
  )

  const createdAt = new Date(script.created_at).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
  const audienceLabel = AUDIENCE_LABELS[script.audience]?.[lang] ?? script.audience

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-2">
        <BackButton href="/scripts" label={t.backLabel} />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm text-red-400 hover:text-red-600 transition-colors disabled:opacity-60 py-2 px-2 min-h-[44px]"
        >
          {deleting ? t.deleting : t.delete}
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{script.title}</h1>

      {/* Metadata */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{t.format}</p>
          <p className="text-sm font-medium text-gray-900">{FORMAT_LABELS[script.format] ?? script.format}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{t.audience}</p>
          <p className="text-sm font-medium text-gray-900">{audienceLabel}</p>
        </div>
        {script.estimated_duration != null && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{t.duration}</p>
            <p className="text-sm font-medium text-gray-900">{script.estimated_duration}s</p>
          </div>
        )}
        {script.tokens_used != null && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{t.tokens}</p>
            <p className="text-sm font-medium text-gray-900">{script.tokens_used.toLocaleString()}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{t.createdAt}</p>
          <p className="text-sm font-medium text-gray-900">{createdAt}</p>
        </div>
      </div>

      {/* Topic */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-400 mb-1">{t.topic}</p>
        <p className="text-sm text-gray-800">{script.topic}</p>
      </div>

      {/* Script content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">📝 {t.script}</h2>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
          {script.content}
        </pre>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
          {error}
        </div>
      )}
    </div>
  )
}
