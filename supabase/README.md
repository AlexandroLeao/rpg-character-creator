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

**Later verified CI evidence (November 4, 2026):** [Database Security Tests](https://github.com/AlexandroLeao/rpg-character-creator/actions/runs/41918531601) at `0b22f48` passed all **39 pgTAP assertions across 2 files**. The original job log and unchanged database files/workflow through `fea7ac8` were checked on November 12. No fresh local or hosted database tests were executed in that review. See the [post-MVP engineering baseline](../docs/post-mvp-engineering.md).

**Latest reported local verification (November 1, 2026):** 39 pgTAP assertions passed; 2 opt-in Express/Supabase integration tests passed; the API's standard suite passed 97 tests with 2 integration tests skipped by default. CI and final deployment-specific verification remain separate release gates.

## R4 — Isolated database validation with Docker

The [API Docker image and smoke](../api/README.md#local-docker-execution-r4) are separate from the existing database test workflow. The latter starts isolated local PostgreSQL via Supabase CLI and runs the same version-controlled migrations and pgTAP assertions. For a full local Auth stack use `supabase start` from the root; for database-only CI the existing `supabase db start` is sufficient. Run `supabase test db` only against the local stack. No hosted schema or data is changed. The container smoke does not require or verify authenticated connections to the local Supabase gateway.

Stop your local stack with `supabase stop` when finished; do not delete volumes or reset a database that contains data you need. See the [official local development guide](https://supabase.com/docs/guides/local-development) for isolated network setup.

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

## Hosted migration/RLS inspection — November 3–4, 2026

The developer ran **read-only SQL** in the currently connected Supabase project's SQL Editor and supplied results:

- `supabase_migrations.schema_migrations` contains `20261028000000` and `20261031000000`, matching Git.
- `public.characters` reports `rowsecurity = true`.
- `pg_policies` lists four policies scoped to `authenticated`: `characters_select_own`, `characters_insert_own`, `characters_update_own`, `characters_delete_own`, each comparing `auth.uid()` with `user_id` in the applicable conditions.
- The table exposes the expected 14 columns, including `user_id`, `character_class` and nullable `motivation` (nullable for backward compatibility; required by the API on new saves).
- An aggregate query reported **2 saved characters and 0 rows with `motivation IS NULL`** at inspection time.
- The developer also reported two-account hosted API authorization/immutable-field checks passing.

These observations resolve the **previously pending hosted migration-history and missing-Motivation checks** for that environment. They do not substitute for a database backup, a new environment's checks, a full credential/history audit, or a controlled production-release smoke test.

**Do not run `supabase db push`, `supabase db reset`, or `supabase test db --linked` to reconfirm these results.** No migration is currently proposed by this evidence update. If any schema change becomes necessary, inspect first, preserve existing data, review backups/recovery, and obtain explicit approval before a write.

The currently used Supabase project is treated as the staging/portfolio-demo environment, even though its dashboard branch is labeled `PRODUCTION`. Using this same free environment publicly requires an explicit launch decision and documented limitations; production-scale email and abuse protection have not been certified. Keep secrets, OTPs, passwords, keys and personal account data out of documentation and screenshots.

Official references:

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase column privileges](https://supabase.com/docs/guides/database/postgres/column-level-security)
- [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase testing with pgTAP](https://supabase.com/docs/guides/local-development/testing/overview)
