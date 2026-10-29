export const characterOptions = {
  characterClass: [
    'warrior',
    'paladin',
    'mage',
    'rogue',
    'ranger',
    'druid',
    'cleric',
    'bard',
  ],

  ancestry: [
    'human',
    'elf',
    'dwarf',
    'orc',
    'fae',
    'construct',
  ],

  background: [
    'noble',
    'scholar',
    'wanderer',
    'guardian',
    'artisan',
    'outlaw',
  ],

  weapon: [
    'sword',
    'bow',
    'staff',
    'dagger',
    'axe',
    'spear',
    'hammer',
    'wand',
  ],

  artifact: [
    'none',
    'emerald-amulet',
    'ancient-ring',
    'moon-crystal',
    'runic-compass',
    'forgotten-tome',
    'phoenix-feather',
    'timeworn-key',
    'sun-relic',
  ],

  personality: [
    'brave',
    'curious',
    'loyal',
    'cunning',
    'kind',
    'stoic',
    'rebellious',
    'mysterious',
  ],

  aura: [
    'fire',
    'ice',
    'nature',
    'shadow',
    'light',
    'storm',
    'arcane',
    'void',
  ],

  companion: [
    'none',
    'wolf',
    'owl',
    'cat',
    'fox',
    'raven',
    'turtle',
    'dragonling',
  ],
} as const

export type CharacterInput = {
  name: string
  characterClass: (typeof characterOptions.characterClass)[number]
  ancestry: (typeof characterOptions.ancestry)[number]
  background: (typeof characterOptions.background)[number]
  weapon: (typeof characterOptions.weapon)[number]
  artifact: (typeof characterOptions.artifact)[number]
  personality: (typeof characterOptions.personality)[number]
  aura: (typeof characterOptions.aura)[number]
  companion: (typeof characterOptions.companion)[number]
}

export type CharacterValidationResult =
  | {
      success: true
      data: CharacterInput
    }
  | {
      success: false
      errors: Record<string, string>
    }

const optionFields = Object.keys(
  characterOptions,
) as Array<keyof typeof characterOptions>

const allowedFields = new Set<string>([
  'name',
  ...optionFields,
])

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

function containsControlCharacters(
  value: string,
): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0)

    if (
      codePoint !== undefined &&
      (
        codePoint <= 0x1f ||
        (codePoint >= 0x7f && codePoint <= 0x9f)
      )
    ) {
      return true
    }
  }

  return false
}

export function validateCharacterInput(
  input: unknown,
): CharacterValidationResult {
  if (!isRecord(input)) {
    return {
      success: false,
      errors: {
        body: 'Request body must be a JSON object.',
      },
    }
  }

  const errors: Record<string, string> = {}

  const containsUnexpectedFields = Object.keys(input).some(
    (field) => !allowedFields.has(field),
  )

  if (containsUnexpectedFields) {
    errors.body = 'Unexpected fields are not allowed.'
  }

  const rawName = input.name

  let normalizedName: string | null = null

  if (typeof rawName !== 'string') {
    errors.name = 'Name must be a string.'
  } else {
    normalizedName = rawName.trim()

    const nameLength = Array.from(normalizedName).length

    if (containsControlCharacters(rawName)) {
      errors.name = 'Name cannot contain control characters.'
    } else if (nameLength < 2 || nameLength > 32) {
      errors.name = 'Name must be between 2 and 32 characters.'
    }
  }

  for (const field of optionFields) {
    const value = input[field]

    const options: readonly string[] =
      characterOptions[field]

    if (
      typeof value !== 'string' ||
      !options.includes(value)
    ) {
      errors[field] = `Invalid ${field} selection.`
    }
  }

  if (
    Object.keys(errors).length > 0 ||
    normalizedName === null
  ) {
    return {
      success: false,
      errors,
    }
  }

  return {
    success: true,
    data: {
      name: normalizedName,

      characterClass:
        input.characterClass as CharacterInput['characterClass'],

      ancestry:
        input.ancestry as CharacterInput['ancestry'],

      background:
        input.background as CharacterInput['background'],

      weapon:
        input.weapon as CharacterInput['weapon'],

      artifact:
        input.artifact as CharacterInput['artifact'],

      personality:
        input.personality as CharacterInput['personality'],

      aura:
        input.aura as CharacterInput['aura'],

      companion:
        input.companion as CharacterInput['companion'],
    },
  }
}