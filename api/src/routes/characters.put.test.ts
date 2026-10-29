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
  update: vi.fn(),
  eq: vi.fn(),
  updateSelect: vi.fn(),
  updateMaybeSingle: vi.fn(),
  insert: vi.fn(),
  insertSelect: vi.fn(),
  insertSingle: vi.fn(),
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

const validCharacter = {
  name: 'Eldrin',
  characterClass: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
}

const databaseFields = {
  name: 'Eldrin',
  character_class: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
}

const savedCharacter = {
  id: 'character-123',
  user_id: 'verified-user-id',
  ...databaseFields,
  created_at: '2026-10-29T10:00:00Z',
  updated_at: '2026-10-29T10:00:00Z',
}

describe('PUT /api/characters/me', () => {
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
      update: mocks.update,
      insert: mocks.insert,
    })

    mocks.update.mockReturnValue({
      eq: mocks.eq,
    })

    mocks.eq.mockReturnValue({
      select: mocks.updateSelect,
    })

    mocks.updateSelect.mockReturnValue({
      maybeSingle: mocks.updateMaybeSingle,
    })

    mocks.insert.mockReturnValue({
      select: mocks.insertSelect,
    })

    mocks.insertSelect.mockReturnValue({
      single: mocks.insertSingle,
    })

    mocks.updateMaybeSingle.mockResolvedValue({
      data: savedCharacter,
      error: null,
    })

    mocks.insertSingle.mockResolvedValue({
      data: savedCharacter,
      error: null,
    })
  })

  it('rejects requests without authentication', async () => {
    const response = await request(app)
      .put('/api/characters/me')
      .send(validCharacter)

    expect(response.status).toBe(401)

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
      .put('/api/characters/me')
      .set('Authorization', 'Bearer invalid-token')
      .send(validCharacter)

    expect(response.status).toBe(401)

    expect(mocks.update).not.toHaveBeenCalled()
    expect(mocks.insert).not.toHaveBeenCalled()
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
      .put('/api/characters/me')
      .set('Authorization', 'Bearer unverified-token')
      .send(validCharacter)

    expect(response.status).toBe(403)

    expect(mocks.update).not.toHaveBeenCalled()
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it('creates a character when none exists', async () => {
    mocks.updateMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(201)

    expect(response.body.character.id).toBe(
      'character-123',
    )

    expect(mocks.insert).toHaveBeenCalledWith({
      user_id: 'verified-user-id',
      ...databaseFields,
    })

    expect(
      mocks.createUserDatabaseClient,
    ).toHaveBeenCalledWith('valid-token')
  })

  it('updates an existing character', async () => {
    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(200)

    expect(response.body.character.id).toBe(
      'character-123',
    )

    expect(mocks.update).toHaveBeenCalledWith(
      databaseFields,
    )

    expect(mocks.eq).toHaveBeenCalledWith(
      'user_id',
      'verified-user-id',
    )

    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it('ignores user IDs supplied through query parameters', async () => {
    const response = await request(app)
      .put('/api/characters/me?userId=attacker-id')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(200)

    expect(mocks.eq).toHaveBeenCalledWith(
      'user_id',
      'verified-user-id',
    )
  })

  it('rejects immutable fields in the request body', async () => {
    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send({
        ...validCharacter,
        user_id: 'attacker-user-id',
      })

    expect(response.status).toBe(400)

    expect(response.body.error).toBe(
      'Invalid character data',
    )

    expect(mocks.update).not.toHaveBeenCalled()
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it('rejects invalid customization options', async () => {
    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send({
        ...validCharacter,
        characterClass: 'invalid-class',
      })

    expect(response.status).toBe(400)

    expect(mocks.update).not.toHaveBeenCalled()
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it('rejects an empty character body', async () => {
    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send({})

    expect(response.status).toBe(400)

    expect(mocks.update).not.toHaveBeenCalled()
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it('normalizes character names before updating', async () => {
    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send({
        ...validCharacter,
        name: '  Eldrin  ',
      })

    expect(response.status).toBe(200)

    expect(mocks.update).toHaveBeenCalledWith(
      databaseFields,
    )
  })

  it('handles simultaneous creation conflicts', async () => {
    mocks.updateMaybeSingle
      .mockResolvedValueOnce({
        data: null,
        error: null,
      })
      .mockResolvedValueOnce({
        data: savedCharacter,
        error: null,
      })

    mocks.insertSingle.mockResolvedValue({
      data: null,
      error: {
        code: '23505',
        message: 'Unique constraint violation',
      },
    })

    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(200)

    expect(mocks.update).toHaveBeenCalledTimes(2)

    expect(mocks.insert).toHaveBeenCalledTimes(1)

    expect(response.body.character.id).toBe(
      'character-123',
    )
  })

  it('returns 409 if a conflicting character disappears', async () => {
    mocks.updateMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    mocks.insertSingle.mockResolvedValue({
      data: null,
      error: {
        code: '23505',
        message: 'Unique constraint violation',
      },
    })

    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(409)

    expect(response.body).toEqual({
      error: 'Character changed. Please retry.',
    })
  })

  it('handles database update errors safely', async () => {
    mocks.updateMaybeSingle.mockResolvedValue({
      data: null,
      error: {
        code: '42501',
        message: 'Sensitive database information',
      },
    })

    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Sensitive database information',
    )
  })

  it('handles database insertion errors safely', async () => {
    mocks.updateMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    })

    mocks.insertSingle.mockResolvedValue({
      data: null,
      error: {
        code: '42501',
        message: 'Sensitive insertion error',
      },
    })

    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Sensitive insertion error',
    )
  })

  it('handles unexpected database failures safely', async () => {
    mocks.updateMaybeSingle.mockRejectedValue(
      new Error('Internal database connection failure'),
    )

    const response = await request(app)
      .put('/api/characters/me')
      .set('Authorization', 'Bearer valid-token')
      .send(validCharacter)

    expect(response.status).toBe(503)

    expect(response.body).toEqual({
      error: 'Character storage unavailable',
    })

    expect(response.text).not.toContain(
      'Internal database connection failure',
    )
  })
})