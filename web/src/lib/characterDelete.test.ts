
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  deleteMyCharacter,
} from './characterApi'

/*
 * ADVENTURE FILES
 * CHARACTER DELETE API TESTS
 *
 * Verifies authenticated deletion,
 * successful responses and errors.
 *
 * All network requests are mocked.
 * No real character is deleted.
 */

const fetchMock = vi.fn()

describe('Character deletion API', () => {
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

  /*
   * TEST 01
   * SUCCESSFUL DELETION
   */

  it('sends an authenticated DELETE request', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    )

    const result = await deleteMyCharacter(
      'valid-token',
    )

    expect(result).toBeUndefined()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      {
        method: 'DELETE',

        headers: {
          Authorization:
            'Bearer valid-token',
        },

        signal: undefined,
      },
    )
  })

  /*
   * TEST 02
   * AUTHENTICATION REQUIRED
   */

  it('rejects deletion without an access token', async () => {
    await expect(
      deleteMyCharacter(''),
    ).rejects.toMatchObject({
      kind: 'unauthorized',
    })

    expect(
      fetchMock,
    ).not.toHaveBeenCalled()
  })

  /*
   * TEST 03
   * ABORT SIGNAL
   */

  it('forwards the abort signal', async () => {
    const controller =
      new AbortController()

    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    )

    await deleteMyCharacter(
      'valid-token',
      controller.signal,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      expect.objectContaining({
        method: 'DELETE',
        signal: controller.signal,
      }),
    )
  })

  /*
   * TESTS 04 TO 09
   * HTTP ERROR HANDLING
   */

  it.each([
    [400, 'invalidRequest'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'unavailable'],
    [409, 'conflict'],
    [503, 'unavailable'],
  ] as const)(
    'handles HTTP %i as %s',
    async (status, expectedKind) => {
      fetchMock.mockResolvedValue(
        new Response(null, {
          status,
        }),
      )

      await expect(
        deleteMyCharacter('valid-token'),
      ).rejects.toMatchObject({
        kind: expectedKind,
      })

      expect(
        fetchMock,
      ).toHaveBeenCalledTimes(1)
    },
  )

  /*
   * TEST 10
   * NETWORK FAILURE
   */

  it('propagates network failures safely', async () => {
    fetchMock.mockRejectedValue(
      new TypeError('Network failure'),
    )

    await expect(
      deleteMyCharacter('valid-token'),
    ).rejects.toThrow(
      'Network failure',
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/characters/me',
      expect.objectContaining({
        method: 'DELETE',
      }),
    )
  })
})
