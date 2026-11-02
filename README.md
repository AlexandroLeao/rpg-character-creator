# Adventure Files

**Adventure Files** is a personal full-stack web project inspired by classic RPGs, retro computers, and minimalist pixel-art games.

The project combines authentication, a guided creator, persistent character data, and two downloadable PNG character-sheet layouts in a nostalgic full-stack experience.

Adventure Files is not a playable RPG. It is a character creation experience designed to demonstrate full-stack development while exploring creative interface design.

## Project Vision

Adventure Files combines modern web development with the visual identity of classic 8-bit games and early computer interfaces.

The experience begins with a retro title screen featuring original pixel-art illustrations, followed by authentication and a guided character creation system.

Each authenticated user can maintain at most one fictional character, customize its attributes, and download character sheets as PNG Story/Status or PNG Portrait images for sharing.

### Design Principles

- Minimalist retro RPG aesthetic.
- Original pixel-art illustrations.
- Classic computer-inspired interfaces.
- A single dark visual theme.
- Dark backgrounds with mint-green and cream accents.
- Pixel-style typography.
- Subtle CRT effects and visual glitches.
- Responsive desktop and mobile layouts.
- Accessible navigation and controls.
- Portuguese and English interface support.

## Current Development Status

Adventure Files is under active development. The six-stage guided character creator, saved-character management, and two PNG export formats are implemented on the feature branch and have been exercised in the browser.

### Implemented

- React, Vite, and TypeScript frontend; Node.js, Express, and TypeScript API.
- Supabase email/password authentication, account confirmation, recovery, sign-out, and session restoration.
- PostgreSQL schema, user-scoped character storage, Row Level Security (RLS), and protected character CRUD endpoints.
- One saved character per account.
- Responsive retro START screen, original desktop/mobile artwork, and iris transition.
- Portuguese/English interface and saved-character translations.
- All six creator stages: Identity, Origins, Equipment, Essence, Journey, and Final Review.
- Required selections, preserved drafts, explicit Save, and the revised catalog with Motivation.
- Illustrated My Character dashboard with editing and confirmation-based deletion.
- PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350) exports using the saved character.
- Automated frontend/API/security test suites and GitHub Actions workflows.

### Local Homologation Completed — November 2, 2026

- Manual QA passed for desktop/mobile layout, keyboard accessibility, reduced motion, PT/EN, all six creator stages, CRUD, error states, and both PNG downloads.
- The developer exercised two separate test accounts and reported no cross-account character mixing in normal application flows.
- Frontend: **146 passing tests across 17 files**, ESLint and Vite/TypeScript build passed.
- API: **97 passing tests across 8 files**, ESLint and TypeScript build passed; 2 opt-in local Supabase integration tests are skipped by default but were exercised previously against an isolated local environment.
- GitHub Actions Frontend, API, and Database Security workflows passed at the last implementation commit; `GET /api/health` returned 200 and an unauthenticated character GET returned 401.

### Remaining Before Release

- Recheck cross-account authorization, RLS, migration state, and legacy-character compatibility against an isolated deployed/staging environment.
- Configure staging/production API routing, HTTPS, CORS, authentication redirect URLs, production-ready email, and monitoring.
- Validate end-to-end authentication, persistence, and both exports on the hosted preview; review dependency security.
- Complete final review, rerun CI after changes, and merge draft PR #23 only after release gates are met. See [release-readiness issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

Passing local tests and manual browser checks does not by itself establish production readiness.

## User Experience

The approved experience follows this structure:

1. Adventure Files START screen.
2. Retro iris transition into authentication.
3. Sign in or create an account.
4. Authenticated character area.
5. Six-stage guided character creation.
6. Final Review and explicit Save.
7. Saved My Character dashboard.
8. Editing, deletion, PNG export, and sign-out.

Authentication credentials and character creation are separate processes.

Users register with a display name, email address, and password. Character creation takes place after authentication.

### Start Screen

The start screen includes:

- The Adventure Files title.
- An original fantasy pixel-art illustration.
- Eight adventurers representing the available classes.
- A minimalist blinking PRESS START control.
- Mouse, keyboard, and touch interaction.
- Responsive desktop and mobile artwork.

