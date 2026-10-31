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
  render,
  screen,
} from '@testing-library/react'

import { CharacterDashboard } from './CharacterDashboard'

import type {
  Character,
} from './lib/characterApi'

/* ==========================================
   API MOCK
   ========================================== */

const mocks = vi.hoisted(() => ({
  getMyCharacter: vi.fn(),
}))

vi.mock('./lib/characterApi', async (importOriginal) => {
  const original =
    await importOriginal<
      typeof import('./lib/characterApi')
    >()

  return {
    ...original,
    getMyCharacter: mocks.getMyCharacter,
  }
})

/* ==========================================
   SAVED CHARACTER
   ========================================== */

const savedCharacter: Character = {
  id: 'character-motivation-test',
  name: 'Alexandro',
  characterClass: 'cleric',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'arcane-seal',
  personality: 'loyal',
  aura: 'light',
  companion: 'owl',
  motivation: 'protection',
  createdAt: '2026-10-31T10:00:00Z',
  updatedAt: '2026-10-31T10:00:00Z',
}

/* ==========================================
   TESTS
   ========================================== */

describe('Character dashboard motivation', () => {
  beforeEach(() => {
    mocks.getMyCharacter.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('displays motivation in Portuguese', async () => {
    mocks.getMyCharacter.mockResolvedValue(
      savedCharacter,
    )

    render(
      <CharacterDashboard
        accessToken="test-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByText('Proteção'),
    ).toBeTruthy()

    expect(
      screen.getByText('Motivação'),
    ).toBeTruthy()
  })

  it('displays motivation in English', async () => {
    mocks.getMyCharacter.mockResolvedValue(
      savedCharacter,
    )

    render(
      <CharacterDashboard
        accessToken="test-token"
        language="en"
      />,
    )

    expect(
      await screen.findByText('Protection'),
    ).toBeTruthy()

    expect(
      screen.getByText('Motivation'),
    ).toBeTruthy()
  })

  it('supports characters without motivation', async () => {
    mocks.getMyCharacter.mockResolvedValue({
      ...savedCharacter,
      motivation: null,
    })

    render(
      <CharacterDashboard
        accessToken="test-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByText('Não informada'),
    ).toBeTruthy()
  })

  it('updates motivation translation when language changes', async () => {
    mocks.getMyCharacter.mockResolvedValue(
      savedCharacter,
    )

    const { rerender } = render(
      <CharacterDashboard
        accessToken="test-token"
        language="pt"
      />,
    )

    expect(
      await screen.findByText('Proteção'),
    ).toBeTruthy()

    rerender(
      <CharacterDashboard
        accessToken="test-token"
        language="en"
      />,
    )

    expect(
      screen.getByText('Protection'),
    ).toBeTruthy()

    expect(
      mocks.getMyCharacter,
    ).toHaveBeenCalledTimes(1)
  })
})