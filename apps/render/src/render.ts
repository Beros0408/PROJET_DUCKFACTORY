import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { createClient } from '@supabase/supabase-js'
import { config as loadDotenv } from 'dotenv'
import { readFileSync, mkdirSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env from render package dir and repo root
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..', '..')

loadDotenv({ path: path.join(__dirname, '..', '.env') })
loadDotenv({ path: path.join(__dirname, '..', '.env.local') })
loadDotenv({ path: path.join(repoRoot, '.env') })
loadDotenv({ path: path.join(repoRoot, '.env.local') })

interface ScriptRow {
  id: string
  user_id: string
  subtitles: Array<{ word: string; start: number; end: number }> | null
  characters: { avatar_url: string | null } | null
}

interface VoiceoverRow {
  id: string
  audio_url: string | null
}

interface VideoRow {
  id: string
  user_id: string
}

async function main() {
  const scriptId = process.argv
    .find((a) => a.startsWith('--script-id='))
    ?.split('=')[1]

  if (!scriptId) {
    console.error('Usage: pnpm --filter render render -- --script-id=<uuid>')
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error(
      'Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in apps/render/.env',
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  console.log(`[render] Fetching script ${scriptId}...`)

  const { data: script, error: scriptErr } = await supabase
    .from('scripts')
    .select('id, user_id, subtitles, characters(avatar_url)')
    .eq('id', scriptId)
    .single<ScriptRow>()

  if (scriptErr || !script) {
    console.error('Script not found:', scriptErr?.message)
    process.exit(1)
  }

  const { data: voiceover, error: voiceErr } = await supabase
    .from('voiceovers')
    .select('id, audio_url')
    .eq('script_id', scriptId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<VoiceoverRow>()

  if (voiceErr || !voiceover?.audio_url) {
    console.error('No voiceover found. Generate the voice first.')
    process.exit(1)
  }

  if (!script.subtitles || script.subtitles.length === 0) {
    console.error('No subtitles found. Run transcribe first via the web app.')
    process.exit(1)
  }

  // Get the videos row (most recent pending)
  const { data: videoRow } = await supabase
    .from('videos')
    .select('id, user_id')
    .eq('script_id', scriptId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<VideoRow>()

  if (videoRow) {
    await supabase.from('videos').update({ status: 'rendering' }).eq('id', videoRow.id)
    console.log(`[render] Video row ${videoRow.id} → rendering`)
  }

  const subtitles = script.subtitles
  const lastWord = subtitles[subtitles.length - 1]
  const durationInSeconds = (lastWord?.end ?? 60) + 0.8
  const fps = 30
  const durationInFrames = Math.ceil(durationInSeconds * fps)

  const mascotImageUrl =
    Array.isArray(script.characters)
      ? (script.characters[0] as { avatar_url: string | null } | undefined)?.avatar_url ?? null
      : (script.characters as { avatar_url: string | null } | null)?.avatar_url ?? null

  const inputProps = {
    audioUrl: voiceover.audio_url,
    subtitles,
    mascotImageUrl,
    durationInSeconds,
  }

  // Bundle
  console.log('[render] Bundling Remotion composition...')
  const entryPoint = path.join(__dirname, 'index.tsx')
  const bundleUrl = await bundle({
    entryPoint,
    onProgress: (p) => process.stdout.write(`\r[bundle] ${p}%   `),
  })
  console.log('\n[render] Bundle ready.')

  // Select composition
  const composition = await selectComposition({
    serveUrl: bundleUrl,
    id: 'CancanVideo',
    inputProps,
  })

  // Output path
  const outputDir = path.resolve(process.cwd(), 'output')
  mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, `video-${scriptId}.mp4`)

  // Render
  console.log(`[render] Rendering ${durationInFrames} frames at ${fps}fps...`)
  await renderMedia({
    composition: { ...composition, durationInFrames, fps },
    serveUrl: bundleUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r[render] ${Math.round(progress * 100)}%   `)
    },
  })
  console.log(`\n[render] Rendered → ${outputPath}`)

  const fileSizeBytes = statSync(outputPath).size

  // Upload to Supabase Storage
  const userId = videoRow?.user_id ?? script.user_id
  const storagePath = `${userId}/${scriptId}/video.mp4`
  const fileBuffer = readFileSync(outputPath)

  console.log('[render] Uploading to Supabase Storage...')
  const { error: uploadErr } = await supabase.storage
    .from('videos')
    .upload(storagePath, fileBuffer, { contentType: 'video/mp4', upsert: true })

  if (uploadErr) {
    console.error('Upload failed:', uploadErr.message)
    if (videoRow) {
      await supabase
        .from('videos')
        .update({ status: 'failed', error_message: uploadErr.message })
        .eq('id', videoRow.id)
    }
    process.exit(1)
  }

  const { data: signedUrlData } = await supabase.storage
    .from('videos')
    .createSignedUrl(storagePath, 31_536_000)

  const videoUrl = signedUrlData?.signedUrl ?? null

  // Update videos table
  if (videoRow) {
    await supabase
      .from('videos')
      .update({
        status: 'ready',
        video_url: videoUrl,
        duration_seconds: Math.round(durationInSeconds),
        file_size_bytes: fileSizeBytes,
      })
      .eq('id', videoRow.id)
    console.log(`[render] videos row ${videoRow.id} → ready`)
  }

  console.log(`\n✅ Done!`)
  console.log(`   Video URL : ${videoUrl}`)
  console.log(`   File size : ${(fileSizeBytes / 1_048_576).toFixed(1)} MB`)
  console.log(`   Duration  : ${Math.round(durationInSeconds)}s`)
}

main().catch((err) => {
  console.error('[render] Fatal error:', err)
  process.exit(1)
})
