import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { createClient } from '@supabase/supabase-js'
import { Command } from 'commander'
import { config as loadDotenv } from 'dotenv'
import { readFileSync, mkdirSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load env: render package dir first, then repo root
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..', '..')

loadDotenv({ path: path.join(__dirname, '..', '.env') })
loadDotenv({ path: path.join(__dirname, '..', '.env.local') })
loadDotenv({ path: path.join(repoRoot, '.env.local') })

// ─── CLI ────────────────────────────────────────────────────────────────────
const program = new Command()
program
  .name('render')
  .description('Render a CancanVideo locally and upload to Supabase Storage')
  .requiredOption('--script-id <uuid>', 'Supabase script ID to render')
  .parse(process.argv)

const { scriptId } = program.opts<{ scriptId: string }>()

// ─── Types ──────────────────────────────────────────────────────────────────
interface ScriptRow {
  id: string
  user_id: string
  subtitles: Array<{ word: string; start: number; end: number }> | null
}

interface VoiceoverRow {
  id: string
  audio_url: string | null
}

interface VideoRow {
  id: string
  user_id: string
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing env vars. Create apps/render/.env with:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL=...')
    console.error('   SUPABASE_SERVICE_ROLE_KEY=...')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  // ── 1. Fetch script ────────────────────────────────────────────────────────
  console.log(`⏳ Fetching script ${scriptId}...`)
  const { data: script, error: scriptErr } = await supabase
    .from('scripts')
    .select('id, user_id, subtitles')
    .eq('id', scriptId)
    .single<ScriptRow>()

  if (scriptErr || !script) {
    console.error('❌ Script not found:', scriptErr?.message)
    process.exit(1)
  }

  if (!script.subtitles || script.subtitles.length === 0) {
    console.error('❌ No subtitles found. Call POST /api/scripts/' + scriptId + '/transcribe first.')
    process.exit(1)
  }

  // ── 2. Fetch voiceover ────────────────────────────────────────────────────
  console.log('⏳ Fetching voiceover...')
  const { data: voiceover, error: voiceErr } = await supabase
    .from('voiceovers')
    .select('id, audio_url')
    .eq('script_id', scriptId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<VoiceoverRow>()

  if (voiceErr || !voiceover?.audio_url) {
    console.error('❌ No voiceover found. Generate the voice first.')
    process.exit(1)
  }

  // ── 3. Get or find videos row, update to rendering ────────────────────────
  const { data: videoRow } = await supabase
    .from('videos')
    .select('id, user_id')
    .eq('script_id', scriptId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<VideoRow>()

  if (videoRow) {
    await supabase.from('videos').update({ status: 'rendering' }).eq('id', videoRow.id)
    console.log(`⏳ Video row ${videoRow.id} → rendering`)
  }

  // ── 4. Compute duration from subtitles ────────────────────────────────────
  const subtitles = script.subtitles
  const lastWord = subtitles[subtitles.length - 1]
  const durationInSeconds = (lastWord?.end ?? 60) + 1.0  // +1s margin per spec
  const fps = 30
  const durationInFrames = Math.ceil(durationInSeconds * fps)

  const inputProps = {
    audioUrl: voiceover.audio_url,
    subtitles,
  }

  // ── 5. Bundle ─────────────────────────────────────────────────────────────
  console.log('⏳ Bundling Remotion composition...')
  const entryPoint = path.join(__dirname, 'index.tsx')
  const bundleUrl = await bundle({
    entryPoint,
    onProgress: (p) => process.stdout.write(`\r   Bundle: ${p}%   `),
  })
  console.log('\n✅ Bundle ready.')

  // ── 6. Select composition ─────────────────────────────────────────────────
  const composition = await selectComposition({
    serveUrl: bundleUrl,
    id: 'CancanVideo',
    inputProps,
  })

  // ── 7. Render ─────────────────────────────────────────────────────────────
  const outputDir = path.resolve(process.cwd(), 'output')
  mkdirSync(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, `video-${scriptId}.mp4`)

  console.log(`⏳ Rendering ${durationInFrames} frames @ ${fps}fps...`)
  await renderMedia({
    composition: { ...composition, durationInFrames, fps },
    serveUrl: bundleUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      process.stdout.write(`\r   Render: ${Math.round(progress * 100)}%   `)
    },
  })
  console.log(`\n✅ Rendered → ${outputPath}`)

  const fileSizeBytes = statSync(outputPath).size

  // ── 8. Upload to Supabase Storage ─────────────────────────────────────────
  const userId = videoRow?.user_id ?? script.user_id
  const storagePath = `${userId}/${scriptId}/video.mp4`

  console.log('⏳ Uploading to Supabase Storage...')
  const fileBuffer = readFileSync(outputPath)
  const { error: uploadErr } = await supabase.storage
    .from('videos')
    .upload(storagePath, fileBuffer, { contentType: 'video/mp4', upsert: true })

  if (uploadErr) {
    console.error('❌ Upload failed:', uploadErr.message)
    if (videoRow) {
      await supabase
        .from('videos')
        .update({ status: 'failed', error_message: uploadErr.message })
        .eq('id', videoRow.id)
    }
    process.exit(1)
  }

  // ── 9. Get signed URL (1 year) ────────────────────────────────────────────
  const { data: signedUrlData } = await supabase.storage
    .from('videos')
    .createSignedUrl(storagePath, 31_536_000)
  const videoUrl = signedUrlData?.signedUrl ?? null

  // ── 10. Update videos row ─────────────────────────────────────────────────
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
  }

  console.log('\n✅ Done!')
  console.log(`   Video URL  : ${videoUrl}`)
  console.log(`   Duration   : ${Math.round(durationInSeconds)}s`)
  console.log(`   File size  : ${(fileSizeBytes / 1_048_576).toFixed(1)} MB`)
  if (videoRow) console.log(`   Video ID   : ${videoRow.id}`)
}

main().catch((err) => {
  console.error('❌ Fatal error:', err instanceof Error ? err.message : err)
  process.exit(1)
})
