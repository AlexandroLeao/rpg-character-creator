# Adventure Files

**Adventure Files** is a personal full-stack web project inspired by classic RPGs, retro computers, and minimalist pixel-art games.

The project transforms a traditional authentication system into a nostalgic experience where users can create, customize, save, and eventually export their own fictional RPG characters.

Adventure Files is not a playable RPG. It is a character creation experience designed to demonstrate full-stack development while exploring creative interface design.

## Project Vision

Adventure Files combines modern web development with the visual identity of classic 8-bit games and early computer interfaces.

The experience begins with a retro title screen featuring original pixel-art illustrations, followed by authentication and a guided character creation system.

Each authenticated user can maintain one fictional character, customize its attributes, and eventually download a printable character sheet.

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
- Portuguese and English interface support (planned).

## Current Development Status

Adventure Files is under active development.

### Implemented

- React, Vite, and TypeScript frontend.
- Node.js, Express, and TypeScript backend.
- Supabase email/password authentication.
- Account registration and email confirmation.
- Login, logout, and session restoration.
- Password recovery and password updates.
- PostgreSQL database schema.
- Row Level Security (RLS).
- One-character-per-account database constraint.
- Protected character API endpoints.
- Character retrieval, creation/update, and deletion on the backend.
- Basic authenticated character dashboard.
- Responsive Adventure Files START screen.
- Original desktop and mobile start-screen illustrations.
- Animated title and blinking PRESS START.
- Retro screen closing and opening transitions.
- Automated tests and GitHub Actions workflows.

### Planned

- Final authentication interface redesign.
- Portuguese and English localization.
- Four-stage character creation wizard.
- Class-specific pixel-art illustrations.
- Character customization interface.
- Character editing and deletion controls.
- Draft randomization.
- Illustrated character sheet.
- Client-side PDF export.
- Production deployment and final accessibility review.

## User Experience

The planned experience follows this structure:

1. Adventure Files START screen.
2. Login or account registration.
3. Authenticated character dashboard.
4. Four-stage character creation.
5. Character review and explicit save.
6. Saved character sheet.
7. Editing, deletion, PDF export, and logout.

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

- Screen closing: 1.6 seconds.
- Dark pause: 0.3 seconds.
- Authentication screen opening: 1.6 seconds.

The interface respects reduced-motion accessibility preferences.

### Character Creation

The creator will use four stages:

1. **Class & Name:** Select a class and enter the character's name.
2. **Origins:** Choose ancestry and background.
3. **Equipment:** Choose weapon, artifact, and companion.
4. **Essence & Review:** Choose personality and aura, review the selections, and save.

Selections remain editable until the user explicitly saves the character.

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

The API validates character selections against the approved catalog and associates records with the authenticated user.

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
- The user interface is planned to support Portuguese and English.
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

The responsive Adventure Files START screen has been implemented and merged into `main` through Pull Request #19.

The next development milestones focus on:

1. Product documentation alignment.
2. Authentication interface redesign.
3. PT/EN localization.
4. Four-stage character creation.
5. Character management and PDF export.
6. Production validation and deployment.

---

Adventure Files is a personal project combining full-stack development, creativity, and nostalgia for classic adventure games.