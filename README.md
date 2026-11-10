# REPÈRES (nom de travail)

Séries officielles (Insee, Eurostat, SDES, SSMSI…) superposées à la chronologie du pouvoir. Source de vérité : [`BRIEF.md`](BRIEF.md). Design : [`DESIGN.md`](DESIGN.md). Maquettes : `mockups/` (sources) et `html/` (export statique).

## Structure

| Dossier       | Rôle                                                         |
| ------------- | ------------------------------------------------------------ |
| `apps/web`    | Next.js (App Router), composants serveur qui lisent Postgres |
| `packages/db` | migrations SQL (dbmate), seed, client Kysely typé            |
| `packages/ui` | design system (Sprint 2)                                     |
| `pipelines/`  | ingestion Python / Airflow (Sprint 1)                        |

## Démarrer en local

```bash
cp .env.example .env
pnpm install
pnpm db:up        # Postgres 16 sur le port 5450
pnpm db:migrate
pnpm db:seed      # sources + frise du pouvoir (rejouable)
pnpm dev          # http://localhost:3000, GET /api/health
```

Après un changement de schéma : `pnpm db:types` régénère `packages/db/src/types.generated.ts`.

## Déploiement

Standard `josias-koffi/infra` : `.deploy/manifest.yaml` (validé par `infra/scripts/validate-manifest.py`) et `.github/workflows/deploy.yml`.
Staging : push sur `develop` → `reperes-staging.koklo.dev`. Production : _Run workflow_ depuis `main` → `reperes.koklo.dev`.
Onboarding unique, depuis infra : `scripts/onboard-app.sh koklo-dev/reperes ../Repere-France`.

Staging : déployé automatiquement à chaque push sur `develop`.
