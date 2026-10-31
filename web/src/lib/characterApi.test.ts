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
  saveMyCharacter,
  type CharacterSaveInput,
} from './characterApi'

/* ==========================================
   ADVENTURE FILES
   CHARACTER API CLIENT TESTS
   ========================================== */

const fetchMock = vi.fn()

/* ==========================================
   SAVED CHARACTER
   ========================================== */

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
  motivation: 'knowledge',

  createdAt: '2026-10-29T10:00:00Z',
  updatedAt: '2026-10-29T10:00:00Z',
}

/* ==========================================
   CHARACTER SAVE INPUT
   ========================================== */

const characterInput: CharacterSaveInput = {
  name: 'Eldrin',
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
   TESTS
   ========================================== */

describe('Character API client', () => {
  beforeEach(() => {
    fetchMock.mockReset()

    vi.stubGlobal(
      'fetch',
      fetchMock,
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  /* ========================================
     GET CHARACTER
     ======================================== */

  it('retrieves the authenticated user character', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        {
          status: 200,
        },
      ),
    )

    const result =
      await getMyCharacter('valid-token')

    expect(result).toEqual(savedCharacter)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      {
        method: 'GET',

        headers: {
          Authorization:
            'Bearer valid-token',
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
      new Response(
        null,
        {
          status: 404,
        },
      ),
    )

    const result =
      await getMyCharacter('valid-token')

    expect(result).toBeNull()
  })

  /* ========================================
     GET LEGACY CHARACTER
     ======================================== */

  it('accepts existing characters without motivation', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: {
            ...savedCharacter,
            motivation: null,
          },
        }),
        {
          status: 200,
        },
      ),
    )

    const result =
      await getMyCharacter('valid-token')

    expect(result?.motivation).toBeNull()
  })

  it('rejects characters with missing motivation fields', async () => {
    const incompleteCharacter = {
      ...savedCharacter,
    }

    const incompleteRecord:
      Record<string, unknown> = {
        ...incompleteCharacter,
      }

    delete incompleteRecord.motivation

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: incompleteRecord,
        }),
        {
          status: 200,
        },
      ),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'invalidResponse',
    })
  })

  /* ========================================
     AUTHENTICATION ERRORS
     ======================================== */

  it('handles unauthorized responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        null,
        {
          status: 401,
        },
      ),
    )

    await expect(
      getMyCharacter('invalid-token'),
    ).rejects.toMatchObject({
      kind: 'unauthorized',
    })
  })

  it('handles forbidden responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        null,
        {
          status: 403,
        },
      ),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'forbidden',
    })
  })

  /* ========================================
     API ERRORS
     ======================================== */

  it('handles unavailable API responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        null,
        {
          status: 503,
        },
      ),
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
        {
          status: 200,
        },
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
        {
          status: 200,
        },
      ),
    )

    await expect(
      getMyCharacter('valid-token'),
    ).rejects.toMatchObject({
      kind: 'invalidResponse',
    })
  })

  /* ========================================
     ABORT SIGNAL
     ======================================== */

  it('forwards the abort signal to fetch', async () => {
    const controller =
      new AbortController()

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        {
          status: 200,
        },
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

  /* ========================================
     SAVE CHARACTER
     ======================================== */

  it('saves a complete character', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        {
          status: 201,
        },
      ),
    )

    const result = await saveMyCharacter(
      'valid-token',
      characterInput,
    )

    expect(result).toEqual(savedCharacter)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            'Bearer valid-token',
        },

        body: JSON.stringify(
          characterInput,
        ),

        signal: undefined,
      },
    )
  })

  it('updates an existing character', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        {
          status: 200,
        },
      ),
    )

    const result = await saveMyCharacter(
      'valid-token',
      characterInput,
    )

    expect(result.id).toBe(
      'character-123',
    )

    expect(result.motivation).toBe(
      'knowledge',
    )
  })

  it('rejects saving without authentication', async () => {
    await expect(
      saveMyCharacter(
        '',
        characterInput,
      ),
    ).rejects.toMatchObject({
      kind: 'unauthorized',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('handles invalid character requests', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        null,
        {
          status: 400,
        },
      ),
    )

    await expect(
      saveMyCharacter(
        'valid-token',
        characterInput,
      ),
    ).rejects.toMatchObject({
      kind: 'invalidRequest',
    })
  })

  it('handles character conflicts', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        null,
        {
          status: 409,
        },
      ),
    )

    await expect(
      saveMyCharacter(
        'valid-token',
        characterInput,
      ),
    ).rejects.toMatchObject({
      kind: 'conflict',
    })
  })

  it('handles unavailable saving services', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        null,
        {
          status: 503,
        },
      ),
    )

    await expect(
      saveMyCharacter(
        'valid-token',
        characterInput,
      ),
    ).rejects.toMatchObject({
      kind: 'unavailable',
    })
  })

  it('rejects save responses without motivation', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: {
            ...savedCharacter,
            motivation: null,
          },
        }),
        {
          status: 201,
        },
      ),
    )

    await expect(
      saveMyCharacter(
        'valid-token',
        characterInput,
      ),
    ).rejects.toMatchObject({
      kind: 'invalidResponse',
    })
  })

  it('forwards save abort signals', async () => {
    const controller =
      new AbortController()

    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          character: savedCharacter,
        }),
        {
          status: 201,
        },
      ),
    )

    await saveMyCharacter(
      'valid-token',
      characterInput,
      controller.signal,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',

      expect.objectContaining({
        signal: controller.signal,
      }),
    )
  })

  /* ========================================
     SAFE ERROR TYPE
     ======================================== */

  it('exposes a safe error type', () => {
    const error =
      new CharacterApiError('unavailable')

    expect(error.name).toBe(
      'CharacterApiError',
    )

    expect(error.kind).toBe(
      'unavailable',
    )

    expect(error.message).toBe(
      'unavailable',
    )
  })
})