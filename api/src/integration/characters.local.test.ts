import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Express } from 'express'
import request from 'supertest'

import {
  createClient,
  type SupabaseClient,
} from '@supabase/supabase-js'

import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest'

/*
 * ADVENTURE FILES
 * LOCAL SUPABASE INTEGRATION TESTS
 *
 * Uses:
 * - Real local Supabase Auth
 * - Real local PostgreSQL and RLS
 * - The actual Express application
 * - Two disposable test accounts
 *
 * Safety:
 * - Explicit opt-in required
 * - Localhost URL required
 * - Hosted projects are rejected
 * - Created users are removed afterward
 * - Credentials are never logged
 */

const enabled =
  process.env.RUN_LOCAL_AUTH_INTEGRATION === '1'

const projectRoot = resolve(
  process.cwd(),
  '..',
)

type LocalConfig = {
  apiUrl: string
  anonKey: string
  serviceRoleKey: string
}

type TestAccount = {
  id: string
  accessToken: string
}

/* ==========================================
   LOCAL CONFIGURATION
   ========================================== */

function readLocalConfig(): LocalConfig {
  const configPath = resolve(
    projectRoot,
    'supabase',
    'config.toml',
  )

  if (!existsSync(configPath)) {
    throw new Error(
      'Local Supabase configuration not found',
    )
  }

  let output: string

  try {
    /*
     * Supabase CLI 2.122.0
     *
     * Correct syntax:
     *
     * supabase status -o env
     *
     * The output is captured internally.
     * Credentials are never printed.
     */

    output = execFileSync(
      'npx',
      [
        'supabase@2.122.0',
        'status',
        '-o',
        'env',
      ],
      {
        cwd: projectRoot,
        encoding: 'utf8',
        timeout: 30000,

        stdio: [
          'ignore',
          'pipe',
          'ignore',
        ],
      },
    )
  } catch {
    throw new Error(
      'Unable to read local Supabase status',
    )
  }

  const values: Record<string, string> = {}

  for (const line of output.split(/\r?\n/)) {
    const match = line.trim().match(
      /^([A-Z][A-Z0-9_]*)=(.*)$/,
    )

    if (!match) {
      continue
    }

    values[match[1]] = match[2]
      .replace(/^["']|["']$/g, '')
  }

  const apiUrl = values.API_URL
  const anonKey = values.ANON_KEY
  const serviceRoleKey =
    values.SERVICE_ROLE_KEY

  if (
    !apiUrl ||
    !anonKey ||
    !serviceRoleKey
  ) {
    throw new Error(
      'Required local Supabase values are unavailable',
    )
  }

  /*
   * SECURITY CHECK
   *
   * Only the local development
   * endpoint is accepted.
   *
   * Hosted Supabase projects
   * cannot be used by this test.
   */

  let parsedUrl: URL

  try {
    parsedUrl = new URL(apiUrl)
  } catch {
    throw new Error(
      'Invalid local Supabase URL',
    )
  }

  if (
    parsedUrl.protocol !== 'http:' ||
    parsedUrl.hostname !== '127.0.0.1' ||
    parsedUrl.port !== '54321'
  ) {
    throw new Error(
      'Integration tests require local Supabase on 127.0.0.1:54321',
    )
  }

  return {
    apiUrl,
    anonKey,
    serviceRoleKey,
  }
}

/* ==========================================
   CHARACTER PAYLOAD
   ========================================== */

const validCharacter = {
  characterClass: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
  motivation: 'knowledge',
}

/* ==========================================
   LOCAL INTEGRATION TEST SUITE
   ========================================== */

describe.skipIf(!enabled)(
  'Local Supabase character authorization',
  () => {
    let app: Express

    let adminClient: SupabaseClient

    let accountA: TestAccount
    let accountB: TestAccount

    const createdUserIds: string[] = []

    const testSuffix = randomUUID()
      .replace(/-/g, '')
      .slice(0, 16)

    /* ======================================
       SETUP
       ====================================== */

    beforeAll(
      async () => {
        const local = readLocalConfig()

        /*
         * Force the API to use
         * local Supabase only.
         */

        process.env.SUPABASE_URL =
          local.apiUrl

        process.env.SUPABASE_PUBLISHABLE_KEY =
          local.anonKey

        app = (
          await import('../app.js')
        ).default

        /*
         * The privileged client is used
         * only for test account setup
         * and cleanup.
         *
         * Character operations use
         * regular user access tokens.
         */

        adminClient = createClient(
          local.apiUrl,
          local.serviceRoleKey,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
            },
          },
        )

        async function createTestAccount(
          label: string,
        ): Promise<TestAccount> {
          const email =
            `adventure-local-${testSuffix}-${label}@example.com`

          const password =
            `LocalTest-${randomUUID()}-Aa1!`

          const {
            data: created,
            error: createError,
          } =
            await adminClient.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
            })

          if (
            createError ||
            !created.user
          ) {
            throw new Error(
              'Failed to create local test account',
            )
          }

          /*
           * Track only users created
           * by this execution.
           */

          createdUserIds.push(
            created.user.id,
          )

          const userClient = createClient(
            local.apiUrl,
            local.anonKey,
            {
              auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
              },
            },
          )

          const {
            data: session,
            error: loginError,
          } =
            await userClient.auth.signInWithPassword({
              email,
              password,
            })

          if (
            loginError ||
            !session.session?.access_token
          ) {
            throw new Error(
              'Failed to authenticate local test account',
            )
          }

          return {
            id: created.user.id,

            accessToken:
              session.session.access_token,
          }
        }

        accountA =
          await createTestAccount('a')

        accountB =
          await createTestAccount('b')
      },
      120000,
    )

    /* ======================================
       TEST 01 — ACCOUNT ISOLATION
       ====================================== */

    it(
      'isolates character creation, reading, updating and deletion',
      async () => {
        /*
         * Create character A.
         */

        const createA = await request(app)
          .put('/api/characters/me')
          .set(
            'Authorization',
            `Bearer ${accountA.accessToken}`,
          )
          .send({
            ...validCharacter,
            name: 'Local Alpha',
          })

        expect(createA.status).toBe(201)

        /*
         * Create character B.
         */

        const createB = await request(app)
          .put('/api/characters/me')
          .set(
            'Authorization',
            `Bearer ${accountB.accessToken}`,
          )
          .send({
            ...validCharacter,
            name: 'Local Bravo',
          })

        expect(createB.status).toBe(201)

        expect(
          createA.body.character.id,
        ).not.toBe(
          createB.body.character.id,
        )

        /*
         * A attempts to read B's
         * character through userId.
         */

        const readA = await request(app)
          .get(
            `/api/characters/me?userId=${accountB.id}`,
          )
          .set(
            'Authorization',
            `Bearer ${accountA.accessToken}`,
          )

        expect(readA.status).toBe(200)

        expect(
          readA.body.character.name,
        ).toBe('Local Alpha')

        expect(
          readA.body.character.id,
        ).toBe(
          createA.body.character.id,
        )

        expect(
          readA.body.character,
        ).not.toHaveProperty('user_id')

        /*
         * A attempts to update B's
         * character through userId.
         */

        const updateA = await request(app)
          .put(
            `/api/characters/me?userId=${accountB.id}`,
          )
          .set(
            'Authorization',
            `Bearer ${accountA.accessToken}`,
          )
          .send({
            ...validCharacter,
            name: 'Local Alpha Updated',
          })

        expect(updateA.status).toBe(200)

        expect(
          updateA.body.character.name,
        ).toBe('Local Alpha Updated')

        /*
         * Confirm B remains unchanged.
         */

        const readB = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            `Bearer ${accountB.accessToken}`,
          )

        expect(readB.status).toBe(200)

        expect(
          readB.body.character.name,
        ).toBe('Local Bravo')

        expect(
          readB.body.character.id,
        ).toBe(
          createB.body.character.id,
        )

        /*
         * A attempts to delete B's
         * character through userId.
         *
         * Only A's own record
         * may be deleted.
         */

        const deleteA = await request(app)
          .delete(
            `/api/characters/me?userId=${accountB.id}`,
          )
          .set(
            'Authorization',
            `Bearer ${accountA.accessToken}`,
          )

        expect(deleteA.status).toBe(204)

        /*
         * A no longer has a character.
         */

        const missingA = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            `Bearer ${accountA.accessToken}`,
          )

        expect(missingA.status).toBe(404)

        /*
         * B still owns the
         * original character.
         */

        const preservedB = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            `Bearer ${accountB.accessToken}`,
          )

        expect(preservedB.status).toBe(200)

        expect(
          preservedB.body.character.name,
        ).toBe('Local Bravo')
      },
      60000,
    )

    /* ======================================
       TEST 02 — INVALID TOKEN
       ====================================== */

    it(
      'rejects an invalid token against real local authentication',
      async () => {
        const response = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            'Bearer invalid-local-token',
          )

        expect(response.status).toBe(401)
      },
    )

    /* ======================================
       CLEANUP
       ====================================== */

    afterAll(
      async () => {
        if (!adminClient) {
          return
        }

        /*
         * Remove only accounts
         * created by this test.
         *
         * Related character data
         * is removed through the
         * database relationship.
         */

        let cleanupFailed = false

        for (const userId of createdUserIds) {
          const { error } =
            await adminClient.auth.admin.deleteUser(
              userId,
            )

          if (error) {
            cleanupFailed = true
          }
        }

        if (cleanupFailed) {
          throw new Error(
            'Failed to remove one or more local test accounts',
          )
        }
      },
      60000,
    )
  },
)