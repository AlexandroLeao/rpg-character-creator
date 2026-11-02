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
  characterSheetLogoSource,
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
  const strokeRect = vi.fn()

  const context = {
    fillRect: vi.fn(),
    strokeRect,

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
    strokeRect,
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
      'ANTONIO',
    )

    expect(renderedTexts).toContain('CLASSE')
    expect(renderedTexts).toContain('DRUIDA')
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
        'ELFO',
        'ARTESÃO',
        'ADAGA',
        'BÚSSOLA RÚNICA',
        'CURIOSO',
        'NATUREZA',
        'CORUJA',
        'LIBERDADE',
      ]),
    )
  })

  it('uses the same PNG as the browser favicon', () => {
    expect(characterSheetLogoSource).toBe('/favicon.png')
  })

  it('aligns identity boxes to the two section columns', () => {
    const mock = mockCanvas()
    const data = prepareCharacterExportData(character, 'pt')

    renderCharacterPng(data, mock.artwork, 'portrait')

    const panels = mock.strokeRect.mock.calls.filter(
      (call) => call[2] > 400 && call[2] < 600,
    )

    // Identity panels (first row) and four section panels share
    // the exact same horizontal grid and card widths.
    const leftCards = panels.filter((call) => call[0] === 40)
    const rightCards = panels.filter((call) => call[0] === 549)

    expect(leftCards).toHaveLength(3)
    expect(rightCards).toHaveLength(3)
    expect(new Set(leftCards.map((call) => call[2])).size).toBe(1)
    expect(new Set(rightCards.map((call) => call[2])).size).toBe(1)
  })

  it('gives long values room while keeping labels aligned in both formats', () => {
    const longCharacter: Character = {
      ...character,
      aura: 'shadow',
      motivation: 'knowledge',
    }

    for (const format of ['story', 'portrait'] as const) {
      const mock = mockCanvas()
      const data = prepareCharacterExportData(longCharacter, 'pt')

      renderCharacterPng(data, mock.artwork, format)

      const text = (value: string) =>
        mock.fillText.mock.calls.find((call) => call[0] === value)

      const auraLabel = text('AURA')
      const auraValue = text('SOMBRA')
      const motivationLabel = text('MOTIVAÇÃO')
      const motivationValue = text('CONHECIMENTO')

      expect(auraLabel).toBeDefined()
      expect(auraValue).toBeDefined()
      expect(motivationLabel).toBeDefined()
      expect(motivationValue).toBeDefined()

      // Each row shares one baseline, and values receive the
      // available width instead of a fixed half-column.
      expect(auraLabel?.[2]).toBe(auraValue?.[2])
      expect(motivationLabel?.[2]).toBe(motivationValue?.[2])
      expect(auraValue?.[3]).toBeGreaterThan(250)
      expect(motivationValue?.[3]).toBeGreaterThan(250)
    }
  })

  it('draws the supplied favicon twice in either export format', () => {
    for (const format of ['story', 'portrait'] as const) {
      const mock = mockCanvas()
      const data = prepareCharacterExportData(character, 'en')
      const logo = {
        naturalWidth: 256,
        naturalHeight: 256,
      } as HTMLImageElement

      renderCharacterPng(data, mock.artwork, format, logo)

      const logoDraws = mock.drawImage.mock.calls.filter(
        (call) => call[0] === logo,
      )

      expect(logoDraws).toHaveLength(2)
      expect(mock.drawImage).toHaveBeenCalledTimes(3)
    }
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