import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: mocks.createClient,
}))

import {
  createAuthClient,
  createUserDatabaseClient,
} from './supabase.js'

describe('Supabase client configuration', () => {
  beforeEach(() => {
    vi.stubEnv(
      'SUPABASE_URL',
      'https://test-project.supabase.co',
    )

    vi.stubEnv(
      'SUPABASE_PUBLISHABLE_KEY',
      'sb_publishable_test',
    )

    mocks.createClient.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('creates an authentication client without session persistence', () => {
    createAuthClient()

    expect(mocks.createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'sb_publishable_test',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    )
  })

  it('configures database access with the user token', () => {
    createUserDatabaseClient('verified-user-token')

    expect(mocks.createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'sb_publishable_test',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            Authorization: 'Bearer verified-user-token',
          },
        },
      },
    )
  })

  it('uses a separate token for each database client', () => {
    createUserDatabaseClient('first-user-token')
    createUserDatabaseClient('second-user-token')

    expect(mocks.createClient).toHaveBeenCalledTimes(2)

    expect(mocks.createClient).toHaveBeenNthCalledWith(
      1,
      'https://test-project.supabase.co',
      'sb_publishable_test',
      expect.objectContaining({
        global: {
          headers: {
            Authorization: 'Bearer first-user-token',
          },
        },
      }),
    )

    expect(mocks.createClient).toHaveBeenNthCalledWith(
      2,
      'https://test-project.supabase.co',
      'sb_publishable_test',
      expect.objectContaining({
        global: {
          headers: {
            Authorization: 'Bearer second-user-token',
          },
        },
      }),
    )
  })

  it.each([
    '',
    'invalid token',
    'token\ninvalid',
    'x'.repeat(8193),
  ])('rejects an invalid user access token', (token) => {
    expect(() => {
      createUserDatabaseClient(token)
    }).toThrow('Verified user access token is required')

    expect(mocks.createClient).not.toHaveBeenCalled()
  })

  it('rejects a missing Supabase URL', () => {
    vi.stubEnv('SUPABASE_URL', '')

    expect(() => {
      createAuthClient()
    }).toThrow('Supabase authentication is not configured')

    expect(mocks.createClient).not.toHaveBeenCalled()
  })

  it('rejects a missing publishable key', () => {
    vi.stubEnv('SUPABASE_PUBLISHABLE_KEY', '')

    expect(() => {
      createUserDatabaseClient('valid-token')
    }).toThrow('Supabase authentication is not configured')

    expect(mocks.createClient).not.toHaveBeenCalled()
  })
})