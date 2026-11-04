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

All three variables above are frontend-visible configuration; the Turnstile site key is optional during rollout. **Never** put a Supabase service-role/secret key, database password, or other privileged credential in any `VITE_` variable or committed file.

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

### Turnstile activation order (shared Supabase project)

1. In Cloudflare Turnstile, allow **every actual hostname** used for Auth, including the stable `adventure-files-staging.vercel.app` and the exact Vercel Preview hostname being tested. Widget mode is Managed; no pre-clearance is required.
2. Set only the **public** `VITE_TURNSTILE_SITE_KEY` for the appropriate Vercel environment(s); redeploy and confirm sign-in, sign-up and recovery render/issue a challenge token. Keep Supabase CAPTCHA **disabled** during this deployment stage.
3. The owner-approved PR #23 was merged on November 4. Before enabling Supabase CAPTCHA, verify the **Production** URL actually serves the token-enabled `main` build and that its Production environment has the public site key. Supabase CAPTCHA applies to all frontend hosts using the same project; turning it on early could lock out clients still running older code.
4. In Supabase Authentication → Attack Protection, set the Cloudflare Turnstile **secret** (never `VITE_`, GitHub or screenshots) and enable CAPTCHA only after all auth hosts are ready. Re-test signup, sign-in and password-recovery request in private browsing, PT/EN and mobile; test an expired/failed challenge, then monitor Auth errors and SMTP rate limits. If live auth fails, disable Supabase CAPTCHA promptly, investigate, and restore only after verification.

The browser resets each single-use Turnstile proof after sending it to Supabase. The UI remains unchanged when the optional site key is absent; **that fallback is not equivalent to abuse protection**, so public launch requires completing the activation steps.

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

Developer-reported desktop/mobile, PT/EN, keyboard/reduced-motion, six-stage creator, save/edit/delete and PNG Story/Portrait QA passed. At merged `main` commit `0b22f48` on November 4, CI passed **180 frontend tests across 20 files**, **107 API tests** (2 opt-in integration tests skipped by default), frontend/API lint and builds, and database security/pgTAP. The creator also reported a successful desktop/mobile PT/EN signup-terms acceptance and real new-account creation test.

On November 3–4, hosted staging testing confirmed the Vercel `/api` rewrite to Render and the `/reset-password` SPA fallback. The developer reported successful Gmail SMTP recovery, expired/used-code rejection, per-tab session isolation, and two-account ownership checks. Read-only hosted database migration/RLS checks also passed. These manual results are not equivalent to a formal penetration test or production-scale email certification.

The initial zero-budget public portfolio demo may reuse the currently working Vercel Hobby + Render Free + Supabase Free setup after a specific launch approval. The API rewrite in `web/vercel.json` currently points to the staging Render service; do not assume the deployment already has a separate production backend. Verify the stable public URL and authentication redirect before publicity.

The static `index.html` now has a descriptive title, meta description, Open Graph/Twitter sharing tags and an image URL referring to the existing original desktop title art. The canonical/og:url currently point to the configured stable production hostname `https://adventure-files-staging.vercel.app/`; **the approved PR #23 has since been merged into `main`; verify that Vercel Production deployed the merge commit `0b22f48`**. Validate the final link preview and image crop after promotion. The `/reset-password` response is configured with `X-Robots-Tag: noindex, nofollow` on Vercel; verify the live header after deployment. Do not index authenticated/private character data.

See [the zero-budget release runbook](../docs/free-portfolio-release.md).

[PR #23](https://github.com/AlexandroLeao/rpg-character-creator/pull/23) was merged and closed with owner approval on November 4. **Do not enable Supabase-wide CAPTCHA until the stable Production deployment includes the site key and new Auth code.** Live headers, rate limits, Render branch/origin alignment, privacy/recoverability and final production smoke remain tracked in [issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

See the [product experience](../docs/product-experience.md), [requirements](../docs/requirements.md), and [architecture](../docs/architecture.md) for the approved scope.
