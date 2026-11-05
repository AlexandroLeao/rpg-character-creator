# Adventure Files — Zero-Budget Portfolio Release

> **Current status (post PR #27):** Adventure Files is functionally complete on `main` at `0a0457d`. PRs #23, #25, #26 and #27 are merged; no PRs remain open. The owner reports successful PT/EN/mobile authentication, recovery, character management and account deletion/re-registration with other accounts unaffected. Frontend CI passed on `0a0457d`, frontend/API CI passed on account-deletion merge `843514a`, and database security tests last passed at the foundational merge (no subsequent DB migrations). **Issue #24 remains open only for final hosted security/operations evidence and the Supabase Free backup decision.** Public promotion, AWS and new character content are out of scope.

## 1. Release objective and scope freeze

Deliver an **accessible, non-commercial, free-to-use personal portfolio demo** showcasing React/Vite, Express/TypeScript, Supabase Auth/PostgreSQL/RLS, GitHub Actions, automated tests, typed interfaces, pixel-art design and architectural documentation.

The frozen MVP has eight classes, one saved character per verified account, six stages (the last is explicit review/save), PT/EN, responsive layout, authenticated CRUD, owner-only RLS and **two browser PNG exports**: Story/Status 1080×1920 and Portrait 1080×1350.

Do not add PDF, Google OAuth, multiplayer, gameplay, a new design system, social publication, new art variants or paid services to the release path.

## 2. Architecture and free-hosting decision

| Component | Current host | Public-demo decision |
|---|---|---|
| Frontend | Vercel Hobby, stable `https://adventure-files-staging.vercel.app/` from `main` | Owner-reported live demo; independently confirm final deployed commit and HTTP headers |
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

1. **Abuse protection and email (final verification):** Turnstile is integrated into signup, sign-in, recovery and own-account deletion; the owner reported successful hosted tests. Confirm Supabase CAPTCHA remains **enabled and enforcing** server-side proofs, allowed stable hostname and configured SMTP/rate limits. Personal Gmail SMTP remains best-effort, not a delivery SLA.
2. **Runtime security (required):** Verify HTTPS, strict Render CORS origins, no-store for authenticated API responses, appropriate browser security headers, safe errors/logs, and the separation of Vercel publishable keys from the server-only Render/Supabase secret. Production-only npm audits previously reported zero vulnerabilities; the known moderate `minimatch` development-toolchain advisory has a recorded risk triage, not an approved forced upgrade. If a check exposes a real defect, fix narrowly and rerun affected CI.
3. **Privacy and recoverability (required):** Review the existing bilingual signup notice against the actual data flow, test account deletion using disposable accounts (developer has already reported positive PT/EN and isolation results), and acknowledge backup/retention limitations. A UI checkbox is not a versioned legal-consent database; do not claim legal certification. Supabase Free does not include automated backups; make a recoverability choice without adding a paid service or storing personal data in Git.
4. **Integration and operations (final verification):** All scoped PRs #23/#25/#26/#27 were owner-merged and CI passed. Confirm the stable Vercel Production and Render services use the approved `main`, check Supabase Site URL/redirect allowlist and strict CORS, and record the owner's already successful disposable-account smoke. Preserve existing protected data; do not repeat destructive tests without a specific reason.
5. **Technical indexing hygiene (small final verification):** After the real public domain serves the approved build, verify canonical/title/description/OG image and `/reset-password` `noindex`. Do not index authenticated characters. Search Console, LinkedIn, promotional screenshots and public GitHub visibility/licensing are **separate optional communication/source-publication decisions**, not criteria for the application's technical completion.

**Already supported:** the creator verified desktop/mobile/PT/EN visuals, real signup with required terms, recovery, account isolation/deletion, character CRUD and PNG exports; CI passed all three workflows at `39cb50c` and again at docs-only `11e717b`. Verification of production runtime headers/Turnstile and final branch deployment is not yet recorded.

**Stop condition:** Do not merge if a new critical security issue or a blocking auth regression appears. Otherwise do not extend the MVP with unrelated improvements.

## 5. Final release execution — bounded sequence

1. **Confirm deployment:** check Vercel Production and Render are Ready/Live on the latest approved `main` code (`0a0457d` or a later reviewed documentation-only commit). Verify the stable URL and the `/api/health` 200 / unauthenticated `/api/characters/me` 401 behavior without credentials.
2. **Confirm anti-abuse enforcement:** in Supabase Authentication → Attack Protection, verify the Cloudflare secret is configured and CAPTCHA **enabled**. The owner already reported successful signup/login/recovery/account deletion under the widget; investigate only if actual enforcement or rate-limit evidence contradicts this.
3. **Read-only security check:** inspect HTTPS, Vercel response headers and recovery `noindex`, Render CORS/no-store/log redaction, publishable versus private key isolation, and brief bilingual privacy/support copy. Do not disclose tokens or secrets.
4. **Accept or mitigate backup risk:** the Supabase Free project has been observed with “No backups”. Record the owner's choice: accept loss of demo data or arrange a secure manual off-repository export; no paid upgrade is mandatory.
5. **Record sign-off and close Issue #24:** attach sanitized verification outcomes and the owner's approval. Close the release tracker only after these bounded technical checks. No new UI, catalog, AWS, SEO promotion or social-posting work is part of this task.

**Historical rollout note:** Earlier stages intentionally kept Supabase CAPTCHA off while deploying the token-enabled frontend. That temporary procedure is superseded; the final configuration must enforce CAPTCHA server-side. Do not disable it as a routine release step.

## 6. Definition of done — technical delivery only

- [x] Reviewed feature integrated into `main` through PR #23; merged commit `0b22f48` passed frontend, API and DB CI.
- [x] Owner reports stable Vercel Production URL and Render API working end to end; independently confirm the latest commit SHA and hosted response headers at sign-off.
- [x] Owner reports successful hosted authentication, CAPTCHA challenge, email recovery, protected CRUD and disposable-account deletion/re-registration without affecting a second account. Backend CAPTCHA enforcement setting still requires read-only verification.
- [ ] Minimal privacy/support details and free-tier backup/retention limitations are documented; no secrets or private user data exposed.
- [x] Owner accepted PT/EN desktop/mobile UI, including PR #27 CAPTCHA spacing, and both PNG exports. Remaining hosted security/backup risks must be documented and accepted before closing #24.
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

## November 4 — Post-merge integration checkpoint (historical; superseded by the current status above)

- [x] Owner clicked Confirm merge on PR #23; GitHub reports merged/closed at 21:42 UTC with merge commit `0b22f48` in `main`.
- [x] All three workflow runs on the **merged `main` commit** concluded successfully (frontend 180 tests, API 107, database pgTAP; applicable lint/build checks).
- [x] Creator supplied a screenshot showing the application opening on the **stable Production hostname** `https://adventure-files-staging.vercel.app/` after merging, and reported Preview registration, login and recovery checks passed. Screenshots **do not yet independently tie Vercel Production to the merge SHA**, nor prove Supabase CAPTCHA enforcement.
- [x] PR #23 is closed as merged. Issue #15 (protected CRUD) is complete after the reviewed integration and prior owner-isolation evidence; issue #24 remains the release checklist.
- [ ] In Vercel → Deployments, confirm the **Production** deployment is Ready and sourced from `main` commit `0b22f48`, and that `VITE_TURNSTILE_SITE_KEY` is set for **Production**.
- [ ] Confirm Render API service is live on the approved `main` branch with appropriate Auth redirect and CORS origins; preserve existing server-only secrets. Verify `/api/health` → 200 and unauthenticated `/api/characters/me` → 401 through the final domain.
- [ ] Check browser response headers (`nosniff`, `DENY`, referrer/permissions policy; `noindex` on `/reset-password`), canonical/OG source and HTTPS. Do not expose any private session/token in evidence.
- [ ] **Only after Production verification**, configure the Cloudflare **secret** in Supabase Attack Protection and enable CAPTCHA. Re-test disposable-account sign-up, sign-in and recovery in PT/EN on mobile and desktop; if authentication breaks, turn CAPTCHA OFF again and investigate.
- [ ] Record the chosen Supabase Free no-automatic-backup risk/mitigation, short Terms/Privacy/support and credential-isolation review, and final production smoke. Close #24 after acceptance, not merely after merge. LinkedIn, Search Console and optional AWS remain deferred.

## Final post-merge QA record (November 2026)

- [x] PR #25 — visible Turnstile and retry handling — merged `f11db839`.
- [x] PR #26 — account-deletion CAPTCHA reauthentication — merged `843514ac`; API and frontend checks green.
- [x] PR #27 — scoped 14px CAPTCHA spacing in account-deletion dialog — merged `0a0457d`; frontend checks green.
- [x] Owner reports successful account deletion, re-registration with verified email, preserved unrelated accounts, login/recovery and mobile/desktop validation on the stable Vercel URL. This is manual evidence, not a new independent penetration test.
- [ ] Hosted runtime headers/CORS, Supabase CAPTCHA enforcement setting, provider limits and Supabase Free backup/recovery decision must be signed off in [Issue #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24).

The previous rollout and draft-PR checkpoints above are retained as historical evidence; **the current sign-off sequence is Section 5**.
