# Adventure Files — isolated full-stack Playwright

This separate test package uses Playwright Chromium, the real Vite frontend, compiled Express API, and a disposable local Supabase Auth/PostgreSQL stack. It does not use hosted Vercel/Render/Supabase or modify production authentication/CAPTCHA. The Playwright version is locked to the same verified version used in the developer portfolio. Existing web Vitest, API Vitest/Supertest, API Docker and pgTAP workflows remain independent.

## Run locally

Use Node 24, Docker with a running engine, Supabase CLI 2.122.0, and a fresh isolated local development checkout/stack. Do not run against a local database containing data you need, or use production keys. Do not link or push any hosted project. Ports 3000, 5173 and 54321 must be available for the local services.

From the repository root:

```bash
npm ci --prefix api
npm ci --prefix web
npm ci --prefix e2e
cd e2e
npx playwright install chromium
cd ..
supabase start
npm test --prefix e2e
supabase stop
```

On Linux CI install browser system dependencies with `npx playwright install --with-deps chromium`. Do not paste the local CLI status or credentials into chat/issues. The launcher reads local CLI status privately, refuses any API URL except `http://127.0.0.1:54321`, and overrides environment variables for both servers; it does not use any hosted `.env` values. The local frontend site key is empty because the fresh local stack has no CAPTCHA enforcement. Production settings remain unchanged. The suite provisions random, confirmed accounts solely on the local stack and removes only the users it creates. No real emails are sent; administrative setup uses local Auth only. The browser blocks requests to non-local origins. Traces, videos and screenshots are disabled to avoid storing login fields or session data. Run the suite through `npm test`, not the raw Playwright command.

## Scenarios

| Scenario | Evidence |
| --- | --- |
| Character lifecycle | Real browser login; all six stages; intentionally intercepted one-time save failure then real PUT persistence (PUT create 201, PUT update 200); reload, edit, download both PNGs and verify signature/dimensions; sign-out and sign-in. |
| Account isolation | Two independent browser contexts; real local accounts A and B each create their own character, reload and verify their own saved character. B starts empty and cannot see A's character. |
| Mobile and language | 390 × 844 Chromium viewport; EN/PT switch, wrong-password feedback, real login and no horizontal overflow. |

The test checks the existing PNG formats Story 1080 × 1920 and Portrait 1080 × 1350. The one injected save failure is an explicit UI error-path simulation; normal auth/save/read operations use real services. No broad claims of cross-browser coverage, accessibility conformance, penetration testing, production deployment verification or Docker-to-Supabase authenticated connectivity are made. The backend in this suite runs as a compiled Node process; Docker is used for the isolated Supabase stack. The credential-free API Docker smoke is separate.

CI: [Full-stack E2E](../.github/workflows/full-stack-e2e.yml) starts and stops a fresh local Supabase stack on a standard GitHub Linux runner. It runs for changes to web, API, Supabase, e2e and the workflow itself. No registry publish, hosted data, paid service, or real account credentials.
