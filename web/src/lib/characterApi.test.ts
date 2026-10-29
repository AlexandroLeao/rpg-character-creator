import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  CharacterApiError,
  getMyCharacter,
} from './characterApi'

const fetchMock = vi.fn()

const savedCharacter = {
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
}

describe('Character API client', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('retrieves the authenticated user character', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        { status: 200 },
      ),
    )

    const result = await getMyCharacter('valid-token')

    expect(result).toEqual(savedCharacter)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer valid-token',
        },
        signal: undefined,
      },
    )
  })

  it('rejects requests without an access token', async () => {
    await expect(
      getMyCharacter(''),
    ).rejects.toMatchObject({
      kind: 'unauthorized',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns null when no character exists', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 404 }),
    )

    const result = await getMyCharacter('valid-token')

    expect(result).toBeNull()
  })

  it('handles unauthorized responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 401 }),
    )

    await expect(
      getMyCharacter('invalid-token'),
    ).rejects.toMatchObject({
      kind: 'unauthorized',
    })
  })

  it('handles forbidden responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 403 }),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'forbidden',
    })
  })

  it('handles unavailable API responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 503 }),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'unavailable',
    })
  })

  it('rejects malformed JSON responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        'invalid-json',
        { status: 200 },
      ),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'invalidResponse',
    })
  })

  it('rejects incomplete character data', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: {
            id: 'character-123',
            name: 'Eldrin',
          },
        }),
        { status: 200 },
      ),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'invalidResponse',
    })
  })

  it('forwards the abort signal to fetch', async () => {
    const controller = new AbortController()

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        { status: 200 },
      ),
    )

    await getMyCharacter(
      'valid-token',
      controller.signal,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      expect.objectContaining({
        signal: controller.signal,
      }),
    )
  })

  it('exposes a safe error type', () => {
    const error = new CharacterApiError(
      'unavailable',
    )

    expect(error.name).toBe('CharacterApiError')
    expect(error.kind).toBe('unavailable')
    expect(error.message).toBe('unavailable')
  })
})