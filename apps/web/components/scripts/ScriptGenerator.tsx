'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles, Square, RotateCcw, Copy, Check } from 'lucide-react'
import type { Character } from '@/lib/api/characters'

const FORMAT_OPTIONS = [
  { value: 'tiktok_30s',   icon: '🎵', label: { fr: 'TikTok 30s',  en: 'TikTok 30s'  }, dur: 30  },
  { value: 'tiktok_60s',   icon: '🎵', label: { fr: 'TikTok 60s',  en: 'TikTok 60s'  }, dur: 60  },
  { value: 'reel_60s',     icon: '📸', label: { fr: 'Reel 60s',    en: 'Reel 60s'    }, dur: 60  },
  { value: 'short_60s',    icon: '▶️', label: { fr: 'Short 60s',   en: 'Short 60s'   }, dur: 60  },
  { value: 'youtube_5min', icon: '📺', label: { fr: 'YouTube 5min', en: 'YouTube 5min' }, dur: 300 },
]

const TONE_OPTIONS = [
  { value: 'kid-friendly', label: { fr: 'Kid 👶',      en: 'Kid 👶'      } },
  { value: 'adolescent',   label: { fr: 'Ado 🧑',      en: 'Teen 🧑'     } },
  { value: 'adulte',       label: { fr: 'Adulte 👨',   en: 'Adult 👨'    } },
  { value: 'expert',       label: { fr: 'Expert 🎓',   en: 'Expert 🎓'   } },
]

const tr = {
  fr: {
    noChar:     'Aucun personnage disponible.',
    noCharSub:  'Crée d\'abord un personnage pour générer un script.',
    createChar: 'Créer un personnage →',
    character:  'Personnage',
    topic:      'Sujet du script',
    topicPlh:   'Ex : Les 3 erreurs que font tous les débutants en trading...',
    format:     'Format',
    tone:       'Tonalité',
    duration:   'Durée cible',
    seconds:    'secondes',
    generate:   '✨ Générer le script',
    generating: 'Génération en cours...',
    stop:       '⏹ Stop',
    result:     'Script généré',
    regenerate: '🔄 Régénérer',
    copy:       '📋 Copier',
    copied:     '✅ Copié !',
    viewAll:    'Voir tous mes scripts →',
    error:      'Erreur lors de la génération. Réessaie.',
  },
  en: {
    noChar:     'No characters available.',
    noCharSub:  'Create a character first before generating a script.',
    createChar: 'Create a character →',
    character:  'Character',
    topic:      'Script topic',
    topicPlh:   'E.g.: The 3 mistakes every beginner makes in trading...',
    format:     'Format',
    tone:       'Tone',
    duration:   'Target duration',
    seconds:    'seconds',
    generate:   '✨ Generate script',
    generating: 'Generating...',
    stop:       '⏹ Stop',
    result:     'Generated script',
    regenerate: '🔄 Regenerate',
    copy:       '📋 Copy',
    copied:     '✅ Copied!',
    viewAll:    'View all my scripts →',
    error:      'Generation failed. Please retry.',
  },
}

interface Props {
  characters: Character[]
  lang: 'fr' | 'en'
}

export default function ScriptGenerator({ characters, lang }: Props) {
  const t = tr[lang]
  const [characterId, setCharacterId] = useState(characters[0]?.id ?? '')
  const [topic, setTopic]             = useState('')
  const [format, setFormat]           = useState('tiktok_60s')
  const [tone, setTone]               = useState('adulte')
  const [durationSec, setDurationSec] = useState(60)
  const [content, setContent]         = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [isDone, setIsDone]           = useState(false)
  const [error, setError]             = useState('')
  const [copied, setCopied]           = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  if (characters.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-700 font-semibold text-lg mb-1">{t.noChar}</p>
        <p className="text-gray-400 text-sm mb-6">{t.noCharSub}</p>
        <Link
          href="/characters/new"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors"
        >
          {t.createChar}
        </Link>
      </div>
    )
  }

  async function handleGenerate() {
    if (!topic.trim() || !characterId || isLoading) return
    setContent('')
    setError('')
    setIsDone(false)
    setCopied(false)
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), characterId, format, tone, durationSec }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail ?? `Error ${res.status}`)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setContent(prev => prev + decoder.decode(value, { stream: true }))
      }

      setIsDone(true)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(t.error)
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }

  function handleStop() {
    abortRef.current?.abort()
    setIsLoading(false)
    setIsDone(true)
  }

  async function handleCopy() {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Sync duration when format changes
  function handleFormatChange(val: string) {
    setFormat(val)
    const opt = FORMAT_OPTIONS.find(o => o.value === val)
    if (opt) setDurationSec(opt.dur)
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">

        {/* Character */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.character}</label>
          <select
            value={characterId}
            onChange={e => setCharacterId(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
          >
            {characters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.topic}</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={t.topicPlh}
            rows={3}
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 resize-none"
          />
        </div>

        {/* Format cards */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.format}</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FORMAT_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => handleFormatChange(o.value)}
                disabled={isLoading}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all disabled:opacity-60 ${
                  format === o.value
                    ? 'border-yellow-400 bg-yellow-50 text-gray-900'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{o.icon}</span>
                {o.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Tone pills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.tone}</label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setTone(o.value)}
                disabled={isLoading}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all disabled:opacity-60 ${
                  tone === o.value
                    ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {o.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Duration slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">{t.duration}</label>
            <span className="text-sm font-bold text-gray-900">
              {durationSec >= 60
                ? `${Math.floor(durationSec / 60)}min${durationSec % 60 > 0 ? `${durationSec % 60}s` : ''}`
                : `${durationSec}${t.seconds}`}
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={300}
            step={15}
            value={durationSec}
            onChange={e => setDurationSec(Number(e.target.value))}
            disabled={isLoading}
            className="w-full accent-yellow-400 disabled:opacity-60"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>15s</span>
            <span>1min</span>
            <span>3min</span>
            <span>5min</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Generate / Stop */}
        {isLoading ? (
          <button
            onClick={handleStop}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Square size={14} />
            {t.stop}
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || !characterId}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
          >
            {t.generate}
          </button>
        )}
      </div>

      {/* Streaming output */}
      {(isLoading || content) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              {t.result}
            </h3>
            {isDone && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                  {copied
                    ? <><Check size={12} />{t.copied}</>
                    : <><Copy size={12} />{t.copy}</>}
                </button>
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <RotateCcw size={12} />
                  {t.regenerate}
                </button>
                <Link
                  href="/scripts"
                  className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  {t.viewAll}
                </Link>
              </div>
            )}
          </div>

          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed min-h-[200px]">
            {content}
            {isLoading && <span className="animate-pulse">▊</span>}
          </pre>
        </div>
      )}
    </div>
  )
}
