// @vitest-environment jsdom

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'

import {
  cleanup,
  render,
  screen,
} from '@testing-library/react'

import type { Character } from './lib/characterApi'
import { CharacterSheet } from './CharacterSheet'

const character: Character = {
  id: 'character-1',
  name: 'Eldrin',
  characterClass: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'arcane-seal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
  motivation: 'protection',
  createdAt: '2026-10-31T10:00:00Z',
  updatedAt: '2026-10-31T10:00:00Z',
}

describe('Saved character sheet', () => {
  afterEach(() => {
    cleanup()
  })

  it('displays the class artwork and all ten choices in Portuguese', () => {
    render(
      <CharacterSheet
        character={character}
        language="pt"
      />,
    )

    expect(screen.getByRole('heading', {
      name: 'Eldrin',
    })).toBeTruthy()

    expect(screen.getByText('Mago')).toBeTruthy()
    expect(screen.getByText('Elfo')).toBeTruthy()
    expect(screen.getByText('Estudioso')).toBeTruthy()
    expect(screen.getByText('Cajado')).toBeTruthy()
    expect(screen.getByText('Selo Arcano')).toBeTruthy()
    expect(screen.getByText('Curioso')).toBeTruthy()
    expect(screen.getByText('Arcana')).toBeTruthy()
    expect(screen.getByText('Coruja')).toBeTruthy()
    expect(screen.getByText('Proteção')).toBeTruthy()

    expect(screen.getByRole('img').getAttribute('src'))
      .toBe('/art/characters/mage.png')

    expect(screen.getByRole('heading', {
      name: 'ORIGENS',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'EQUIPAMENTO',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'ESSÊNCIA',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'JORNADA',
    })).toBeTruthy()
  })

  it('translates the complete sheet into English', () => {
    const { rerender } = render(
      <CharacterSheet
        character={character}
        language="pt"
      />,
    )

    rerender(
      <CharacterSheet
        character={character}
        language="en"
      />,
    )

    expect(screen.getByText('Mage')).toBeTruthy()
    expect(screen.getByText('Elf')).toBeTruthy()
    expect(screen.getByText('Scholar')).toBeTruthy()
    expect(screen.getByText('Arcane Seal')).toBeTruthy()
    expect(screen.getByText('Protection')).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'ORIGINS',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'EQUIPMENT',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'ESSENCE',
    })).toBeTruthy()

    expect(screen.getByRole('heading', {
      name: 'JOURNEY',
    })).toBeTruthy()
  })

  it('supports saved characters without motivation', () => {
    render(
      <CharacterSheet
        character={{
          ...character,
          motivation: null,
        }}
        language="pt"
      />,
    )

    expect(screen.getByText('Não informada')).toBeTruthy()
  })

  it('falls back to existing group artwork for unknown legacy classes', () => {
    render(
      <CharacterSheet
        character={{
          ...character,
          characterClass: 'old-class',
        }}
        language="en"
      />,
    )

    expect(screen.getByText('Old Class')).toBeTruthy()
    expect(screen.getByRole('img').getAttribute('src'))
      .toBe('/art/characters/classes-together.png')
  })
})
