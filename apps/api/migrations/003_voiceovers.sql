-- Migration: 003_voiceovers.sql
-- Run this in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/jcsrirxscnazngyjufai/sql/new

-- ============================================================
-- TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.voiceovers (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  script_id         UUID        NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  audio_url         TEXT,
  duration_seconds  INTEGER,
  voice_id          TEXT,
  model_id          TEXT,
  characters_used   INTEGER,
  status            TEXT        NOT NULL DEFAULT 'pending',
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.voiceovers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "voiceovers: select own"
  ON public.voiceovers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "voiceovers: insert own"
  ON public.voiceovers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "voiceovers: update own"
  ON public.voiceovers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "voiceovers: delete own"
  ON public.voiceovers FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER updated_at
-- (handle_updated_at already exists from 001_characters.sql)
-- ============================================================
DROP TRIGGER IF EXISTS on_voiceovers_updated ON public.voiceovers;
CREATE TRIGGER on_voiceovers_updated
  BEFORE UPDATE ON public.voiceovers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS voiceovers_user_id_idx      ON public.voiceovers (user_id);
CREATE INDEX IF NOT EXISTS voiceovers_script_id_idx    ON public.voiceovers (script_id);
CREATE INDEX IF NOT EXISTS voiceovers_created_at_idx   ON public.voiceovers (created_at DESC);

-- ============================================================
-- STORAGE BUCKET "voiceovers"  (manuel via Dashboard)
-- ============================================================
-- 1. Aller sur : https://supabase.com/dashboard/project/jcsrirxscnazngyjufai/storage/buckets
-- 2. Cliquer "New bucket"
-- 3. Name : voiceovers
-- 4. Cocher "Private bucket" (ne pas activer le accès public)
-- 5. Cliquer "Create bucket"
--
-- Ensuite, dans Storage > Policies > voiceovers, ajouter ces policies :
--
-- Policy 1 — SELECT (lecture des fichiers)
-- Nom : "voiceovers storage: select own"
-- Opération : SELECT
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Policy 2 — INSERT (upload)
-- Nom : "voiceovers storage: insert own"
-- Opération : INSERT
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Policy 3 — UPDATE
-- Nom : "voiceovers storage: update own"
-- Opération : UPDATE
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Policy 4 — DELETE
-- Nom : "voiceovers storage: delete own"
-- Opération : DELETE
-- Expression : (auth.uid())::text = (storage.foldername(name))[1]
--
-- Convention de path : [user_id]/[script_id]/voice.mp3
-- Exemple : a1b2c3.../d4e5f6.../voice.mp3
