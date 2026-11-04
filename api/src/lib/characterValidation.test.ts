import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  characterOptions,
  validateCharacterInput,
  type CharacterInput,
} from './characterValidation.js'

const validCharacter: CharacterInput = {
  name: 'Eldrin',
  characterClass: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
  motivation: 'knowledge',
}

function expectInvalid(
  input: unknown,
  field: string,
) {
  const result = validateCharacterInput(input)

  expect(result.success).toBe(false)

  if (result.success) {
    throw new Error(
      'Expected character validation to fail',
    )
  }

  expect(result.errors).toHaveProperty(field)
}

describe('Character input validation', () => {
  it('accepts a complete character', () => {
    const result =
      validateCharacterInput(validCharacter)

    expect(result).toEqual({
      success: true,
      data: validCharacter,
    })
  })

  it('trims character names', () => {
    const input = {
      ...validCharacter,
      name: '  Eldrin  ',
    }

    const result = validateCharacterInput(input)

    expect(result.success).toBe(true)

    if (!result.success) {
      throw new Error('Expected valid character')
    }

    expect(result.data.name).toBe('Eldrin')
    expect(input.name).toBe('  Eldrin  ')
  })

  it('accepts none as a companion', () => {
    const result = validateCharacterInput({
      ...validCharacter,
      companion: 'none',
    })

    expect(result.success).toBe(true)
  })

  it('requires a selected artifact', () => {
    expectInvalid(
      {
        ...validCharacter,
        artifact: 'none',
      },
      'artifact',
    )
  })

  it('accepts all current artifacts', () => {
    for (const artifact of characterOptions.artifact) {
      const result = validateCharacterInput({
        ...validCharacter,
        artifact,
      })

      expect(result.success).toBe(true)
    }
  })

  it('accepts all motivations', () => {
    for (const motivation of characterOptions.motivation) {
      const result = validateCharacterInput({
        ...validCharacter,
        motivation,
      })

      expect(result.success).toBe(true)
    }
  })

  it('accepts dragon as a companion', () => {
    const result = validateCharacterInput({
      ...validCharacter,
      companion: 'dragon',
    })

    expect(result.success).toBe(true)
  })

  it('rejects legacy identifiers in new saves', () => {
    expectInvalid(
      {
        ...validCharacter,
        artifact: 'emerald-amulet',
      },
      'artifact',
    )

    expectInvalid(
      {
        ...validCharacter,
        companion: 'dragonling',
      },
      'companion',
    )
  })

  it('rejects a null request body', () => {
    expectInvalid(null, 'body')
  })

  it('rejects an array request body', () => {
    expectInvalid([], 'body')
  })

  it('rejects missing required fields', () => {
    const input: Record<string, unknown> = {
      ...validCharacter,
    }

    delete input.companion

    expectInvalid(input, 'companion')
  })

  it('requires motivation', () => {
    const input: Record<string, unknown> = {
      ...validCharacter,
    }

    delete input.motivation

    expectInvalid(input, 'motivation')
  })

  it('rejects null motivation', () => {
    expectInvalid(
      {
        ...validCharacter,
        motivation: null,
      },
      'motivation',
    )
  })

  it('rejects client-provided ownership fields', () => {
    expectInvalid(
      {
        ...validCharacter,
        user_id: 'another-user-id',
      },
      'body',
    )
  })

  it('rejects client-provided database IDs', () => {
    expectInvalid(
      {
        ...validCharacter,
        id: 'client-controlled-id',
      },
      'body',
    )
  })

  it('rejects blank character names', () => {
    expectInvalid(
      {
        ...validCharacter,
        name: '   ',
      },
      'name',
    )
  })

  it('rejects character names shorter than two characters', () => {
    expectInvalid(
      {
        ...validCharacter,
        name: 'A',
      },
      'name',
    )
  })

  it('rejects character names longer than 32 characters', () => {
    expectInvalid(
      {
        ...validCharacter,
        name: 'A'.repeat(33),
      },
      'name',
    )
  })

  it('rejects control characters in names', () => {
    expectInvalid(
      {
        ...validCharacter,
        name: 'Eldrin\nMage',
      },
      'name',
    )
  })

  it('rejects non-string names', () => {
    expectInvalid(
      {
        ...validCharacter,
        name: 123,
      },
      'name',
    )
  })

  it('rejects non-string customization values', () => {
    expectInvalid(
      {
        ...validCharacter,
        weapon: 123,
      },
      'weapon',
    )
  })

  it('rejects multiple invalid fields', () => {
    const result = validateCharacterInput({
      ...validCharacter,
      name: 'A',
      weapon: 'invalid-weapon',
    })

    expect(result.success).toBe(false)

    if (result.success) {
      throw new Error(
        'Expected character validation to fail',
      )
    }

    expect(result.errors).toHaveProperty('name')
    expect(result.errors).toHaveProperty('weapon')
  })

  it('counts Unicode characters correctly', () => {
    const result = validateCharacterInput({
      ...validCharacter,
      name: '🧙'.repeat(32),
    })

    expect(result.success).toBe(true)
  })

  const customizationFields = [
    'characterClass',
    'ancestry',
    'background',
    'weapon',
    'artifact',
    'personality',
    'aura',
    'companion',
    'motivation',
  ] as const

  for (const field of customizationFields) {
    it(`rejects unsupported ${field} values`, () => {
      expectInvalid(
        {
          ...validCharacter,
          [field]: 'invalid-option',
        },
        field,
      )
    })
  }
})