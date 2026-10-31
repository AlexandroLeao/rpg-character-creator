// @vitest-environment jsdom

import {
  afterEach,
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

import type { Language } from './lib/authTranslations'

import { CharacterCreator } from './CharacterCreator'

/*
 * ADVENTURE FILES
 * CHARACTER CREATOR TESTS
 *
 * Tests for steps 01 and 02.
 */

afterEach(() => {
  cleanup()
})

/*
 * HELPER
 *
 * Opens the creator and completes
 * the first step.
 */

function advanceToOrigins(language: Language = 'pt') {
  const onCancel = vi.fn()
  const onStepChange = vi.fn()

  render(
    <CharacterCreator
      language={language}
      onCancel={onCancel}
      onStepChange={onStepChange}
    />,
  )

  fireEvent.click(
    screen.getByRole('button', {
      name: language === 'pt' ? 'Mago' : 'Mage',
    }),
  )

  fireEvent.change(
    screen.getByLabelText(
      language === 'pt'
        ? 'NOME DO PERSONAGEM'
        : 'CHARACTER NAME',
    ),
    {
      target: {
        value: 'Luna',
      },
    },
  )

  fireEvent.click(
    screen.getByRole('button', {
      name:
        language === 'pt'
          ? 'CONTINUAR'
          : 'CONTINUE',
    }),
  )

  return {
    onCancel,
    onStepChange,
  }
}

/*
 * TEST 01
 * CLASS AND NAME VALIDATION
 */

describe('Character creator', () => {
  it('requires a class and a valid name before continuing', () => {
    render(
      <CharacterCreator
        language="pt"
        onCancel={vi.fn()}
      />,
    )

    const continueButton = screen.getByRole(
      'button',
      {
        name: 'CONTINUAR',
      },
    ) as HTMLButtonElement

    expect(continueButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Mago',
      }),
    )

    expect(continueButton.disabled).toBe(true)

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    )

    fireEvent.change(nameInput, {
      target: {
        value: 'L',
      },
    })

    expect(continueButton.disabled).toBe(true)

    fireEvent.change(nameInput, {
      target: {
        value: 'Luna',
      },
    })

    expect(continueButton.disabled).toBe(false)
  })

  /*
   * TEST 02
   * ORIGINS OPTIONS
   */

  it('displays all ancestry and background options', () => {
    advanceToOrigins()

    expect(
      screen.getByText('ANCESTRALIDADE'),
    ).toBeTruthy()

    expect(
      screen.getByText('ORIGEM'),
    ).toBeTruthy()

    const ancestryOptions = [
      'Humano',
      'Elfo',
      'Anão',
      'Orc',
      'Feérico',
      'Construto',
    ]

    const backgroundOptions = [
      'Nobre',
      'Estudioso',
      'Andarilho',
      'Guardião',
      'Artesão',
      'Fora da lei',
    ]

    for (const option of ancestryOptions) {
      expect(
        screen.getByRole('button', {
          name: option,
        }),
      ).toBeTruthy()
    }

    for (const option of backgroundOptions) {
      expect(
        screen.getByRole('button', {
          name: option,
        }),
      ).toBeTruthy()
    }
  })

  /*
   * TEST 03
   * ORIGINS VALIDATION
   */

  it('requires both origins selections before continuing', () => {
    advanceToOrigins()

    const continueButton = screen.getByRole(
      'button',
      {
        name: 'CONTINUAR',
      },
    ) as HTMLButtonElement

    expect(continueButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Elfo',
      }),
    )

    expect(continueButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Nobre',
      }),
    )

    expect(continueButton.disabled).toBe(false)

    expect(
      screen
        .getByRole('button', {
          name: 'Elfo',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    expect(
      screen
        .getByRole('button', {
          name: 'Nobre',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })

  /*
   * TEST 04
   * PRESERVE SELECTIONS ON BACK
   */

  it('preserves unfinished origins selections when returning to step one', () => {
    advanceToOrigins()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Anão',
      }),
    )

    /*
     * Return without selecting
     * a background.
     */

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VOLTAR',
      }),
    )

    /*
     * Class remains selected.
     */

    expect(
      screen
        .getByRole('button', {
          name: 'Mago',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    /*
     * Name remains unchanged.
     */

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    expect(nameInput.value).toBe('Luna')

    /*
     * Return to step 02.
     */

    fireEvent.click(
      screen.getByRole('button', {
        name: 'CONTINUAR',
      }),
    )

    /*
     * Ancestry remains selected.
     */

    expect(
      screen
        .getByRole('button', {
          name: 'Anão',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    /*
     * Continue is still disabled
     * because no background was selected.
     */

    const continueButton = screen.getByRole(
      'button',
      {
        name: 'CONTINUAR',
      },
    ) as HTMLButtonElement

    expect(continueButton.disabled).toBe(true)
  })

  /*
   * TEST 05
   * STEP 02 TO STEP 03
   */

  it('advances to equipment and preserves origins when returning', () => {
    const { onStepChange } = advanceToOrigins()

    expect(onStepChange).toHaveBeenCalledWith(2)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Feérico',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Guardião',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'CONTINUAR',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'EQUIPAMENTO',
      }),
    ).toBeTruthy()

    expect(onStepChange).toHaveBeenCalledWith(3)

    /*
     * Return to origins.
     */

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VOLTAR',
      }),
    )

    expect(
      screen
        .getByRole('button', {
          name: 'Feérico',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    expect(
      screen
        .getByRole('button', {
          name: 'Guardião',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })

  /*
   * TEST 06
   * ENGLISH TRANSLATIONS
   */

  it('displays origins options in English', () => {
    advanceToOrigins('en')

    expect(
      screen.getByText('ANCESTRY'),
    ).toBeTruthy()

    expect(
      screen.getByText('BACKGROUND'),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Human',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Fae',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Scholar',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Outlaw',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'BACK',
      }),
    ).toBeTruthy()
  })
})