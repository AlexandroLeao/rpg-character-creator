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
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
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

const exampleCharacter = {
  id: 'character-123',
  user_id: 'verified-user-id',
  name: 'Eldrin',
  character_class: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
  created_at: '2026-10-29T10:00:00Z',
  updated_at: '2026-10-29T10:00:00Z',
}

describe('GET /api/characters/me', () => {
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
      select: mocks.select,
    })

    mocks.select.mockReturnValue({
      eq: mocks.eq,
    })

    mocks.eq.mockReturnValue({
      maybeSingle: mocks.maybeSingle,
    })

    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    })
  })

  it('rejects unauthenticated requests', async () => {
    const response = await request(app)
      .get('/api/characters/me')

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      error: 'Unauthorized',
    })

    expect(
      mocks.createUserDatabaseClient,
    ).not.toHaveBeenCalled()
  })

  it('rejects invalid access tokens', async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: null,
      },
      error: new Error('Invalid access token'),
    })

    const response = await request(app)
      .get('/api/characters/me')
      .set('Authorization', 'Bearer invalid-token')

    expect(response.status).toBe(401)

    expect(
      mocks.createUserDatabaseClient,
    ).not.toHaveBeenCalled()
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
      .get('/api/characters/me')
      .set('Authorization', 'Bearer unverified-token')

    expect(response.status).toBe(403)

    expect(response.body).toEqual({
      error: 'Email verification required',
    })

    expect(
      mocks.createUserDatabaseClient,
    ).not.toHaveBeenCalled()
  })

  it('returns 404 when the user has no character', async () => {
    const response = await request(app)
      .get('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(404)

    expect(response.body).toEqual({
      error: 'Character not found',
    })
  })

  it('returns the authenticated user character', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: exampleCharacter,
      error: null,
    })

    const response = await request(app)
      .get('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      character: {
        id: 'character-123',
        name: 'Eldrin',
        characterClass: 'mage',
        ancestry: 'elf',
        background: 'scholar',
        weapon: 'staff',
        artifact: 'moon-crystal',
        personality: 'curious',
        aura: 'arcane',
        companion: 'owl',
        createdAt: '2026-10-29T10:00:00Z',
        updatedAt: '2026-10-29T10:00:00Z',
      },
    })

    expect(response.body.character).not.toHaveProperty(
      'user_id',
    )
  })

  it('queries the database using the verified identity', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: exampleCharacter,
      error: null,
    })

    const response = await request(app)
      .get(
        '/api/characters/me?userId=another-user-id',
      )
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(200)

    expect(
      mocks.createUserDatabaseClient,
    ).toHaveBeenCalledWith('valid-token')

    expect(mocks.from).toHaveBeenCalledWith(
      'characters',
    )

    expect(mocks.select).toHaveBeenCalledWith(
      expect.stringContaining('character_class'),
    )

    expect(mocks.eq).toHaveBeenCalledWith(
      'user_id',
      'verified-user-id',
    )
  })

  it('returns 404 when RLS provides no visible character', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    const response = await request(app)
      .get('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(404)

    expect(mocks.eq).toHaveBeenCalledWith(
      'user_id',
      'verified-user-id',
    )
  })

  it('handles database errors safely', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: {
        message: 'Internal database information',
        code: '42501',
      },
    })

    const response = await request(app)
      .get('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Internal database information',
    )
  })

  it('handles unexpected database failures safely', async () => {
    mocks.maybeSingle.mockRejectedValue(
      new Error('Internal database connection failure'),
    )

    const response = await request(app)
      .get('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Internal database connection failure',
    )
  })
})