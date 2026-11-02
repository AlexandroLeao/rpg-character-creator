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
import { CharacterEssenceStep } from './CharacterEssenceStep'
import { CharacterJourneyStep } from './CharacterJourneyStep'

/*
 * ADVENTURE FILES
 * CHARACTER CREATOR TESTS
 *
 * Step 01 — Identity
 * Step 02 — Origins
 * Step 03 — Equipment
 * Step 04 — Essence
 * Step 05 — Journey
 * Step 06 — Final Review placeholder
 */

afterEach(() => {
  cleanup()
})

/*
 * TEST HELPERS
 */

function getButton(name: string) {
  return screen.getByRole('button', { name })
}

function clickButton(name: string) {
  fireEvent.click(getButton(name))
}

function getContinueButton(language: Language = 'pt') {
  return getButton(
    language === 'pt' ? 'CONTINUAR' : 'CONTINUE',
  ) as HTMLButtonElement
}

function isSelected(name: string) {
  return getButton(name).getAttribute('aria-pressed')
}

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

  clickButton(language === 'pt' ? 'Mago' : 'Mage')

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

  clickButton(
    language === 'pt' ? 'CONTINUAR' : 'CONTINUE',
  )

  return {
    onCancel,
    onStepChange,
  }
}

function advanceToEquipment(language: Language = 'pt') {
  const callbacks = advanceToOrigins(language)

  clickButton(language === 'pt' ? 'Elfo' : 'Elf')

  clickButton(
    language === 'pt' ? 'Estudioso' : 'Scholar',
  )

  clickButton(
    language === 'pt' ? 'CONTINUAR' : 'CONTINUE',
  )

  return callbacks
}

function advanceToEssence(language: Language = 'pt') {
  const callbacks = advanceToEquipment(language)

  clickButton(language === 'pt' ? 'Espada' : 'Sword')

  clickButton(
    language === 'pt' ? 'Selo Arcano' : 'Arcane Seal',
  )

  clickButton(
    language === 'pt' ? 'CONTINUAR' : 'CONTINUE',
  )

  return callbacks
}

function advanceToJourney(language: Language = 'pt') {
  const callbacks = advanceToEssence(language)

  clickButton(language === 'pt' ? 'Corajoso' : 'Brave')
  clickButton(language === 'pt' ? 'Fogo' : 'Fire')

  clickButton(
    language === 'pt' ? 'CONTINUAR' : 'CONTINUE',
  )

  return callbacks
}

/*
 * TESTS
 */

