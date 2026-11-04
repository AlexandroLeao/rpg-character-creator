import {
  describe,
  expect,
  it,
} from 'vitest'

import type { Character } from './characterApi'

import {
  prepareCharacterExportData,
} from './characterExportData'

const savedCharacter: Character = {
  id: 'private-record-id',

  name: 'Antonio',
  characterClass: 'druid',

  ancestry: 'elf',
  background: 'artisan',

  weapon: 'dagger',
  artifact: 'runic-compass',

  personality: 'curious',
  aura: 'nature',

  companion: 'owl',
  motivation: 'freedom',

  createdAt: '2026-11-01T10:00:00Z',
  updatedAt: '2026-11-01T10:00:00Z',
}

describe('Character export data', () => {
  it('prepares all saved choices in Portuguese', () => {
    const data = prepareCharacterExportData(
      savedCharacter,
      'pt',
    )

    expect(data.title).toBe(
      'FICHA DE PERSONAGEM',
    )

    expect(data.name).toBe('Antonio')

    expect(data.classFieldLabel).toBe(
      'Classe',
    )

    expect(data.classLabel).toBe(
      'Druida',
    )

    expect(data.artworkSource).toBe(
      '/art/characters/druid.png',
    )

    expect(
      data.sections.map(
        (section) => section.title,
      ),
    ).toEqual([
      'ORIGENS',
      'EQUIPAMENTO',
      'ESSÊNCIA',
      'JORNADA',
    ])

    const values = data.sections.flatMap(
      (section) =>
        section.fields.map(
          (field) => field.value,
        ),
    )

    expect(values).toEqual([
      'Elfo',
      'Artesão',
      'Adaga',
      'Bússola Rúnica',
      'Curioso',
      'Natureza',
      'Coruja',
      'Liberdade',
    ])
  })

  it('translates the export into English', () => {
    const data = prepareCharacterExportData(
      savedCharacter,
      'en',
    )

    expect(data.title).toBe(
      'CHARACTER SHEET',
    )

    expect(data.classFieldLabel).toBe(
      'Class',
    )

    expect(data.classLabel).toBe(
      'Druid',
    )

    expect(
      data.sections[0].fields[0],
    ).toEqual({
      key: 'ancestry',
      label: 'Ancestry',
      value: 'Elf',
    })

    expect(
      data.sections[1].fields[1],
    ).toEqual({
      key: 'artifact',
      label: 'Artifact',
      value: 'Runic Compass',
    })
  })

  it('preserves an explicit companion None', () => {
    const character: Character = {
      ...savedCharacter,
      companion: 'none',
    }

    const portuguese =
      prepareCharacterExportData(
        character,
        'pt',
      )

    const english =
      prepareCharacterExportData(
        character,
        'en',
      )

    expect(
      portuguese.sections[3].fields[0].value,
    ).toBe('Nenhum')

    expect(
      english.sections[3].fields[0].value,
    ).toBe('None')
  })

  it('handles legacy characters without motivation', () => {
    const character: Character = {
      ...savedCharacter,
      motivation: null,
    }

    const portuguese =
      prepareCharacterExportData(
        character,
        'pt',
      )

    const english =
      prepareCharacterExportData(
        character,
        'en',
      )

    expect(
      portuguese.sections[3].fields[1].value,
    ).toBe('Não informada')

    expect(
      english.sections[3].fields[1].value,
    ).toBe('Not provided')
  })

  it('uses fallback artwork for unknown classes', () => {
    const character: Character = {
      ...savedCharacter,
      characterClass: 'unknown-class',
    }

    const data = prepareCharacterExportData(
      character,
      'pt',
    )

    expect(data.artworkSource).toBe(
      '/art/characters/classes-together.png',
    )
  })

  it('excludes private record metadata', () => {
    const data = prepareCharacterExportData(
      savedCharacter,
      'pt',
    )

    const serialized = JSON.stringify(data)

    expect(serialized).not.toContain(
      savedCharacter.id,
    )

    expect(serialized).not.toContain(
      savedCharacter.createdAt,
    )

    expect(serialized).not.toContain(
      savedCharacter.updatedAt,
    )

    expect(Object.keys(data).sort()).toEqual(
      [
        'title',
        'name',
        'classFieldLabel',
        'classLabel',
        'artworkSource',
        'sections',
      ].sort(),
    )
  })
})