-- Migration: 002_scripts.sql
-- Run this in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/jcsrirxscnazngyjufai/sql/new

CREATE TABLE IF NOT EXISTS public.scripts (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id       UUID        NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  title              TEXT        NOT NULL,
  topic              TEXT        NOT NULL,
  content            TEXT        NOT NULL DEFAULT '',
  format             TEXT        NOT NULL DEFAULT 'tiktok_60s',
  tone               TEXT        NOT NULL DEFAULT 'drole',
  audience           TEXT        NOT NULL DEFAULT 'adults',
  language           TEXT        NOT NULL DEFAULT 'fr',
  estimated_duration INTEGER,
  segments           JSONB,
  status             TEXT        NOT NULL DEFAULT 'draft',
  tokens_used        INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scripts: select own"
  ON public.scripts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "scripts: insert own"
  ON public.scripts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "scripts: update own"
  ON public.scripts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "scripts: delete own"
  ON public.scripts FOR DELETE
  USING (auth.uid() = user_id);

-- Reuse the handle_updated_at function from 001_characters.sql
-- (already created — no need to recreate)

DROP TRIGGER IF EXISTS on_scripts_updated ON public.scripts;
CREATE TRIGGER on_scripts_updated
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS scripts_user_id_idx       ON public.scripts (user_id);
CREATE INDEX IF NOT EXISTS scripts_character_id_idx  ON public.scripts (character_id);
CREATE INDEX IF NOT EXISTS scripts_created_at_idx    ON public.scripts (created_at DESC);
