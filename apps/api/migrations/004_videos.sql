-- Migration: 004_videos.sql
-- Run this in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/jcsrirxscnazngyjufai/sql/new

-- ============================================================
-- PATCH: add subtitles column to scripts
-- ============================================================
ALTER TABLE public.scripts
  ADD COLUMN IF NOT EXISTS subtitles JSONB;

-- ============================================================
-- TABLE: videos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  script_id         UUID        NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  video_url         TEXT,
  duration_seconds  INTEGER,
  file_size_bytes   BIGINT,
  status            TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'rendering', 'ready', 'failed')),
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "videos: select own"
  ON public.videos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "videos: insert own"
  ON public.videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "videos: update own"
  ON public.videos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "videos: delete own"
  ON public.videos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER updated_at
-- (handle_updated_at already exists from 001_characters.sql)
-- ============================================================
DROP TRIGGER IF EXISTS on_videos_updated ON public.videos;
CREATE TRIGGER on_videos_updated
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS videos_user_id_idx     ON public.videos (user_id);
CREATE INDEX IF NOT EXISTS videos_script_id_idx   ON public.videos (script_id);
CREATE INDEX IF NOT EXISTS videos_created_at_idx  ON public.videos (created_at DESC);

-- ============================================================
-- STORAGE BUCKET "videos"  (création manuelle via Dashboard)
-- ============================================================
-- 1. Aller sur : https://supabase.com/dashboard/project/jcsrirxscnazngyjufai/storage/buckets
-- 2. Cliquer "New bucket"
-- 3. Name : videos
-- 4. Cocher "Private bucket"
-- 5. Cliquer "Create bucket"
--
-- Ensuite, dans Storage > Policies > bucket "videos", créer 4 policies :
--
-- Policy 1 — SELECT
-- Nom : "videos storage: select own"
-- Opération : SELECT
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Policy 2 — INSERT
-- Nom : "videos storage: insert own"
-- Opération : INSERT
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Policy 3 — UPDATE
-- Nom : "videos storage: update own"
-- Opération : UPDATE
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Policy 4 — DELETE
-- Nom : "videos storage: delete own"
-- Opération : DELETE
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Convention de path : [user_id]/[script_id]/video.mp4
