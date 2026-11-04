# RPG Character Creator API

REST API for the RPG Character Creator application.

Built with Node.js, Express, TypeScript, and Supabase Auth.

## Technology Stack

- Node.js 24
- Express 5
- TypeScript
- Supabase JavaScript Client
- PostgreSQL
- Supabase Row Level Security
- ESLint
- Vitest
- Supertest
- GitHub Actions

## Project Status

The Express API includes:

- Public API health checks.
- JSON request handling.
- Configurable CORS restrictions.
- Centralized error handling.
- Supabase email authentication middleware.
- Verified user identity handling.
- User-scoped Supabase database clients.
- Server-side character validation.
- Protected character retrieval.
- Protected character creation and updates.
- Protected character deletion.
- Automated authentication and CRUD tests.
- Continuous integration through GitHub Actions.

The character CRUD implementation is covered by automated tests using mocked Supabase responses.

Two opt-in integration tests have already passed using real local Supabase Auth, PostgreSQL RLS and Express with disposable accounts. Hosted two-account checks were subsequently reported by the developer; additional public-release safety checks remain in Issue #24.

## Requirements

- Node.js 24
- npm
- Git

A Supabase project is required when running authenticated operations against the real authentication service.

The database must have the approved `public.characters` schema, permissions, and Row Level Security policies applied.

## Installation

From the repository root:

```bash
cd api
npm ci
```

## Environment Configuration

Create a local environment file:

```bash
cp .env.example .env
```

The API uses the following environment variables:

| Variable | Description |
|---|---|
| `PORT` | Express server port. Defaults to `3000`. |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable API key. |
| `SUPABASE_SECRET_KEY` | Server-only Supabase secret API key for account deletion. Keep exclusively in the API environment; never use a `VITE_` prefix. |

