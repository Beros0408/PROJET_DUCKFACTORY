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

## IT-005 (EN PAUSE - blocage commercial) - Generation voix Cancan
Date : 20-21 mai 2026
Statut : Code livre en production, bloque par restriction API ElevenLabs Free
Commit : b12d283

### Livrables techniques FAITS
- Migration SQL 003_voiceovers.sql executee dans Supabase
- Route API POST /api/scripts/[id]/generate-voice (Node runtime, maxDuration 60)
- Helper lib/api/voiceovers.ts (generateVoice, fetchVoiceover)
- Composant VoicePlayer.tsx (bouton jaune + spinner + audio HTML)
- Page detail script integre VoicePlayer
- i18n FR/EN ajoute (voice.generate, voice.generating, voice.player.title, voice.error, voice.success)
- Bucket Supabase Storage "voiceovers" cree (mode Private)

### Configuration ElevenLabs faite
- Compte cree (plan Free, 10k caracteres/mois)
- Voix Maxime - Young and Casual ajoutee (voice_id : 5Qfm4RqcAer0xoyWtoHC)
- Voix Troy - Cartoon Hero ajoutee en backup (voice_id : 4TfTGcPwoefWe878B0rm)
- Cle API "DuckFactory Production" creee (permissions : Text to Speech Acces, Voix Lire)
- Variables ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID configurees dans Vercel

### BLOCAGE IDENTIFIE
Erreur retournee par ElevenLabs lors du test final :
"Free users cannot use library voices via the API. Please upgrade your subscription to use this voice."

Restriction commerciale : les voix de la bibliotheque ElevenLabs ne sont accessibles via l'API que pour les comptes payants.

### Reste a faire pour debloquer IT-005
1. Choisir une des 3 options demain :
   - Option A : Plan Starter 6$/mois ElevenLabs
   - Option B : Voice Cloning Free (enregistrer sa voix)
   - Option C : Bascule vers OpenAI TTS
2. Configurer RLS policies du bucket Supabase Storage "voiceovers"
3. Tester la generation et ecouter Cancan parler

---

## IT-006+ - Roadmap future (differee)

- IT-006 : Avatar parlant (HeyGen ou alternative)
- IT-006b : Montage final + sous-titres (Remotion)
- IT-007 : Publication YouTube/TikTok/Instagram (OAuth)
- IT-008 : Pricing + Stripe (UNIQUEMENT apres produit complet)
- IT-009 : Analytics et dashboard utilisateur
- IT-010 : Mascotte officielle (canard photorealiste TikTok)
