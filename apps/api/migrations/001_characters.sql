-- Migration: 001_characters.sql
-- Run this in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/jcsrirxscnazngyjufai/sql/new

CREATE TABLE IF NOT EXISTS public.characters (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  description TEXT,
  personality TEXT        NOT NULL DEFAULT 'drole',
  tone        TEXT        NOT NULL DEFAULT 'adult',
  catchphrase TEXT,
  tic_verbal  TEXT,
  avatar_url  TEXT,
  voice_id    TEXT,
  language    TEXT        NOT NULL DEFAULT 'fr',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "characters: select own"
  ON public.characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "characters: insert own"
  ON public.characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "characters: update own"
  ON public.characters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "characters: delete own"
  ON public.characters FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_characters_updated ON public.characters;
CREATE TRIGGER on_characters_updated
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
