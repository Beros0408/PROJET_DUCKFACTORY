'use client'

import { useState } from 'react'
import { fetchVideo, generateVideo, type Video, type VideoGenerationResult } from '@/lib/api/videos'

const tr = {
  fr: {
    generate:     '🎬 Générer la vidéo',
    generating:   'Transcription + préparation...',
    playerTitle:  '🎬 Vidéo Cancan',
    error:        'Erreur lors de la génération.',
    success:      'Vidéo prête !',
    commandHint:  'Lance cette commande dans ton terminal pour render la vidéo :',
    checkStatus:  'Vérifier le statut',
    checking:     'Vérification...',
    pending:      '⏳ En attente du render local',
    rendering:    '⚙️ Render en cours...',
    download:     '⬇️ Télécharger',
    failed:       '❌ Échec du render',
    copyCommand:  'Copier',
    copied:       'Copié !',
  },
  en: {
    generate:     '🎬 Generate video',
    generating:   'Transcribing + preparing...',
    playerTitle:  '🎬 Cancan Video',
    error:        'Video generation failed.',
    success:      'Video ready!',
    commandHint:  'Run this command in your terminal to render the video:',
    checkStatus:  'Check status',
    checking:     'Checking...',
    pending:      '⏳ Waiting for local render',
    rendering:    '⚙️ Rendering...',
    download:     '⬇️ Download',
    failed:       '❌ Render failed',
    copyCommand:  'Copy',
    copied:       'Copied!',
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
  const [command, setCommand] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    try {
      const result: VideoGenerationResult = await generateVideo(scriptId)
      setVideo(result.video)
      setCommand(result.command)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error)
    } finally {
      setGenerating(false)
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

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // No video yet
  if (!video) {
    return (
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">{t.playerTitle}</h2>
        {error && (
          <p className="text-sm text-red-600 mb-3 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 min-h-[44px]"
        >
          {generating ? t.generating : t.generate}
        </button>
      </div>
    )
  }

  // Ready — show video player
  if (video.status === 'ready' && video.video_url) {
    return (
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">{t.playerTitle}</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {t.success}
          </span>
        </div>
        <div className="flex justify-center">
          <video
            controls
            src={video.video_url}
            style={{ maxWidth: 400, width: '100%', borderRadius: 12 }}
            className="rounded-xl border border-gray-200"
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

  // Failed
  if (video.status === 'failed') {
    return (
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-3">{t.playerTitle}</h2>
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
          {t.failed}
          {video.error_message ? ` — ${video.error_message}` : ''}
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 min-h-[44px]"
        >
          {generating ? t.generating : t.generate}
        </button>
      </div>
    )
  }

  // Pending / rendering — show command to copy
  const displayCommand = command ?? `pnpm --filter render render -- --script-id=${scriptId}`

  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">{t.playerTitle}</h2>
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
          {video.status === 'rendering' ? t.rendering : t.pending}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-3">{t.commandHint}</p>

      <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-4 py-3">
        <code className="flex-1 text-yellow-300 text-sm font-mono break-all">
          {displayCommand}
        </code>
        <button
          onClick={() => handleCopy(displayCommand)}
          className="shrink-0 text-xs bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? t.copied : t.copyCommand}
        </button>
      </div>

      <button
        onClick={handleCheckStatus}
        disabled={checking}
        className="mt-4 w-full border border-gray-200 hover:border-yellow-400 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-60 min-h-[44px] text-sm"
      >
        {checking ? t.checking : t.checkStatus}
      </button>
    </div>
  )
}
