'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles } from 'lucide-react'
import type { Character } from '@/lib/api/characters'

const FORMAT_OPTIONS = [
  { value: 'tiktok_60s',   label: { fr: 'TikTok 60s',   en: 'TikTok 60s' } },
  { value: 'reel_30s',     label: { fr: 'Reel 30s',     en: 'Reel 30s' } },
  { value: 'youtube_5min', label: { fr: 'YouTube 5min', en: 'YouTube 5min' } },
  { value: 'short_15s',    label: { fr: 'Short 15s',    en: 'Short 15s' } },
]

const TONE_OPTIONS = [
  { value: 'drole',       label: { fr: 'Drôle 😄',       en: 'Funny 😄' } },
  { value: 'informatif',  label: { fr: 'Informatif 📚',  en: 'Informative 📚' } },
  { value: 'dramatique',  label: { fr: 'Dramatique 🎭',  en: 'Dramatic 🎭' } },
  { value: 'inspirant',   label: { fr: 'Inspirant ✨',   en: 'Inspiring ✨' } },
]

const AUDIENCE_OPTIONS = [
  { value: 'kids',    label: { fr: 'Enfants 👶',   en: 'Kids 👶' } },
  { value: 'teens',   label: { fr: 'Ados 🧑',      en: 'Teens 🧑' } },
  { value: 'adults',  label: { fr: 'Adultes 👨',   en: 'Adults 👨' } },
  { value: 'experts', label: { fr: 'Experts 🎓',   en: 'Experts 🎓' } },
]

const DURATION_OPTIONS = [
  { value: 15,  label: '15s' },
  { value: 30,  label: '30s' },
  { value: 60,  label: '60s' },
  { value: 300, label: '5min' },
]

const tr = {
  fr: {
    noChar:      'Aucun personnage disponible.',
    noCharSub:   'Crée d\'abord un personnage pour générer un script.',
    createChar:  'Créer un personnage →',
    character:   'Personnage',
    topic:       'Sujet du script',
    topicPlh:    'Ex : Les 3 erreurs que font tous les débutants...',
    format:      'Format',
    tone:        'Ton',
    audience:    'Audience',
    duration:    'Durée cible',
    generate:    'Générer le script ✨',
    generating:  'Génération en cours...',
    result:      'Script généré',
    viewAll:     'Voir tous mes scripts →',
    error:       'Erreur lors de la génération. Réessaie.',
  },
  en: {
    noChar:      'No characters available.',
    noCharSub:   'Create a character first before generating a script.',
    createChar:  'Create a character →',
    character:   'Character',
    topic:       'Script topic',
    topicPlh:    'E.g.: The 3 mistakes every beginner makes...',
    format:      'Format',
    tone:        'Tone',
    audience:    'Audience',
    duration:    'Target duration',
    generate:    'Generate script ✨',
    generating:  'Generating...',
    result:      'Generated script',
    viewAll:     'View all my scripts →',
    error:       'Generation failed. Please retry.',
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
  const [tone, setTone]               = useState('drole')
  const [audience, setAudience]       = useState('adults')
  const [durationSec, setDurationSec] = useState(60)
  const [content, setContent]         = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [isDone, setIsDone]           = useState(false)
  const [error, setError]             = useState('')
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

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
    setIsLoading(true)

    try {
      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), characterId, format, tone, audience, durationSec }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail ?? `Error ${res.status}`)
      }

      const reader = res.body!.getReader()
      readerRef.current = reader
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
      readerRef.current = null
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.format}</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
            >
              {FORMAT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label[lang]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.duration}</label>
            <select
              value={durationSec}
              onChange={e => setDurationSec(Number(e.target.value))}
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
            >
              {DURATION_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.tone}</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
            >
              {TONE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label[lang]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.audience}</label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
            >
              {AUDIENCE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label[lang]}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim() || !characterId}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
        >
          {isLoading
            ? <><Loader2 size={16} className="animate-spin" />{t.generating}</>
            : t.generate}
        </button>
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
              <Link
                href="/scripts"
                className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                {t.viewAll}
              </Link>
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
