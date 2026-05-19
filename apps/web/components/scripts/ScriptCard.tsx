import Link from 'next/link'
import type { Script } from '@/lib/api/scripts'

const FORMAT_LABELS: Record<string, string> = {
  tiktok_30s:   'TikTok 30s',
  tiktok_60s:   'TikTok 60s',
  reel_60s:     'Reel 60s',
  short_60s:    'Short 60s',
  youtube_5min: 'YouTube 5min',
  // legacy values
  reel_30s:     'Reel 30s',
  short_15s:    'Short 15s',
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  ready: 'bg-green-50 text-green-700',
  used:  'bg-blue-50 text-blue-700',
}

const STATUS_LABELS: Record<string, { fr: string; en: string }> = {
  draft: { fr: 'Brouillon', en: 'Draft' },
  ready: { fr: 'Prêt',      en: 'Ready' },
  used:  { fr: 'Utilisé',   en: 'Used'  },
}

function relativeTime(dateStr: string, lang: 'fr' | 'en'): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)

  if (lang === 'fr') {
    if (mins < 1)    return 'à l\'instant'
    if (mins < 60)   return `il y a ${mins}min`
    if (hours < 24)  return `il y a ${hours}h`
    if (days === 1)  return 'hier'
    if (days < 30)   return `il y a ${days}j`
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  } else {
    if (mins < 1)    return 'just now'
    if (mins < 60)   return `${mins}m ago`
    if (hours < 24)  return `${hours}h ago`
    if (days === 1)  return 'yesterday'
    if (days < 30)   return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }
}

interface Props {
  script: Script
  lang: 'fr' | 'en'
  onDelete?: (id: string) => void
}

export default function ScriptCard({ script, lang, onDelete }: Props) {
  const timeAgo     = relativeTime(script.created_at, lang)
  const statusStyle = STATUS_STYLES[script.status] ?? STATUS_STYLES.draft
  const statusLabel = STATUS_LABELS[script.status]?.[lang] ?? script.status
  const preview     = script.content
    .split('\n')
    .filter(l => l.trim())
    .slice(0, 3)
    .join(' ')
    .slice(0, 120)

  return (
    <Link
      href={`/scripts/${script.id}`}
      className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1 group-hover:text-yellow-700 transition-colors">
          {script.title}
        </h3>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>

      {/* Content preview */}
      {preview && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{preview}…</p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          {FORMAT_LABELS[script.format] ?? script.format}
        </span>
        {script.estimated_duration != null && (
          <span className="text-xs text-gray-400">{script.estimated_duration}s</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-400">{timeAgo}</span>
        <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
          {onDelete && (
            <button
              onClick={() => onDelete(script.id)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 min-h-[32px]"
            >
              {lang === 'fr' ? 'Supprimer' : 'Delete'}
            </button>
          )}
          <span className="text-xs font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors px-2 py-1">
            {lang === 'fr' ? 'Voir →' : 'View →'}
          </span>
        </div>
      </div>
    </Link>
  )
}
