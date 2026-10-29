# RPG Character Creator API

REST API for the RPG Character Creator application.

Built with Node.js, Express, TypeScript, and Supabase Auth.

## Technology Stack

- Node.js 24
- Express 5
- TypeScript
- Supabase JavaScript Client
- ESLint
- Vitest
- Supertest
- GitHub Actions

## Project Status

The Express API foundation is implemented.

The project includes:

- Public API health checks.
- JSON request handling.
- Configurable CORS restrictions.
- Centralized error handling.
- Reusable Supabase authentication middleware.
- Automated authentication middleware tests.
- Automated API checks through GitHub Actions.

Protected character CRUD endpoints are planned for a separate milestone.

## Requirements

- Node.js 24
- npm
- Git

A Supabase project is required when running authenticated operations against the real authentication service.

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

Example configuration:

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY
```

Replace the placeholders with the correct values for your development environment.

Do not commit `.env` files containing real configuration values.

Never place service-role keys, secret API keys, database passwords, or other privileged credentials in frontend code.

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

When accessing the frontend through a Cloud Shell preview URL, configure the appropriate frontend origin in `CORS_ORIGIN`.

Do not disable CORS restrictions to bypass configuration errors.

CORS is a browser access policy and is not a substitute for authentication or authorization.

## Authentication

The API uses Supabase Auth to validate user access tokens.

Clients must provide an authentication header when accessing protected routes:

```http
Authorization: Bearer <access_token>
```

The access token is issued by Supabase Auth after successful user authentication.

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
4. Validates the supplied access token using Supabase Auth.
5. Rejects invalid or expired access tokens.
6. Rejects users without a confirmed email address.
7. Distinguishes authentication failures from service availability failures.
8. Makes the verified user ID available to protected route handlers.

The verified user ID is stored in:

```typescript
res.locals.authenticatedUserId
```

Protected handlers must use this verified identity rather than trusting a user ID supplied in a request.

### Authentication Responses

| HTTP Status | Meaning |
|---|---|
| `401 Unauthorized` | Missing, malformed, invalid, or expired credentials. |
| `403 Forbidden` | Email verification is required. |
| `503 Service Unavailable` | Authentication service failure or temporary network error. |

Authentication errors must not expose access tokens, passwords, internal service details, or other sensitive credentials.

### Supabase Client Configuration

The backend Supabase client is implemented in:

```text
src/lib/supabase.ts
```

The client disables browser-oriented session persistence and automatic token refreshing.

The backend validates the caller's access token through Supabase Auth.

Ordinary character operations must eventually use user-scoped database access so PostgreSQL Row Level Security policies remain effective.

Privileged service-role access must not be used as a shortcut for ordinary character CRUD.

## API Endpoints

### GET /api/health

Public endpoint that checks whether the API is available.

Authentication is not required.

Example response:

```json
{
  "status": "ok",
  "service": "rpg-character-creator-api"
}
```

HTTP status:

```text
200 OK
```

### Unknown Routes

Requests to unknown endpoints return:

```json
{
  "error": "Route not found"
}
```

HTTP status:

```text
404 Not Found
```

### Future Protected Endpoints

Character management endpoints will be implemented separately.

Planned endpoints:

| Method | Endpoint | Authentication |
|---|---|---|
| GET | `/api/characters/me` | Required |
| PUT | `/api/characters/me` | Required |
| DELETE | `/api/characters/me` | Required |

These endpoints are not implemented yet.

The authentication middleware is currently tested through an isolated test route.

It will be connected to the character management endpoints during their implementation.

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

The current test suite contains **14 automated tests**.

### API Tests

File:

```text
src/app.test.ts
```

Two tests verify:

1. The public health endpoint returns HTTP 200.
2. Unknown routes return HTTP 404.

### Authentication Middleware Tests

File:

```text
src/middleware/requireAuth.test.ts
```

Twelve tests verify:

1. Requests without authorization headers are rejected.
2. Malformed authorization headers are rejected.
3. Bearer headers without tokens are rejected.
4. Invalid access tokens are rejected.
5. Expired access tokens are rejected.
6. Users with unverified email addresses are rejected.
7. Valid tokens from verified users are accepted.
8. Verified user identities cannot be replaced by client-supplied user IDs.
9. Authentication service exceptions are handled safely.
10. Oversized authorization headers are rejected.
11. Authentication service errors returned by Supabase are handled safely.
12. Network errors returned by Supabase are handled safely.

### Test Summary

| Test Category | Total |
|---|---:|
| API health and routing | 2 |
| Authentication middleware | 12 |
| **Total** | **14** |

Authentication tests use mocked Supabase responses.

They do not require real user credentials or production access tokens.

These tests verify the middleware behavior but do not replace live integration testing against Supabase Auth.

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

Changes must pass the automated checks before being considered ready for merging.

## Security Requirements

- Validate authentication before executing protected operations.
- Never trust arbitrary client-provided user IDs.
- Do not treat unverified JWT payloads as authenticated identities.
- Never log passwords, access tokens, or refresh tokens.
- Never expose privileged credentials to the frontend.
- Use generic authentication and server error responses.
- Reject malformed and oversized authorization headers.
- Distinguish invalid credentials from authentication service failures.
- Apply input validation to future API endpoints.
- Preserve restrictive CORS configuration.
- Enforce ownership through server-side authorization and database RLS.
- Use HTTPS in production.
- Keep environment configuration and secrets outside Git.

## Related Documentation

- [System Architecture](../docs/architecture.md)
- [System Requirements](../docs/requirements.md)
- [Project Overview](../docs/project-overview.md)
- [Database Security](../supabase/README.md)

## Related GitHub Issues

- Issue #9 — Supabase database schema and RLS.
- Issue #11 — Frontend authentication and recovery.
- Issue #13 — Express authentication middleware and API CI.

## Next Milestone

Implement protected character persistence using:

- Validated Supabase access tokens.
- Verified user identities.
- Server-side request validation.
- User-scoped PostgreSQL operations.
- Row Level Security.
- Automated authorization and CRUD tests.

The character management API will be implemented separately from the authentication middleware.