describe('Character creator', () => {
  /*
   * TEST 01
   * IDENTITY VALIDATION
   */

  it('requires a class and a valid name before continuing', () => {
    render(
      <CharacterCreator
        language="pt"
        onCancel={vi.fn()}
      />,
    )

    const continueButton = getContinueButton()

    expect(continueButton.disabled).toBe(true)

    clickButton('Mago')

    expect(continueButton.disabled).toBe(true)

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    )

    fireEvent.change(nameInput, {
      target: { value: 'L' },
    })

    expect(continueButton.disabled).toBe(true)

    fireEvent.change(nameInput, {
      target: { value: 'Luna' },
    })

    expect(continueButton.disabled).toBe(false)
    expect((nameInput as HTMLInputElement).value).toBe('LUNA')
  })

  /*
   * TEST 02
   * ORIGINS OPTIONS
   */

  it('displays all ancestry and background options', () => {
    advanceToOrigins()

    expect(screen.getByText('ANCESTRALIDADE')).toBeTruthy()
    expect(screen.getByText('ORIGEM')).toBeTruthy()

    const options = [
      'Humano',
      'Elfo',
      'Anão',
      'Orc',
      'Feérico',
      'Construto',
      'Nobre',
      'Estudioso',
      'Andarilho',
      'Guardião',
      'Artesão',
      'Fora da lei',
    ]

    for (const option of options) {
      expect(getButton(option)).toBeTruthy()
    }
  })

  /*
   * TEST 03
   * ORIGINS VALIDATION
   */

  it('requires both origins selections before continuing', () => {
    advanceToOrigins()

    const continueButton = getContinueButton()

    expect(continueButton.disabled).toBe(true)

    clickButton('Elfo')

    expect(continueButton.disabled).toBe(true)

    clickButton('Nobre')

    expect(continueButton.disabled).toBe(false)

    expect(isSelected('Elfo')).toBe('true')
    expect(isSelected('Nobre')).toBe('true')
  })

  /*
   * TEST 04
   * PRESERVE ORIGINS
   */

  it('preserves unfinished origins selections when returning to identity', () => {
    advanceToOrigins()

    clickButton('Anão')
    clickButton('VOLTAR')

    expect(isSelected('Mago')).toBe('true')

    const nameInput = screen.getByLabelText(
      'NOME DO PERSONAGEM',
    ) as HTMLInputElement

    expect(nameInput.value).toBe('LUNA')

    clickButton('CONTINUAR')

    expect(isSelected('Anão')).toBe('true')
    expect(getContinueButton().disabled).toBe(true)
  })

  /*
   * TEST 05
   * ORIGINS TO EQUIPMENT
   */

  it('advances to equipment and preserves origins when returning', () => {
    const { onStepChange } = advanceToOrigins()

    expect(onStepChange).toHaveBeenCalledWith(2)

    clickButton('Feérico')
    clickButton('Guardião')
    clickButton('CONTINUAR')

    expect(screen.getByText('ARMA')).toBeTruthy()
    expect(screen.getByText('ARTEFATO')).toBeTruthy()

    expect(screen.queryByText('COMPANHEIRO')).toBeNull()

    expect(onStepChange).toHaveBeenCalledWith(3)

    clickButton('VOLTAR')

    expect(isSelected('Feérico')).toBe('true')
    expect(isSelected('Guardião')).toBe('true')
  })

  /*
   * TEST 06
   * ENGLISH ORIGINS
   */

  it('displays origins options in English', () => {
    advanceToOrigins('en')

    expect(screen.getByText('ANCESTRY')).toBeTruthy()
    expect(screen.getByText('BACKGROUND')).toBeTruthy()

    for (const option of [
      'Human',
      'Fae',
      'Scholar',
      'Outlaw',
    ]) {
      expect(getButton(option)).toBeTruthy()
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

    const weapons = [
      'Espada',
      'Arco',
      'Cajado',
      'Adaga',
      'Machado',
      'Lança',
      'Martelo',
      'Varinha',
    ]

    const artifacts = [
      'Selo Arcano',
      'Anel Antigo',
      'Cristal Lunar',
      'Bússola Rúnica',
      'Coroa Sombria',
      'Pena de Fênix',
      'Orbe do Caos',
      'Relíquia Solar',
    ]

    for (const option of [...weapons, ...artifacts]) {
      expect(getButton(option)).toBeTruthy()
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

    const continueButton = getContinueButton()

    expect(continueButton.disabled).toBe(true)

    clickButton('Espada')

    expect(continueButton.disabled).toBe(true)

    clickButton('Coroa Sombria')

    expect(continueButton.disabled).toBe(false)

    expect(isSelected('Espada')).toBe('true')
    expect(isSelected('Coroa Sombria')).toBe('true')
  })

  /*
   * TEST 09
   * PRESERVE UNFINISHED EQUIPMENT
   */

  it('preserves unfinished equipment when returning to origins', () => {
    advanceToEquipment()

    clickButton('Cajado')
    clickButton('VOLTAR')

    expect(screen.getByText('ANCESTRALIDADE')).toBeTruthy()

    clickButton('CONTINUAR')

    expect(isSelected('Cajado')).toBe('true')
    expect(getContinueButton().disabled).toBe(true)

    clickButton('Orbe do Caos')

    expect(getContinueButton().disabled).toBe(false)
  })

  /*
   * TEST 10
   * EQUIPMENT TO ESSENCE
   */

  it('advances to Essence and preserves equipment when returning', () => {
    const { onStepChange } = advanceToEquipment()

    clickButton('Arco')
    clickButton('Coroa Sombria')
    clickButton('CONTINUAR')

    expect(screen.getByText('PERSONALIDADE')).toBeTruthy()
    expect(screen.getByText('AURA')).toBeTruthy()

    expect(onStepChange).toHaveBeenCalledWith(4)

    clickButton('VOLTAR')

    expect(isSelected('Arco')).toBe('true')
    expect(isSelected('Coroa Sombria')).toBe('true')
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
      expect(getButton(option)).toBeTruthy()
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

    clickButton('Espada')
    clickButton('Selo Arcano')
    clickButton('CONTINUAR')

    expect(onNext).toHaveBeenCalledWith({
      weapon: 'sword',
      artifact: 'arcane-seal',
    })
  })

  /*
   * TEST 13
   * ESSENCE OPTIONS
   */

  it('displays eight personalities and eight auras', () => {
    advanceToEssence()

    expect(screen.getByText('PERSONALIDADE')).toBeTruthy()
    expect(screen.getByText('AURA')).toBeTruthy()
    expect(screen.queryByText('COMPANHEIRO')).toBeNull()

    const personalities = [
      'Corajoso',
      'Curioso',
      'Leal',
      'Astuto',
      'Gentil',
      'Estoico',
      'Rebelde',
      'Misterioso',
    ]

    const auras = [
      'Fogo',
      'Gelo',
      'Natureza',
      'Sombra',
      'Luz',
      'Tempestade',
      'Arcana',
      'Vazio',
    ]

    for (const option of [...personalities, ...auras]) {
      expect(getButton(option)).toBeTruthy()
    }
  })

  /*
   * TEST 14
   * ESSENCE VALIDATION
   */

  it('requires both personality and aura before continuing', () => {
    advanceToEssence()

    const continueButton = getContinueButton()

    expect(continueButton.disabled).toBe(true)

    clickButton('Corajoso')

    expect(continueButton.disabled).toBe(true)

    clickButton('Fogo')

    expect(continueButton.disabled).toBe(false)

    expect(isSelected('Corajoso')).toBe('true')
    expect(isSelected('Fogo')).toBe('true')
  })

  /*
   * TEST 15
   * PRESERVE UNFINISHED ESSENCE
   */

  it('preserves partial essence selections when returning to equipment', () => {
    advanceToEssence()

    clickButton('Curioso')
    clickButton('VOLTAR')

    expect(screen.getByText('ARMA')).toBeTruthy()

    expect(isSelected('Espada')).toBe('true')
    expect(isSelected('Selo Arcano')).toBe('true')

    clickButton('CONTINUAR')

    expect(isSelected('Curioso')).toBe('true')

    const continueButton = getContinueButton()

    expect(continueButton.disabled).toBe(true)

    clickButton('Arcana')

    expect(continueButton.disabled).toBe(false)
  })

  /*
   * TEST 16
   * ESSENCE TO JOURNEY
   */

  it('advances to Journey and preserves essence selections on return', () => {
    const { onStepChange } = advanceToEssence()

    expect(onStepChange).toHaveBeenCalledWith(4)

    clickButton('Rebelde')
    clickButton('Sombra')
    clickButton('CONTINUAR')

    expect(screen.getByText('COMPANHEIRO')).toBeTruthy()
    expect(screen.getByText('MOTIVAÇÃO')).toBeTruthy()

    expect(onStepChange).toHaveBeenCalledWith(5)

    clickButton('VOLTAR')

    expect(isSelected('Rebelde')).toBe('true')
    expect(isSelected('Sombra')).toBe('true')
  })

  /*
   * TEST 17
   * ENGLISH ESSENCE
   */

  it('displays personality and aura options in English', () => {
    advanceToEssence('en')

    expect(screen.getByText('PERSONALITY')).toBeTruthy()
    expect(screen.getByText('AURA')).toBeTruthy()

    const options = [
      'Brave',
      'Curious',
      'Loyal',
      'Cunning',
      'Kind',
      'Stoic',
      'Rebellious',
      'Mysterious',
      'Fire',
      'Ice',
      'Nature',
      'Shadow',
      'Light',
      'Storm',
      'Arcane',
      'Void',
    ]

    for (const option of options) {
      expect(getButton(option)).toBeTruthy()
    }
  })

  /*
   * TEST 18
   * STABLE ESSENCE IDENTIFIERS
   */

  it('submits stable personality and aura identifiers', () => {
    const onNext = vi.fn()

    render(
      <CharacterEssenceStep
        language="pt"
        onBack={vi.fn()}
        onNext={onNext}
      />,
    )

    clickButton('Misterioso')
    clickButton('Vazio')
    clickButton('CONTINUAR')

    expect(onNext).toHaveBeenCalledWith({
      personality: 'mysterious',
      aura: 'void',
    })
  })

  /*
   * TEST 19
   * JOURNEY OPTIONS
   */

  it('displays eight companions and eight motivations', () => {
    advanceToJourney()

    expect(screen.getByText('COMPANHEIRO')).toBeTruthy()
    expect(screen.getByText('MOTIVAÇÃO')).toBeTruthy()

    const companions = [
      'Nenhum',
      'Lobo',
      'Coruja',
      'Gato',
      'Raposa',
      'Corvo',
      'Tartaruga',
      'Dragão',
    ]

    const motivations = [
      'Proteção',
      'Liberdade',
      'Justiça',
      'Redenção',
      'Glória',
      'Conhecimento',
      'Vingança',
      'Aventura',
    ]

    for (const option of [...companions, ...motivations]) {
      expect(getButton(option)).toBeTruthy()
    }

    expect(
      screen.queryByRole('button', {
        name: 'Filhote de Dragão',
      }),
    ).toBeNull()
  })

  /*
   * TEST 20
   * JOURNEY VALIDATION
   */

  it('requires a companion and a motivation before continuing', () => {
    advanceToJourney()

    const continueButton = getContinueButton()

    expect(continueButton.disabled).toBe(true)

    clickButton('Nenhum')

    expect(isSelected('Nenhum')).toBe('true')
    expect(continueButton.disabled).toBe(true)

    clickButton('Proteção')

    expect(isSelected('Proteção')).toBe('true')
    expect(continueButton.disabled).toBe(false)
  })

  /*
   * TEST 21
   * PRESERVE UNFINISHED JOURNEY
   */

  it('preserves partial Journey selections when returning to Essence', () => {
    advanceToJourney()

    clickButton('Dragão')
    clickButton('VOLTAR')

    expect(screen.getByText('PERSONALIDADE')).toBeTruthy()
    expect(isSelected('Corajoso')).toBe('true')
    expect(isSelected('Fogo')).toBe('true')

    clickButton('CONTINUAR')

    expect(isSelected('Dragão')).toBe('true')
    expect(getContinueButton().disabled).toBe(true)

    clickButton('Liberdade')

    expect(getContinueButton().disabled).toBe(false)
  })

  /*
   * TEST 22
   * JOURNEY TO FINAL REVIEW
   */

  it('advances to Final Review and preserves Journey on return', () => {
    const { onStepChange } = advanceToJourney()

    expect(onStepChange).toHaveBeenCalledWith(5)

    clickButton('Coruja')
    clickButton('Aventura')
    clickButton('CONTINUAR')

    expect(
      screen.getByRole('heading', {
        name: 'REVISÃO FINAL',
      }),
    ).toBeTruthy()

    expect(onStepChange).toHaveBeenCalledWith(6)

    clickButton('VOLTAR')

    expect(isSelected('Coruja')).toBe('true')
    expect(isSelected('Aventura')).toBe('true')
  })

  /*
   * TEST 23
   * ENGLISH JOURNEY
   */

  it('displays Journey options in English', () => {
    advanceToJourney('en')

    expect(screen.getByText('COMPANION')).toBeTruthy()
    expect(screen.getByText('MOTIVATION')).toBeTruthy()

    const options = [
      'None',
      'Wolf',
      'Owl',
      'Cat',
      'Fox',
      'Raven',
      'Turtle',
      'Dragon',
      'Protection',
      'Freedom',
      'Justice',
      'Redemption',
      'Glory',
      'Knowledge',
      'Revenge',
      'Adventure',
    ]

    for (const option of options) {
      expect(getButton(option)).toBeTruthy()
    }

    expect(
      screen.queryByRole('button', {
        name: 'Dragonling',
      }),
    ).toBeNull()
  })

  /*
   * TEST 24
   * STABLE JOURNEY IDENTIFIERS
   */

  it('submits stable companion and motivation identifiers', () => {
    const onNext = vi.fn()

    render(
      <CharacterJourneyStep
        language="pt"
        onBack={vi.fn()}
        onNext={onNext}
      />,
    )

    clickButton('Nenhum')
    clickButton('Proteção')
    clickButton('CONTINUAR')

    expect(onNext).toHaveBeenCalledWith({
      companion: 'none',
      motivation: 'protection',
    })
  })
})