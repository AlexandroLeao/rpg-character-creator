# RPG Character Creator

A full-stack fictional RPG character creator with a minimalist retro-computer / pixel-art aesthetic. Registered users will create, save, edit, and export **one** RPG character each.

> **Current status:** Project scaffold and Express health API are implemented. Authentication, character persistence, expanded creator UI, PDF export, and production infrastructure are **planned**, not yet complete.

## Planned Experience

- Public welcome, registration, sign-in, email verification, and password recovery
- Eight character classes and a rich, data-driven customization catalog
- Four-stage guided creation flow with original pixel art and draft randomization
- Private character dashboard and downloadable retro PDF
- Email/password Supabase Auth and PostgreSQL with strict per-user RLS
- Responsive light/dark styling in emerald, mint, cream, and near-black
- Vercel deployment and GitHub Actions CI/CD

**No playable combat, multiple characters, or Google login in the first release.** A final project name will be selected later.

## Repository Layout

- `web/` — React, Vite, TypeScript frontend
- `api/` — Express, TypeScript backend with health endpoint and tests
- `docs/` — Scope, architecture, requirements, product design, and UML

## Documentation

- [Project Overview](docs/project-overview.md)
- [System Requirements](docs/requirements.md)
- [Customization Catalog](docs/customization-catalog.md)
- [Product Experience and Visual Design](docs/product-experience.md)
- [System Architecture](docs/architecture.md)
- [Entity Relationship / Data Model](docs/uml/data-model.md)
- [Use Case Diagram](docs/uml/use-cases.puml)
- [Save Character Sequence](docs/uml/save-character-sequence.puml)
- [Authentication Flow Diagram](docs/uml/auth-flow.puml)

## Local Development

Requirements: Node.js 24 and npm, Git; Google Cloud Shell Editor is the current development workspace.

Frontend (from repository root):

```bash
cd web
npm ci
npm run build
npm run lint
npm run dev
```

Backend (from repository root, in a separate terminal):

```bash
cd api
npm ci
npm run build
npm run lint
npm test
npm run dev
```

The implemented API health check is `GET /api/health`. Future Supabase integration requires environment configuration; do **not** commit real secret values. See `api/README.md` and `api/.env.example` for API-specific setup.

## Contribution Workflow

Issues → topic branches → tests/build/lint → pull requests → review → merge. Keep `main` in a deployable state as the project progresses.

All code, UI strings, and project documentation are written in **English**.
