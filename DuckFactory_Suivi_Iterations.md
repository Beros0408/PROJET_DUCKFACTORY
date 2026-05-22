# DuckFactory - Suivi des iterations

## IT-001 (FAIT) - Setup monorepo Turborepo
Date : Mai 2026
- Monorepo Turborepo + pnpm
- Frontend Next.js 14.2.35
- Backend FastAPI (deprecie, migre vers routes Next.js)
- Supabase configure

## IT-002 (FAIT) - Auth + Landing premium bilingue
Date : Mai 2026
- Auth Supabase (email/password + confirmation)
- Landing page premium (palette ocean blue + coral)
- 6 sections : Hero, Features, How It Works, Pricing, FAQ, CTA
- Bilingue FR/EN
- Middleware de protection

## IT-003 (FAIT) - Module Personnages
Date : 18 mai 2026
- Table characters Supabase + RLS
- Wizard de creation en 4 etapes
- CRUD via routes Next.js
- Pages : /characters, /characters/new, /characters/[id]
- Premier personnage cree : Cancan le Canard

## IT-004 (LIVREE) - Generation de scripts IA
Date : 19 mai 2026
Statut : Livree et validee en production
Commits : bd2af66, 59832b1, 2482d7f, 8033f4b, 233f60f

### Livrables techniques
- Migration SQL 002_scripts.sql
- Route streaming POST /api/scripts/generate (Vercel AI SDK v6, GPT-4o)
- Routes CRUD /api/scripts et /api/scripts/[id]
- Composants : ScriptGenerator, ScriptCard
- Pages : /scripts, /scripts/new, /scripts/[id]
- i18n FR/EN complet

### Validation qualite (3 tests en production)
- Test 1 : 5 astuces TikTok -> 9,5/10
- Test 2 : IA expliquee -> 9/10
- Test 3 : Entreprise France -> 8,5/10
- Moyenne : 9/10

---

## IT-005 (LIVREE) - Generation voix Cancan ElevenLabs
Date : 21-22 mai 2026
Statut : Livree et fonctionnelle en production
Commit : b12d283

### Livrables techniques
- Migration SQL 003_voiceovers.sql executee
- Route API POST /api/scripts/[id]/generate-voice
- Helper lib/api/voiceovers.ts
- Composant VoicePlayer.tsx
- Page detail script integre VoicePlayer
- i18n FR/EN ajoute
- Bucket Supabase Storage voiceovers + 4 RLS policies

### Configuration ElevenLabs
- Compte cree avec plan Starter 6$/mois (apres test Free bloque)
- Voix Maxime - Young and Casual (voice_id 5Qfm4RqcAer0xoyWtoHC)
- Voix Troy - Cartoon Hero en backup
- Cle API DuckFactory Production
- Variables ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID dans Vercel

### Feedback utilisateur
- Voix Maxime : trop humaine, sonne professeur, pas drole
- Decision : on garde pour MVP, Voice Cloning prevu plus tard

---

## IT-006b (LIVREE) - Generation videos TikTok Remotion (MVP local)
Date : 22 mai 2026
Statut : Livree en mode MVP local render
Commits : 89ad7f4, a2b4f8a, 00e8890

### Livrables techniques
- Setup apps/render avec Remotion 4+
- Composant CancanVideo.tsx (1080x1920, 30fps, gradient yellow-100)
- Composant Root.tsx avec registerRoot et defaultProps
- Script CLI render.ts avec commander
- Route /api/scripts/[id]/transcribe (OpenAI Whisper avec language fr)
- Route /api/scripts/[id]/generate-video
- Route GET /api/scripts/[id]/videos
- Helper lib/api/videos.ts
- Composant VideoPlayer.tsx (etats idle/pending/ready/error)
- Migration SQL 004_videos.sql (table videos + scripts.subtitles JSONB)
- Bucket Supabase videos + 4 RLS policies
- Bucket Supabase assets (public) + cancan-mascot.png uploadee
- i18n FR/EN complet

### Architecture choisie
- Transcription Whisper appelle depuis Vercel (cle OpenAI cote serveur)
- Render Remotion en LOCAL sur le PC de Beros (MVP)
- Upload final dans Supabase Storage bucket videos
- Mascotte photorealiste hardcodee dans le composant Remotion

### Decisions techniques
- Render local au lieu de Lambda AWS : evite 4-6h de setup, MVP suffit
- Pas d'avatar HeyGen pour V1 : economie 24$/mois
- Pipeline TikTok-natif (voix + sous-titres + mascotte statique)
- Image mascotte chargee depuis Supabase Storage URL publique

### Resultats du premier test
- Video V1 : 5.9 MB, 42s, emoji statique
- Video V2 : 26.3 MB, 42s, mascotte photorealiste + police 56px
- Feedback : mascotte visible mais statique, chevauchement texte/image
- Limites identifiees : pas de lipsync, pas d'animation reelle

### Reste a faire pour IT-006b (perfection)
- Fixer chevauchement entre image et sous-titres
- Ameliorer le placement / spacing

### Limitations du MVP a accepter
- Render local seulement (pas de clients commercialement viable)
- Mascotte statique (pas de lipsync ni mouvement)
- Pas de B-roll ni effets visuels avances

---

## IT-006 (PROCHAINE PRIORITE) - Avatar 3D parlant avec lipsync
Date prevue : 1-2 semaines apres Harmoni
Statut : A planifier

### Objectif
Remplacer la mascotte statique par un canard 3D anime qui parle, marche, et synchronise les levres avec l'audio.

### Options a evaluer
1. HeyGen (24$/mois) - reference du marche pour avatar IA
2. Hedra (10$/mois) - permet animation d'images custom
3. D-ID (6$/mois) - moins realiste
4. Solutions open source (DeepMotion, etc.)

### Travaux a prevoir
- Choix du service prestataire
- Setup API et integration
- Refonte du pipeline Remotion
- Tests et iterations
- Verification budget vs ROI

---

## IT-007+ - Roadmap future (apres IT-006)

- IT-007 : Voice Cloning de la vraie voix Cancan (Beros enregistre)
- IT-008 : Publication YouTube/TikTok/Instagram (OAuth)
- IT-009 : Pricing + Stripe (uniquement apres produit complet)
- IT-010 : Migration Lambda AWS (quand 10-20+ users)
- IT-011 : Analytics et dashboard utilisateur
- IT-012 : Mascotte officielle (animations avancees)
