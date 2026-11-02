
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

import {
  CharacterApiError,
  type Character,
} from './lib/characterApi'

/*
 * ADVENTURE FILES
 * CHARACTER EDITING TESTS
 *
 * Tests the editing flow for
 * an existing saved character.
 */

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

/*
 * SAVED CHARACTER
 */

const savedCharacter: Character = {
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

const updatedCharacter: Character = {
  ...savedCharacter,
  name: 'Luna Nova',
  updatedAt: '2026-11-01T18:00:00Z',
}

/*
 * TEST HELPERS
 */

function clickButton(name: string) {
  fireEvent.click(
    screen.getByRole('button', {
      name,
    }),
  )
}

function expectSelected(name: string) {
  expect(
    screen
      .getByRole('button', { name })
      .getAttribute('aria-pressed'),
  ).toBe('true')
}

async function openEditing(
  language: 'pt' | 'en' = 'pt',
  character: Character = savedCharacter,
  onCreatorStepChange = vi.fn(),
) {
  mocks.getMyCharacter.mockResolvedValue(character)

  render(
    <CharacterDashboard
      accessToken="valid-token"
      language={language}
      onCreatorStepChange={onCreatorStepChange}
    />,
  )

  const editButton = await screen.findByRole(
    'button',
    {
      name:
        language === 'pt'
          ? 'Editar personagem'
          : 'Edit character',
    },
  )

  fireEvent.click(editButton)

  return onCreatorStepChange
}

function advanceToJourney() {
  /*
   * STEP 01 — IDENTITY
   */

  clickButton('CONTINUAR')

  /*
   * STEP 02 — ORIGINS
   */

  clickButton('CONTINUAR')

  /*
   * STEP 03 — EQUIPMENT
   */

  clickButton('CONTINUAR')

  /*
   * STEP 04 — ESSENCE
   */

  clickButton('CONTINUAR')
}

function advanceToReview() {
  advanceToJourney()

  /*
   * STEP 05 — JOURNEY
   */

  clickButton('CONTINUAR')
}

/*
 * TEST SETUP
 */

describe('Character editing flow', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    mocks.getMyCharacter.mockResolvedValue(
      savedCharacter,
    )

    mocks.saveMyCharacter.mockResolvedValue(
      updatedCharacter,
    )
  })

  afterEach(() => {
    cleanup()
  })

  /*
   * TEST 01
   * EXISTING DATA
   */

  it('opens editing with saved class and name', async () => {
    const onStepChange = await openEditing()

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    expect(nameInput.value).toBe('Luna')

    expectSelected('Mago')

    expect(
      onStepChange,
    ).toHaveBeenCalledWith(1)

    expect(
      mocks.saveMyCharacter,
    ).not.toHaveBeenCalled()
  })

  /*
   * TEST 02
   * CANCEL EDITING
   */

  it('cancels editing without saving changes', async () => {
    const onStepChange = await openEditing()

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    )

    fireEvent.change(nameInput, {
      target: {
        value: 'Nome Temporário',
      },
    })

    clickButton('VOLTAR')

    expect(
      await screen.findByRole('heading', {
        name: 'Luna',
      }),
    ).toBeTruthy()

    expect(
      mocks.saveMyCharacter,
    ).not.toHaveBeenCalled()

    expect(
      onStepChange,
    ).toHaveBeenLastCalledWith(null)

    /*
     * Reopening must restore persisted data,
     * not the canceled local changes.
     */

    clickButton('Editar personagem')

    const restoredInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    expect(restoredInput.value).toBe('Luna')
  })

  /*
   * TEST 03
   * RESTORE ALL SELECTIONS
   */

  it('restores all saved choices across the wizard', async () => {
    await openEditing()

    expectSelected('Mago')

    clickButton('CONTINUAR')

    expectSelected('Elfo')
    expectSelected('Estudioso')

    clickButton('CONTINUAR')

    expectSelected('Espada')
    expectSelected('Selo Arcano')

    clickButton('CONTINUAR')

    expectSelected('Corajoso')
    expectSelected('Fogo')

    clickButton('CONTINUAR')

    expectSelected('Coruja')
    expectSelected('Proteção')

    clickButton('CONTINUAR')

    expect(
      screen.getByRole('heading', {
        name: 'REVISÃO FINAL',
      }),
    ).toBeTruthy()

    const saveButton = screen.getByRole(
      'button',
      {
        name: 'SALVAR',
      },
    ) as HTMLButtonElement

    expect(saveButton.disabled).toBe(false)
  })

  /*
   * TEST 04
   * SAVE UPDATED CHARACTER
   */

  it('saves edited data and updates the character sheet', async () => {
    const onStepChange = await openEditing()

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    )

    fireEvent.change(nameInput, {
      target: {
        value: 'Luna Nova',
      },
    })

    advanceToReview()

    clickButton('SALVAR')

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
        name: 'Luna Nova',
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

    expect(
      await screen.findByRole('heading', {
        name: 'Luna Nova',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Editar personagem',
      }),
    ).toBeTruthy()

    expect(
      onStepChange,
    ).toHaveBeenLastCalledWith(null)
  })

  /*
   * TEST 05
   * SAVE FAILURE AND RETRY
   */

  it('keeps edited data when saving fails', async () => {
    mocks.saveMyCharacter
      .mockRejectedValueOnce(
        new CharacterApiError('unavailable'),
      )
      .mockResolvedValueOnce(updatedCharacter)

    await openEditing()

    fireEvent.change(
      screen.getByLabelText(
        'NOME DO PERSONAGEM',
      ),
      {
        target: {
          value: 'Luna Nova',
        },
      },
    )

    advanceToReview()

    clickButton('SALVAR')

    expect(
      await screen.findByRole('alert'),
    ).toBeTruthy()

    expect(
      screen.getByText(
        'Luna Nova',
      ),
    ).toBeTruthy()

    expect(
      mocks.saveMyCharacter,
    ).toHaveBeenCalledTimes(1)

    /*
     * Retry without losing the changes.
     */

    clickButton('SALVAR')

    await waitFor(() => {
      expect(
        mocks.saveMyCharacter,
      ).toHaveBeenCalledTimes(2)
    })

    expect(
      await screen.findByRole('heading', {
        name: 'Luna Nova',
      }),
    ).toBeTruthy()
  })

  /*
   * TEST 06
   * LEGACY CHARACTER
   */

  it('requires motivation for older saved characters', async () => {
    const legacyCharacter: Character = {
      ...savedCharacter,
      motivation: null,
    }

    await openEditing(
      'pt',
      legacyCharacter,
    )

    advanceToJourney()

    expectSelected('Coruja')

    expect(
      screen
        .getByRole('button', {
          name: 'Proteção',
        })
        .getAttribute('aria-pressed'),
    ).toBe('false')

    const continueButton = screen.getByRole(
      'button',
      {
        name: 'CONTINUAR',
      },
    ) as HTMLButtonElement

    expect(continueButton.disabled).toBe(true)

    clickButton('Proteção')

    expect(continueButton.disabled).toBe(false)

    clickButton('CONTINUAR')

    expect(
      screen.getByRole('button', {
        name: 'SALVAR',
      }),
    ).toBeTruthy()
  })

  /*
   * TEST 07
   * ENGLISH INTERFACE
   */

  it('supports editing and cancellation in English', async () => {
    await openEditing('en')

    expect(
      screen.getByRole('heading', {
        name: 'SELECT YOUR CLASS',
      }),
    ).toBeTruthy()

    const nameInput = screen.getByLabelText(
      'CHARACTER NAME',
    ) as HTMLInputElement

    expect(nameInput.value).toBe('Luna')

    expectSelected('Mage')

    clickButton('BACK')

    expect(
      await screen.findByRole('heading', {
        name: 'Luna',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Edit character',
      }),
    ).toBeTruthy()

    expect(
      mocks.saveMyCharacter,
    ).not.toHaveBeenCalled()
  })
})
