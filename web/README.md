# Adventure Files — Web Frontend

Adventure Files is a retro pixel-art character-creation experience. This directory contains its React/TypeScript interface, built with Vite.

The web app is part of the [Adventure Files full-stack repository](../README.md); its API lives in [`api/`](../api/README.md), while Supabase supplies authentication and PostgreSQL/RLS storage.

## Implemented Experience

- Responsive Adventure Files START screen with original desktop/mobile artwork and reduced-motion support.
- Supabase Auth email/password flows, recovery, session restoration, and PT/EN interface.
- Guided creator with six stages: Identity, Origins, Equipment, Essence, Journey, and Final Review.
- Eight character classes with original class artwork and ten character selections (class, name, ancestry, background, weapon, artifact, personality, aura, companion, motivation).
- One saved character per account, with view, edit, and confirmation-based delete.
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
- PNG generation uses browser Canvas, without uploading generated exports or including private account data.

## Verification and Release

On November 2, 2026, the developer completed local manual QA of desktop/mobile UX, PT/EN, accessibility/reduced motion, the six-stage flow, save/edit/delete, two test accounts, error states, and both exports; no issues were reported.

The November 2 local frontend run passed **146 tests across 17 files**, lint, and the production build. On November 3 the latest feature-branch GitHub Actions run passed **167 frontend tests across 18 files**, **97 API tests** (with two opt-in integration tests skipped by default), lint/builds, and database security checks.

Vercel's staging frontend uses `web/vercel.json` to forward `/api` calls to a Render staging backend. The `/reset-password` route is also configured for SPA fallback. Hosted API health, CORS, cross-account authorization, and production environment separation must still be independently verified; do not assume a green build proves those endpoints are live.

The developer reported successful manual email/code/password recovery and desktop/mobile QA on November 3. Custom Gmail SMTP is a small-scale staging solution, not yet a production email-delivery service.

The feature branch is being reviewed in [draft PR #23](https://github.com/AlexandroLeao/rpg-character-creator/pull/23). **Do not merge or publish for general access yet**: deployed staging authorization, migration compatibility, authentication email/recovery, API routing, and operational checks remain in [release-readiness issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

See the [product experience](../docs/product-experience.md), [requirements](../docs/requirements.md), and [architecture](../docs/architecture.md) for the approved scope.
