import request from 'supertest'

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

/*
 * ADVENTURE FILES
 * CROSS-ACCOUNT AUTHORIZATION TESTS
 *
 * Simulates two authenticated accounts.
 *
 * No network connection or real database
 * operations are performed.
 *
 * These tests check API ownership behavior.
 * Live Supabase RLS integration must be
 * verified separately.
 */

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  createUserDatabaseClient: vi.fn(),
}))

vi.mock('../lib/supabase.js', () => ({
  createAuthClient: () => ({
    auth: {
      getUser: mocks.getUser,
    },
  }),

  createUserDatabaseClient:
    mocks.createUserDatabaseClient,
}))

import app from '../app.js'

/* ==========================================
   TEST ACCOUNTS
   ========================================== */

const tokenOwners: Record<string, string> = {
  'token-account-a': 'user-a',
  'token-account-b': 'user-b',
}

/* ==========================================
   CHARACTER TYPES
   ========================================== */

type CharacterFields = {
  name: string
  character_class: string
  ancestry: string
  background: string
  weapon: string
  artifact: string
  personality: string
  aura: string
  companion: string
  motivation: string
}

type StoredCharacter = CharacterFields & {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

/* ==========================================
   EXAMPLE CHARACTER DATA
   ========================================== */

const characterA: StoredCharacter = {
  id: 'character-a',
  user_id: 'user-a',

  name: 'Aldren',
  character_class: 'mage',

  ancestry: 'elf',
  background: 'scholar',

  weapon: 'staff',
  artifact: 'moon-crystal',

  personality: 'curious',
  aura: 'arcane',

  companion: 'owl',
  motivation: 'knowledge',

  created_at: '2026-11-01T10:00:00Z',
  updated_at: '2026-11-01T10:00:00Z',
}

const characterB: StoredCharacter = {
  ...characterA,

  id: 'character-b',
  user_id: 'user-b',

  name: 'Borin',
  character_class: 'ranger',
}

/* ==========================================
   VALID CHARACTER INPUT
   ========================================== */

const validInput = {
  name: 'Aldren',
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
   ISOLATED TEST DATABASE
   ========================================== */

let characters = new Map<string, StoredCharacter>()

function assertOwnerFilter(
  field: string,
  value: string,
  authenticatedUserId: string,
) {
  if (
    field !== 'user_id' ||
    value !== authenticatedUserId
  ) {
    throw new Error(
      'Unsafe database ownership filter',
    )
  }
}

/* ==========================================
   FAKE USER-SCOPED DATABASE CLIENT
   ========================================== */

function createFakeDatabaseClient(
  accessToken: string,
) {
  const authenticatedUserId =
    tokenOwners[accessToken]

  if (!authenticatedUserId) {
    throw new Error('Unrecognized access token')
  }

  return {
    from(table: string) {
      if (table !== 'characters') {
        throw new Error('Unexpected table')
      }

      return {
        /*
         * GET CHARACTER
         */

        select(_columns: string) {
          return {
            eq(field: string, value: string) {
              return {
                async maybeSingle() {
                  assertOwnerFilter(
                    field,
                    value,
                    authenticatedUserId,
                  )

                  return {
                    data:
                      characters.get(
                        authenticatedUserId,
                      ) ?? null,
                    error: null,
                  }
                },
              }
            },
          }
        },

        /*
         * UPDATE CHARACTER
         */

        update(fields: Partial<CharacterFields>) {
          return {
            eq(field: string, value: string) {
              return {
                select(_columns: string) {
                  return {
                    async maybeSingle() {
                      assertOwnerFilter(
                        field,
                        value,
                        authenticatedUserId,
                      )

                      const existing =
                        characters.get(
                          authenticatedUserId,
                        )

                      if (!existing) {
                        return {
                          data: null,
                          error: null,
                        }
                      }

                      const updated = {
                        ...existing,
                        ...fields,
                      }

                      characters.set(
                        authenticatedUserId,
                        updated,
                      )

                      return {
                        data: updated,
                        error: null,
                      }
                    },
                  }
                },
              }
            },
          }
        },

        /*
         * CREATE CHARACTER
         */

        insert(
          fields: CharacterFields & {
            user_id: string
          },
        ) {
          return {
            select(_columns: string) {
              return {
                async single() {
                  if (
                    fields.user_id !==
                    authenticatedUserId
                  ) {
                    throw new Error(
                      'Cannot create another user character',
                    )
                  }

                  if (
                    characters.has(
                      authenticatedUserId,
                    )
                  ) {
                    return {
                      data: null,
                      error: {
                        code: '23505',
                      },
                    }
                  }

                  const created: StoredCharacter = {
                    id:
                      `character-${authenticatedUserId}`,

                    ...fields,

                    user_id:
                      authenticatedUserId,

                    created_at:
                      '2026-11-01T10:00:00Z',

                    updated_at:
                      '2026-11-01T10:00:00Z',
                  }

                  characters.set(
                    authenticatedUserId,
                    created,
                  )

                  return {
                    data: created,
                    error: null,
                  }
                },
              }
            },
          }
        },

        /*
         * DELETE CHARACTER
         */

        delete() {
          return {
            async eq(
              field: string,
              value: string,
            ) {
              assertOwnerFilter(
                field,
                value,
                authenticatedUserId,
              )

              characters.delete(
                authenticatedUserId,
              )

              return {
                data: null,
                error: null,
              }
            },
          }
        },
      }
    },
  }
}

/* ==========================================
   CROSS-ACCOUNT TEST SUITE
   ========================================== */

describe(
  'Character API cross-account authorization',
  () => {
    beforeEach(() => {
      vi.resetAllMocks()

      characters = new Map([
        ['user-a', { ...characterA }],
        ['user-b', { ...characterB }],
      ])

      mocks.getUser.mockImplementation(
        async (accessToken: string) => {
          const userId =
            tokenOwners[accessToken]

          if (!userId) {
            return {
              data: {
                user: null,
              },

              error: new Error(
                'Invalid access token',
              ),
            }
          }

          return {
            data: {
              user: {
                id: userId,

                email_confirmed_at:
                  '2026-11-01T10:00:00Z',
              },
            },

            error: null,
          }
        },
      )

      mocks.createUserDatabaseClient
        .mockImplementation(
          (accessToken: string) =>
            createFakeDatabaseClient(
              accessToken,
            ),
        )
    })

    /* ======================================
       01 — READ ISOLATION
       ====================================== */

    it(
      'returns only the character owned by the authenticated account',
      async () => {
        const responseA = await request(app)
          .get(
            '/api/characters/me?userId=user-b',
          )
          .set(
            'Authorization',
            'Bearer token-account-a',
          )

        expect(responseA.status).toBe(200)

        expect(
          responseA.body.character.id,
        ).toBe('character-a')

        expect(
          responseA.body.character.name,
        ).toBe('Aldren')

        expect(responseA.text).not.toContain(
          'Borin',
        )

        const responseB = await request(app)
          .get(
            '/api/characters/me?userId=user-a',
          )
          .set(
            'Authorization',
            'Bearer token-account-b',
          )

        expect(responseB.status).toBe(200)

        expect(
          responseB.body.character.id,
        ).toBe('character-b')

        expect(
          responseB.body.character.name,
        ).toBe('Borin')

        expect(
          mocks.createUserDatabaseClient,
        ).toHaveBeenCalledWith(
          'token-account-a',
        )

        expect(
          mocks.createUserDatabaseClient,
        ).toHaveBeenCalledWith(
          'token-account-b',
        )
      },
    )

    /* ======================================
       02 — UPDATE ISOLATION
       ====================================== */

    it(
      'cannot update another account through a supplied user ID',
      async () => {
        const response = await request(app)
          .put(
            '/api/characters/me?userId=user-b',
          )
          .set(
            'Authorization',
            'Bearer token-account-a',
          )
          .send({
            ...validInput,
            name: 'Aldren Updated',
          })

        expect(response.status).toBe(200)

        expect(
          response.body.character.id,
        ).toBe('character-a')

        expect(
          characters.get('user-a')?.name,
        ).toBe('Aldren Updated')

        expect(
          characters.get('user-b'),
        ).toEqual(characterB)

        const responseB = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            'Bearer token-account-b',
          )

        expect(responseB.status).toBe(200)

        expect(
          responseB.body.character.name,
        ).toBe('Borin')
      },
    )

    /* ======================================
       03 — CREATE ISOLATION
       ====================================== */

    it(
      'creates a character only for the verified account',
      async () => {
        characters.delete('user-a')

        const response = await request(app)
          .put(
            '/api/characters/me?userId=user-b',
          )
          .set(
            'Authorization',
            'Bearer token-account-a',
          )
          .send(validInput)

        expect(response.status).toBe(201)

        expect(
          characters.get('user-a')?.user_id,
        ).toBe('user-a')

        expect(
          characters.get('user-b'),
        ).toEqual(characterB)

        expect(characters.size).toBe(2)
      },
    )

    /* ======================================
       04 — DELETE ISOLATION
       ====================================== */

    it(
      'deletes only the authenticated account character',
      async () => {
        const response = await request(app)
          .delete(
            '/api/characters/me?userId=user-b',
          )
          .set(
            'Authorization',
            'Bearer token-account-a',
          )

        expect(response.status).toBe(204)

        expect(
          characters.has('user-a'),
        ).toBe(false)

        expect(
          characters.get('user-b'),
        ).toEqual(characterB)

        const responseB = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            'Bearer token-account-b',
          )

        expect(responseB.status).toBe(200)

        expect(
          responseB.body.character.id,
        ).toBe('character-b')
      },
    )

    /* ======================================
       05 — IMMUTABLE OWNERSHIP
       ====================================== */

    it(
      'rejects attempts to overwrite character ownership',
      async () => {
        const response = await request(app)
          .put('/api/characters/me')
          .set(
            'Authorization',
            'Bearer token-account-a',
          )
          .send({
            ...validInput,
            user_id: 'user-b',
          })

        expect(response.status).toBe(400)

        expect(
          characters.get('user-a'),
        ).toEqual(characterA)

        expect(
          characters.get('user-b'),
        ).toEqual(characterB)
      },
    )

    /* ======================================
       06 — INVALID TOKEN
       ====================================== */

    it(
      'rejects an invalid token before accessing character storage',
      async () => {
        const response = await request(app)
          .get('/api/characters/me')
          .set(
            'Authorization',
            'Bearer invalid-account-token',
          )

        expect(response.status).toBe(401)

        expect(
          mocks.createUserDatabaseClient,
        ).not.toHaveBeenCalled()

        expect(
          characters.get('user-a'),
        ).toEqual(characterA)

        expect(
          characters.get('user-b'),
        ).toEqual(characterB)
      },
    )
  },
)