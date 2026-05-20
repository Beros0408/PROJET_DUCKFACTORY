# DuckFactory - Progression du projet

Derniere mise a jour : 21 mai 2026

---

## Etat global

DuckFactory est un SaaS B2C pour createurs de contenu francophones.
Permet de generer des scripts video viraux avec un personnage IA (Cancan le Canard).
Etape suivante : ajouter la generation de voix audio.

Stade actuel : MVP en production, generation de scripts operationnelle, voix bloquee.

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
- Cancan le Canard cree

### Module Scripts (IT-004)
- Generation IA via GPT-4o en streaming
- 5 formats : TikTok 30s/60s, Reels 60s, Shorts 60s, YouTube 5min
- Qualite validee 9/10 sur 3 tests

### Module Voix (IT-005) - Code livre mais bloque
- Code technique entierement livre
- Migration SQL appliquee
- Bucket Supabase cree
- Bloque par restriction commerciale ElevenLabs Free

---

## Roadmap (ordre de priorite)

### Court terme (1-2 semaines)
1. Resoudre IT-005 (choix de la solution voix demain)
2. RLS policies du bucket voiceovers
3. Premiere video TikTok publiee
4. IT-006 - Avatar parlant (HeyGen ou D-ID)
5. IT-006b - Montage final + sous-titres (Remotion)

### Moyen terme (3-6 semaines)
6. IT-007 - Publication multi-plateforme
7. IT-008 - Pricing + Stripe

### Long terme (2-3 mois)
8. IT-009 - Analytics
9. IT-010 - Mascotte officielle
10. Voice Cloning Pro de Cancan

---

## Achievements unlocked

- 18 mai 2026 : Cancan le Canard officiellement ne en BDD
- 19 mai 2026 : Premier script IA genere par Cancan (qualite 9/10)
- 21 mai 2026 : Skills Claude Code installes + IT-005 livre techniquement

---

## Stack technique (rappel)

- Frontend : Next.js 14.2.35 (App Router, TypeScript, Tailwind)
- Backend : Routes API Next.js (Edge/Node selon route)
- Database : Supabase (project ref : jcsrirxscnazngyjufai)
- Auth : Supabase SSR (RLS automatique)
- IA scripts : OpenAI GPT-4o via Vercel AI SDK v6
- IA voix : ElevenLabs (en cours de configuration)
- Storage : Supabase Storage (bucket voiceovers)
- Hosting : Vercel (https://duckfactory-zeta.vercel.app)

---

## Couts mensuels

- Vercel : 0 EUR (free tier)
- Supabase : 0 EUR (free tier)
- GitHub : 0 EUR (public repo)
- OpenAI : 9,62 USD de credit en stock
- ElevenLabs : 0 EUR (Free, mais bloque pour l'API)
- TOTAL : ~0 EUR / mois actuellement

---

## URL a utiliser (pour CV, demos, etc.)

- Demo en ligne : https://duckfactory-zeta.vercel.app
- Code source : https://github.com/Beros0408/PROJET_DUCKFACTORY
