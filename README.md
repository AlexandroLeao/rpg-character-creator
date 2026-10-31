# Adventure Files

**Adventure Files** is a personal full-stack web project inspired by classic RPGs, retro computers, and minimalist pixel-art games.

The project combines authentication, a guided creator, persistent character data, and planned character-sheet exports in a nostalgic full-stack experience.

Adventure Files is not a playable RPG. It is a character creation experience designed to demonstrate full-stack development while exploring creative interface design.

## Project Vision

Adventure Files combines modern web development with the visual identity of classic 8-bit games and early computer interfaces.

The experience begins with a retro title screen featuring original pixel-art illustrations, followed by authentication and a guided character creation system.

Each authenticated user can maintain at most one fictional character, customize its attributes, and eventually download character sheets as PDF A4 or PNG images for sharing.

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

Adventure Files is under active development. The approved target is a **six-stage creator** with a dedicated Final Review and three character-sheet export formats.

The completed frontend currently implements the first three stages of the previous four-stage creator. Reorganizing these stages into the new structure is pending.

### Implemented

- React, Vite, and TypeScript frontend.
- Node.js, Express, and TypeScript backend.
- Supabase email/password authentication.
- Account registration and email confirmation.
- Login, logout, and session restoration.
- Password recovery and password updates.
- PostgreSQL database schema and Row Level Security (RLS).
- One-character-per-account database constraint.
- Protected character API endpoints for retrieval, creation/update, and deletion.
- Basic authenticated character dashboard and localized empty/error states.
- Responsive Adventure Files START screen with original desktop and mobile illustrations.
- Animated title, blinking PRESS START, and retro iris transitions.
- Portuguese/English interface support.
- Class and Name selection with the eight-class ensemble and class-specific artwork.
- Ancestry and Background selection.
- Weapon, Artifact, and Companion selection in the previous equipment layout.
- Draft preservation when navigating between implemented stages.
- Automated tests and GitHub Actions workflows.

### Approved and Pending

- Reorganize the frontend into the six approved stages.
- Update Emerald Amulet to Arcane Seal (`arcane-seal`).
- Update Dragonling to Dragon (`dragon`).
- Move Companion from Equipment to Journey.
- Implement Personality and Aura in Essence.
- Add the eight-option Motivation category to Journey.
- Implement a dedicated Final Review with explicit Save.
- Align frontend types, API validation, and database constraints.
- Safely handle previously saved records during schema/catalog changes.
- Complete illustrated character management, editing, and deletion.
- Generate PDF A4 character sheets.
- Generate PNG Story/Status files at 1080 × 1920 pixels.
- Generate PNG Portrait files at 1080 × 1350 pixels.
- Complete accessibility, integration, security, and production validation.

A feature listed as approved or pending must not be treated as implemented until it passes the relevant tests.

## User Experience

The approved experience follows this structure:

1. Adventure Files START screen.
2. Retro iris transition into authentication.
3. Sign in or create an account.
4. Authenticated character area.
5. Six-stage guided character creation.
6. Final Review and explicit Save.
7. Saved My Character dashboard.
8. Editing, deletion, PDF/PNG export, and sign-out.

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

Three download formats are approved for saved characters:

| Format | Size | Purpose |
|---|---|---|
| PDF | A4 | Printable character sheet |
| PNG Story/Status | 1080 × 1920 | Instagram Stories and WhatsApp Status |
| PNG Portrait | 1080 × 1350 | Portrait posts and general sharing |

All formats use the same saved character data, including Motivation, and exclude private account information.

Direct publishing to social media is outside the initial scope.

These export capabilities are planned and not yet implemented.

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
- Google Cloud Shell
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

Google Cloud Shell is the primary development environment.

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

For Google Cloud Shell:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

Open Cloud Shell Web Preview on port `5173`.

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

Run the backend:

```bash
npm run dev
```

The frontend development server proxies API requests to the backend running on port `3000`.

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

The responsive Adventure Files START screen and authentication foundations are implemented.

The first three stages of the previous character creator are also implemented and covered by automated tests.

The approved next milestones are:

1. Finish documentation alignment for the six-stage plan.
2. Update frontend catalog identifiers and character types.
3. Reorganize Equipment into Weapon and Artifact.
4. Implement Essence, Journey, and the dedicated Final Review.
5. Align API validation and apply safe database migrations.
6. Complete saving, editing, deletion, and the illustrated character dashboard.
7. Implement PDF A4 and both PNG export formats.
8. Verify production security, accessibility, integration, and deployment.

Development work remains on a focused feature branch until the approved implementation and checks are ready for review.

---

Adventure Files is a personal project combining full-stack development, creativity, and nostalgia for classic adventure games.