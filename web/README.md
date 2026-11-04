# Adventure Files — Web Frontend

Adventure Files is a retro pixel-art character-creation experience. This directory contains its React/TypeScript interface, built with Vite.

The web app is part of the [Adventure Files full-stack repository](../README.md); its API lives in [`api/`](../api/README.md), while Supabase supplies authentication and PostgreSQL/RLS storage.

## Implemented Experience

- Responsive Adventure Files START screen with original desktop/mobile artwork and reduced-motion support.
- Supabase Auth email/password flows, recovery, session restoration, and PT/EN interface.
- Guided creator with six stages: Identity, Origins, Equipment, Essence, Journey, and Final Review.
- Eight character classes with original class artwork and ten character selections (class, name, ancestry, background, weapon, artifact, personality, aura, companion, motivation).
- One saved character per account, with view, edit, and confirmation-based delete.
- Compact authenticated dashboard: empty-state Create / Extras / Delete Account / Sign Out; saved-character Sign Out / Edit / Export / Delete / Extras, in PT/EN. Extras credits creator Alexandro Milhomes Leão and includes a short about section, inspirations, GitHub, and support email. AI-assisted workflow details are documented in the root README, not displayed in Extras.
- Delete menu separates character deletion from irreversible password-reconfirmed account deletion; the backend route requires a server-only Supabase admin credential.
- Browser-generated PNG Story/Status (1080 × 1920) and PNG Portrait (1080 × 1350) downloads from the **saved** character. The project favicon is reused in both export layouts.

The application is a character creator, not a playable RPG. PDF and direct social publishing are outside the initial scope.

## Requirements

- Node.js 24 and npm.
- The Express API running on port 3000.
- A configured Supabase project (URL and **publishable** key).

## Development in GitHub Codespaces

1. Install frontend dependencies (from this `web/` directory):

```bash
npm ci
```

2. Create `web/.env.local` using `web/.env.example` as a template:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY
```

These two values are frontend-visible configuration. **Never** put a Supabase service-role/secret key, database password, or other privileged credential in any `VITE_` variable or committed file.

3. Start the Express API in a **separate Codespaces terminal**:

```bash
cd /workspaces/rpg-character-creator/api
node --env-file=.env --import tsx src/server.ts
```

The API needs its own `api/.env` configuration, documented in [the API README](../api/README.md).

4. Start the frontend in another terminal:

```bash
cd /workspaces/rpg-character-creator/web
npm run dev -- --host 0.0.0.0 --port 5174
```

Open the forwarded port `5174` from the Codespaces **Ports** tab.

The Vite **development** proxy forwards `/api` requests to the Express server at `127.0.0.1:3000`. Production hosting needs a separate forwarding/routing rule; the Vite development proxy does not run inside a production build.

## Commands

Run from `web/`:

```bash
npm test
npm run lint
npm run build
```

- `npm test`: Vitest and React Testing Library tests.
- `npm run lint`: ESLint.
- `npm run build`: TypeScript checks and Vite production build.
- `npm run preview`: serve a locally built frontend for preview (does **not** start the API).

## Implementation Notes

- UI components, styling, and tests live in `src/`.
- Supabase browser client and character API requests live in `src/lib/`.
- Original artwork and `favicon.png` live in `public/`.
- Browser registration/sign-in/recovery use Supabase Auth directly.
- Protected character requests use `GET/PUT/DELETE /api/characters/me` with the verified account's access token.
- Account deletion uses `DELETE /api/account/me`, with the current password and explicit confirmation. Its `SUPABASE_SECRET_KEY` must exist **only** in the API environment. The developer reported successful hosted PT/EN deletion and account isolation tests on November 4, using the privately configured backend; this is manual acceptance evidence, not an independent security assessment.
- PNG generation uses browser Canvas, without uploading generated exports or including private account data.

## Verification and Release

Developer-reported desktop/mobile, PT/EN, keyboard/reduced-motion, six-stage creator, save/edit/delete and PNG Story/Portrait QA passed. At feature-branch commit `0b89fa2` on November 4, CI passed **173 frontend tests across 19 files**, **107 API tests** (2 opt-in integration tests skipped by default), frontend/API lint and builds, and database security/pgTAP.

On November 3–4, hosted staging testing confirmed the Vercel `/api` rewrite to Render and the `/reset-password` SPA fallback. The developer reported successful Gmail SMTP recovery, expired/used-code rejection, per-tab session isolation, and two-account ownership checks. Read-only hosted database migration/RLS checks also passed. These manual results are not equivalent to a formal penetration test or production-scale email certification.

The initial zero-budget public portfolio demo may reuse the currently working Vercel Hobby + Render Free + Supabase Free setup after a specific launch approval. The API rewrite in `web/vercel.json` currently points to the staging Render service; do not assume the deployment already has a separate production backend. Verify the stable public URL and authentication redirect before publicity.

The static `index.html` currently has a title/favicon but still needs a short SEO description and appropriate social-sharing metadata before the LinkedIn release. The public URL and sharing image must be chosen before setting canonical/og:url fields. Do not index authenticated/private character pages.

See [the zero-budget release runbook](../docs/free-portfolio-release.md).

The feature branch remains in [draft PR #23](https://github.com/AlexandroLeao/rpg-character-creator/pull/23). **Do not merge or enable public sign-up yet**: dependency/header/security review, email/abuse limits, stable public routing, privacy and final release approval remain in [issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

See the [product experience](../docs/product-experience.md), [requirements](../docs/requirements.md), and [architecture](../docs/architecture.md) for the approved scope.
