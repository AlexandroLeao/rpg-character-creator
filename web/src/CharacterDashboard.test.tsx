// @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { CharacterDashboard } from './CharacterDashboard'

import { CharacterApiError } from './lib/characterApi'

const mocks = vi.hoisted(() => ({
  getMyCharacter: vi.fn(),
}))

vi.mock('./lib/characterApi', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('./lib/characterApi')>()

  return {
    ...original,
    getMyCharacter: mocks.getMyCharacter,
  }
})

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

describe('Character dashboard', () => {
  beforeEach(() => {
    mocks.getMyCharacter.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows a loading state', () => {
    mocks.getMyCharacter.mockReturnValue(
      new Promise(() => undefined),
    )

    render(
      <CharacterDashboard accessToken="valid-token" />,
    )

    expect(
      screen.getByText('Carregando personagem...'),
    ).toBeTruthy()

    expect(mocks.getMyCharacter).toHaveBeenCalledWith(
      'valid-token',
      expect.any(AbortSignal),
    )
  })

  it('shows an empty state when no character exists', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard accessToken="valid-token" />,
    )

    expect(
      await screen.findByText(
        'Você ainda não criou seu personagem.',
      ),
    ).toBeTruthy()
  })

  it('displays the saved character', async () => {
    mocks.getMyCharacter.mockResolvedValue(
      savedCharacter,
    )

    render(
      <CharacterDashboard accessToken="valid-token" />,
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Eldrin',
      }),
    ).toBeTruthy()

    expect(screen.getByText('mage')).toBeTruthy()
    expect(screen.getByText('elf')).toBeTruthy()
    expect(screen.getByText('scholar')).toBeTruthy()
    expect(screen.getByText('staff')).toBeTruthy()
  })

  it.each([
    'unauthorized',
    'forbidden',
  ] as const)(
    'handles %s authentication errors',
    async (kind) => {
      mocks.getMyCharacter.mockRejectedValue(
        new CharacterApiError(kind),
      )

      render(
        <CharacterDashboard accessToken="valid-token" />,
      )

      expect(
        await screen.findByRole('alert'),
      ).toHaveProperty(
        'textContent',
        'Sua sessão não pôde ser validada. Entre novamente.',
      )
    },
  )

  it('handles unavailable API errors', async () => {
    mocks.getMyCharacter.mockRejectedValue(
      new CharacterApiError('unavailable'),
    )

    render(
      <CharacterDashboard accessToken="valid-token" />,
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      'Não foi possível carregar seu personagem.',
    )
  })

  it('retries after a failed request', async () => {
    mocks.getMyCharacter
      .mockRejectedValueOnce(
        new Error('Network failure'),
      )
      .mockResolvedValueOnce(null)

    render(
      <CharacterDashboard accessToken="valid-token" />,
    )

    await screen.findByRole('alert')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Tentar novamente',
      }),
    )

    expect(
      await screen.findByText(
        'Você ainda não criou seu personagem.',
      ),
    ).toBeTruthy()

    expect(
      mocks.getMyCharacter,
    ).toHaveBeenCalledTimes(2)
  })

  it('aborts the request when the component unmounts', () => {
    mocks.getMyCharacter.mockReturnValue(
      new Promise(() => undefined),
    )

    const { unmount } = render(
      <CharacterDashboard accessToken="valid-token" />,
    )

    const signal = mocks.getMyCharacter
      .mock.calls[0][1] as AbortSignal

    expect(signal.aborted).toBe(false)

    unmount()

    expect(signal.aborted).toBe(true)
  })
})