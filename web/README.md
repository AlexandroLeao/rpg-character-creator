# Adventure Files — Web Frontend

Adventure Files is a retro pixel-art character-creation experience. This directory contains its React/TypeScript interface, built with Vite.

The web app is part of the [Adventure Files full-stack repository](../README.md); its API lives in [`api/`](../api/README.md), while Supabase supplies authentication and PostgreSQL/RLS storage.

## Implemented Experience

- Responsive Adventure Files START screen with original desktop/mobile artwork and reduced-motion support.
- Supabase Auth email/password flows, recovery, session restoration, and PT/EN interface.
- Signup-only expandable bilingual Terms of Use / Privacy Notice and an unchecked mandatory terms acknowledgement. This blocks the frontend signup until accepted; it is not an independently auditable server-side legal-consent record.
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
# Set only after allowing the exact hostname in Cloudflare Turnstile:
VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_TURNSTILE_SITE_KEY
```

All three variables above are frontend-visible configuration; the Turnstile site key is optional for local development but required on hosted frontends when Supabase CAPTCHA enforcement is enabled. **Never** put a Supabase service-role/secret key, database password, or other privileged credential in any `VITE_` variable or committed file.

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

### Turnstile configuration and production verification

The initial CAPTCHA rollout has been implemented and merged into `main` through PRs #25 and #26. The owner reports successful PT/EN/mobile sign-in, signup, recovery and account-deletion/re-registration tests after authorizing the Vercel hostnames.

1. In Cloudflare Turnstile, allow the stable `adventure-files-staging.vercel.app` hostname and any separate Preview hostname actually being tested. A new Vercel deployment URL can require a new hostname entry; never disable validation just to make a Preview work.
2. Keep the **public** `VITE_TURNSTILE_SITE_KEY` in the appropriate Vercel environment(s); the Cloudflare **secret** belongs only in Supabase Authentication → Attack Protection. Never use any `VITE_` variable for a secret.
3. Confirm that the stable Production frontend and Render API both serve the approved `main` build, and verify that Supabase CAPTCHA is **enabled**. Turning it off is an emergency troubleshooting measure, not the finished security configuration.
4. The widget obtains a fresh single-use token for sign-in, signup, recovery, **and deletion confirmation**. The trusted API forwards the deletion proof during the fresh-password reauthentication; tokens are cleared/reset after requests. Never rely on the client widget alone without Supabase server-side enforcement.

The hosted security/header checks, free-plan recoverability limitations and owner acceptance are documented in closed [Issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24) and follow-up [#31](https://github.com/AlexandroLeao/rpg-character-creator/issues/31).

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

**Latest verified baseline:** [Frontend Checks on November 5, 2026](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/42101618668) at `fea7ac8` passed **183 tests across 20 files**, ESLint and the production build. The original job log was reviewed on November 12. See the [post-MVP engineering baseline](../docs/post-mvp-engineering.md); the older acceptance results below remain historical.

Developer-reported desktop/mobile, PT/EN, keyboard/reduced-motion, six-stage creator, save/edit/delete and PNG Story/Portrait QA passed. At merged `main` commit `0b22f48` on November 4, CI passed **180 frontend tests across 20 files**, **107 API tests** (2 opt-in integration tests skipped by default), frontend/API lint and builds, and database security/pgTAP. The creator also reported a successful desktop/mobile PT/EN signup-terms acceptance and real new-account creation test.

On November 3–4, hosted staging testing confirmed the Vercel `/api` rewrite to Render and the `/reset-password` SPA fallback. The developer reported successful Gmail SMTP recovery, expired/used-code rejection, per-tab session isolation, and two-account ownership checks. Read-only hosted database migration/RLS checks also passed. These manual results are not equivalent to a formal penetration test or production-scale email certification.

The approved zero-budget portfolio MVP uses the existing Vercel Hobby + Render Free + Supabase Free setup; the owner accepted its limitations in closed Issue #24. The API rewrite in `web/vercel.json` currently points to the staging Render service; do not assume the deployment already has a separate production backend. Verify the stable public URL and authentication redirect before publicity.

The static `index.html` now has a descriptive title, meta description, Open Graph/Twitter sharing tags and an image URL referring to the existing original desktop title art. The canonical/og:url point to the stable hostname `https://adventure-files-staging.vercel.app/`; verify that Vercel Production serves the intended `main` commit after each future deployment. Revalidate the link preview and image crop if the public hostname or social metadata changes. The `/reset-password` response is configured with `X-Robots-Tag: noindex, nofollow` on Vercel; verify the live header after deployment. Do not index authenticated/private character data.

See [the zero-budget release runbook](../docs/free-portfolio-release.md).

PRs #23, #25, #26 and #27 were merged into `main`. The owner reported successful real-account authentication and account-deletion QA after enabling Turnstile. Hosted CAPTCHA/header/CORS evidence and accepted free-plan recovery limits were captured in closed [Issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24); recheck operational settings after relevant environment changes.

See the [product experience](../docs/product-experience.md), [requirements](../docs/requirements.md), and [architecture](../docs/architecture.md) for the approved scope.
