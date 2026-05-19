import Link from 'next/link'
import type { Script } from '@/lib/api/scripts'

const FORMAT_LABELS: Record<string, string> = {
  tiktok_60s:   'TikTok 60s',
  reel_30s:     'Reel 30s',
  youtube_5min: 'YouTube 5min',
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

interface Props {
  script: Script
  lang: 'fr' | 'en'
  onDelete?: (id: string) => void
}

export default function ScriptCard({ script, lang, onDelete }: Props) {
  const date = new Date(script.created_at).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' },
  )
  const statusStyle = STATUS_STYLES[script.status] ?? STATUS_STYLES.draft
  const statusLabel = STATUS_LABELS[script.status]?.[lang] ?? script.status

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
          {script.title}
        </h3>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>

      <p className="text-gray-400 text-xs mb-3 line-clamp-2">{script.topic}</p>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          {FORMAT_LABELS[script.format] ?? script.format}
        </span>
        {script.estimated_duration != null && (
          <span className="text-xs text-gray-400">{script.estimated_duration}s</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-400">{date}</span>
        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              onClick={() => onDelete(script.id)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 min-h-[32px]"
            >
              {lang === 'fr' ? 'Supprimer' : 'Delete'}
            </button>
          )}
          <Link
            href={`/scripts/${script.id}`}
            className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition-colors px-2 py-1 min-h-[32px] inline-flex items-center"
          >
            {lang === 'fr' ? 'Voir →' : 'View →'}
          </Link>
        </div>
      </div>
    </div>
  )
}
