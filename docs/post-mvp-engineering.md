# Post-MVP Engineering Roadmap — Adventure Files

**Baseline reviewed:** November 12, 2026.  
**Baseline commit:** `fea7ac86ea8c0caadf099f3c881d9e44b8640c03` (merged November 5, 2026).  
**Prerequisite:** developer portfolio quality/documentation cycle completed; [portfolio PR #114](https://github.com/AlexandroLeao/developer-portfolio/pull/114) merged.

## R1 — Technical baseline and prioritization

The MVP was accepted by the owner on November 5, 2026 ([release #24](https://github.com/AlexandroLeao/rpg-character-creator/issues/24), [post-MVP assurance #31](https://github.com/AlexandroLeao/rpg-character-creator/issues/31)). The following engineering cycle does not reopen the product release or change its approved appearance or rules.

| Check | Last verified result | Source and date |
|---|---|---|
| Frontend | 183 passed, 20 files; lint and production build passed | [Frontend Checks](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/42101618668), Nov 5, exact baseline commit |
| API | 108 passed, 2 opt-in skipped; 9 files passed, 1 skipped; lint and build passed | [API Checks](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/42101618812), Nov 5, exact baseline commit |
| Database | 39 pgTAP assertions passed in 2 SQL files | [Database Security Tests](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/41918531601), Nov 4, commit `0b22f48` |
| Deployment | Vercel commit status `success` for the baseline | GitHub commit status, inspected Nov 12 |

Original workflow job logs were inspected on November 12. No Supabase files or database workflow changed between `0b22f48` and `fea7ac8`. These are dated CI results, not newly executed local tests, a fresh database test, or independent proof of current live behavior. The two opt-in local integration tests were intentionally skipped in default API CI; they must only be run against an isolated local Supabase instance.

The repository includes two versioned SQL migrations, separate frontend/API/database workflows, typed React and Express applications, tests, and technical documentation. OpenAPI, a backend Dockerfile/Compose, and Playwright full-stack browser coverage are not implemented in the reviewed tree. The prior development-dependency audit in the release runbook remains historical; no new npm audit was run during this read-only review.

### Deployment and operational boundaries

The accepted release uses one documented **Vercel Hobby + Render Free + Supabase Free** demo environment. The stable frontend URL and API service retain staging names; they do not establish independent staging and production environments. The Vercel configuration still proxies the API to the documented Render service. The owner previously accepted the absence of automatic database backups on the free plan, with manual off-repository exports deferred until actual recovery needs justify them. No provider dashboard, private records, secrets, or live authentication were accessed in this review. Reconfirm current provider plans/settings with the owner if they have changed.

### R1 checklist

- [x] Confirm prerequisite portfolio merge, current RPG baseline and open Issues.
- [x] Inspect original CI evidence and distinguish dated frontend/API results from database results.
- [x] Review documented single-environment deployment and prior backup decision; preserve historical limitations.
- [x] Correct current test counts in technical documentation and record a separate post-MVP plan.
- [x] Owner reviewed and merged [PR #42](https://github.com/AlexandroLeao/rpg-character-creator/pull/42) on November 12, 2026; [Issue #41](https://github.com/AlexandroLeao/rpg-character-creator/issues/41) closed. Frontend, API and database checks passed on the PR. Merge commit: `8c36830`.
- [ ] If hosting settings have changed, reconfirm the free-tier/backup configuration with the owner; no hosted data access is required for this document.

## R2–R7 — Agreed sequence

| Step | Scope | Completion evidence |
|---|---|---|
| R2 | Narrow API response caching and logging hygiene review | Targeted change if justified; focused unit/HTTP regression tests and owner review; no unsupported vulnerability claims |
| R3 | Machine-readable OpenAPI contract | Spec for existing health, character and account endpoints; validation against actual implementation/tests |
| R4 | Reproducible local backend with Docker | API container, documented environment/health, isolated local Supabase/pgTAP verification when supported |
| R5 | Full-stack Playwright | Separate suite for existing auth, six-stage flow, persistence, PNG, PT/EN, responsive and account isolation; disposable local test users only |
| R6 (optional) | Operational maturity | Only if justified: report-only CSP, narrow rate-limit or privacy-safe logging improvements, without unnecessary maintenance |
| R7 | One consolidated developer-portfolio refresh | Update the Adventure Files card and technology evidence after implementation is verified; then begin external open-source work |

### R2 — Current implementation review (November 12, 2026)

- [x] Review the existing Express routes, authentication middleware, error handlers and Vercel rewrite.
- [x] Add an early no-store response policy for the character and account namespaces; preserve public health and the existing API contract.
- [x] Restrict unexpected-error and account-deletion logging to fixed event identifiers; add synthetic regression assertions.
- [x] Add and extend Supertest checks for private success/error responses, including malformed/oversized JSON and CORS preflight.
- [x] [PR #44](https://github.com/AlexandroLeao/rpg-character-creator/pull/44) merged November 12; [Issue #43](https://github.com/AlexandroLeao/rpg-character-creator/issues/43) closed. Merge `f6f3102`; [API CI on main](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/43230655232) passed 117 tests (+2 opt-in skipped), lint and build.
- [ ] After merge and confirmed deployment, verify public health and non-authenticated private response headers without accessing real user data.

R2 is integrated. Live response-header smoke remains pending; the prior review could not access the published URLs. The owner can verify without credentials from a network that can reach the service. R3 can proceed independently because it changes documentation and tests only.

### R3 — OpenAPI contract (November 12, 2026)

- [x] Describe all five existing HTTP operations in [OpenAPI 3.1 JSON](../api/openapi.json), using the local server and fictional examples.
- [x] Document Bearer authentication, current write catalog, legacy read data, status codes, no-store headers and existing account-deletion/CAPTCHA behavior.
- [x] Add a contract regression suite covering local references, examples, catalog parity and selected HTTP responses with mocked services. This is a bounded check, not full OpenAPI conformance validation.
- [x] Link the specification and usage instructions from the root and API READMEs.
- [ ] Confirm API CI and owner review/merge in [Issue #45](https://github.com/AlexandroLeao/rpg-character-creator/issues/45).

No runtime API, dependencies, frontend, database or deployment configuration is changed in R3. R4–R7 remain pending. Existing MVP tests and safeguards are not proof of future improvements. Issues #30 (future admin/RBAC) and #32 (analytics) are separate product research, outside this cycle.

## Constraints

- Preserve the approved retro-futuristic UI, PT/EN, six-stage creator, one character per account and two PNG formats.
- No paid services, new hosting, real-user data experiments, or production migrations during these improvements.
- No gameplay, multiplayer, redesign, PDF, new product, or framework migration in this cycle.
- Separate Issue → branch → tests → PR → owner review/merge for each scoped change. Do not merge automatically.
- External open-source contribution follows R7; update résumé/LinkedIn only with verified evidence.
