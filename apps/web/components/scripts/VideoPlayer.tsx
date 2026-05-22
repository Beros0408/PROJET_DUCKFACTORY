'use client'

import { useState } from 'react'
import {
  fetchVideo,
  generateVideo,
  transcribeScript,
  type Video,
} from '@/lib/api/videos'

type GeneratingStep = 'idle' | 'transcribing' | 'generating'

const tr = {
  fr: {
    sectionTitle:    '🎬 Vidéo Cancan',
    generate:        '🎬 Générer la vidéo',
    generating:      'Génération en cours...',
    transcribing:    'Transcription audio en cours...',
    pendingLocal:    'En attente du rendu local',
    commandHint:     'Lancez cette commande dans votre terminal :',
    copyCommand:     'Copier la commande',
    commandCopied:   'Copié !',
    checkStatus:     'Vérifier le statut',
    checking:        'Vérification...',
    ready:           'Vidéo prête',
    download:        '📥 Télécharger la vidéo',
    rendering:       '⚙️ Render en cours...',
    failed:          '❌ Échec du render',
    error:           'Erreur de génération',
    retryGenerate:   '↺ Réessayer',
  },
  en: {
    sectionTitle:    '🎬 Cancan Video',
    generate:        '🎬 Generate video',
    generating:      'Generating...',
    transcribing:    'Transcribing audio...',
    pendingLocal:    'Waiting for local render',
    commandHint:     'Run this command in your terminal:',
    copyCommand:     'Copy command',
    commandCopied:   'Copied!',
    checkStatus:     'Check status',
    checking:        'Checking...',
    ready:           'Video ready',
    download:        '📥 Download video',
    rendering:       '⚙️ Rendering...',
    failed:          '❌ Render failed',
    error:           'Generation error',
    retryGenerate:   '↺ Retry',
  },
}

interface VideoPlayerProps {
  scriptId: string
  existingVideo: Video | null
  lang: 'fr' | 'en'
}

export default function VideoPlayer({ scriptId, existingVideo, lang }: VideoPlayerProps) {
  const t = tr[lang]
  const [video, setVideo] = useState<Video | null>(existingVideo)
  const [step, setStep] = useState<GeneratingStep>('idle')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const renderCommand = `pnpm --filter render render -- --script-id=${scriptId}`

  async function handleGenerate() {
    setStep('generating')
    setError('')
    try {
      let result
      try {
        result = await generateVideo(scriptId)
      } catch (err) {
        // 400 means subtitles missing — transcribe first then retry
        if (err instanceof Error && err.message.toLowerCase().includes('transcrib')) {
          setStep('transcribing')
          await transcribeScript(scriptId)
          setStep('generating')
          result = await generateVideo(scriptId)
        } else {
          throw err
        }
      }
      // Fetch the full video row to reflect status
      const freshVideo = await fetchVideo(scriptId)
      setVideo(freshVideo ?? { id: result.videoId, status: 'pending' } as Video)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error)
    } finally {
      setStep('idle')
    }
  }

  async function handleCheckStatus() {
    setChecking(true)
    try {
      const refreshed = await fetchVideo(scriptId)
      if (refreshed) setVideo(refreshed)
    } catch {
      // silent
    } finally {
      setChecking(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(renderCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isGenerating = step !== 'idle'

  // ── Ready ────────────────────────────────────────────────────────────────
  if (video?.status === 'ready' && video.video_url) {
    return (
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">{t.sectionTitle}</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {t.ready}
          </span>
        </div>
        <div className="flex justify-center">
          <video
            controls
            src={video.video_url}
            className="rounded-xl border border-gray-200 w-full"
            style={{ maxWidth: 320 }}
          />
        </div>
        <a
          href={video.video_url}
          download={`cancan-video-${scriptId}.mp4`}
          className="mt-4 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors min-h-[44px]"
        >
          {t.download}
        </a>
      </div>
    )
  }

  // ── Pending / rendering — show render command ─────────────────────────────
  if (video?.status === 'pending' || video?.status === 'rendering') {
    return (
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">{t.sectionTitle}</h2>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
            {video.status === 'rendering' ? t.rendering : t.pendingLocal}
          </span>
        </div>

        <p className="text-sm text-slate-500 mb-3">{t.commandHint}</p>

        <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-4 py-3 mb-4">
          <code className="flex-1 text-yellow-300 text-sm font-mono break-all">
            {renderCommand}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-xs bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-3 py-1.5 rounded-lg transition-colors min-h-[32px]"
          >
            {copied ? t.commandCopied : t.copyCommand}
          </button>
        </div>

        <button
          onClick={handleCheckStatus}
          disabled={checking}
          className="w-full border border-gray-200 hover:border-yellow-400 text-slate-700 text-sm font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-60 min-h-[44px]"
        >
          {checking ? t.checking : t.checkStatus}
        </button>
      </div>
    )
  }

  // ── Failed ────────────────────────────────────────────────────────────────
  if (video?.status === 'failed') {
    return (
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-slate-900 mb-3">{t.sectionTitle}</h2>
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">
          {t.failed}{video.error_message ? ` — ${video.error_message}` : ''}
        </p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 min-h-[44px]"
        >
          {isGenerating ? t.generating : t.retryGenerate}
        </button>
      </div>
    )
  }

  // ── Idle — show generate button ───────────────────────────────────────────
  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-slate-900 mb-4">{t.sectionTitle}</h2>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">{error}</p>
      )}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 min-h-[44px]"
      >
        {step === 'transcribing'
          ? t.transcribing
          : isGenerating
          ? t.generating
          : t.generate}
      </button>
    </div>
  )
}
