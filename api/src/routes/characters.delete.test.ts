import request from 'supertest'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  createUserDatabaseClient: vi.fn(),
  from: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
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

describe('DELETE /api/characters/me', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'verified-user-id',
          email_confirmed_at: '2026-10-29T10:00:00Z',
        },
      },
      error: null,
    })

    mocks.createUserDatabaseClient.mockReturnValue({
      from: mocks.from,
    })

    mocks.from.mockReturnValue({
      delete: mocks.delete,
    })

    mocks.delete.mockReturnValue({
      eq: mocks.eq,
    })

    mocks.eq.mockResolvedValue({
      data: null,
      error: null,
    })
  })

  it('rejects unauthenticated requests', async () => {
    const response = await request(app)
      .delete('/api/characters/me')

    expect(response.status).toBe(401)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })

    expect(mocks.delete).not.toHaveBeenCalled()
  })

  it('rejects invalid access tokens', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: new Error('Invalid access token'),
    })

    const response = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(mocks.delete).not.toHaveBeenCalled()
  })

  it('rejects users with unverified emails', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'unverified-user-id',
          email_confirmed_at: null,
        },
      },
      error: null,
    })

    const response = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer unverified-token')

    expect(response.status).toBe(403)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(mocks.delete).not.toHaveBeenCalled()
  })

  it('deletes the authenticated user character', async () => {
    const response = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(204)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(response.text).toBe('')

    expect(mocks.from).toHaveBeenCalledWith(
      'characters',
    )

    expect(mocks.delete).toHaveBeenCalledTimes(1)

    expect(mocks.eq).toHaveBeenCalledWith(
      'user_id',
      'verified-user-id',
    )
  })

  it('returns 204 when no character exists', async () => {
    const firstResponse = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    const secondResponse = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(firstResponse.status).toBe(204)
    expect(secondResponse.status).toBe(204)

    expect(firstResponse.text).toBe('')
    expect(secondResponse.text).toBe('')

    expect(mocks.delete).toHaveBeenCalledTimes(2)
  })

  it('uses the verified identity instead of a supplied user ID', async () => {
    const response = await request(app)
      .delete('/api/characters/me?userId=attacker-user-id')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(204)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(
      mocks.createUserDatabaseClient,
    ).toHaveBeenCalledWith('valid-token')

    expect(mocks.eq).toHaveBeenCalledWith(
      'user_id',
      'verified-user-id',
    )
  })

  it('handles database errors safely', async () => {
    mocks.eq.mockResolvedValue({
      data: null,
      error: {
        code: '42501',
        message: 'Sensitive database error',
      },
    })

    const response = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Sensitive database error',
    )
  })

  it('handles unexpected database failures safely', async () => {
    mocks.eq.mockRejectedValue(
      new Error('Internal database connection failure'),
    )

    const response = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Internal database connection failure',
    )
  })

  it('handles database client configuration failures safely', async () => {
    mocks.createUserDatabaseClient.mockImplementation(() => {
      throw new Error('Sensitive configuration failure')
    })

    const response = await request(app)
      .delete('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Sensitive configuration failure',
    )
  })
})