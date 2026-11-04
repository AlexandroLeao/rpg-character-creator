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

import {
  CharacterReviewStep,
  type CharacterReviewData,
} from './CharacterReviewStep'

afterEach(() => {
  cleanup()
})

/* ==========================================
   ADVENTURE FILES
   FINAL REVIEW TESTS
   ========================================== */

const character: CharacterReviewData = {
  characterClass: 'cleric',
  name: 'Alexandro',

  ancestry: 'elf',
  background: 'scholar',

  weapon: 'staff',
  artifact: 'arcane-seal',

  personality: 'loyal',
  aura: 'light',

  companion: 'owl',
  motivation: 'protection',
}

/* ==========================================
   CHARACTER FINAL REVIEW
   ========================================== */

describe('Character final review', () => {
  /* ========================================
     CHARACTER INFORMATION
     ======================================== */

  it('displays all ten selections in the approved order', () => {
    const { container } = render(
      <CharacterReviewStep
        language="pt"
        data={character}
        onBack={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: 'REVISÃO FINAL',
      }),
    ).toBeTruthy()

    const values = Array.from(
      container.querySelectorAll(
        '.character-review-step__value',
      ),
      (element) => element.textContent,
    )

    expect(values).toEqual([
      'Alexandro',
      'Clérigo',
      'Elfo',
      'Estudioso',
      'Cajado',
      'Selo Arcano',
      'Leal',
      'Luz',
      'Coruja',
      'Proteção',
    ])
  })

  /* ========================================
     CHARACTER ARTWORK
     ======================================== */

  it('reuses the artwork of the selected class', () => {
    render(
      <CharacterReviewStep
        language="pt"
        data={character}
        onBack={vi.fn()}
      />,
    )

    const image = screen.getByRole(
      'img',
    ) as HTMLImageElement

    expect(image.getAttribute('src')).toBe(
      '/art/characters/cleric.png',
    )
  })

  /* ========================================
     ENGLISH TRANSLATIONS
     ======================================== */

  it('displays translated values in English', () => {
    render(
      <CharacterReviewStep
        language="en"
        data={character}
        onBack={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', {
        name: 'FINAL REVIEW',
      }),
    ).toBeTruthy()

    for (const value of [
      'Alexandro',
      'Cleric',
      'Elf',
      'Scholar',
      'Staff',
      'Arcane Seal',
      'Loyal',
      'Light',
      'Owl',
      'Protection',
    ]) {
      expect(
        screen.getByText(value),
      ).toBeTruthy()
    }
  })

  /* ========================================
     BACK NAVIGATION
     ======================================== */

  it('allows returning and prevents premature saving', () => {
    const onBack = vi.fn()

    render(
      <CharacterReviewStep
        language="pt"
        data={character}
        onBack={onBack}
      />,
    )

    const saveButton = screen.getByRole(
      'button',
      {
        name: 'SALVAR',
      },
    ) as HTMLButtonElement

    expect(saveButton.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'VOLTAR',
      }),
    )

    expect(onBack).toHaveBeenCalledTimes(1)
  })

  /* ========================================
     NO COMPANION
     ======================================== */

  it('accepts an explicit choice of no companion', () => {
    render(
      <CharacterReviewStep
        language="pt"
        data={{
          ...character,
          companion: 'none',
        }}
        onBack={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Nenhum'),
    ).toBeTruthy()
  })

  /* ========================================
     SAVE CALLBACK
     ======================================== */

  it('enables saving when a callback is provided', () => {
    const onSave = vi.fn()

    render(
      <CharacterReviewStep
        language="pt"
        data={character}
        onBack={vi.fn()}
        onSave={onSave}
      />,
    )

    const saveButton = screen.getByRole(
      'button',
      {
        name: 'SALVAR',
      },
    ) as HTMLButtonElement

    expect(saveButton.disabled).toBe(false)

    fireEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledTimes(1)
  })

  /* ========================================
     SAVING STATE
     ======================================== */

  it('disables navigation while saving', () => {
    const onBack = vi.fn()
    const onSave = vi.fn()

    render(
      <CharacterReviewStep
        language="pt"
        data={character}
        onBack={onBack}
        onSave={onSave}
        saving
      />,
    )

    const backButton = screen.getByRole(
      'button',
      {
        name: 'VOLTAR',
      },
    ) as HTMLButtonElement

    const saveButton = screen.getByRole(
      'button',
      {
        name: 'SALVANDO...',
      },
    ) as HTMLButtonElement

    expect(backButton.disabled).toBe(true)
    expect(saveButton.disabled).toBe(true)

    expect(
      saveButton.getAttribute('aria-busy'),
    ).toBe('true')

    fireEvent.click(backButton)
    fireEvent.click(saveButton)

    expect(onBack).not.toHaveBeenCalled()
    expect(onSave).not.toHaveBeenCalled()
  })

  /* ========================================
     ENGLISH SAVING STATE
     ======================================== */

  it('displays English saving feedback', () => {
    render(
      <CharacterReviewStep
        language="en"
        data={character}
        onBack={vi.fn()}
        onSave={vi.fn()}
        saving
      />,
    )

    expect(
      screen.getByRole('button', {
        name: 'SAVING...',
      }),
    ).toBeTruthy()
  })
})