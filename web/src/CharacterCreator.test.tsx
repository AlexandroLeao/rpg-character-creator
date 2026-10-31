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
import { CharacterEquipmentStep } from './CharacterEquipmentStep'

/*
 * ADVENTURE FILES
 * CHARACTER CREATOR TESTS
 *
 * Steps 01, 02 and 03.
 */

afterEach(() => {
  cleanup()
})

/*
 * HELPERS
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

function advanceToEquipment(language: Language = 'pt') {
  const callbacks = advanceToOrigins(language)

  fireEvent.click(
    screen.getByRole('button', {
      name: language === 'pt' ? 'Elfo' : 'Elf',
    }),
  )

  fireEvent.click(
    screen.getByRole('button', {
      name:
        language === 'pt'
          ? 'Estudioso'
          : 'Scholar',
    }),
  )

  fireEvent.click(
    screen.getByRole('button', {
      name:
        language === 'pt'
          ? 'CONTINUAR'
          : 'CONTINUE',
    }),
  )

  return callbacks
}

/*
 * TESTS
 */

describe('Character creator', () => {
  /*
   * TEST 01
   * CLASS AND NAME VALIDATION
   */

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
   * PRESERVE ORIGINS WHEN GOING BACK
   */

  it('preserves unfinished origins selections when returning to step one', () => {
    advanceToOrigins()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Anão',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VOLTAR',
      }),
    )

    expect(
      screen
        .getByRole('button', {
          name: 'Mago',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    expect(nameInput.value).toBe('Luna')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'CONTINUAR',
      }),
    )

    expect(
      screen
        .getByRole('button', {
          name: 'Anão',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')

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
   * ORIGINS TO EQUIPMENT
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
      screen.getByText('ARMA'),
    ).toBeTruthy()

    expect(
      screen.getByText('ARTEFATO'),
    ).toBeTruthy()

    expect(screen.queryByText('COMPANHEIRO')).toBeNull()

    expect(onStepChange).toHaveBeenCalledWith(3)

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
   * ENGLISH ORIGINS
   */

  it('displays origins options in English', () => {
    advanceToOrigins('en')

    expect(
      screen.getByText('ANCESTRY'),
    ).toBeTruthy()

    expect(
      screen.getByText('BACKGROUND'),
    ).toBeTruthy()

    for (const option of [
      'Human',
      'Fae',
      'Scholar',
      'Outlaw',
    ]) {
      expect(
        screen.getByRole('button', {
          name: option,
        }),
      ).toBeTruthy()
    }
  })

  /*
   * TEST 07
   * EQUIPMENT OPTIONS
   */

  it('displays eight weapons and eight artifacts without companions', () => {
    advanceToEquipment()

    expect(screen.getByText('ARMA')).toBeTruthy()
    expect(screen.getByText('ARTEFATO')).toBeTruthy()
    expect(screen.queryByText('COMPANHEIRO')).toBeNull()

    const weaponOptions = [
      'Espada',
      'Arco',
      'Cajado',
      'Adaga',
      'Machado',
      'Lança',
      'Martelo',
      'Varinha',
    ]

    const artifactOptions = [
      'Selo Arcano',
      'Anel Antigo',
      'Cristal Lunar',
      'Bússola Rúnica',
      'Coroa Sombria',
      'Pena de Fênix',
      'Orbe do Caos',
      'Relíquia Solar',
    ]

    for (const option of [...weaponOptions, ...artifactOptions]) {
      expect(
        screen.getByRole('button', { name: option }),
      ).toBeTruthy()
    }

    for (const removed of [
      'Nenhum',
      'Amuleto de Esmeralda',
      'Filhote de Dragão',
      'Tomo Esquecido',
      'Chave Desgastada pelo Tempo',
    ]) {
      expect(
        screen.queryByRole('button', { name: removed }),
      ).toBeNull()
    }
  })

  /*
   * TEST 08
   * EQUIPMENT VALIDATION
   */

  it('requires a weapon and an artifact before continuing', () => {
    advanceToEquipment()

    const continueButton = screen.getByRole(
      'button',
      { name: 'CONTINUAR' },
    ) as HTMLButtonElement

    expect(continueButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', { name: 'Espada' }),
    )

    expect(continueButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', { name: 'Coroa Sombria' }),
    )

    expect(continueButton.disabled).toBe(false)

    for (const option of ['Espada', 'Coroa Sombria']) {
      expect(
        screen
          .getByRole('button', { name: option })
          .getAttribute('aria-pressed'),
      ).toBe('true')
    }
  })

  /*
   * TEST 09
   * PRESERVE UNFINISHED EQUIPMENT
   */

  it('preserves an unfinished equipment selection when returning to origins', () => {
    advanceToEquipment()

    fireEvent.click(
      screen.getByRole('button', { name: 'Cajado' }),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'VOLTAR' }),
    )

    expect(screen.getByText('ANCESTRALIDADE')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', { name: 'CONTINUAR' }),
    )

    expect(
      screen
        .getByRole('button', { name: 'Cajado' })
        .getAttribute('aria-pressed'),
    ).toBe('true')

    const continueButton = screen.getByRole(
      'button',
      { name: 'CONTINUAR' },
    ) as HTMLButtonElement

    expect(continueButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', { name: 'Orbe do Caos' }),
    )

    expect(continueButton.disabled).toBe(false)
  })

  /*
   * TEST 10
   * EQUIPMENT TO ESSENCE
   */

  it('advances to Essence and preserves equipment when returning', () => {
    const { onStepChange } = advanceToEquipment()

    fireEvent.click(
      screen.getByRole('button', { name: 'Arco' }),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Coroa Sombria' }),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'CONTINUAR' }),
    )

    expect(
      screen.getByRole('heading', { name: 'ESSÊNCIA' }),
    ).toBeTruthy()

    expect(onStepChange).toHaveBeenCalledWith(4)

    fireEvent.click(
      screen.getByRole('button', { name: 'VOLTAR' }),
    )

    for (const option of ['Arco', 'Coroa Sombria']) {
      expect(
        screen
          .getByRole('button', { name: option })
          .getAttribute('aria-pressed'),
      ).toBe('true')
    }
  })

  /*
   * TEST 11
   * ENGLISH EQUIPMENT
   */

  it('displays only weapons and artifacts in English', () => {
    advanceToEquipment('en')

    expect(screen.getByText('WEAPON')).toBeTruthy()
    expect(screen.getByText('ARTIFACT')).toBeTruthy()
    expect(screen.queryByText('COMPANION')).toBeNull()

    for (const option of [
      'Sword',
      'Moon Crystal',
      'Shadow Crown',
      'Chaos Orb',
      'Arcane Seal',
    ]) {
      expect(
        screen.getByRole('button', { name: option }),
      ).toBeTruthy()
    }

    for (const removed of [
      'None',
      'Dragon',
      'Dragonling',
      'Emerald Amulet',
      'Forgotten Tome',
      'Timeworn Key',
    ]) {
      expect(
        screen.queryByRole('button', { name: removed }),
      ).toBeNull()
    }

    expect(
      screen.getByRole('button', { name: 'BACK' }),
    ).toBeTruthy()
  })

  /*
   * TEST 12
   * STABLE ARTIFACT IDENTIFIER
   */

  it('submits the arcane-seal identifier for Selo Arcano', () => {
    const onNext = vi.fn()

    render(
      <CharacterEquipmentStep
        language="pt"
        onBack={vi.fn()}
        onNext={onNext}
      />,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Espada' }),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Selo Arcano' }),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'CONTINUAR' }),
    )

    expect(onNext).toHaveBeenCalledWith({
      weapon: 'sword',
      artifact: 'arcane-seal',
    })
  })
})