Example configuration:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY
SUPABASE_SECRET_KEY=sb_secret_YOUR_SERVER_ONLY_KEY
```

Replace the placeholders with the correct values for your development environment.

Never commit `.env` files containing real configuration values.

Never expose service-role keys, secret API keys, database passwords, or privileged credentials in frontend code.

## Development

Start the API development server:

```bash
npm run dev
```

The default server address is:

```text
http://localhost:3000
```

### Google Cloud Shell

When accessing the frontend through a Cloud Shell preview URL, configure the corresponding frontend origin in `CORS_ORIGIN`.

Do not disable CORS restrictions to bypass configuration errors.

CORS is a browser access policy. It does not replace authentication or database authorization.

## Authentication

The API uses Supabase Auth to validate user access tokens.

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

The access token is issued by Supabase Auth after successful authentication.

The backend does not create custom login tokens or store user passwords.

### Authentication Middleware

The reusable middleware is implemented in:

```text
src/middleware/requireAuth.ts
```

The middleware:

1. Reads the Authorization header.
2. Requires the Bearer authentication scheme.
3. Rejects malformed or oversized authorization headers.
4. Validates the access token through Supabase Auth.
5. Rejects invalid or expired tokens.
6. Rejects users with unverified email addresses.
7. Handles authentication service failures safely.
8. Makes the verified user identity available to protected endpoints.

The verified user ID is stored in:

```typescript
res.locals.authenticatedUserId
```

The verified access token is stored in:

```typescript
res.locals.authenticatedAccessToken
```

These values are used internally during the current request.

Protected endpoints must not trust user IDs supplied through request bodies or query parameters.

### Authentication Responses

| HTTP Status | Meaning |
|---|---|
| `401 Unauthorized` | Missing, malformed, invalid, or expired credentials. |
| `403 Forbidden` | Email verification is required. |
| `503 Service Unavailable` | Authentication service failure or temporary network error. |

Authentication errors must not expose tokens, passwords, internal service information, or other sensitive credentials.

## Supabase Database Access

The Supabase client configuration is implemented in:

```text
src/lib/supabase.ts
```

Two client factories are available:

- `createAuthClient()` validates authentication through Supabase Auth.
- `createUserDatabaseClient()` creates a database client using the verified user's access token.

The database client:

- Uses the Supabase publishable key.
- Includes the authenticated user's access token.
- Disables automatic token refreshing.
- Disables session persistence.
- Disables authentication detection through URLs.
- Is created separately for each authenticated request.

Character database operations execute in the authenticated user's security context.

PostgreSQL Row Level Security policies enforce character ownership.

Privileged service-role or secret credentials must not be used for ordinary character operations.

## API Endpoints

### GET /api/health

Public endpoint used to verify API availability.

Authentication is not required.

Example response:

```json
{
  "status": "ok",
  "service": "rpg-character-creator-api"
}
```

Success status:

```text
200 OK
```

### GET /api/characters/me

Retrieves the authenticated user's saved character.

Authentication is required.

Example request:

```http
GET /api/characters/me
Authorization: Bearer <access_token>
```

Example successful response:

```json
{
  "character": {
    "id": "character-uuid",
    "name": "Eldrin",
    "characterClass": "mage",
    "ancestry": "elf",
    "background": "scholar",
    "weapon": "staff",
    "artifact": "moon-crystal",
    "personality": "curious",
    "aura": "arcane",
    "companion": "owl",
    "createdAt": "2026-10-29T10:00:00Z",
    "updatedAt": "2026-10-29T10:00:00Z"
  }
}
```

Success status:

```text
200 OK
```

If the user has no saved character:

```json
{
  "error": "Character not found"
}
```

Response status:

```text
404 Not Found
```

The endpoint uses the verified user ID to select the character.

Database RLS policies provide an additional ownership boundary.

### PUT /api/characters/me

Creates or updates the authenticated user's character.

Authentication is required.

Example request:

```http
PUT /api/characters/me
Authorization: Bearer <access_token>
Content-Type: application/json
```

Example request body:

```json
{
  "name": "Eldrin",
  "characterClass": "mage",
  "ancestry": "elf",
  "background": "scholar",
  "weapon": "staff",
  "artifact": "moon-crystal",
  "personality": "curious",
  "aura": "arcane",
  "companion": "owl"
}
```

All nine editable fields are required.

Behavior:

- If the user has no character, the API creates one.
- If the user already has a character, the API updates it.
- Updates preserve the existing character ID.
- The authenticated user ID determines ownership.
- Immutable database fields cannot be supplied through the request body.

Success statuses:

| Status | Meaning |
|---|---|
| `201 Created` | A new character was created. |
| `200 OK` | An existing character was updated. |

Successful responses use the same character representation returned by GET.

### Concurrent Character Creation

The database defines a unique constraint on `user_id`.

The PUT endpoint first attempts to update an existing character.

If no character exists, it attempts to insert one.

If concurrent creation causes a PostgreSQL unique constraint violation (`23505`), the API attempts to update the existing character.

This prevents duplicate character records while preserving the database ownership restrictions.

If a conflicting record is no longer available during the retry, the endpoint returns:

```json
{
  "error": "Character changed. Please retry."
}
```

Response status:

```text
409 Conflict
```

The API does not use privileged credentials to bypass database restrictions.

### DELETE /api/characters/me

Deletes the authenticated user's saved character.

Authentication is required.

Example request:

```http
DELETE /api/characters/me
Authorization: Bearer <access_token>
```

Success status:

```text
204 No Content
```

The response body is empty.

The endpoint is idempotent:

- Deleting an existing character returns `204`.
- Deleting when no character exists also returns `204`.

The API filters the operation using the verified user ID.

PostgreSQL RLS policies restrict deletion to the authenticated user's own character.

### DELETE /api/account/me — self-service account deletion

This irreversible endpoint is intentionally separate from character CRUD. It requires a verified Bearer access token, a **fresh password verification** against the authenticated account email, and an explicit confirmation string.

```http
DELETE /api/account/me
Authorization: Bearer <access_token>
Content-Type: application/json

