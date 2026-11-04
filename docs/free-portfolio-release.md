# Adventure Files — Zero-Budget Portfolio Release

> Status: release candidate (November 3–4, 2026). The application is functional, but public registration, merging and repository visibility changes are **not yet approved or completed**. Track the final decisions in [PR #23](https://github.com/AlexandroLeao/rpg-character-creator/pull/23), [Issue #15](https://github.com/AlexandroLeao/rpg-character-creator/issues/15) and [Issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

## 1. Release objective and scope freeze

Deliver an **accessible, non-commercial, free-to-use personal portfolio demo** showcasing React/Vite, Express/TypeScript, Supabase Auth/PostgreSQL/RLS, GitHub Actions, automated tests, typed interfaces, pixel-art design and architectural documentation.

The frozen MVP has eight classes, one saved character per verified account, six stages (the last is explicit review/save), PT/EN, responsive layout, authenticated CRUD, owner-only RLS and **two browser PNG exports**: Story/Status 1080×1920 and Portrait 1080×1350.

Do not add PDF, Google OAuth, multiplayer, gameplay, a new design system, social publication, new art variants or paid services to the release path.

## 2. Architecture and free-hosting decision

| Component | Current host | Public-demo decision |
|---|---|---|
| Frontend | Vercel Hobby, Preview from `feat/adventure-files-character-creator` | Use a stable free `.vercel.app` hostname after approving the final build |
| Express API | Render Free service `adventure-files-api-staging` | Reuse the existing working backend for the first public demo; document that there is only one shared environment |
| Authentication + PostgreSQL | Supabase Free | Reuse the verified project for the first public demo, with data ownership enforced by Auth/RLS |
| Authentication email | Personal Gmail custom SMTP | Suitable only for controlled low-volume portfolio use; verify limits and prevent automated abuse |
| Source + CI/CD | Private GitHub repository, Actions | Review Git history for secrets before any separate decision to make the repository public |

This is a **proposed single-environment release** to minimize time and cost. It does **not** imply production/staging isolation, guaranteed uptime or unlimited email delivery. The `web/vercel.json` rewrite is hard-coded to Render staging; this is intentional only if the same service is explicitly promoted as the public demo. Do not claim to have two separate API environments.

Known free-tier trade-offs: Render may sleep after idle and cold-start slowly; Supabase Free projects may pause for inactivity; Vercel Hobby is restricted to personal non-commercial use; SMTP can be rate-limited or blocked. Include these limitations in the public README, not in users' passwords or character data.

Official provider references: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Render Free](https://render.com/docs/free), [Supabase free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing), [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## 3. Verified evidence (completed)

- [x] Responsive desktop/mobile PT/EN manual QA, keyboard/reduced-motion behavior and error/retry paths (developer report).
- [x] START, authentication, six-stage creator, save/reload, dashboard, edit/delete and both PNG layouts (developer report).
- [x] Email/code/password recovery, used/expired code rejection, independent tab sessions (developer report).
- [x] Hosted Vercel → Render `/api/health`, HTTP 401 unauthenticated `/api/characters/me`, guarded direct `/reset-password` (developer report/screenshots).
- [x] Two-account negative hosted authorization, rejected `userId`, and preserved account ownership (developer report; do not claim independently replayed requests).
- [x] Hosted migrations `20261028000000` and `20261031000000`, RLS enabled, four owner-scoped policies, 14 columns, 2 rows and 0 rows with null Motivation (read-only SQL screenshots).
- [x] Specific staging CORS origin allowlist updated and Render redeployed successfully; API smoke tests repeated (developer report/screenshots).
- [x] CI at `c115039`: frontend 167 tests (18 files), API 97 tests (two opt-in local integration tests skipped in default CI), frontend/API lint/build and isolated database security checks passed. Prior isolated pgTAP (39) and two real local Auth/Express integration tests also passed.

Local and manual tests are strong evidence; they are **not** a guarantee of complete security or production availability.

## 4. Must complete before public registration and LinkedIn sharing

- [ ] **Security and dependencies:** Review `npm audit` results for `web/` and `api/`; investigate findings rather than blindly upgrading. Verify HTTP security headers/HTTPS, CORS, safe errors/logs, public vs secret environment variables and production redirects. Re-run CI for any code change.
- [ ] **Anti-abuse and email:** Confirm Supabase Auth email/signup/OTP rate limits; decide on free Cloudflare Turnstile integration (requires frontend `captchaToken` support **before** enabling Supabase CAPTCHA). Test one fresh external recipient, including confirmation and recovery, within provider limits; never disable email verification to get around delivery limits.
- [ ] **Privacy:** Provide a short plain-language explanation of stored email/account metadata and fictional characters, the user-specific visibility rule, and a verified contact/process for account-data access, correction and deletion. Avoid claiming automatic account deletion if only character deletion is implemented.
- [ ] **Stable public demo:** Choose a free permanent `.vercel.app` URL; open in an anonymous browser to confirm it is externally accessible and serving the feature version. Validate Supabase `Site URL`/redirect allowlist, `VITE_AUTH_REDIRECT_ORIGIN`, and the Render CORS origin list; verify the direct `/reset-password` deep link after deployment.
- [ ] **SEO/sharing:** Add a concise `meta description`, appropriate Open Graph/Twitter title/description/image and consistent page-language metadata after confirming the public URL. Avoid exposing account/private character data in metadata and do not use dynamic private URLs as canonical links. Add README screenshots, architecture overview and link to the live demo.
- [ ] **Repository visibility:** The GitHub repository is currently private. Before switching to public, inspect the *entire Git history* and current tree for secrets, tokens, credentials, private user data and questionable licensing; review screenshot/media contents. Do not publish the repository automatically.
- [ ] **Review + integration:** Final review of PR #23 (draft → ready when reviewable), keep `main` stable, merge only after approved criteria. Close API Issue #15 after integration and its acceptance record; keep Release Issue #24 open until public smoke tests pass.
- [ ] **Post-release smoke:** Without exposing credentials, test signup/confirmation, login/logout, recovery, own character create/edit/delete and both PNG exports on desktop/mobile. Check health, logs, performance after idle and failure messaging. Record the results and then close Issue #24.

**No new database migrations or destructive data operations are required by the current SQL evidence.** If a data change becomes necessary, stop for review and a recoverability plan.

## 5. Next-day time-boxed delivery (November 4, 2026)

### Morning — Release safety (highest priority)

1. Review documentation/issue/PR status and approve the single-free-environment approach.
2. Run dependency and current/history secret audit; review needed HTTP headers and auth abuse controls. Make **only** bounded fixes with tests.
3. Recheck public URL and any required Auth redirect/SMTP/CORS settings without sharing secrets.

### Afternoon — CI, accessibility and public presentation

4. Complete final PR code review and rerun Frontend, API and Database Security workflows on the final commit.
5. Complete minimal privacy/account deletion instructions, SEO/social metadata, README demo links/screenshots and GitHub-publication decision.
6. Confirm mobile/PT-EN/PNG flows only where final changes or stable URL may have affected them; do not retest every approved component needlessly.

### Evening — Controlled release and handoff

7. Approve Ready for review and merge PR #23 only after checks are green and critical findings resolved.
8. Check the **actual final public URL** anonymously, create one disposable test account and perform the final smoke checklist.
9. Close Issue #15 after integration, Issue #24 after release evidence; publish the GitHub repository only after the separate secret-history audit and explicit visibility approval.
10. Prepare LinkedIn/portfolio presentation: problem, architecture (React/Express/Supabase), security design, 6-stage UX, original pixel art, CI/test numbers, lessons learned and a live demo link.

If a high-severity security or exposure problem is discovered, **do not force the release deadline**. Record the blocker, preserve the working MVP, and defer public signup until fixed. If only optional improvements remain, deliver and track them as post-release follow-up.

## 6. Definition of done

- [ ] Feature commit integrated into `main` with green final checks and reviewed changes.
- [ ] One publicly accessible stable demo URL, HTTPS, functional sign-up/recovery, protected CRUD and two PNG exports.
- [ ] Explicitly accepted free-tier limitations and functioning logs/health check.
- [ ] Basic privacy/account deletion instructions, accurate architecture/UML/README and non-sensitive configuration.
- [ ] No known unresolved critical/high findings from the scoped security audit.
- [ ] Public launch evidence recorded; #15 and #24 closed according to their respective gates.
- [ ] LinkedIn-ready screenshots/demo explanation and a conscious decision on publishing source history.

`Adventure Files` is a portfolio demonstration; no statement above promises absolute security, uptime or unlimited free usage.
