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
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import type { Character } from './lib/characterApi'

import {
  downloadCharacterPng,
} from './lib/characterPngExport'

import {
  CharacterExportPanel,
} from './CharacterExportPanel'

/*
 * ADVENTURE FILES
 * CHARACTER EXPORT PANEL TESTS
 */

vi.mock('./lib/characterPngExport', () => ({
  downloadCharacterPng: vi.fn(),
}))

const character: Character = {
  id: 'test-id',

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

const mockedDownload =
  vi.mocked(downloadCharacterPng)

beforeEach(() => {
  mockedDownload.mockReset()

  mockedDownload.mockResolvedValue(undefined)
})

afterEach(() => {
  cleanup()

  vi.restoreAllMocks()
})

describe('Character export panel', () => {
  it('opens and closes the format selector', () => {
    render(
      <CharacterExportPanel
        character={character}
        language="pt"
      />,
    )

    expect(
      screen.queryByText(
        'ESCOLHA O FORMATO',
      ),
    ).toBeNull()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Exportar',
      }),
    )

    expect(
      screen.getByText(
        'ESCOLHA O FORMATO',
      ),
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Exportar',
      }),
    )

    expect(
      screen.queryByText(
        'ESCOLHA O FORMATO',
      ),
    ).toBeNull()
  })

  it('exports the saved character as Story PNG', async () => {
    render(
      <CharacterExportPanel
        character={character}
        language="pt"
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Exportar',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /PNG STORY/i,
      }),
    )

    await waitFor(() => {
      expect(
        mockedDownload,
      ).toHaveBeenCalledWith(
        character,
        'pt',
        'story',
      )
    })
  })

  it('exports the saved character as Portrait PNG', async () => {
    render(
      <CharacterExportPanel
        character={character}
        language="en"
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Export',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /PNG PORTRAIT/i,
      }),
    )

    await waitFor(() => {
      expect(
        mockedDownload,
      ).toHaveBeenCalledWith(
        character,
        'en',
        'portrait',
      )
    })
  })

  it('shows an error if generation fails', async () => {
    mockedDownload.mockRejectedValue(
      new Error('Generation failed'),
    )

    render(
      <CharacterExportPanel
        character={character}
        language="pt"
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Exportar',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /PNG STORY/i,
      }),
    )

    const alert =
      await screen.findByRole('alert')

    expect(
      alert.textContent,
    ).toContain(
      'Não foi possível gerar a imagem.',
    )
  })

  it('prevents repeated exports while generating', async () => {
    let finishExport: () => void = () => {}

    mockedDownload.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishExport = resolve
        }),
    )

    render(
      <CharacterExportPanel
        character={character}
        language="pt"
      />,
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Exportar',
      }),
    )

    const storyButton =
      screen.getByRole('button', {
        name: /PNG STORY/i,
      })

    const portraitButton =
      screen.getByRole('button', {
        name: /PNG RETRATO/i,
      })

    fireEvent.click(storyButton)

    expect(
      storyButton.hasAttribute('disabled'),
    ).toBe(true)

    expect(
      portraitButton.hasAttribute('disabled'),
    ).toBe(true)

    fireEvent.click(portraitButton)

    expect(
      mockedDownload,
    ).toHaveBeenCalledTimes(1)

    finishExport()

    await waitFor(() => {
      expect(
        storyButton.hasAttribute('disabled'),
      ).toBe(false)
    })
  })
})