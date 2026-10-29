import express from 'express'
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
}))

vi.mock('../lib/supabase.js', () => ({
  createAuthClient: () => ({
    auth: {
      getUser: mocks.getUser,
    },
  }),
}))

import { requireAuth } from './requireAuth.js'

const app = express()

app.get('/api/protected-test', requireAuth, (_req, res) => {
  res.status(200).json({
    userId: res.locals.authenticatedUserId,
  })
})

describe('Supabase authentication middleware', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('rejects requests without an authorization header', async () => {
    const response = await request(app)
      .get('/api/protected-test')

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })

    expect(mocks.getUser).not.toHaveBeenCalled()
  })

  it('rejects malformed authorization headers', async () => {
    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Basic invalid-token')

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })

    expect(mocks.getUser).not.toHaveBeenCalled()
  })

  it('rejects a Bearer header without a token', async () => {
    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer')

    expect(response.status).toBe(401)

    expect(mocks.getUser).not.toHaveBeenCalled()
  })

  it('rejects invalid access tokens', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: new Error('Invalid access token'),
    })

    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })

    expect(mocks.getUser).toHaveBeenCalledWith(
      'invalid-token',
    )

    expect(response.text).not.toContain(
      'Invalid access token',
    )
  })

  it('rejects expired access tokens', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: new Error('JWT expired'),
    })

    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer expired-token')

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })
  })

  it('rejects users with unverified email addresses', async () => {
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
      .get('/api/protected-test')
      .set('Authorization', 'Bearer unverified-token')

    expect(response.status).toBe(403)

    expect(response.body).toEqual({
      error: 'Email verification required',
    })
  })

  it('accepts valid tokens from verified users', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'verified-user-id',
          email_confirmed_at: '2026-10-29T10:00:00Z',
        },
      },
      error: null,
    })

    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      userId: 'verified-user-id',
    })

    expect(mocks.getUser).toHaveBeenCalledWith(
      'valid-token',
    )
  })

  it('uses the verified identity instead of a supplied user ID', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'actual-user-id',
          email_confirmed_at: '2026-10-29T10:00:00Z',
        },
      },
      error: null,
    })

    const response = await request(app)
      .get('/api/protected-test?userId=attacker-user-id')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      userId: 'actual-user-id',
    })
  })

  it('handles authentication service failures safely', async () => {
    mocks.getUser.mockRejectedValue(
      new Error('Internal authentication service failure'),
    )

    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer valid-looking-token')

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Authentication service unavailable',
    })

    expect(response.text).not.toContain(
      'Internal authentication service failure',
    )
  })
  it('rejects oversized authorization headers', async () => {
    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', `Bearer ${'x'.repeat(8200)}`)

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })

    expect(mocks.getUser).not.toHaveBeenCalled()
  })

  it('handles returned authentication service errors safely', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: {
        name: 'AuthRetryableFetchError',
        status: 503,
        message: 'Internal authentication service failure',
      },
    })

    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer valid-looking-token')

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Authentication service unavailable',
    })

    expect(response.text).not.toContain(
      'Internal authentication service failure',
    )
  })

  it('handles returned network errors safely', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: {
        name: 'AuthRetryableFetchError',
        status: 0,
        message: 'Network request failed',
      },
    })

    const response = await request(app)
      .get('/api/protected-test')
      .set('Authorization', 'Bearer valid-looking-token')

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Authentication service unavailable',
    })

    expect(response.text).not.toContain(
      'Network request failed',
    )
  })
})