The transition uses a retro circular closing effect followed by an inverse opening animation on the authentication screen.

The approved animation sequence is:

- Screen closing: approximately 1.6 seconds.
- Dark pause: approximately 0.3 seconds.
- Authentication screen opening: approximately 1.6 seconds.

The interface respects reduced-motion accessibility preferences.

### Character Creation

The approved creator uses six stages:

| Step | Name | Fields |
|---|---|---|
| 01 / 06 | Identity | Class and name |
| 02 / 06 | Origins | Ancestry and background |
| 03 / 06 | Equipment | Weapon and artifact |
| 04 / 06 | Essence | Personality and aura |
| 05 / 06 | Journey | Companion and motivation |
| 06 / 06 | Final Review | Review all values and explicitly save |

The first five stages contain two fields each; the sixth introduces no new customization choices.

Each required category must be explicitly selected. Only Companion supports `none`; Artifact does not.

Desktop pairs selection groups side by side with subtle short dividers. Mobile stacks groups vertically without those dividers.

The creator preserves draft selections during Back/Continue navigation and language changes. Saving occurs only after user confirmation.

### Character Sheet Export

Saved characters can be downloaded in two PNG formats:

| Format | Size | Purpose |
|---|---|---|
| PNG Story/Status | 1080 × 1920 | Instagram Stories and WhatsApp Status |
| PNG Portrait | 1080 × 1350 | Portrait posts and general sharing |

Both exports use the saved character data, including Motivation, with the existing class artwork and without private account information. Exports are generated in the browser; they do not change or duplicate the saved record.

**Scope decision (November 1, 2026):** PDF export has been removed from the product roadmap. Direct publishing to social media remains outside the initial scope.

## Character Classes

Adventure Files includes eight predefined classes:

| Class | Identifier |
|---|---|
| Warrior | `warrior` |
| Paladin | `paladin` |
| Mage | `mage` |
| Rogue | `rogue` |
| Ranger | `ranger` |
| Druid | `druid` |
| Cleric | `cleric` |
| Bard | `bard` |

The complete customization catalog is documented in:

[Customization Catalog](docs/customization-catalog.md)

Each account supports one saved character.

The project does not include character gender selection, combat mechanics, or restrictions on combining customization options.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Supabase JavaScript Client
- Vitest
- React Testing Library

### Backend

- Node.js
- Express
- TypeScript

### Database and Authentication

- Supabase Auth
- PostgreSQL
- Row Level Security (RLS)

### Development and Automation

- Git
- GitHub
- GitHub Codespaces (current browser-based development)
- Google Cloud Shell (optional)
- GitHub Actions
- npm

## Repository Structure

- `web/` — React frontend and user interface.
- `api/` — Express REST API.
- `supabase/` — Database migrations, configuration, and security tests.
- `docs/` — Product documentation, requirements, architecture, and diagrams.
- `.github/workflows/` — Continuous integration workflows.

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

### Requirements

- Node.js 24
- npm
- Git

GitHub Codespaces is the current browser-based development environment. Cloud Shell can also be used when available; neither environment is the production host.

### Frontend Setup

From the repository root:

```bash
cd web
npm ci
```

Create the local environment file:

```text
web/.env.local
```

Use `web/.env.example` as a reference.

Required variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with your Supabase project configuration.

Never expose service-role keys, database passwords, or other secrets through public frontend variables.

### Start the Frontend

From the `web` directory:

```bash
npm run dev
```

For the current GitHub Codespaces setup:

```bash
npm run dev -- --host 0.0.0.0 --port 5174
```

Open forwarded port `5174` from the Codespaces **Ports** panel. Keep this terminal open, and run the API separately on port `3000`. Cloud Shell users can instead select a suitable forwarded port.

### Run Frontend Tests

```bash
npm test
```

### Run ESLint

```bash
npm run lint
```

### Build the Frontend

```bash
npm run build
```

## Backend Setup

From the repository root:

```bash
cd api
npm ci
```

Use `api/.env.example` as a reference for the API environment configuration.

The API requires:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Run the backend (from `api/`):

```bash
npm run dev
```

