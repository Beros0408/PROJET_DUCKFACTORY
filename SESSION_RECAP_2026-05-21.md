# DuckFactory - Session Recap du 21 mai 2026

## Etat du projet a la fin de session

IT-005 ElevenLabs : code livre en production, BLOQUE par restriction API du plan Free ElevenLabs.

- Production : https://duckfactory-zeta.vercel.app
- Repo : https://github.com/Beros0408/PROJET_DUCKFACTORY
- Iteration en cours : IT-005 (technique fini, blocage commercial)

---

## Ce qui a ete accompli aujourd'hui

### Phase 1 - Installation des Skills Claude Code (matinee)
- Installation manuelle des 3 skills DuckFactory dans ~/.claude/skills/
- duckfactory-conventions : stack, structure, naming, i18n
- duckfactory-supabase : pattern migrations + routes API + RLS
- duckfactory-ai-prompts : pattern Vercel AI SDK v6 + system prompts
- Verification des SKILL.md (frontmatter YAML correct)

### Phase 2 - Choix de la voix de Cancan (apres-midi)
- Exploration ElevenLabs Voice Library (185 voix FR)
- Test de Maxime - Young and Casual (voice_id : 5Qfm4RqcAer0xoyWtoHC)
- Test de Troy - Cartoon Hero (voice_id : 4TfTGcPwoefWe878B0rm) en backup
- Decision : Maxime provisoire, Voice Cloning plus tard

### Phase 3 - Configuration ElevenLabs + Vercel
- Creation de la cle API ElevenLabs "DuckFactory Production"
- Permissions : Text to Speech (Acces) + Voix (Lire)
- Ajout des variables ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID dans Vercel
- Production + Preview configurees

### Phase 4 - Implementation IT-005 par Claude Code
- Migration SQL 003_voiceovers.sql (table voiceovers + RLS + indexes + trigger)
- Route API POST /api/scripts/[id]/generate-voice
- Helper client lib/api/voiceovers.ts
- Composant VoicePlayer.tsx (bouton jaune Cancan + spinner + audio player)
- Integration dans page detail script
- i18n FR/EN ajoute (cles voice.*)
- Commit b12d283 pousse sur main
- Vercel a redeploye automatiquement

### Phase 5 - Configuration Supabase
- Migration SQL 003_voiceovers.sql executee : SUCCESS
- Bucket "voiceovers" cree en mode Private
- Path convention : [user_id]/[script_id]/voice.mp3
- RLS policies du bucket : NON CONFIGUREES (a faire demain)

### Phase 6 - Test final BLOQUE
- Tentative de generation de voix sur script existant
- Erreur retournee par ElevenLabs :
  "Free users cannot use library voices via the API"
- Code "paid_plan_required"
- Decouverte de la restriction commerciale ElevenLabs

---

## Stats de la session

- 6 fichiers techniques crees (IT-005)
- 3 skills Claude Code installes
- 2 variables Vercel ajoutees
- 326 lignes de code ajoutees (commit b12d283)
- 1 bucket Supabase Storage cree
- 1 migration SQL appliquee
- 1 restriction commerciale decouverte

---

## Restriction ElevenLabs - Le coeur du blocage

ElevenLabs reserve l'usage API des voix de bibliothèque aux plans payants.

| Action | Free | Starter 6$/mois |
|---|---|---|
| Voix bibliotheque via Studio web | OK | OK |
| Voix bibliotheque via API | BLOQUE | OK |
| Voix clonees via API | OK | OK |
| Voice Cloning Pro | Non | OK |

---

## Decision a prendre demain

3 options possibles :

A. Plan Starter ElevenLabs 6$/mois
   - Debloquer Maxime + voice cloning
   - Cout : ~5,50 EUR / mois

B. Voice Cloning Free
   - Enregistrer sa propre voix (5-10 min audio)
   - 100% gratuit
   - 30 min de boulot

C. Bascule vers OpenAI TTS
   - Pas d'abonnement, paye a l'usage (0,015$/min)
   - Refonte du code IT-005
   - Qualite differente

---

## Ce qui reste a faire (TODO demain)

### Priorite 1 - Resoudre le blocage IT-005
- Choisir entre A, B ou C
- Tester la nouvelle solution
- Valider que Cancan parle en production

### Priorite 2 - RLS policies du bucket Supabase Storage
- Aller sur Storage > Policies > voiceovers
- Ajouter 4 policies (SELECT/INSERT/UPDATE/DELETE)
- Expression : (auth.uid())::text = (storage.foldername(name))[1]

### Priorite 3 - Premiere video TikTok
- Une fois la voix fonctionnelle
- Generer audio depuis un script DuckFactory
- Montage simple
- Publication sur @duckstories_4you

---

## URL a utiliser

Production : https://duckfactory-zeta.vercel.app
Repo : https://github.com/Beros0408/PROJET_DUCKFACTORY

---

Coin coin ! Bonne nuit Beros !
