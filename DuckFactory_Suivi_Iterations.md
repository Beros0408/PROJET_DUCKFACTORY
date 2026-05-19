# 🦆 DuckFactory — Suivi des iterations

## IT-001 (FAIT) — Setup monorepo Turborepo
Date : Mai 2026
- Monorepo Turborepo + pnpm
- Frontend Next.js 14.2.35
- Backend FastAPI (deprecie, migre vers routes Next.js)
- Supabase configure

## IT-002 (FAIT) — Auth + Landing premium bilingue
Date : Mai 2026
- Auth Supabase (email/password + confirmation)
- Landing page premium (palette ocean blue + coral)
- 6 sections : Hero, Features, How It Works, Pricing, FAQ, CTA
- Bilingue FR/EN
- Middleware de protection

## IT-003 (FAIT) — Module Personnages
Date : 18 mai 2026
- Table characters Supabase + RLS
- Wizard de creation en 4 etapes
- CRUD via routes Next.js
- Pages : /characters, /characters/new, /characters/[id]
- Premier personnage cree : Cancan le Canard

---

## IT-004 (LIVREE) — Generation de scripts IA

Statut : Livree et validee en production
Date : 19 mai 2026
Commits : bd2af66, 59832b1, 2482d7f, 8033f4b

### Livrables techniques
- Migration SQL 002_scripts.sql (table + RLS + indexes + trigger)
- Route streaming POST /api/scripts/generate (Vercel AI SDK v6, GPT-4o, edge runtime)
- Route CRUD GET /api/scripts (filtre optionnel par character_id)
- Route CRUD GET/DELETE /api/scripts/[id]
- Helper client lib/api/scripts.ts
- Composant ScriptGenerator.tsx (form + streaming UI fetch natif)
- Composant ScriptCard.tsx (liste)
- Page /scripts (liste avec empty state)
- Page /scripts/new (creation)
- Page /scripts/[id] (detail + delete)
- AppSidebar : Scripts actif
- Dashboard : carte Scripts cliquable
- i18n FR/EN complet
- .env.example mis a jour avec OPENAI_API_KEY

### Activations production
- Cle OpenAI creee sur platform.openai.com
- Credit OpenAI recharge (9,62$ avec auto-recharge a 5$ -> 10$)
- Variable OPENAI_API_KEY ajoutee dans Vercel (Production + Preview)
- Migration SQL executee dans Supabase

### Validation qualite (3 tests en production)
- Test 1 : 5 astuces pour devenir viral sur TikTok -> 9,5/10
- Test 2 : L'intelligence artificielle expliquee simplement -> 9/10
- Test 3 : Comment lancer son entreprise en France -> 8,5/10
- Moyenne : 9/10

### Cancan mis a jour en BDD (Supabase Table Editor)
- name : Cancan le Canard
- description : Un canard jaune naif et debrouillard, drole et pedagogue
- catchphrase : Coin coin !
- tic_verbal : En fait, c'est tres simple...
- tone : adult
- personality : naif
- language : fr

---

## IT-005 (EN COURS) — Generation voix Cancan

Statut : En cours (configuration ElevenLabs entamee)
Date prevue : 20 mai 2026 (demain)

### Avancement actuel
- Compte ElevenLabs cree (plan Free)
- Studio Text-to-Speech explore
- Voix Roger testee (verdict : trop humaine, pas assez canard)
- Choix de voix en attente

### Decision strategique en cours
- Option A : Voix expressive humaine ce soir (provisoire) -> Voice Cloning payant dans 2-3 semaines
- Option B : Voice Cloning payant tout de suite (plan Starter 6$/mois)
- A trancher demain a tete reposee

### Idee creative a explorer
Voix legerement nasillarde pour Cancan (signature canard, type Donald Duck leger).
Faisable uniquement via Voice Cloning Pro (plan Creator 11$/mois) en enregistrant TA voix.

### Reste a faire pour IT-005
- Tester 5 voix candidates dans la Voice Library
- Choisir voice_id provisoire OU acheter plan payant
- Migration SQL : table voiceovers ou colonne audio_url dans scripts
- Route API POST /api/scripts/[id]/generate-voice
- Composant audio player
- Activation bouton "Generer la voix" (actuellement disabled)
- Stockage fichiers MP3 (Supabase Storage)

---

## IT-006+ — Roadmap future (differee)

- IT-006 : Avatar parlant (HeyGen ou alternative)
- IT-006b : Montage final + sous-titres (Remotion)
- IT-007 : Publication YouTube/TikTok/Instagram (OAuth)
- IT-008 : Pricing + Stripe (UNIQUEMENT apres produit complet)
- IT-009 : Analytics et dashboard utilisateur
- IT-010 : Mascotte officielle (canard photorealiste TikTok)