In Codespaces, the explicitly loaded environment-file command is also supported:

```bash
node --env-file=.env --import tsx src/server.ts
```

The frontend development server proxies `/api` requests to the backend on port `3000`. That Vite proxy is **development-only**: hosted environments need an explicitly configured frontend/API route or proxy.

### API Endpoints

Public health endpoint:

```http
GET /api/health
```

Authenticated character endpoints:

```http
GET /api/characters/me
PUT /api/characters/me
DELETE /api/characters/me
```

Character endpoints require a valid authenticated session.

The API currently validates character selections against its implemented catalog and associates records with the authenticated user. The revised six-stage catalog, new Motivation field, and new identifiers require coordinated API and database updates before the new save flow is enabled.

## Authentication

Supabase Auth manages:

- Registration.
- Email verification.
- Password-based login.
- Logout.
- Session restoration.
- Password recovery.
- Password updates.

The application does not implement custom password storage or password-reset tokens.

### Authentication Redirect URLs

Development and production redirect URLs must be configured in Supabase.

Password recovery uses:

```text
/reset-password
```

The configured application URL and its password recovery route must be included in the allowed redirect URLs.

Google Cloud Shell preview URLs may change between environments.

### Production Email Delivery

Before enabling public registration, configure a production-ready email provider.

Review authentication rate limits, account verification, abuse prevention, and security settings before production deployment.

## Database Security

The database schema is maintained through version-controlled Supabase migrations.

The character table enforces one character per account.

Row Level Security protects character records so authenticated users can only access their own data.

The API also verifies authentication and character ownership.

Database security tests cover:

- Anonymous access restrictions.
- User ownership isolation.
- Character uniqueness.
- Approved customization values.
- Database constraints.

## Continuous Integration

GitHub Actions runs automated checks when relevant files change.

### Frontend Checks

The frontend workflow includes:

- Dependency installation.
- Automated tests.
- ESLint.
- Production build.

Workflow:

```text
.github/workflows/frontend.yml
```

### API Checks

The API workflow verifies the backend implementation through automated checks.

Workflow:

```text
.github/workflows/api.yml
```

### Database Security Tests

The database workflow validates migrations and security policies.

Workflow:

```text
.github/workflows/database.yml
```

## Contribution Workflow

Development follows these steps:

1. Create or select a GitHub Issue.
2. Create a dedicated branch.
3. Implement the approved changes.
4. Run the required tests.
5. Open a Pull Request.
6. Review the changes and CI results.
7. Merge into `main` after approval.

The main branch should remain stable throughout development.

## Project Conventions

- Source code uses English identifiers and comments.
- Commits, Issues, Pull Requests, and technical documentation use English.
- The user interface supports Portuguese and English.
- Database identifiers and stored customization slugs remain language-independent.
- Authentication and authorization follow least-privilege principles.
- Secrets must never be committed to Git.
- Visual effects must respect accessibility and usability.
- Character data must remain protected by authentication and database policies.

## Out of Scope

The initial release does not include:

- Playable RPG mechanics.
- Combat systems.
- Multiplayer.
- Multiple characters per account.
- Character gender selection.
- User-generated artwork.
- Public character sharing.
- Google OAuth.
- A custom administration dashboard.

## Current Development Milestone

The six-stage character flow, saved-character creation/editing/deletion, and both PNG downloads are implemented. The November 2 manual QA of frontend flows, PT/EN, mobile/desktop layouts, reduced motion, keyboard access, error states, and two test accounts found no reported issues. The latest local checks passed **146 frontend tests** (17 files) and **97 API tests** (8 files), lint, and production builds; GitHub Actions database security checks passed.

The next milestone is controlled **staging** deployment and verification: repeat cross-account authorization/RLS checks, migration and legacy-data compatibility, email/recovery flows, API routing, and operational readiness on the hosted preview. The feature branch remains in draft PR #23 and is not merged into `main`. Progress is tracked in [issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

The roadmap includes **only two character-sheet downloads**: PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350). PDF generation is explicitly out of scope.
---

Adventure Files is a personal project combining full-stack development, creativity, and nostalgia for classic adventure games.