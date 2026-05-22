# DuckFactory - Progression du projet

Derniere mise a jour : 22 mai 2026

---

## Etat global

DuckFactory est un SaaS B2C de generation de videos TikTok virales pour createurs de contenu francophones.
Le pipeline complet fonctionne : script IA, voix audio, sous-titres animes, video MP4 finale.

Stade actuel : MVP COMPLET en production. Pret pour publication TikTok publique et acquisition utilisateurs.

---

## Fonctionnalites LIVREES (en production)

### Landing page premium
- Bilingue FR/EN, 6 sections, design ocean blue + coral

### Authentification
- Supabase Auth (email + password)
- Confirmation email + Reset password
- Middleware de protection

### Module Personnages (IT-003)
- Wizard de creation en 4 etapes
- CRUD complet
- Cancan le Canard cree avec personnalite definie

### Module Scripts (IT-004)
- Generation IA via GPT-4o en streaming
- 5 formats : TikTok 30s/60s, Reels 60s, Shorts 60s, YouTube 5min
- Qualite validee 9/10 sur 3 tests

### Module Voix (IT-005)
- Generation audio via ElevenLabs (voix Maxime)
- Plan Starter actif (6$/mois)
- Audio MP3 stocke dans Supabase Storage
- Compatible commercial (licence ElevenLabs Starter)

### Module Video (IT-006b)
- Transcription audio via OpenAI Whisper avec timestamps mot par mot
- Render local via Remotion (composant CancanVideo)
- Format vertical 1080x1920 (TikTok natif)
- Sous-titres animes synchronises avec l'audio
- Mascotte photorealiste integree
- MP4 finale uploadee dans Supabase Storage

---

## Pipeline complet operationnel

Script (GPT-4o) -> Voix (ElevenLabs) -> Transcription (Whisper) -> Video (Remotion) -> MP4

Temps total de generation : ~5-10 minutes par video
Cout par video : ~0,02 EUR (Whisper) + audio quota ElevenLabs

---

## Roadmap (ordre de priorite)

### Bloque temporairement (cerveau frais necessaire)
1. IT-006 - Avatar 3D parlant avec lipsync
2. Fix chevauchement texte/image dans V2
3. Voice Cloning de la vraie voix Cancan

### Court terme (1-2 semaines)
4. Premiere video TikTok publiee sur @duckstories_4you
5. Validation publique du concept
6. Premiers feedbacks utilisateurs reels

### Moyen terme (1-2 mois)
7. Migration Lambda AWS (render serverless)
8. Statut juridique (SASU, micro-entreprise)
9. Stripe et premier pricing
10. Acquisition utilisateurs

### Long terme (3-6 mois)
11. Analytics dashboard
12. Mascotte officielle avec animations avancees
13. Scale et croissance

---

## Achievements unlocked

- 18 mai 2026 : Cancan le Canard officiellement ne en BDD
- 19 mai 2026 : Premier script IA genere par Cancan (qualite 9/10)
- 21 mai 2026 : Skills Claude Code installes
- 22 mai 2026 : IT-005 ElevenLabs LIVRE + IT-006b Remotion LIVRE
- 22 mai 2026 : Premiere video MP4 DuckFactory generee (5.9 MB, 42s)
- 22 mai 2026 : V2 avec mascotte photorealiste integree (26.3 MB, 42s)

---

## Stack technique (rappel)

- Frontend : Next.js 14.2.35 (App Router, TypeScript, Tailwind)
- Backend : Routes API Next.js (Edge/Node selon route)
- Database : Supabase (project ref : jcsrirxscnazngyjufai)
- Auth : Supabase SSR (RLS automatique)
- IA scripts : OpenAI GPT-4o via Vercel AI SDK v6
- IA voix : ElevenLabs (plan Starter)
- IA transcription : OpenAI Whisper-1 avec timestamp_granularities word
- Render video : Remotion 4+ (local sur PC Beros)
- Storage : Supabase Storage (3 buckets : voiceovers, videos, assets)
- Hosting : Vercel (https://duckfactory-zeta.vercel.app)

---

## Couts mensuels actuels

- Vercel : 0 EUR (free tier)
- Supabase : 0 EUR (free tier)
- GitHub : 0 EUR (public repo)
- OpenAI : ~9 USD de credit en stock (pay-as-you-go)
- ElevenLabs : 6 USD / mois (Starter plan)
- TOTAL : ~6 USD / mois (~5,50 EUR)

---

## URL a utiliser

Production live : https://duckfactory-zeta.vercel.app
Code source : https://github.com/Beros0408/PROJET_DUCKFACTORY
TikTok officiel : @duckstories_4you (0 video publiee)

---

## Decision strategique finale

DuckFactory est techniquement complet en mode MVP.
Le focus passe maintenant sur :
1. Le projet Harmoni (priorite immediate)
2. La preparation de l'IT-006 avatar parlant (planification)
3. La publication TikTok publique (quand Beros aura du temps)

Pas de developpement urgent. Le produit fonctionne, ne reste qu'a l'utiliser et l'ameliorer progressivement.
