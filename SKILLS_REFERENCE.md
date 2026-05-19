# 📚 Claude Code Skills — Reference pour DuckFactory

A reprendre dans la prochaine session.

---

## 🎯 Qu'est-ce qu'un Skill Claude ?

Un Skill est un fichier Markdown (SKILL.md) qui contient des instructions
specialisees que Claude Code consulte automatiquement quand il rencontre
certains types de taches.

Exemples de skills built-in :
- docx : creation de documents Word
- pdf : manipulation de PDF
- xlsx : creation de spreadsheets
- pptx : creation de presentations
- frontend-design : regles de design UI (CSS, typo, couleurs)
- product-self-knowledge : connaissance des produits Anthropic

---

## 🔍 Comment Claude Code utilise les skills

Quand tu lui demandes par exemple :
- "Cree un fichier Word avec ce rapport" -> Claude consulte le skill docx
- "Ameliore le design de cette page React" -> Claude consulte frontend-design

C'est automatique : Claude lit le SKILL.md du skill correspondant
AVANT d'ecrire du code, pour respecter les bonnes pratiques.

---

## 🛠️ Skills pertinents pour DuckFactory

### Skills built-in a utiliser activement
- frontend-design : Pour toutes les pages Next.js + composants React
- docx : Si on genere des rapports automatiques pour clients
- pdf : Pour exporter scripts en PDF (feature future)

### Skills custom a creer pour DuckFactory

1. duckfactory-conventions/SKILL.md
   - Conventions de naming (camelCase TypeScript, kebab-case fichiers)
   - Pattern Supabase SSR a utiliser dans toutes les routes API
   - Structure type des pages (BackButton en haut, etc.)
   - i18n obligatoire pour tout texte visible

2. duckfactory-prompts/SKILL.md
   - Pattern de SYSTEM PROMPT pour generation IA
   - Comment templater avec les donnees du personnage
   - Calcul de mots par duree (2,5 mots/sec en FR)

3. duckfactory-supabase/SKILL.md
   - Pattern de migrations SQL (RLS, indexes, triggers)
   - Pattern de routes API (auth check, character load, RLS automatique)
   - Convention des policies "table: action own"

---

## 📋 Plan d'action skills (a faire demain)

### Etape 1 — Recherche
- Lire la doc officielle Anthropic sur les skills custom
- Voir des exemples publiques sur GitHub

### Etape 2 — Skill DuckFactory v1
Creer ~/.claude/skills/duckfactory/SKILL.md (chemin a confirmer)

### Etape 3 — Tester
Faire une demande a Claude Code et verifier que le skill est bien lu/respecte.

### Etape 4 — Iterer
Au fur et a mesure que le projet grandit, enrichir le skill.

---

## 🔗 Liens utiles a consulter demain

- https://docs.claude.com (doc officielle Anthropic)
- https://docs.claude.com/en/docs/agents-and-tools/agent-skills
- https://support.claude.com (FAQ skills)

---

## 💡 Pourquoi c'est important pour DuckFactory

Sans skill custom :
- Claude doit redecouvrir tes conventions a chaque session
- Risque d'incoherences (parfois RLS oublie, parfois pas)
- Tu dois re-expliquer la stack a chaque prompt

Avec un skill DuckFactory :
- Claude connait tes conventions a 100%
- Coherence garantie sur tout le code
- Prompts plus courts (pas besoin de re-specifier la stack)
- Code de meilleure qualite des le premier essai
