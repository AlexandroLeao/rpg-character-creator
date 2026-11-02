
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

/*
 * ADVENTURE FILES
 * CHARACTER DELETION INTERFACE TESTS
 *
 * All API requests are mocked.
 * No real character is deleted.
 */

const mocks = vi.hoisted(() => ({
  getMyCharacter: vi.fn(),
  deleteMyCharacter: vi.fn(),
}))

vi.mock('./lib/characterApi', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('./lib/characterApi')>()

  return {
    ...original,
    getMyCharacter: mocks.getMyCharacter,
    deleteMyCharacter: mocks.deleteMyCharacter,
  }
})

/* ==========================================
   SAVED CHARACTER
   ========================================== */

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
  updatedAt: '2026-11-01T18:00:00Z',
}

/* ==========================================
   HELPERS
   ========================================== */

function clickButton(name: string) {
  fireEvent.click(
    screen.getByRole('button', {
      name,
    }),
  )
}

async function openDeleteDialog(
  language: 'pt' | 'en' = 'pt',
) {
  render(
    <CharacterDashboard
      accessToken="valid-token"
      language={language}
    />,
  )

  const deleteButton =
    await screen.findByRole('button', {
      name:
        language === 'pt'
          ? 'Excluir personagem'
          : 'Delete character',
    })

  fireEvent.click(deleteButton)

  return screen.getByRole('alertdialog')
}

/* ==========================================
   TESTS
   ========================================== */

