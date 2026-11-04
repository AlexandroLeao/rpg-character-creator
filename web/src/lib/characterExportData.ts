import type { Language } from './authTranslations'
import type { Character } from './characterApi'

import {
  characterTranslations,
  translateCharacterOption,
  type CharacterField,
} from './characterTranslations'

/*
 * ADVENTURE FILES
 * CHARACTER EXPORT DATA
 *
 * Prepares the saved character information
 * for PDF and PNG exports.
 *
 * No authentication or account information
 * is included in the export data.
 */

type ExportFieldKey = Exclude<
  CharacterField,
  'characterClass'
>

const artworkByClass = new Map<string, string>([
  ['warrior', '/art/characters/warrior.png'],
  ['paladin', '/art/characters/paladin.png'],
  ['mage', '/art/characters/mage.png'],
  ['rogue', '/art/characters/rogue.png'],
  ['ranger', '/art/characters/ranger.png'],
  ['druid', '/art/characters/druid.png'],
  ['cleric', '/art/characters/cleric.png'],
  ['bard', '/art/characters/bard.png'],
])

const fallbackArtwork =
  '/art/characters/classes-together.png'

const sectionDefinitions = [
  {
    id: 'origins',
    titles: {
      pt: 'ORIGENS',
      en: 'ORIGINS',
    },
    fields: ['ancestry', 'background'],
  },
  {
    id: 'equipment',
    titles: {
      pt: 'EQUIPAMENTO',
      en: 'EQUIPMENT',
    },
    fields: ['weapon', 'artifact'],
  },
  {
    id: 'essence',
    titles: {
      pt: 'ESSÊNCIA',
      en: 'ESSENCE',
    },
    fields: ['personality', 'aura'],
  },
  {
    id: 'journey',
    titles: {
      pt: 'JORNADA',
      en: 'JOURNEY',
    },
    fields: ['companion', 'motivation'],
  },
] as const

export type CharacterExportField = {
  key: ExportFieldKey
  label: string
  value: string
}

export type CharacterExportSection = {
  id: string
  title: string
  fields: CharacterExportField[]
}

export type CharacterExportData = {
  title: string
  name: string
  classFieldLabel: string
  classLabel: string
  artworkSource: string
  sections: CharacterExportSection[]
}

/*
 * Builds a safe, localized representation
 * of an already saved character.
 *
 * This function does not:
 *
 * - Call the API.
 * - Change the character.
 * - Save information.
 * - Include account identifiers.
 */

export function prepareCharacterExportData(
  character: Character,
  language: Language,
): CharacterExportData {
  const translations =
    characterTranslations[language]

  const artworkSource =
    artworkByClass.get(
      character.characterClass,
    ) ?? fallbackArtwork

  const sections: CharacterExportSection[] =
    sectionDefinitions.map((section) => {
      const fields: CharacterExportField[] =
        section.fields.map((field) => ({
          key: field,
          label: translations.fields[field],
          value: translateCharacterOption(
            language,
            field,
            character[field],
          ),
        }))

      return {
        id: section.id,
        title: section.titles[language],
        fields,
      }
    })

  return {
    title:
      language === 'pt'
        ? 'FICHA DE PERSONAGEM'
        : 'CHARACTER SHEET',

    name: character.name,

    classFieldLabel:
      translations.fields.characterClass,

    classLabel: translateCharacterOption(
      language,
      'characterClass',
      character.characterClass,
    ),

    artworkSource,

    sections,
  }
}