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
  waitFor,
} from '@testing-library/react'

import { CharacterDashboard } from './CharacterDashboard'

import { CharacterApiError } from './lib/characterApi'

/* ==========================================
   ADVENTURE FILES
   CHARACTER SAVE FLOW TESTS
   ========================================== */

const mocks = vi.hoisted(() => ({
  getMyCharacter: vi.fn(),
  saveMyCharacter: vi.fn(),
}))

vi.mock('./lib/characterApi', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('./lib/characterApi')>()

  return {
    ...original,
    getMyCharacter: mocks.getMyCharacter,
    saveMyCharacter: mocks.saveMyCharacter,
  }
})

const savedCharacter = {
  id: 'character-123',

  name: 'Luna',
  characterClass: 'mage',

  ancestry: 'elf',
  background: 'scholar',

  weapon: 'sword',
  artifact: 'arcane-seal',

  personality: 'brave',
  aura: 'fire',

  companion: 'owl',
  motivation: 'protection',

  createdAt: '2026-10-31T21:00:00Z',
  updatedAt: '2026-10-31T21:00:00Z',
}

function clickButton(name: string) {
  fireEvent.click(
    screen.getByRole('button', {
      name,
    }),
  )
}

async function advanceToFinalReview() {
  render(
    <CharacterDashboard
      accessToken="valid-token"
      language="pt"
    />,
  )

  const createButton =
    await screen.findByRole('button', {
      name: 'Criar Personagem',
    })

  fireEvent.click(createButton)

  /* STEP 01 */

  clickButton('Mago')

  fireEvent.change(
    screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ),
    {
      target: {
        value: 'Luna',
      },
    },
  )

  clickButton('CONTINUAR')

  /* STEP 02 */

  clickButton('Elfo')
  clickButton('Estudioso')
  clickButton('CONTINUAR')

  /* STEP 03 */

  clickButton('Espada')
  clickButton('Selo Arcano')
  clickButton('CONTINUAR')

  /* STEP 04 */

  clickButton('Corajoso')
  clickButton('Fogo')
  clickButton('CONTINUAR')

  /* STEP 05 */

  clickButton('Coruja')
  clickButton('Proteção')
  clickButton('CONTINUAR')

  return screen.getByRole('button', {
    name: 'SALVAR',
  }) as HTMLButtonElement
}

describe('Character saving flow', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    mocks.getMyCharacter.mockResolvedValue(null)

    mocks.saveMyCharacter.mockResolvedValue(
      savedCharacter,
    )
  })

  afterEach(() => {
    cleanup()
  })

  it('saves all selections and returns to the dashboard', async () => {
    const saveButton =
      await advanceToFinalReview()

    expect(saveButton.disabled).toBe(false)

    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(
        mocks.saveMyCharacter,
      ).toHaveBeenCalledTimes(1)
    })

    expect(
      mocks.saveMyCharacter,
    ).toHaveBeenCalledWith(
      'valid-token',
      {
        name: 'LUNA',
        characterClass: 'mage',
        ancestry: 'elf',
        background: 'scholar',
        weapon: 'sword',
        artifact: 'arcane-seal',
        personality: 'brave',
        aura: 'fire',
        companion: 'owl',
        motivation: 'protection',
      },
    )

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Meu personagem',
        }),
      ).toBeTruthy()
    })

    expect(
      screen.queryByRole('button', {
        name: 'SALVAR',
      }),
    ).toBeNull()
  })

  it('preserves the character when saving fails', async () => {
    mocks.saveMyCharacter.mockRejectedValueOnce(
      new CharacterApiError('unavailable'),
    )

    const saveButton =
      await advanceToFinalReview()

    fireEvent.click(saveButton)

    expect(
      await screen.findByRole('alert'),
    ).toBeTruthy()

    expect(
      screen.getByText('LUNA'),
    ).toBeTruthy()

    const retryButton = screen.getByRole(
      'button',
      {
        name: 'SALVAR',
      },
    ) as HTMLButtonElement

    expect(retryButton.disabled).toBe(false)

    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(
        mocks.saveMyCharacter,
      ).toHaveBeenCalledTimes(2)
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Meu personagem',
        }),
      ).toBeTruthy()
    })
  })

  it('prevents repeated clicks while saving', async () => {
    mocks.saveMyCharacter.mockReturnValue(
      new Promise(() => undefined),
    )

    const saveButton =
      await advanceToFinalReview()

    fireEvent.click(saveButton)

    const savingButton = screen.getByRole(
      'button',
      {
        name: 'SALVANDO...',
      },
    ) as HTMLButtonElement

    expect(savingButton.disabled).toBe(true)

    fireEvent.click(savingButton)

    expect(
      mocks.saveMyCharacter,
    ).toHaveBeenCalledTimes(1)

    const backButton = screen.getByRole(
      'button',
      {
        name: 'VOLTAR',
      },
    ) as HTMLButtonElement

    expect(backButton.disabled).toBe(true)
  })
})