describe('Character deletion interface', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    mocks.getMyCharacter.mockResolvedValue(
      savedCharacter,
    )

    mocks.deleteMyCharacter.mockResolvedValue(
      undefined,
    )
  })

  afterEach(() => {
    cleanup()
  })

  /*
   * TEST 01
   * EMPTY DASHBOARD
   */

  it('does not offer deletion without a saved character', async () => {
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
      screen.queryByRole('button', {
        name: 'Excluir personagem',
      }),
    ).toBeNull()

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()
  })

  /*
   * TEST 02
   * OPEN CONFIRMATION
   */

  it('opens confirmation without deleting', async () => {
    const dialog = await openDeleteDialog()

    expect(dialog).toBeTruthy()

    expect(
      screen.getByRole('heading', {
        name: 'EXCLUIR PERSONAGEM?',
      }),
    ).toBeTruthy()

    expect(
      dialog.textContent,
    ).toContain('Luna')

    expect(
      screen.getByText(
        'ESTA AÇÃO NÃO PODE SER DESFEITA.',
      ),
    ).toBeTruthy()

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()

    expect(document.activeElement).toBe(
      screen.getByRole('button', {
        name: 'CANCELAR',
      }),
    )
  })

  /*
   * TEST 03
   * CANCEL CONFIRMATION
   */

  it('cancels deletion and preserves the character', async () => {
    await openDeleteDialog()

    clickButton('CANCELAR')

    expect(
      screen.queryByRole('alertdialog'),
    ).toBeNull()

    expect(
      screen.getByRole('heading', {
        name: 'Luna',
      }),
    ).toBeTruthy()

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()

    /*
     * Focus must return after the
     * Delete button is re-enabled.
     */

    expect(document.activeElement).toBe(
      screen.getByRole('button', {
        name: 'Excluir personagem',
      }),
    )
  })

  /*
   * TEST 04
   * ESCAPE KEY
   */

  it('closes confirmation with Escape', async () => {
    const dialog = await openDeleteDialog()

    fireEvent.keyDown(dialog, {
      key: 'Escape',
      code: 'Escape',
    })

    expect(
      screen.queryByRole('alertdialog'),
    ).toBeNull()

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()
  })

  /*
   * TEST 05
   * KEYBOARD FOCUS
   */

  it('keeps Tab navigation inside confirmation', async () => {
    await openDeleteDialog()

    const cancelButton = screen.getByRole(
      'button',
      {
        name: 'CANCELAR',
      },
    )

    const confirmButton = screen.getByRole(
      'button',
      {
        name: 'EXCLUIR DEFINITIVAMENTE',
      },
    )

    expect(document.activeElement).toBe(
      cancelButton,
    )

    fireEvent.keyDown(cancelButton, {
      key: 'Tab',
      shiftKey: true,
    })

    expect(document.activeElement).toBe(
      confirmButton,
    )

    fireEvent.keyDown(confirmButton, {
      key: 'Tab',
    })

    expect(document.activeElement).toBe(
      cancelButton,
    )
  })

  /*
   * TEST 06
   * CONFIRMED DELETION
   */

  it('deletes only after confirmation and returns to creation', async () => {
    const onCreatorStepChange = vi.fn()

    render(
      <CharacterDashboard
        accessToken="valid-token"
        language="pt"
        onCreatorStepChange={onCreatorStepChange}
      />,
    )

    /*
     * Wait for the saved character
     * to finish loading before
     * clicking the Delete button.
     */

    const deleteButton =
      await screen.findByRole('button', {
        name: 'Excluir personagem',
      })

    fireEvent.click(deleteButton)

    expect(
      screen.getByRole('alertdialog'),
    ).toBeTruthy()

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()

    clickButton(
      'EXCLUIR DEFINITIVAMENTE',
    )

    await waitFor(() => {
      expect(
        mocks.deleteMyCharacter,
      ).toHaveBeenCalledTimes(1)
    })

    expect(
      mocks.deleteMyCharacter,
    ).toHaveBeenCalledWith(
      'valid-token',
    )

    expect(
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    ).toBeTruthy()

    expect(
      screen.queryByRole('heading', {
        name: 'Luna',
      }),
    ).toBeNull()

    expect(
      screen.queryByRole('alertdialog'),
    ).toBeNull()

    expect(
      onCreatorStepChange,
    ).toHaveBeenCalledWith(null)
  })

  /*
   * TEST 07
   * FAILURE AND RETRY
   */

  it('preserves the character after failure and allows retry', async () => {
    mocks.deleteMyCharacter
      .mockRejectedValueOnce(
        new CharacterApiError('unavailable'),
      )
      .mockResolvedValueOnce(undefined)

    await openDeleteDialog()

    clickButton(
      'EXCLUIR DEFINITIVAMENTE',
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      'Não foi possível excluir o personagem. Verifique sua conexão e tente novamente.',
    )

    expect(
      screen.getByRole('heading', {
        name: 'Luna',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('alertdialog'),
    ).toBeTruthy()

    expect(
      mocks.deleteMyCharacter,
    ).toHaveBeenCalledTimes(1)

    clickButton(
      'EXCLUIR DEFINITIVAMENTE',
    )

    await waitFor(() => {
      expect(
        mocks.deleteMyCharacter,
      ).toHaveBeenCalledTimes(2)
    })

    expect(
      await screen.findByRole('button', {
        name: 'Criar Personagem',
      }),
    ).toBeTruthy()
  })

  /*
   * TEST 08
   * DUPLICATE REQUEST PROTECTION
   */

  it('prevents repeated deletion requests while pending', async () => {
    mocks.deleteMyCharacter.mockReturnValue(
      new Promise<void>(() => undefined),
    )

    await openDeleteDialog()

    clickButton(
      'EXCLUIR DEFINITIVAMENTE',
    )

    const deletingButton = screen.getByRole(
      'button',
      {
        name: 'EXCLUINDO...',
      },
    ) as HTMLButtonElement

    expect(deletingButton.disabled).toBe(true)

    const cancelButton = screen.getByRole(
      'button',
      {
        name: 'CANCELAR',
      },
    ) as HTMLButtonElement

    expect(cancelButton.disabled).toBe(true)

    fireEvent.click(deletingButton)

    expect(
      mocks.deleteMyCharacter,
    ).toHaveBeenCalledTimes(1)
  })

  /*
   * TEST 09
   * ENGLISH INTERFACE
   */

  it('supports English confirmation and cancellation', async () => {
    await openDeleteDialog('en')

    expect(
      screen.getByRole('heading', {
        name: 'DELETE CHARACTER?',
      }),
    ).toBeTruthy()

    expect(
      screen.getByText(
        'THIS ACTION CANNOT BE UNDONE.',
      ),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'DELETE PERMANENTLY',
      }),
    ).toBeTruthy()

    clickButton('CANCEL')

    expect(
      screen.queryByRole('alertdialog'),
    ).toBeNull()

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()
  })

  /*
   * TEST 10
   * SESSION SAFETY
   */

  it('does not confirm deletion under a different access token', async () => {
    const { rerender } = render(
      <CharacterDashboard
        accessToken="original-token"
        language="pt"
      />,
    )

    const deleteButton =
      await screen.findByRole('button', {
        name: 'Excluir personagem',
      })

    fireEvent.click(deleteButton)

    rerender(
      <CharacterDashboard
        accessToken="different-token"
        language="pt"
      />,
    )

    clickButton(
      'EXCLUIR DEFINITIVAMENTE',
    )

    expect(
      mocks.deleteMyCharacter,
    ).not.toHaveBeenCalled()

    expect(
      screen.queryByRole('alertdialog'),
    ).toBeNull()
  })
})
