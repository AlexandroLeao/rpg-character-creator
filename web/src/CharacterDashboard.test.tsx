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

/*
 * API MOCK
 */

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

/*
 * SAVED CHARACTER MOCK
 */

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

/*
 * CHARACTER DASHBOARD TESTS
 */

describe('Character dashboard', () => {
  beforeEach(() => {
    mocks.getMyCharacter.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  /*
   * TEST 01
   * PORTUGUESE LOADING STATE
   */

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

  /*
   * TEST 02
   * PORTUGUESE EMPTY STATE
   */

  it('shows the Portuguese empty state', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    ).toBeTruthy()

    expect(
      screen.queryByText(
        'Você ainda não criou seu personagem.',
      ),
    ).toBeNull()
  })

  /*
   * TEST 03
   * ENGLISH EMPTY STATE
   */

  it('shows the English empty state', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="en"
      />,
    )

    expect(
      await screen.findByRole('button', {
        name: 'Create Character',
      }),
    ).toBeTruthy()

    expect(
      screen.queryByText(
        'You have not created a character yet.',
      ),
    ).toBeNull()
  })

  /*
   * TEST 04
   * OPEN AND CLOSE CHARACTER CREATOR
   */

  it('opens the character creator from the empty state', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    const createButton = await screen.findByRole('button', {
      name: 'Criar Personagem',
    })

    fireEvent.click(createButton)

    expect(
      screen.getByRole('heading', {
        name: 'ESCOLHA SUA CLASSE',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Guerreiro',
      }),
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VOLTAR',
      }),
    )

    expect(
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    ).toBeTruthy()
  })

  /*
   * TEST 05
   * ARTWORK CHANGES ONLY ON CLICK
   */

  it('changes artwork only when a class is selected', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    )

    const mageButton = screen.getByRole('button', {
      name: 'Mago',
    })

    const artwork = document.querySelector(
      '.character-class-step__visual img',
    )

    expect(artwork).not.toBeNull()

    expect(
      artwork?.getAttribute('src'),
    ).toBe('/art/characters/classes-together.png')

    /*
     * Hover must not change the selected artwork.
     */

    fireEvent.mouseEnter(mageButton)

    expect(
      artwork?.getAttribute('src'),
    ).toBe('/art/characters/classes-together.png')

    /*
     * Focus alone must not select a class.
     */

    fireEvent.focus(mageButton)

    expect(
      artwork?.getAttribute('src'),
    ).toBe('/art/characters/classes-together.png')

    expect(
      mageButton.getAttribute('aria-pressed'),
    ).toBe('false')

    /*
     * Clicking selects the class.
     */

    fireEvent.click(mageButton)

    expect(
      artwork?.getAttribute('src'),
    ).toBe('/art/characters/mage.png')

    expect(
      mageButton.getAttribute('aria-pressed'),
    ).toBe('true')

    /*
     * Moving the mouse away must preserve
     * the currently selected class.
     */

    fireEvent.mouseLeave(mageButton)

    expect(
      artwork?.getAttribute('src'),
    ).toBe('/art/characters/mage.png')
  })

  /*
   * TEST 06
   * PRESERVE CLASS AND NAME BETWEEN STEPS
   */

  it('preserves class and name when returning from step two', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    )

    /*
     * Select the Mage class.
     */

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Mago',
      }),
    )

    /*
     * Enter the character name.
     */

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    fireEvent.change(nameInput, {
      target: {
        value: 'Luna',
      },
    })

    expect(nameInput.value).toBe('Luna')

    /*
     * Continue to step two.
     */

    fireEvent.click(
      screen.getByRole('button', {
        name: 'CONTINUAR',
      }),
    )

    /*
     * Verify the new Origins screen.
     */

    expect(
      await screen.findByText('ANCESTRALIDADE'),
    ).toBeTruthy()

    expect(
      screen.getByText('ORIGEM'),
    ).toBeTruthy()

    /*
     * Return to step one.
     */

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VOLTAR',
      }),
    )

    /*
     * Verify that the selected class
     * remains unchanged.
     */

    const selectedMage = screen.getByRole('button', {
      name: 'Mago',
    })

    expect(
      selectedMage.getAttribute('aria-pressed'),
    ).toBe('true')

    /*
     * Verify that the name is preserved.
     */

    const restoredName = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    expect(restoredName.value).toBe('Luna')
  })

  /*
   * TEST 07
   * PORTUGUESE CHARACTER DETAILS
   */

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

  /*
   * TEST 08
   * ENGLISH CHARACTER DETAILS
   */

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

  /*
   * TEST 09
   * LANGUAGE SWITCHING
   */

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

    expect(
      screen.getByText('Mage'),
    ).toBeTruthy()

    expect(
      mocks.getMyCharacter,
    ).toHaveBeenCalledTimes(1)
  })

  /*
   * TESTS 10 AND 11
   * AUTHENTICATION ERRORS
   */

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

  /*
   * TEST 12
   * UNAVAILABLE API IN PORTUGUESE
   */

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

  /*
   * TEST 13
   * UNAVAILABLE API IN ENGLISH
   */

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

  /*
   * TEST 14
   * RETRY AFTER FAILED REQUEST
   */

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
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    ).toBeTruthy()

    expect(
      mocks.getMyCharacter,
    ).toHaveBeenCalledTimes(2)
  })

  /*
   * TEST 15
   * ABORT REQUEST ON UNMOUNT
   */

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

  it('shows the saved class artwork and grouped character sheet', async () => {
    mocks.getMyCharacter.mockResolvedValue(savedCharacter)

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
      />,
    )

    expect(await screen.findByRole('heading', {
      name: 'Eldrin',
    })).toBeTruthy()

    expect(screen.getByRole('img').getAttribute('src'))
      .toBe('/art/characters/mage.png')

    expect(screen.getByRole('heading', {
      name: 'ORIGENS',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'EQUIPAMENTO',
    })).toBeTruthy()
  })
})