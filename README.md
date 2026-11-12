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

Adventure Files is a **completed, owner-tested MVP** on `main` at application commit `32bb63d` (November 5, 2026). The creator/PNG exports, Turnstile compatibility, account-deletion fixes, and email-only signup were reviewed and merged. The owner accepted desktop/mobile PT/EN smoke tests, account deletion/re-registration and account isolation; [release issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24) is closed. [Post-MVP security review #31](https://github.com/AlexandroLeao/rpg-character-creator/issues/31) records bounded additional checks and accepted follow-ups, not a release blocker.

**November 12 post-MVP review:** [Frontend Checks](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/42101618668) and [API Checks](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/42101618812) on `main` commit `fea7ac8` passed **183 frontend tests (20 files)** and **108 API tests (9 files passed; 2 opt-in tests in a tenth file skipped)**, respectively, with lint and builds. The [November 4 database run](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/41918531601) passed **39 pgTAP assertions (2 files)** at `0b22f48`; no database files or workflow changed through `fea7ac8`. These original logs were inspected, not rerun. The [post-MVP engineering roadmap](docs/post-mvp-engineering.md) tracks the separate R1–R7 cycle, including OpenAPI, Docker and full-stack Playwright as future work.

### Implemented

- React, Vite, and TypeScript frontend; Node.js, Express, and TypeScript API.
- Supabase email/password authentication, account confirmation, recovery, sign-out, and session restoration.
- Bilingual signup with expandable Terms of Use / Privacy Notice and an unchecked, mandatory terms acknowledgement before the signup UI can submit.
- Cloudflare Turnstile in registration, sign-in, recovery and account-deletion confirmation. Auth requests forward a fresh token for Supabase validation; account deletion reauthenticates on the trusted API with a fresh token, password and independently verified session. The owner reports successful hosted CAPTCHA-protected authentication and account-deletion checks; continued enforcement depends on keeping the Supabase protection setting enabled.
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

### Final Release Acceptance — November 5, 2026

- The owner confirmed signup, login, recovery, account deletion/re-registration, cross-account isolation, mobile/PT/EN flows, and both PNG exports. These are owner-reported hosted smoke tests, not an exhaustive production audit.
- Hosted checks confirmed HTTPS/HSTS and browser-hardening headers, recovery-page `noindex`, Vercel-proxied API `401`/`Cache-Control: no-store`, origin-specific Render API CORS, and a **SecurityHeaders.com grade A** on the stable frontend. The public bundle search found no exposed private key; a literal `sb_secret_` SDK prefix check is not a secret value.
- A **manual ZAP Safe-mode passive review** of public pages reported **0 High, 7 Medium, 3 Low, 4 Informational** alerts across mixed first- and third-party hosts. Reviewed samples included Cloudflare-owned challenge CSP/clickjacking alerts, public CSS wildcard CORS, and Google Fonts SRI. These observations are not a complete pentest or an automated ZAP Baseline pass.
- Accepted/deferred hardening: frontend CSP is absent; direct Render anonymous character API `401` did not include `Cache-Control: no-store` (the Vercel proxy and account-deletion route already set it); no generic Express rate limiter is configured. Review these if the application serves meaningful real-user data or an incident justifies the work; no confirmed private-data exposure was observed in these checks.
- The owner accepted **Supabase Free without automatic database backups** for this disposable portfolio demo, deferring manual off-repository exports until meaningful recovery requirements arise. Known free-tier limitations include Render cold starts, Supabase inactivity pauses and best-effort SMTP delivery.

See the [historical release runbook](docs/free-portfolio-release.md), [closed release issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24), and [security review #31](https://github.com/AlexandroLeao/rpg-character-creator/issues/31). The MVP scope remains frozen: no PDF, playable game, OAuth expansion, or new artwork variants.

### Lossless Static PNG Optimization — November 5, 2026

Two reviewed, merged asset-only changes reduced the eleven selected static PNGs by **1,271,167 bytes (10.85%)** without resizing or changing their decoded pixels:

- [PR #35](https://github.com/AlexandroLeao/rpg-character-creator/pull/35): five class illustrations (Bard, Mage, Paladin, Rogue, Warrior), saving **405,356 bytes (9.23%)**.
- [PR #36](https://github.com/AlexandroLeao/rpg-character-creator/pull/36): the two START illustrations, Classes Together, Cleric, Druid and Ranger, saving **865,811 bytes (11.82%)**.

Each replacement was checked against the original Git blob and validated for exact decoded pixel equality, dimensions, color mode and transparency; the remaining six also had PNG metadata compared. The original file paths and application code, layout, CSS, animations, exports and behavior were unchanged. The creator visually approved the results before merging. The existing favicon and hero PNGs were left unmodified because recompression offered no meaningful benefit.

This was a lossless storage optimization, not an artwork revision or a new design feature.

### Post-START Retro-Futuristic Finish — November 5, 2026

The owner approved a restrained, glass-inspired lighting finish across the existing post-START interface:

- [PR #38](https://github.com/AlexandroLeao/rpg-character-creator/pull/38) added soft highlights and hover depth to existing login, creator, dashboard and dialog surfaces.
- [PR #39](https://github.com/AlexandroLeao/rpg-character-creator/pull/39) strengthened layered reflections and fixed Chrome's autofilled-password hover background: the dark inset paint remains intact on hover/focus/active.
- Changes are confined to `web/src/App.css`; the START artwork and animations, palette, typography, spacing, functionality, and exported PNG layouts are preserved. There is no heavy backdrop blur or continuous new animation, and reduced-motion support remains in place.

The merged frontend workflow and Vercel deployment passed after PR #39. This is a visual finish, not a redesign or a new gameplay feature.

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

Users register with an email address and password, with mandatory acknowledgement of the Terms of Use and Privacy Notice. Character naming takes place after authentication.

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

- [Free Portfolio Release Runbook](docs/free-portfolio-release.md) — historical release gates, owner acceptance evidence, and zero-cost hosting risk decisions.
- [Post-MVP Engineering Roadmap](docs/post-mvp-engineering.md) — dated CI evidence and the separate R1–R7 improvement cycle.
- [OpenAPI 3.1 API contract](api/openapi.json) — five existing operations, local examples and schemas; see [API documentation](api/README.md) for usage and validation.
- [Local API Docker execution](api/README.md#local-docker-execution-r4) — Node 24 container, healthcheck, non-root runtime and isolated smoke verification; current hosting is unchanged.
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

**MVP accepted (November 5, 2026):** the owner completed PT/EN desktop/mobile acceptance and the engineering release tracker [#24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24) was closed. Future security assurance and product research are separate optional work, not blockers for the completed portfolio demo.

The six-stage creator, owner-scoped CRUD, two PNG exports, email recovery, verified account deletion, responsive bilingual UI and minimal email-only signup are integrated into `main` at `32bb63d`. Frontend and API GitHub Actions checks and Vercel commit status passed on the later reviewed `main` commit `fea7ac8`; database CI passed at `0b22f48`, with no subsequent database files/workflow changes through `fea7ac8`. See the [dated engineering baseline](docs/post-mvp-engineering.md). The owner reports successful live account deletion/re-registration and cross-account regression testing.

**Bounded post-release security review:** hosted HTTPS/headers, public assets, CORS, noindex, the public-bundle secret search and a manual ZAP Safe-mode passive review are documented in [#31](https://github.com/AlexandroLeao/rpg-character-creator/issues/31). A full penetration test or automated ZAP Baseline was **not** performed. No high-severity alert was recorded in the reviewed passive session, but this is not a security certification. The documented CSP, direct Render response caching and Express limiter considerations are optional follow-ups, not verified vulnerabilities or current MVP blockers. The owner accepted the Supabase Free no-automatic-backup risk; manual exports remain deferred.

The roadmap includes **only two character-sheet downloads**: PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350). PDF is explicitly out of scope.

### Optional Improvements After the First Public Release

The following are **ideas for a future milestone, not pending requirements for the current MVP**. Any implementation should be separately approved, tested, and reviewed without changing the already accepted retro UI:

- **New character classes or appearance choices:** commission/create original matching pixel art, add PT/EN descriptions, update shared selection catalogs and class-slug validation, review API/database allowlists and saved-record compatibility, and extend frontend/API/RLS/export tests. Keep the current one-character-per-account limit unless the product scope is explicitly revisited.
- **More role-playing options:** propose additional origins, companions, or equipment with accessible bilingual labels and data-driven validation rather than introducing unchecked values or breaking previously saved characters.
- **AWS as a learning exercise, not a mandatory migration:** evaluate a small isolated proof of concept for S3/CloudFront asset hosting or SES transactional email, with IAM least privilege, cost budgets/alerts, provider quotas, deployment/rollback plans and comparison to the current free Vercel/Render/Supabase stack. No paid or irreversible cloud setup is required for the current release.
- **Future least-privilege RBAC/admin roles:** research actual support/admin workflows before creating roles, authorize privileges by verified user UUID (never automatically by support sender email), and require RLS/server enforcement, MFA, tests and audit logging. Planning only; see [#30](https://github.com/AlexandroLeao/rpg-character-creator/issues/30).
- **Privacy-first usage analytics/dashboard:** research whether aggregated creator completion, usability and error metrics would inform decisions before collecting any behavioral data. Minimize personal data, evaluate retention/transparency/consent and secure dashboard access; do not introduce tracking in the completed MVP. Planning only; see [#32](https://github.com/AlexandroLeao/rpg-character-creator/issues/32).
- **Operational maturity:** if real usage warrants it, add `Cache-Control: no-store` to direct authenticated Render API responses, evaluate an appropriate CSP in Report-Only mode with Turnstile compatibility, consider narrowly scoped Express rate limiting, and revisit observability or broader security testing. Prioritize actual incidents and user feedback; see [#31](https://github.com/AlexandroLeao/rpg-character-creator/issues/31).

---

Adventure Files is a personal project combining full-stack development, creativity, and nostalgia for classic adventure games.
