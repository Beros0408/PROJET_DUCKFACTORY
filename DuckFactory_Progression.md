# 🦆 DuckFactory — Progression du projet

Derniere mise a jour : 19 mai 2026

---

## 🎯 Etat global

DuckFactory est un SaaS B2C pour createurs de contenu francophones.
Permet de generer des videos virales (TikTok, Reels, Shorts) avec un
personnage IA recurrent (Cancan le Canard par defaut).

Stade actuel : MVP en production, generation de scripts operationnelle.

---

## ✅ Fonctionnalites LIVREES (en production)

### Landing page premium
- Bilingue FR/EN
- 6 sections (Hero, Features, How It Works, Pricing, FAQ, CTA)
- Design Palette B ocean blue + coral
- Responsive mobile-first

### Authentification
- Supabase Auth (email + password)
- Confirmation email
- Reset password
- Middleware de protection des routes privees

### Module Personnages (IT-003)
- Wizard de creation en 4 etapes
- CRUD complet via routes Next.js + Supabase
- Page liste, detail, creation, modification
- BackButton reutilisable

### Module Scripts (IT-004) — NOUVEAU
- Generation IA via GPT-4o en streaming
- System prompt enrichi avec personnalite du personnage
- Formats supportes : TikTok 30s/60s, Reels 60s, Shorts 60s, YouTube 5min
- 4 tonalites : kid-friendly, adolescent, adulte, expert
- Slider de duree 15-300s
- Sauvegarde automatique en BDD
- Page liste avec empty state
- Page detail avec actions (copier, regenerer, supprimer)

---

## 🚧 Fonctionnalites EN COURS

### Module Voix (IT-005)
- Compte ElevenLabs cree
- Exploration des voix en cours
- Integration dev pas encore commencee

---

## 📋 Roadmap (ordre de priorite)

### Court terme (1-2 semaines)
1. IT-005 — Voix Cancan (ElevenLabs)
2. IT-006 — Avatar parlant (HeyGen ou D-ID)
3. IT-006b — Montage final + sous-titres (Remotion)

### Moyen terme (3-6 semaines)
4. IT-007 — Publication multi-plateforme (TikTok, YouTube, Instagram)
5. IT-008 — Pricing + Stripe (4 plans : Free / Creator 49€ / Pro 99€ / Agency 299€)

### Long terme (2-3 mois)
6. IT-009 — Analytics utilisateur
7. IT-010 — Mascotte officielle (canard photorealiste TikTok)
8. Rebranding eventuel DuckFactory -> DuckStories (a valider quand 50+ clients)

---

## 🏆 Achievements unlocked

- 18 mai 2026 : Cancan le Canard officiellement ne en BDD
- 19 mai 2026 : Premier script IA genere par Cancan en production
- Stack moderne et scalable mis en place
- 0€ de couts mensuels jusqu'a ~25 videos generees

---

## 📊 Indicateurs MVP

- Routes API actives : 7
- Pages frontend : 12
- Tables Supabase : 2 (characters, scripts)
- Commits sur main : 30+
- Personnages crees : 1 (Cancan)
- Scripts generes : 3 (tests qualite)
- Qualite moyenne scripts : 9/10

---

## 🎯 Vision long terme

Annee 1 (mai 2026 -> mai 2027) :
- Objectif : 50-150 clients payants
- Revenue cible : 2 500-7 500€ MRR
- Cancan devient personnage TikTok identifiable

Annee 2 (mai 2027 -> mai 2028) :
- 300-500 clients
- Voice cloning officiel de Cancan
- Premier acteur francais du SaaS video IA

Annee 3+ :
- Multi-personnages (utilisateurs creent leurs propres canards)
- 1000+ clients
- Marketplace de personnages IA
