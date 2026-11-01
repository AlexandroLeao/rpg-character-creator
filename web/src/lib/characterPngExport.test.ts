// @vitest-environment jsdom

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { Character } from './characterApi'

import {
  prepareCharacterExportData,
} from './characterExportData'

import {
  characterPngDimensions,
  getCharacterPngFilename,
  renderCharacterPng,
} from './characterPngExport'

/*
 * ADVENTURE FILES
 * CHARACTER PNG EXPORT TESTS
 *
 * Browser APIs are simulated using jsdom.
 */

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

/*
 * Simulates the Canvas API.
 *
 * This lets us verify the rendering
 * instructions without needing an
 * actual browser graphics engine.
 */

function mockCanvas() {
  const fillText = vi.fn()
  const drawImage = vi.fn()

  const context = {
    fillRect: vi.fn(),
    strokeRect: vi.fn(),

    save: vi.fn(),
    restore: vi.fn(),

    beginPath: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),

    fillText,
    drawImage,

    measureText: vi.fn(
      (text: string) => ({
        width: text.length * 14,
      }),
    ),
  } as unknown as CanvasRenderingContext2D

  vi.spyOn(
    HTMLCanvasElement.prototype,
    'getContext',
  ).mockImplementation(
    () => context,
  )

  const artwork = {
    naturalWidth: 512,
    naturalHeight: 512,
  } as HTMLImageElement

  return {
    fillText,
    drawImage,
    artwork,
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Character PNG export', () => {
  it('defines the exact Story dimensions', () => {
    expect(
      characterPngDimensions.story,
    ).toEqual({
      width: 1080,
      height: 1920,
    })
  })

  it('defines the exact Portrait dimensions', () => {
    expect(
      characterPngDimensions.portrait,
    ).toEqual({
      width: 1080,
      height: 1350,
    })
  })

  it('renders the Story layout', () => {
    const mock = mockCanvas()

    const data =
      prepareCharacterExportData(
        character,
        'pt',
      )

    const canvas = renderCharacterPng(
      data,
      mock.artwork,
      'story',
    )

    expect(canvas.width).toBe(1080)
    expect(canvas.height).toBe(1920)

    expect(
      mock.drawImage,
    ).toHaveBeenCalledOnce()

    const renderedTexts =
      mock.fillText.mock.calls.map(
        (call) => call[0],
      )

    expect(renderedTexts).toContain(
      'Antonio',
    )

    expect(renderedTexts).toContain(
      'CLASSE: Druida',
    )
  })

  it('renders all fields in Portrait format', () => {
    const mock = mockCanvas()

    const data =
      prepareCharacterExportData(
        character,
        'pt',
      )

    const canvas = renderCharacterPng(
      data,
      mock.artwork,
      'portrait',
    )

    expect(canvas.width).toBe(1080)
    expect(canvas.height).toBe(1350)

    const renderedTexts =
      mock.fillText.mock.calls.map(
        (call) => call[0],
      )

    expect(renderedTexts).toEqual(
      expect.arrayContaining([
        'Elfo',
        'Artesão',
        'Adaga',
        'Bússola Rúnica',
        'Curioso',
        'Natureza',
        'Coruja',
        'Liberdade',
      ]),
    )
  })

  it('creates safe PNG filenames', () => {
    expect(
      getCharacterPngFilename(
        'Antônio',
        'story',
      ),
    ).toBe(
      'adventure-files-antonio-story.png',
    )

    expect(
      getCharacterPngFilename(
        'Antonio',
        'portrait',
      ),
    ).toBe(
      'adventure-files-antonio-portrait.png',
    )
  })
})