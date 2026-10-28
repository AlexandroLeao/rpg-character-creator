# RPG Character Creator

A full-stack fictional RPG character creator with a minimalist retro-computer and pixel-art aesthetic.

Registered users will create, save, edit, and export **one RPG character per account**.

> **Current status:** The initial React frontend, Express health API, Supabase PostgreSQL schema, and database Row Level Security (RLS) are implemented. Email/password authentication, registration, login, logout, session handling, and password recovery are implemented in the authentication feature branch. Protected character API endpoints, character creation, PDF export, and production deployment are planned.

## Project Vision

RPG Character Creator is a character creation application, not a playable RPG.

The experience combines modern web technologies with an interface inspired by early desktop computers and classic handheld games.

### Planned Features

- Email/password authentication using Supabase Auth.
- Email confirmation and password recovery.
- One saved character per authenticated user.
- Eight character classes.
- Seven character customization categories.
- Four-stage guided character creation.
- Character draft randomization.
- Private character dashboard.
- Character editing and deletion.
- Downloadable retro-styled PDF character sheet.
- Original pixel-art illustrations.
- Retro CRT effects and subtle visual glitches.
- Responsive layouts and accessible controls.
- Light and dark visual themes.

Google OAuth, playable combat, and multiple saved characters per account are outside the initial release.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
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

- Git and GitHub
- Google Cloud Shell
- GitHub Actions
- npm

## Repository Structure

- `web/` — React frontend and authentication interface.
- `api/` — Express REST API.
- `supabase/` — Database configuration, migrations, and security tests.
- `docs/` — Requirements, architecture, product design, and UML diagrams.
- `.github/workflows/` — Automated CI workflows.

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

Google Cloud Shell is currently used as the primary development environment.

### Frontend Setup

From the repository root:

```bash
cd web
npm ci
```

Create a local environment file:

```text
web/.env.local
```

Use `web/.env.example` as the reference.

The required environment variables are:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with the correct project URL and publishable key from the Supabase dashboard.

Never put a Supabase secret key, service-role key, or database password in the frontend environment.

The `.env.local` file must remain untracked by Git.

### Start the Frontend

From the `web` directory:

```bash
npm run dev
```

For Google Cloud Shell:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

Open the application using Cloud Shell Web Preview on port `5173`.

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

## Authentication

The frontend uses Supabase Auth for:

- Email registration.
- Email confirmation.
- Password-based sign-in.
- Sign-out.
- Session restoration.
- Password recovery.
- Password updates.

Authentication is managed by Supabase.

The application does not implement custom password storage or password-reset tokens.

### Authentication Redirect URLs

Development and production redirect URLs must be configured in the Supabase dashboard.

The password recovery flow uses:

```text
/reset-password
```

The development URL and its `/reset-password` route must be included in the allowed redirect URLs.

Google Cloud Shell preview URLs may change between environments.

### Production Email Delivery

Supabase's default email service is suitable only for limited development and testing.

Before public registration is enabled, configure a production-ready SMTP provider and review authentication rate limits, abuse prevention, and account verification settings.

## Backend Setup

From the repository root:

```bash
cd api
npm ci
npm run build
npm run lint
npm test
npm run dev
```

The currently implemented public health endpoint is:

```http
GET /api/health
```

Protected character endpoints will be implemented in a separate development milestone.

## Database Security

The PostgreSQL schema is managed through version-controlled Supabase migrations.

The character table enforces one character per account and uses Row Level Security to protect user-owned records.

Database security tests validate ownership isolation, anonymous access restrictions, and database constraints.

Authentication middleware and protected Express character operations will be implemented separately.

## Continuous Integration

GitHub Actions runs automated checks when relevant files change.

### Frontend Checks

The frontend workflow runs:

- Dependency installation.
- Automated Vitest tests.
- ESLint.
- Production build.

Workflow:

```text
.github/workflows/frontend.yml
```

### Database Security Tests

The database workflow checks Supabase migrations and database security policies.

Workflow:

```text
.github/workflows/database.yml
```

## Contribution Workflow

Development follows:

1. Create or select a GitHub Issue.
2. Create a dedicated feature branch.
3. Implement the approved scope.
4. Run tests, lint, and build checks.
5. Open a Pull Request.
6. Review the changes and CI results.
7. Merge into `main` after approval.
8. Close the related Issue.

Keep `main` stable as development progresses.

## Project Conventions

- Source code is written in English.
- User interface text is written in English.
- Commits, Issues, Pull Requests, and documentation use English.
- Authentication and authorization must follow least-privilege principles.
- Secrets must never be committed to the repository.
- Visual effects must not interfere with usability or accessibility.
- Character data must always be protected by server-side authorization and database RLS.

## Current Development Milestone

**Issue #11 — Supabase Email Authentication and Recovery UI**

The authentication feature includes frontend screens, Supabase integration, automated tests, and CI.

The next planned milestone is secure Express API authentication and authorization, followed by character persistence and the guided character creator.