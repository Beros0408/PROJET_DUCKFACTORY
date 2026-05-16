# 🦆 DuckFactory

Studio IA de production de contenus viraux automatisés.
Cancan le Canard est le premier produit phare.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | FastAPI + Python 3.12 |
| Base de données | Supabase (PostgreSQL) |
| Stockage média | Cloudflare R2 |
| IA Texte | OpenAI GPT-4o |
| IA Voix | ElevenLabs |
| IA Vidéo | HeyGen |
| Paiements | Stripe |

## Structure

```
DuckFactory/
├── apps/
│   ├── web/          # Frontend Next.js 14
│   └── api/          # Backend FastAPI
├── packages/
│   └── types/        # TypeScript types partagés
├── package.json      # Monorepo root (pnpm workspaces)
├── pnpm-workspace.yaml
└── turbo.json
```

## Lancer en local

### Prérequis

- Node.js >= 20
- pnpm >= 8
- Python 3.12

### Frontend (Next.js)

```bash
cd apps/web
pnpm install
pnpm dev
# → http://localhost:3000
```

### Backend (FastAPI)

```bash
cd apps/api
# Windows
.\.venv\Scripts\Activate.ps1
# Mac/Linux
source .venv/bin/activate

uvicorn main:app --reload --port 8000
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
# → http://localhost:8000/redoc (ReDoc)
```

### Health checks

```bash
# Frontend
curl http://localhost:3000/api/health
# → {"status":"ok","service":"DuckFactory Web"}

# Backend
curl http://localhost:8000/health
# → {"status":"ok","service":"DuckFactory API"}
```

## Variables d'environnement

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`apps/api/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
```

## Roadmap

- **IT-001** ✅ Setup initial (monorepo + frontend + backend)
- **IT-002** Auth Supabase + Landing page bilingue
- **IT-003** Module création de personnage IA
- **IT-004** Générateur de scripts (GPT-4o)
- **IT-005** Générateur de voix (ElevenLabs)
- **IT-006** Générateur de vidéo (HeyGen)
- **IT-007** Publication YouTube Shorts
- **IT-008** Bilan Mois 1 + test end-to-end

## Liens

- [Cahier des charges](../DuckFactory_Cahier_des_Charges.md)
- [Plan 30 jours](../DuckFactory_Plan_30_Jours.md)
- [Suivi des itérations](../DuckFactory_Suivi_Iterations.md)
- [Swagger API](http://localhost:8000/docs)

---

**Cancan le Canard 🦆 — Coin coin !**
