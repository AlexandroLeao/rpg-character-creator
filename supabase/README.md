# Supabase Database Foundation

The database schema lives in version-controlled SQL migrations. Do not edit the hosted schema manually in the Table Editor or SQL Editor after adopting this workflow: changes applied directly to the hosted project bypass migration tracking.

## What this change provides

- `public.characters` references Supabase-managed `auth.users` and is limited to one row per account (`UNIQUE(user_id)`).
- All eight character classes and eight customization fields are constrained to the [approved catalog](../docs/customization-catalog.md).
- Character names must be trimmed, between 2 and 32 characters, and contain no control characters.
- IDs and timestamps are database-managed.
- Row Level Security (RLS) allows only the signed-in owner to select, insert, update, and delete their character.
- Only editable character columns can be updated by the `authenticated` database role. Ownership, IDs and timestamps are not writable through the normal client role.
- The `anon` database role has no access to this table.

**Important:** RLS is not a substitute for authenticating the Express API's access token. The implemented Express CRUD handlers validate tokens and use user-scoped database requests so RLS applies. They must never use a service-role/secret key for ordinary character CRUD.

## Testing before touching the hosted project

On a machine with Docker and the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) installed:

```bash
supabase start
supabase test db
```

Run these commands from the **repository root**. The CLI uses the local `supabase/config.toml`, applies migrations to an isolated local PostgreSQL instance, and runs the pgTAP assertions in `supabase/tests/`. Database tests insert fictional local test accounts **inside rolled-back transactions**.

The same steps run in `.github/workflows/database.yml` on PRs that change the Supabase folder. GitHub Actions is the preferred test environment if the Google Cloud Shell session does not provide an appropriate Docker runtime.

Do not run `supabase db reset` against any environment containing data you need. Do not use `supabase test db --linked` on the hosted project: these tests exercise database roles and create temporary authentication records and are intended **only for isolated local testing**.

### Local Express + Supabase authorization integration

The API includes `api/src/integration/characters.local.test.ts`, an opt-in integration suite using the **real local Supabase Auth, PostgreSQL RLS, and Express app**.

From the `api/` directory, with the local Supabase stack already running:

```bash
RUN_LOCAL_AUTH_INTEGRATION=1 npx vitest run src/integration/characters.local.test.ts
```

The suite reads local CLI credentials internally using `supabase status -o env`; it rejects any API URL other than `http://127.0.0.1:54321`. It creates two disposable local users, authenticates with real JWTs, verifies that cross-account query parameters cannot redirect character reads/updates/deletes, rejects an invalid token, and removes only its own test users. **Never paste local keys, JWTs, or the complete CLI status output into issues or chat.**

The two integration tests are skipped during ordinary `npm test` runs unless `RUN_LOCAL_AUTH_INTEGRATION=1` is set. They must not be run against the hosted project.

**Latest reported local verification (November 1, 2026):** 39 pgTAP assertions passed; 2 opt-in Express/Supabase integration tests passed; the API's standard suite passed 97 tests with 2 integration tests skipped by default. CI and final deployment-specific verification remain separate release gates.

## Security verification matrix

| Scenario | Expected result |
|---|---|
| User A creates their own character | Allowed |
| User A reads, edits, or deletes A's character | Allowed |
| User A reads B's character | No rows returned |
| User A edits or deletes B's character | No rows changed |
| User A inserts a character for user C | Rejected by RLS |
| User A tries to change the `user_id` column | Rejected by column privileges |
| User A inserts a second character | Rejected by UNIQUE constraint |
| An anonymous caller reads or inserts characters | Rejected |
| A caller submits an unapproved class or option slug | Rejected by database constraints |
| A caller supplies a blank or untrimmed character name | Rejected by database constraints |
| User B deletes their Supabase Auth account | B's character is removed by FK cascade |

The database test suite verifies these rules at the SQL layer. The API additionally has isolated mock-based authorization tests and an opt-in integration suite using real local Auth tokens with disposable accounts. These local results do not substitute for controlled validation of production authentication, API deployment, and RLS configuration.

## Later: deploy the reviewed migration

**Do not do this during the initial review.** After GitHub Actions tests pass and the pull request is approved, confirm the migration is safe for the selected target environment. Use the Supabase CLI migration workflow (`supabase link`, inspect `supabase migration list`, then `supabase db push`) from a controlled environment with appropriate access. Use secure interactive authentication; keep database passwords and service-role credentials out of Git history, screenshots and chat.

The hosted project is currently a **development project** even though the dashboard labels its branch `PRODUCTION`. Public registration and email verification also require correct Site URL / Redirect URLs and a production SMTP sender, which are out of scope for this database-only issue.

Official references:

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase column privileges](https://supabase.com/docs/guides/database/postgres/column-level-security)
- [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase testing with pgTAP](https://supabase.com/docs/guides/local-development/testing/overview)
