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

### Creative Direction and Credits

**Alexandro Milhomes Leão** conceived Adventure Files, defined its creative direction, and developed its application. Its original illustrations were iteratively refined with AI assistance; AI tools also supported software development and technical documentation. The visual ideas and design decisions belong to the creator.

The aesthetic draws inspiration from tabletop RPGs and classic adventure video games (including *Dungeons & Dragons*, *Adventure Time*, *The Legend of Zelda*, *Super Mario*, *Fallout* and *Pokémon*), pixel art, and 1980s–1990s computer operating systems. These are inspirations only: Adventure Files is an independent project, is not affiliated with these franchises, and does not intentionally reproduce their characters, logos, or other protected artwork.

A compact bilingual **Extras** panel in the authenticated dashboard contains credits, an about section, and contact links. Support: [adventurefiles.suporte@gmail.com](mailto:adventurefiles.suporte@gmail.com). Creator: [github.com/AlexandroLeao](https://github.com/AlexandroLeao).

## Current Development Status

Adventure Files is a feature-complete, owner-tested release candidate on `main`. The original creator and exports landed in [PR #23](https://github.com/AlexandroLeao/rpg-character-creator/pull/23); the Turnstile reliability, account-deletion CAPTCHA compatibility and final dialog-spacing changes were subsequently merged in [PRs #25–#27](https://github.com/AlexandroLeao/rpg-character-creator/pulls?q=is%3Apr+is%3Amerged). The latest application-code merge is `0a0457d` (November 2026). No application pull requests remain open. The remaining Issue #24 is a short hosted operations/security sign-off, not new feature development.

### Implemented

- React, Vite, and TypeScript frontend; Node.js, Express, and TypeScript API.
- Supabase email/password authentication, account confirmation, recovery, sign-out, and session restoration.
- Bilingual signup with expandable Terms of Use / Privacy Notice and an unchecked, mandatory terms acknowledgement before the signup UI can submit.
- Cloudflare Turnstile in registration, sign-in, recovery and account-deletion confirmation. Auth requests forward a fresh token for Supabase validation; account deletion reauthenticates on the trusted API with a fresh token, password and independently verified session. CAPTCHA enforcement depends on the hosted Supabase setting and must be confirmed during final sign-off.
- Fifteen-character minimum on signup/reset, matching the last verified Supabase Auth policy; limited browser-hardening response headers without changing the approved pixel-art UI.
- PostgreSQL schema, user-scoped character storage, Row Level Security (RLS), and protected character CRUD endpoints.
- One saved character per account.
- Responsive retro START screen, original desktop/mobile artwork, and iris transition.
- Portuguese/English interface and saved-character translations.
- All six creator stages: Identity, Origins, Equipment, Essence, Journey, and Final Review.
- Required selections, preserved drafts, explicit Save, and the revised catalog with Motivation.
- Illustrated My Character dashboard with editing, confirmed character deletion, Extras/Credits, and password-reconfirmed self-service account deletion executed only by the server (hosted manual QA reported on November 4).
- PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350) exports using the saved character.
- Automated frontend/API/security test suites and GitHub Actions workflows.

### Local Homologation Completed — November 2, 2026

- Manual QA passed for desktop/mobile layout, keyboard accessibility, reduced motion, PT/EN, all six creator stages, CRUD, error states, and both PNG downloads.
- The developer exercised two separate test accounts and reported no cross-account character mixing in normal application flows.
- Frontend on November 2: **146 passing tests across 17 files**, ESLint and Vite/TypeScript build passed.
- November 4 feature-branch implementation `27b0829` adds final auth/security compatibility fixes and **180 frontend tests across 20 files**. **All three workflows passed at `27b0829`**: frontend 180 tests, lint/build; API 107 tests with 2 optional integration checks skipped, lint/build; isolated database security/pgTAP. The previous baseline at `4560955` was 177 frontend / 107 API.
- API: **97 passing tests across 8 files**, ESLint and TypeScript build passed; 2 opt-in local Supabase integration tests are skipped by default but were exercised previously against an isolated local environment.
- The merged `main` commit `0b22f48` passed Frontend, API and Database Security GitHub Actions. The creator reported the stable Vercel Production URL displaying the application after merge; verify the exact Production deployment SHA, runtime response headers and API access in the final hosted environment.

### Staging Validation — November 3–4, 2026

- The developer confirmed that the Vercel-to-Render API proxy returns `GET /api/health` successfully and rejects unauthenticated `GET /api/characters/me` with HTTP 401.
- Using two test accounts, the developer reported successful deployed ownership-isolation, protected-field rejection, and independent character CRUD checks. These are **developer-reported manual results**, separate from automated/local integration tests.
- Read-only hosted Supabase checks confirmed migrations `20261028000000` and `20261031000000`, RLS enabled on `public.characters`, four owner-scoped policies, the six-stage schema, and **2 characters / 0 records missing Motivation** at the time of inspection.
- The Render staging API was redeployed successfully after an origin-specific CORS configuration update. The developer rechecked the health and unauthenticated endpoints.
- The frontend, API, and database security GitHub Actions checks passed on documentation commit `c115039`.

- On November 4, the developer reported successful **hosted account deletion in Portuguese and English**, inability to sign back into a deleted account, successful re-registration with the same email after confirmation, and preservation of a separate account. These are valuable manual acceptance results; they do **not** independently prove the removed character row or cover every token failure mode. Render startup logs show a Live service; no server-side account data was accessed for this report.

### Remaining Before Public Portfolio Demo

- The creator reports successful hosted login, registration, recovery, account deletion/re-registration, cross-account isolation and desktop/mobile checks after the Turnstile rollout. Confirm that the stable Vercel Production and Render API deploy the latest approved `main` code and that Supabase CAPTCHA is **enabled and enforcing** fresh tokens; do not disable CAPTCHA as a routine release step.
- Verify actual hosted browser security headers, HTTPS, Render CORS and secret isolation; accept or mitigate the Supabase Free no-backup risk and confirm the accepted bilingual Terms/Privacy notice reflects real data handling (checkbox is not an auditable legal consent register). Production-only dependency audits had zero findings; the moderate dev-only minimatch risk is documented in the runbook.
- Verify the stable public Vercel URL in a signed-out browser, its authentication redirect allowlist, HTTPS, critical recovery flow, and the chosen single free-hosting environment.
- PRs #23, #25, #26 and #27 are merged; frontend CI passed on `0a0457d`, frontend/API CI passed on account-deletion merge `843514a`, and database pgTAP last passed at foundational merge `0b22f48` (no subsequent migration changes). Issue #15 is closed. Keep Issue #24 open until hosted headers/CORS, Supabase CAPTCHA configuration and the free-plan backup risk are explicitly reviewed.
- Known free-tier trade-offs include Render cold starts, possible Supabase inactivity pausing, and limited personal Gmail SMTP throughput. These affect availability; do not describe the demo as a commercial service with an uptime guarantee.

See the [zero-budget portfolio release runbook](docs/free-portfolio-release.md) and [release-readiness issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24). The MVP scope remains frozen: no PDF, playable game, OAuth expansion, or new artwork variants for this release.

## User Experience

The approved experience follows this structure:

1. Adventure Files START screen.
2. Retro iris transition into authentication.
3. Sign in or create an account.
4. Authenticated character area.
5. Six-stage guided character creation.
6. Final Review and explicit Save.
7. Saved My Character dashboard.
8. Editing, two PNG exports, character/account deletion, Extras, and sign-out.

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

- [Free Portfolio Release Runbook](docs/free-portfolio-release.md) — evidence, remaining gates, zero-cost hosting risks, and final delivery sequence.
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
# Required for secure account deletion, only on the trusted API server:
SUPABASE_SECRET_KEY=sb_secret_YOUR_SERVER_ONLY_KEY
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
DELETE /api/account/me
```

Character endpoints require a valid authenticated session. `DELETE /api/account/me` additionally requires a fresh password check and explicit `DELETE` confirmation; the server deletes only the authenticated user's account, cascading to their character. The secret key never belongs in `VITE_*` variables or frontend bundles. Configure it in Render after reviewing the code; without that key, the route returns a controlled 503.

The API currently validates character selections against its implemented catalog and associates records with the authenticated user. The six-stage catalog, Motivation field, and associated API/database validation are implemented; preserve their existing tested contracts.

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

### Staging Recovery Email: One-Time Code

Supabase's built-in SMTP is a development-only sender with a shared limit of
**two emails per hour**. Configure custom SMTP under **Authentication → SMTP
Settings** before testing recovery at scale. A dedicated Gmail SMTP account is
acceptable for small staging tests but is **not a reliable production email
service**. Do not commit SMTP credentials or reuse a personal Gmail password.
When using Gmail SMTP, store a Google **app password** only in Supabase:

- Sender email / SMTP user: the same dedicated Gmail account.
- Sender name: `Adventure Files`.
- Host: `smtp.gmail.com`.
- Port: `465` (TLS).
- Password: Google app password (requires Google 2-Step Verification).

**After custom SMTP is enabled**, in **Authentication → Emails → Reset password**
set a custom template that sends an OTP instead of an auto-verifying link.
This prevents email security scanners from consuming a single-use recovery URL
before the user opens it. Suggested subject:

```text
Adventure Files — Your recovery code / Código de recuperação
```

Suggested HTML body (the Go-template variables are processed by Supabase):

```html
<h2>Adventure Files — Recuperação de senha / Password recovery</h2>
<p>Seu código temporário / Your one-time recovery code:</p>
<p><strong>{{ .Token }}</strong></p>
<p><a href="{{ .RedirectTo }}">Abrir recuperação / Open recovery page</a></p>
<p>Digite seu e-mail e o código para definir uma nova senha.</p>
<p>Enter your email address and this code to set a new password.</p>
<p>Se você não solicitou isso, ignore esta mensagem.</p>
<p>If you did not request this, ignore this message.</p>
```

**Do not include** `{{ .ConfirmationURL }}` in this recovery template: clicking
that link would verify and consume the token automatically. The app verifies
`email + code` directly with Supabase Auth using `verifyOtp` with
`type: 'recovery'`, then shows the password form only for the verified
account. Legacy emailed links continue to work while this configuration
is being rolled out.

Keep `VITE_AUTH_REDIRECT_ORIGIN` pointed to a **stable** Vercel environment
alias rather than a per-deployment URL, and allow its `/reset-password`
route in **Authentication → URL Configuration**. Never place SMTP secrets in
`VITE_*` variables; Vite exposes them in browser bundles.

Test with two separate accounts, using the newest email/code, verifying that
wrong, expired and previously used codes fail. Verify that updating the
password of account A never changes account B or any characters belonging
to B, and that sign-out affects the intended session scope.

### Public-Demo Email Delivery

The existing dedicated Gmail custom SMTP has passed low-volume email/OTP testing; it is **not** a guaranteed transactional email service. Before opening public registration, verify configured rate limits, email confirmation/recovery and abuse protection, and explicitly accept the free-tier delivery limits. If usage grows or delivery becomes unreliable, evaluate a dedicated transactional provider as a **post-launch operational decision**, not an unapproved paid dependency.

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

**Release candidate:** the implemented product is functionally accepted on desktop/mobile, PT/EN. The remaining work is an intentionally bounded engineering handoff, not new RPG features or social-media promotion.

The six-stage character creator, protected CRUD, two PNG exports, session recovery, hosted database migration/RLS verification, two-account isolation and hosted account deletion are integrated into `main`. The creator manually approved the PT/EN desktop/mobile signup Terms of Use and Privacy Notice flow, including a successful new-account registration. At application commit `39cb50c`, GitHub Actions passed all three workflows: **177 frontend tests (19 files), 107 API tests (2 opt-in integration tests skipped)**, frontend/API lint and builds, and isolated database security/pgTAP.

**Next milestone:** verify the deployed `main` SHA on Vercel and Render, confirm Supabase CAPTCHA remains enabled and that hosted HTTPS/CORS/security and recovery `noindex` headers are correct, acknowledge the Supabase Free backup/recoverability limitation and close Issue #24 after owner sign-off. The owner has already reported successful real account-deletion/re-registration and cross-account tests; do not repeat destructive tests without a specific need. No new application functionality or promotion is required. See the [release runbook](docs/free-portfolio-release.md).

The roadmap includes **only two character-sheet downloads**: PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350). PDF is explicitly out of scope.

### Optional Improvements After the First Public Release

The following are **ideas for a future milestone, not pending requirements for the current MVP**. Any implementation should be separately approved, tested, and reviewed without changing the already accepted retro UI:

- **New character classes or appearance choices:** commission/create original matching pixel art, add PT/EN descriptions, update shared selection catalogs and class-slug validation, review API/database allowlists and saved-record compatibility, and extend frontend/API/RLS/export tests. Keep the current one-character-per-account limit unless the product scope is explicitly revisited.
- **More role-playing options:** propose additional origins, companions, or equipment with accessible bilingual labels and data-driven validation rather than introducing unchecked values or breaking previously saved characters.
- **AWS as a learning exercise, not a mandatory migration:** evaluate a small isolated proof of concept for S3/CloudFront asset hosting or SES transactional email, with IAM least privilege, cost budgets/alerts, provider quotas, deployment/rollback plans and comparison to the current free Vercel/Render/Supabase stack. No paid or irreversible cloud setup is required for the current release.
- **Operational maturity:** consider observability and broader integration testing after the public demo is stable, prioritizing fixes to actual incidents or user feedback.

---

Adventure Files is a personal project combining full-stack development, creativity, and nostalgia for classic adventure games.
