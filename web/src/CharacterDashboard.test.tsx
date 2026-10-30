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

  it('shows the Portuguese loading state', () => {
    mocks.getMyCharacter.mockReturnValue(
      new Promise(() => undefined),
    )

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(
      screen.getByText('Carregando personagem...'),
    ).toBeTruthy()

    expect(mocks.getMyCharacter).toHaveBeenCalledWith(
      'valid-token',
      expect.any(AbortSignal),
    )
  })

  it('shows the Portuguese empty state', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByText(
        'Você ainda não criou seu personagem.',
      ),
    ).toBeTruthy()
  })

  it('shows the English empty state', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="en"
      />,
    )

    expect(
      await screen.findByText(
        'You have not created a character yet.',
      ),
    ).toBeTruthy()
  })

  it('displays localized Portuguese character details', async () => {
    mocks.getMyCharacter.mockResolvedValue(savedCharacter)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Eldrin',
      }),
    ).toBeTruthy()

    expect(screen.getByText('Mago')).toBeTruthy()
    expect(screen.getByText('Elfo')).toBeTruthy()
    expect(screen.getByText('Estudioso')).toBeTruthy()
    expect(screen.getByText('Cajado')).toBeTruthy()
    expect(screen.getByText('Cristal Lunar')).toBeTruthy()
  })

  it('displays localized English character details', async () => {
    mocks.getMyCharacter.mockResolvedValue(savedCharacter)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="en"
      />,
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Eldrin',
      }),
    ).toBeTruthy()

    expect(screen.getByText('Mage')).toBeTruthy()
    expect(screen.getByText('Elf')).toBeTruthy()
    expect(screen.getByText('Scholar')).toBeTruthy()
    expect(screen.getByText('Staff')).toBeTruthy()
    expect(screen.getByText('Moon Crystal')).toBeTruthy()
  })

  it('switches language without fetching the character again', async () => {
    mocks.getMyCharacter.mockResolvedValue(savedCharacter)

    const { rerender } = render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByText('Mago'),
    ).toBeTruthy()

    rerender(
      <CharacterDashboard
        accessToken="valid-token"
        language="en"
      />,
    )

    expect(screen.getByText('Mage')).toBeTruthy()

    expect(
      mocks.getMyCharacter,
    ).toHaveBeenCalledTimes(1)
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
        <CharacterDashboard
          accessToken="valid-token"
          language="pt"
        />,
      )

      expect(
        await screen.findByRole('alert'),
      ).toHaveProperty(
        'textContent',
        'Sua sessão não pôde ser validada. Entre novamente.',
      )
    },
  )

  it('handles unavailable API errors in Portuguese', async () => {
    mocks.getMyCharacter.mockRejectedValue(
      new CharacterApiError('unavailable'),
    )

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      'Não foi possível carregar seu personagem.',
    )
  })

  it('handles unavailable API errors in English', async () => {
    mocks.getMyCharacter.mockRejectedValue(
      new CharacterApiError('unavailable'),
    )

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="en"
      />,
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      'Unable to load your character.',
    )
  })

  it('retries after a failed request', async () => {
    mocks.getMyCharacter
      .mockRejectedValueOnce(
        new Error('Network failure'),
      )
      .mockResolvedValueOnce(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
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
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    const signal = mocks.getMyCharacter
      .mock.calls[0][1] as AbortSignal

    expect(signal.aborted).toBe(false)

    unmount()

    expect(signal.aborted).toBe(true)
  })
})