# Adventure Files — Zero-Budget Portfolio Release

> Status: feature-complete release candidate (November 4, 2026). The creator accepted the PT/EN desktop/mobile product and signup terms, and all GitHub Actions checks passed at documentation commit `11e717b`. **Final technical release approval, merge and public smoke are still pending; LinkedIn/social promotion is explicitly outside this project's definition of done.** Track the final decisions in [PR #23](https://github.com/AlexandroLeao/rpg-character-creator/pull/23), [Issue #15](https://github.com/AlexandroLeao/rpg-character-creator/issues/15) and [Issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

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

Known free-tier trade-offs: Render may sleep after idle and cold-start slowly; Supabase Free projects may pause for inactivity **and have no automatic daily database backups** (the Supabase dashboard reports “No backups”); Vercel Hobby is restricted to personal non-commercial use; SMTP can be rate-limited or blocked. Before onboarding real public users, record a recoverability decision: keep migrations in Git, consider a manual, access-controlled Supabase CLI data dump stored outside the repository, and never include Auth credentials/user PII in commits or support screenshots. Include these limitations in the public README, not in users' passwords or character data.

Official provider references: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Render Free](https://render.com/docs/free), [Supabase free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing), [Supabase free backups](https://supabase.com/kb/faqs/platform/free-plan-backups), [Supabase manual exports](https://supabase.com/docs/guides/platform/backups), [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## 3. Verified evidence (completed)

- [x] Responsive desktop/mobile PT/EN manual QA, keyboard/reduced-motion behavior and error/retry paths (developer report).
- [x] START, authentication, six-stage creator, save/reload, dashboard, edit/delete and both PNG layouts (developer report).
- [x] Email/code/password recovery, used/expired code rejection, independent tab sessions (developer report).
- [x] Hosted Vercel → Render `/api/health`, HTTP 401 unauthenticated `/api/characters/me`, guarded direct `/reset-password` (developer report/screenshots).
- [x] Two-account negative hosted authorization, rejected `userId`, and preserved account ownership (developer report; do not claim independently replayed requests).
- [x] Hosted migrations `20261028000000` and `20261031000000`, RLS enabled, four owner-scoped policies, 14 columns, 2 rows and 0 rows with null Motivation (read-only SQL screenshots).
- [x] Specific staging CORS origin allowlist updated and Render redeployed successfully; API smoke tests repeated (developer report/screenshots).
- [x] **Final signup/SEO feature commit `39cb50c` (Nov 4): all three GitHub Actions workflows completed successfully** — frontend **177 tests in 19 files**, API **107 tests** (2 opt-in tests skipped by design), frontend/API lint and builds, and isolated database security/pgTAP. This supersedes the prior `0b89fa2` CI snapshot; earlier real local Auth/Express integration tests also passed.

- [x] **Hosted account deletion (November 4, developer report):** deletion succeeded in PT/EN; previously deleted accounts could not sign in; a new signup with the same email succeeded after confirmation; deleting one account did not delete another account. The feature branch now includes server-only diagnostic commit `0b89fa2`, and Render was reported Live; the supplied startup logs do not identify a deployment SHA. These checks do **not** substitute for a direct read-only database cascade verification or fresh-token/expiry edge cases.

Local and manual tests are strong evidence; they are **not** a guarantee of complete security or production availability.

### November 4, 2026 — npm dependency audit

The developer ran all four commands on clean feature-branch commit `47d9b52` after `git pull --ff-only`:

| Command | Reported result | Scope |
|---|---|---|
| `npm --prefix api audit --omit=dev` | **0 vulnerabilities** | API production dependencies |
| `npm --prefix web audit --omit=dev` | **0 vulnerabilities** | Frontend production dependencies |
| `npm --prefix api audit` | **11 moderate findings** | Development-toolchain dependency paths |
| `npm --prefix web audit` | **12 moderate findings** | Development-toolchain dependency paths |

The 23 combined findings are **not 23 distinct vulnerabilities**: the reported transitive chains point to `minimatch@10.2.6` through ESLint/TypeScript-ESLint. [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) concerns possible denial of service from attacker-controlled glob patterns; the upstream patched version is `11.0.1`. Current development tools depend on `minimatch` 10.x. npm offers only a potentially breaking forced change or no compatible fix; **do not run `npm audit fix --force` or force a major override without testing compatibility**.

**Risk triage (open):** The production-only audits did not report this package; no public app endpoint is known to expose its glob-pattern processing. Direct public-runtime risk appears lower, but is not guaranteed absent. Record this **known moderate development-dependency risk**, monitor upstream compatible updates, and require passing lint, tests, builds and final CI before merging. The overall security/release gate stays unchecked until remaining controls are verified. No dependencies were changed during this documentation update.

Earlier scoped text/history checks examined 109 files and 145 accessible commit patches with no high-confidence credential matches. This is **not an exhaustive secret or licensing review**; binary assets, personal media and source-history publication still need final human sign-off.

## 4. Final software-release gates — only items that affect delivery

The product UX, character catalog, account deletion and PNG exports are **frozen and accepted**. No additional artwork, PDF, AWS infrastructure, OAuth, social sharing or SEO promotion campaign is necessary to complete the application. Before enabling public registration, finish only these engineering gates:

1. **Abuse protection and email (required):** Integrate the already provisioned Cloudflare Turnstile **in the frontend auth calls** and test signup, sign-in and recovery with real allowed hostnames **before** switching on Supabase CAPTCHA. Do not toggle it on while the frontend lacks `captchaToken`. Confirm email verification and provider rate limits; the Gmail SMTP is a best-effort, low-volume choice, not a delivery SLA.
2. **Runtime security (required):** Verify HTTPS, strict Render CORS origins, no-store for authenticated API responses, appropriate browser security headers, safe errors/logs, and the separation of Vercel publishable keys from the server-only Render/Supabase secret. Production-only npm audits previously reported zero vulnerabilities; the known moderate `minimatch` development-toolchain advisory has a recorded risk triage, not an approved forced upgrade. If a check exposes a real defect, fix narrowly and rerun affected CI.
3. **Privacy and recoverability (required):** Review the existing bilingual signup notice against the actual data flow, test account deletion using disposable accounts (developer has already reported positive PT/EN and isolation results), and acknowledge backup/retention limitations. A UI checkbox is not a versioned legal-consent database; do not claim legal certification. Supabase Free does not include automated backups; make a recoverability choice without adding a paid service or storing personal data in Git.
4. **Integration and operations (required):** Review draft PR #23 and current Actions, obtain explicit owner approval to merge into `main`, align Vercel Production and Render's connected branch to the approved version, check Supabase Site URL/redirects and CORS, and execute one end-to-end live smoke in an anonymous browser and a disposable account. Keep existing protected data intact. No unapproved destructive migrations.
5. **Technical indexing hygiene (small final verification):** After the real public domain serves the approved build, verify canonical/title/description/OG image and `/reset-password` `noindex`. Do not index authenticated characters. Search Console, LinkedIn, promotional screenshots and public GitHub visibility/licensing are **separate optional communication/source-publication decisions**, not criteria for the application's technical completion.

**Already supported:** the creator verified desktop/mobile/PT/EN visuals, real signup with required terms, recovery, account isolation/deletion, character CRUD and PNG exports; CI passed all three workflows at `39cb50c` and again at docs-only `11e717b`. Verification of production runtime headers/Turnstile and final branch deployment is not yet recorded.

**Stop condition:** Do not merge if a new critical security issue or a blocking auth regression appears. Otherwise do not extend the MVP with unrelated improvements.

## 5. Final release execution — bounded sequence

1. **Finish Turnstile once:** implement tokens with safe fallback/configuration, test all three Supabase auth flows in an authorized Preview hostname, then enable CAPTCHA and retest. Keep the approved pixel-art layout unchanged. Do not ask the developer to repeat previously passed character-creator tests.
2. **Complete the operational check:** collect sanitized HTTP header/CORS results, confirm the Render-only admin credential is not in the browser, review the zero-cost backup/recovery trade-off, and sign off the short privacy notice. Correct only observed problems.
3. **Freeze the feature:** re-run frontend (177 currently passing), API (107), and DB RLS/pgTAP CI after final changes; review PR #23 for accidental changes, secret exposure and migration risk.
4. **Owner-approved integration:** request explicit merge authorization. Only then merge into `main`, align Vercel/Render deployed branches and redirect origin settings, and verify the stable production URL serves the approved commit.
5. **Live smoke and handoff:** test public page, email signup/confirmation, login/recovery, protected character create/edit/delete, two PNGs and own-account deletion using disposable data. Confirm basic logs/health and `noindex` on recovery. Record evidence; close #15 after integration, #24 after live smoke. **The project can then be considered delivered.**

Do not require a LinkedIn post, a Search Console ranking, public source visibility, extra characters, AWS or a second paid environment to declare the application complete.

## 6. Definition of done — technical delivery only

- [ ] Reviewed feature integrated into `main` with all final applicable CI checks green.
- [ ] Stable Vercel Production URL serves the approved code over HTTPS and routes to the correct Render API.
- [ ] Authentication, abuse controls, email confirmation/recovery and owner-only CRUD/account deletion work with disposable accounts in the final environment.
- [ ] Minimal privacy/support details and free-tier backup/retention limitations are documented; no secrets or private user data exposed.
- [ ] Accepted PT/EN desktop/mobile UI and two PNG exports remain intact; major security risks are closed or explicitly documented and accepted.
- [ ] Public production smoke evidence recorded; #15 and #24 closed according to their acceptance conditions.

Promotion (LinkedIn), optional Search Console ownership, GitHub visibility and future AWS/class expansions are **not** part of the software delivery acceptance criteria.

## November 4 — Approved dashboard refinements (implementation gated)

- The empty dashboard action order is **Create Character / Extras / Delete Account / Sign Out**; the saved-character footer is **Sign Out / Edit / Export / Delete / Extras**, bilingual and responsive.
- The two original PNG formats remain unchanged. The Delete menu separates confirmed character deletion from full-account deletion, which requires fresh password proof and a server-only Supabase privileged key.
- Extras credits Alexandro Milhomes Leão for the **concept, original creative direction and development**. The in-app panel has four concise sections: About, Credits, Inspirations, Support/GitHub (no LinkedIn and no AI section). The README separately documents AI assistance with **illustration refinement and development/documentation support**, not conceptual authorship.
- On November 4, the developer reported successful hosted self-service account deletion (PT/EN, re-registration and account isolation), and all three CI workflows passed at `0b89fa2`. **Direct read-only cascade verification**, privacy notice, SEO/social metadata, safe public URL, security/header review, final PR review and explicit launch approval remain open. Keep the repo private and PR #23 in draft.

## November 4 — Final signup transparency QA and deferred enhancements

- [x] The developer manually verified the compact, bilingual signup Terms of Use/Privacy Notice and required acknowledgement on desktop and mobile, including **successful creation of a new account**. This is real-device/user acceptance evidence, not independent legal review or proof that an auditable acceptance timestamp/version is stored.
- [x] `39cb50c` GitHub Actions: **177 frontend tests**, **107 API tests** (2 optional integration tests skipped), both lint/build checks and database security/pgTAP all passed. Vercel Preview build reported Ready. Do not assume the older `main`/Production hostname already serves the feature.
- [x] Initial SEO/social metadata is in the feature branch. Remaining SEO is a **post-promotion public URL verification task**: inspect public `/` HTML title/description/canonical/OG image, check `X-Robots-Tag` on `/reset-password`, test link previews, then optionally submit the single public landing URL to Search Console. Do not submit preview URLs or authenticated character pages for indexing.
- [ ] Complete the release safety gate: cloud anti-abuse/Turnstile integration and PT/EN email flows **before enabling Supabase CAPTCHA**, basic HTTPS/CORS/security headers, limited-volume SMTP checks, legal copy and data-deletion review, source/asset-license and Git-history review, final owner-approved PR integration and public smoke. These are release tasks, not invitations to redesign approved UI.
- [ ] Keep **Issue #15** open until PR #23 is reviewed/merged; keep **Issue #24** open until the stable public demo passes final smoke. Neither is ready to close as of this checkpoint.

**Ideas after public launch only (not current release work):** introduce additional class/art choices or richer configurable catalogs through a reviewed design proposal (original illustration, PT/EN copy, stable slugs, API/database constraints, migrations only if needed, regression testing). For cloud-learning/portfolio value, evaluate an **optional** AWS proof of concept such as S3/CloudFront for static asset distribution or SES for transactional emails, after comparing free-tier eligibility, cost controls, IAM security, deployment complexity and rollback. Neither AWS nor extra characters is needed for the present working Vercel/Render/Supabase demo; avoid creating billable resources by default.
