# DuckFactory - Session Recap du 22 mai 2026

## Etat du projet a la fin de session

IT-005 ElevenLabs : LIVRE en production (plan Starter 6$/mois souscrit)
IT-006b Remotion : LIVRE techniquement (MVP local render fonctionnel)
Mascotte Cancan V2 : Image photorealiste integree (chapeau de paille, lunettes, chemise hawaienne, DUCKCAM)

- Production : https://duckfactory-zeta.vercel.app
- Repo : https://github.com/Beros0408/PROJET_DUCKFACTORY
- 1ere video generee : video-V1-emoji.mp4 (5.9 MB, emoji statique)
- 2e video generee : video-8045cc26-f25e-44fb-86d8-0533e87d591e.mp4 (26.3 MB, mascotte photorealiste)

---

## Ce qui a ete accompli aujourd'hui

### Phase 1 - Resolution blocage ElevenLabs (matinee)
- Decouverte que le plan Free bloque les voix de bibliotheque via API
- Souscription plan Starter 6$/mois ElevenLabs
- Configuration des 4 RLS policies du bucket voiceovers
- Premier audio Cancan genere et ecoute (voix Maxime)
- Verdict utilisateur : voix trop humaine, pas canard, on garde pour MVP

### Phase 2 - Decision strategique sur le pipeline video
- Discussion sur Lambda AWS vs render local
- Decision : render LOCAL pour le MVP, Lambda dans 2-4 semaines
- Decision : pas d'avatar HeyGen pour le MVP (24$/mois evite)
- Decision : pipeline TikTok-natif sans avatar parlant

### Phase 3 - Implementation IT-006b (apres-midi)
- Setup apps/render avec Remotion 4+
- Composant CancanVideo.tsx 1080x1920 30fps
- Background gradient yellow-100 vers white
- Sous-titres animes (mots passes noirs, courant jaune Cancan, futurs gris)
- Route /api/scripts/[id]/transcribe (OpenAI Whisper)
- Route /api/scripts/[id]/generate-video
- Composant VideoPlayer.tsx avec bouton jaune et bloc commande a copier
- Migration SQL 004_videos.sql (table videos + scripts.subtitles)
- Bucket Supabase Storage videos + 4 RLS policies

### Phase 4 - Configuration et test du pipeline
- Migration SQL executee dans Supabase
- Bucket videos cree
- Fichier apps/render/.env configure
- pnpm install (Remotion + Chromium telecharges)
- Probleme : ERR_PNPM_OUTDATED_LOCKFILE sur Vercel
- Solution : commit + push pnpm-lock.yaml
- Vercel redeploye avec succes

### Phase 5 - Premier render local
- Generation transcription Whisper via DuckFactory (clic Generer la video)
- Lancement render Remotion local
- Premier MP4 cree en local + uploade sur Supabase
- Video V1 : 5.9 MB, 42s, emoji statique
- Feedback : police trop grosse, mascotte trop simple

### Phase 6 - V2 avec mascotte photorealiste (soir)
- Image cancan-mascot.png trouvee
- Bucket Supabase assets cree (public)
- Image uploadee dans le bucket assets
- URL publique testee et validee
- Claude Code modifie CancanVideo.tsx :
  - Remplacement emoji par Img Remotion
  - Reduction police 72px vers 56px
  - Image 500px avec borderRadius 24
  - Animation oscillation subtile + rotation
  - Fallback emoji si image ne charge pas
- Commit V2 push sur GitHub
- 2e render lance avec succes
- Video V2 : 26.3 MB, 42s, mascotte photorealiste

### Phase 7 - Feedback final V2
- Verdict utilisateur :
  - Mascotte visible et belle
  - Police 56px plus lisible
  - PROBLEME : chevauchement sous-titres / image
  - PROBLEME : mascotte juste statique (oscillation insuffisante)
- Besoin futur identifie : VRAIE animation 3D avec lipsync + marche

---

## Decisions prises pour la suite

### IMMEDIAT
- Fermer la session DuckFactory aujourd'hui
- Push final + documentation complete
- Reprise sur Harmoni demain

### COURT TERME (1-2 semaines)
- IT-006 Avatar parlant 3D avec lipsync :
  - Evaluer HeyGen (24$/mois) ou Hedra (10$/mois)
  - Refonte du pipeline pour integrer l'avatar anime
  - Synchronisation labiale + mouvement du canard
- Fixer le chevauchement texte/image dans CancanVideo.tsx

### MOYEN TERME (1-2 mois)
- Migration vers Lambda AWS (render serverless)
- Voice Cloning de la vraie voix Cancan
- Statut juridique pour pouvoir vendre
- Stripe et premiers clients

---

## Stats de la session

- 2 commits majeurs (00e8890 et a2b4f8a)
- 4 fichiers de migration SQL crees/executes
- 3 buckets Supabase Storage configures (voiceovers, videos, assets)
- 12 policies RLS appliquees
- 2 videos MP4 generees (V1 emoji + V2 mascotte photorealiste)
- Premier paiement DuckFactory : 6$/mois ElevenLabs Starter
- ~12h de session intensive

---

## Etat infrastructure a la fin de session

- Vercel : deploiement Ready (commit 00e8890)
- Supabase : 4 tables (characters, scripts, voiceovers, videos)
- Supabase Storage : 3 buckets (voiceovers prive, videos prive, assets public)
- GitHub : 3 commits poussees sur main
- OpenAI : ~9$ de credit en stock
- ElevenLabs : Starter 6$/mois actif
- Couts mensuels : ~6$ ElevenLabs

---

## URL a utiliser dans internet

Production : https://duckfactory-zeta.vercel.app
Repo : https://github.com/Beros0408/PROJET_DUCKFACTORY
TikTok : @duckstories_4you (0 video publiee a date)

---

Coin coin ! Bonne nuit Beros !