{"password":"<current-password>","confirmation":"DELETE"}
```

- Success: `204 No Content`. The authenticated Auth user is removed; the `public.characters.user_id` foreign key with `ON DELETE CASCADE` removes their saved character.
- Invalid request: `400`; invalid/expired session: `401`; failed password/identity proof: `403`; unavailable administrator: `503`. Never echo secrets, passwords, or underlying Supabase error details.
- No client-supplied `userId` or `email` is accepted as a deletion target. Admin deletion uses only the verified Bearer-token owner ID.
- The **server-only** `SUPABASE_SECRET_KEY` must be configured in Render and kept out of GitHub, browser bundles, Vercel and chat. Without it, deletion fails closed with `503`.
- Deletion revokes refresh sessions. Existing issued access JWTs may remain cryptographically valid until expiration; protected requests must validate the current user/session. Use disposable accounts to test success, wrong password, cross-account attempts, stale sessions and cascading data removal.
- After backend success the frontend signs out locally; never declare success based only on UI state.

### Unknown Routes

Requests to unknown endpoints return:

```json
{
  "error": "Route not found"
}
```

Response status:

```text
404 Not Found
```

## Character Validation

Character validation is implemented in:

```text
src/lib/characterValidation.ts
```

The API independently validates character data before performing database operations.

Frontend validation is not sufficient to guarantee database integrity.

### Required Character Fields

| API Field | Database Column |
|---|---|
| `name` | `name` |
| `characterClass` | `character_class` |
| `ancestry` | `ancestry` |
| `background` | `background` |
| `weapon` | `weapon` |
| `artifact` | `artifact` |
| `personality` | `personality` |
| `aura` | `aura` |
| `companion` | `companion` |

Validation rules:

- All editable fields are required.
- Character names must be strings.
- Names are trimmed before persistence.
- Names must contain between 2 and 32 characters.
- Control characters are rejected.
- Character classes must match the approved catalog.
- Customization options must match the approved catalog.
- Unsupported values are rejected.
- Unexpected fields are rejected.
- Immutable database fields cannot be supplied.

### Immutable Fields

The following database fields are managed by the server or database:

- `id`
- `user_id`
- `created_at`
- `updated_at`

Clients cannot choose character IDs or ownership.

Database timestamps are managed by PostgreSQL.

### Invalid Character Data

Invalid request bodies return:

```text
400 Bad Request
```

Example response:

```json
{
  "error": "Invalid character data",
  "details": {
    "name": "Name must be between 2 and 32 characters."
  }
}
```

The `details` object identifies validation failures.

Invalid data must never be silently persisted.

## Character Database Security

The database schema is defined through version-controlled migrations in:

```text
supabase/migrations/
```

The `public.characters` table enforces:

- One character per authenticated user.
- Unique `user_id` values.
- Approved character classes.
- Approved customization options.
- Character name constraints.
- Database-managed identifiers.
- Database-managed timestamps.
- Foreign-key ownership relationships.
- Row Level Security.

The database defines ownership policies for:

- SELECT
- INSERT
- UPDATE
- DELETE

Only the authenticated owner may access or modify their character.

The `anon` database role has no character table access.

Column-level permissions prevent ordinary authenticated users from updating protected database fields.

The backend must preserve these restrictions.

## API Error Responses

| Status | Description |
|---|---|
| `200` | Successful retrieval or update. |
| `201` | Character successfully created. |
| `204` | Character deletion completed. |
| `400` | Invalid character data or malformed JSON. |
| `401` | Authentication is required or credentials are invalid. |
| `403` | Email verification is required. |
| `404` | Character or route not found. |
| `409` | Concurrent character modification conflict. |
| `503` | Authentication or character storage service unavailable. |

Database errors must not expose connection details, access tokens, SQL information, or privileged credentials.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Compile TypeScript. |
| `npm start` | Run the compiled API. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run automated tests. |

## Automated Tests

Run:

```bash
npm test
```

The current API test suite contains **80 automated tests**.

### Test Organization

| Test File | Tests |
|---|---:|
| `src/app.test.ts` | 2 |
| `src/middleware/requireAuth.test.ts` | 12 |
| `src/lib/supabase.test.ts` | 9 |
| `src/lib/characterValidation.test.ts` | 24 |
| `src/routes/characters.test.ts` | 9 |
| `src/routes/characters.put.test.ts` | 15 |
| `src/routes/characters.delete.test.ts` | 9 |
| **Total** | **80** |

### Authentication Coverage

Tests verify:

- Missing authorization headers.
- Malformed authorization headers.
- Invalid access tokens.
- Expired access tokens.
- Unverified users.
- Valid authenticated users.
- Verified identity handling.
- Authentication service errors.
- Network failures.
- Oversized authorization headers.

### Database Client Coverage

Tests verify:

- Supabase environment configuration.
- Disabled session persistence.
- User-scoped authorization headers.
- Separation of tokens between requests.
- Invalid access token rejection.
- Missing configuration handling.

### Character Validation Coverage

Tests verify:

- Required fields.
- Supported character classes.
- Approved customization options.
- Invalid selections.
- Unexpected fields.
- Immutable field rejection.
- Name normalization.
- Character name length restrictions.
- Control character rejection.
- Invalid request body types.

### Character CRUD Coverage

GET tests verify:

- Authentication requirements.
- Email verification requirements.
- Character retrieval.
- Missing characters.
- Verified ownership filtering.
- Safe database error handling.

PUT tests verify:

- Authentication requirements.
- Character creation.
- Existing character updates.
- Verified ownership.
- Invalid data rejection.
- Immutable field protection.
- Name normalization.
- Unique constraint conflict handling.
- Safe database error handling.

DELETE tests verify:

- Authentication requirements.
- Email verification requirements.
- Successful deletion responses.
- Idempotent deletion.
- Verified ownership filtering.
- Safe database error handling.

### Test Environment

Automated API tests use mocked Supabase responses.

They do not require production credentials or access tokens.

Passing unit tests does not prove that live database permissions and RLS policies are configured correctly.

## Integration Verification

Live integration testing remains necessary.

Before performing integration tests:

1. Select a safe, isolated Supabase development environment.
2. Confirm the approved database migrations are applied.
3. Confirm RLS is enabled.
4. Confirm the intended table and column permissions.
5. Configure the API with the development project's URL and publishable key.
6. Authenticate two separate test accounts.
7. Verify that each account can manage only its own character.
8. Verify that anonymous access is rejected.
9. Verify character creation, updates, retrieval, and deletion.
10. Verify that concurrent creation does not produce duplicate records.

Do not perform destructive integration tests against production data.

Do not expose real credentials, access tokens, refresh tokens, or database passwords in Git commits, screenshots, or chat messages.

## Continuous Integration

The API workflow is defined in:

```text
.github/workflows/api.yml
```

GitHub Actions runs the following checks when relevant API files change:

1. Dependency installation using `npm ci`.
2. Automated API tests.
3. ESLint.
4. TypeScript production build.

The workflow also runs on relevant changes merged into `main`.

Changes must pass automated checks before being considered ready for merging.

## Security Requirements

- Validate authentication before protected operations.
- Use verified user identities.
- Never trust user IDs supplied by clients.
- Never treat unverified JWT payloads as authenticated identities.
- Never log passwords, access tokens, or refresh tokens.
- Never expose privileged credentials to the frontend.
- Use safe authentication and database error responses.
- Validate character input on the server.
- Reject immutable and unexpected fields.
- Preserve restrictive CORS configuration.
- Enforce ownership through server-side filtering and database RLS.
- Use the authenticated user's JWT for database requests.
- Never bypass RLS for ordinary character operations.
- Use parameterized Supabase queries.
- Keep secrets outside Git.
- Use HTTPS in production.
- Test ownership isolation before production deployment.

## Related Documentation

- [System Architecture](../docs/architecture.md)
- [System Requirements](../docs/requirements.md)
- [Project Overview](../docs/project-overview.md)
- [Customization Catalog](../docs/customization-catalog.md)
- [Database Security](../supabase/README.md)

## Related GitHub Issues

- Issue #9 — Supabase database schema and RLS.
- Issue #11 — Frontend authentication and recovery.
- Issue #13 — Express authentication middleware and API CI.
- Issue #15 — Protected character CRUD endpoints.

## November 3–4, 2026 — Hosted Staging Evidence

- The developer reported successful API health and HTTP 401 unauthenticated smoke checks through Vercel's `/api` rewrite to Render.
- The developer reported negative cross-account CRUD, rejected `userId` payloads, and no alteration of the second account's character. These manual tests are **developer-reported**, not a new automated hosted penetration test.
- Read-only hosted Supabase SQL confirmed migrations `20261028000000` and `20261031000000`, RLS enabled, owner-only SELECT/INSERT/UPDATE/DELETE policies, and **2 characters with 0 missing Motivation** at inspection time.
- Local checks include 6 mocked cross-account tests, 39 pgTAP assertions, and 2 opt-in Supabase Local Auth/Express integration tests. The standard API suite passes 97 tests with the 2 local integration cases skipped by default. GitHub Actions API/Database checks passed at `c115039`.
- Render successfully redeployed following a strict staging origin allowlist update. A browser's same-origin Vercel `/api` proxy is not by itself evidence of a direct browser-to-Render CORS preflight.

## Final Release Checks

1. Audit production-intended dependencies, security headers, logging/error handling, HTTPS and any credentials/history exposure.
2. Confirm the approved stable public frontend URL, Auth redirects, API destination, and account recovery/email-delivery limits. Do not treat personal Gmail SMTP as guaranteed transactional infrastructure.
3. Review public-signup abuse/rate limits and a documented data/account deletion contact before announcing open registration.
4. Recheck the final public deployment, finish PR #23 review, and record issue #24 evidence before merging or closing related issues.

The portfolio demo may reuse a single free-hosting environment by explicit decision; a separate paid production stack is **not** required for this MVP. This is a documented availability trade-off, not production-grade isolation or uptime assurance. See [zero-budget release runbook](../docs/free-portfolio-release.md).

The frontend defaults to Brazilian Portuguese with optional English and a consistent dark retro theme. The two PNG downloads (1080×1920 Story/Status, 1080×1350 Portrait) remain the only export formats; PDF is out of scope.
