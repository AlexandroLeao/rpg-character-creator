import type { Language } from './authTranslations'
import type { Character } from './characterApi'

import {
  prepareCharacterExportData,
  type CharacterExportData,
  type CharacterExportSection,
} from './characterExportData'

/*
 * ADVENTURE FILES
 * CHARACTER PNG EXPORT
 *
 * Generates character sheets locally
 * in the user's browser.
 */

export type CharacterPngFormat =
  | 'story'
  | 'portrait'

export const characterPngDimensions = {
  story: {
    width: 1080,
    height: 1920,
  },

  portrait: {
    width: 1080,
    height: 1350,
  },
} as const

const colors = {
  background: '#061009',
  panel: '#0c1e12',
  border: '#5b8d61',
  green: '#a4ed86',
  cream: '#f5efd2',
  muted: '#b1c7a8',
} as const

type Layout = {
  artworkTop: number
  artworkHeight: number
  nameY: number
  classY: number
  sectionsTop: number
  sectionHeight: number
  sectionGap: number
  footerY: number
}

const layouts: Record<
  CharacterPngFormat,
  Layout
> = {
  story: {
    artworkTop: 153,
    artworkHeight: 575,
    nameY: 805,
    classY: 873,
    sectionsTop: 965,
    sectionHeight: 354,
    sectionGap: 24,
    footerY: 1855,
  },

  portrait: {
    artworkTop: 145,
    artworkHeight: 365,
    nameY: 570,
    classY: 630,
    sectionsTop: 708,
    sectionHeight: 273,
    sectionGap: 20,
    footerY: 1320,
  },
}

const canvasWidth = 1080
const margin = 72
const columnGap = 20

/*
 * Draws text while adapting its size
 * to the available space.
 */

function drawFittedText(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  maxWidth: number,
  initialSize: number,
  minimumSize: number,
  color: string,
  align: CanvasTextAlign = 'left',
): void {
  let fontSize = initialSize

  context.fillStyle = color
  context.textAlign = align
  context.textBaseline = 'alphabetic'

  while (fontSize > minimumSize) {
    context.font =
      `${fontSize}px "Press Start 2P", monospace`

    if (
      context.measureText(value).width <=
      maxWidth
    ) {
      break
    }

    fontSize -= 2
  }

  context.font =
    `${fontSize}px "Press Start 2P", monospace`

  context.fillText(
    value,
    x,
    y,
    maxWidth,
  )
}

/*
 * Draws a retro rectangular panel.
 */

function drawPanel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  context.fillStyle = colors.panel

  context.fillRect(
    x,
    y,
    width,
    height,
  )

  context.strokeStyle = colors.border
  context.lineWidth = 3

  context.strokeRect(
    x,
    y,
    width,
    height,
  )
}

/*
 * Draws the original class illustration.
 *
 * Image smoothing is disabled to preserve
 * the pixel-art appearance.
 */

function drawArtwork(
  context: CanvasRenderingContext2D,
  artwork: HTMLImageElement,
  layout: Layout,
): void {
  const width = canvasWidth - margin * 2

  drawPanel(
    context,
    margin,
    layout.artworkTop,
    width,
    layout.artworkHeight,
  )

  const availableWidth = width - 50

  const availableHeight =
    layout.artworkHeight - 40

  const scale = Math.min(
    availableWidth / artwork.naturalWidth,
    availableHeight / artwork.naturalHeight,
  )

  const imageWidth =
    artwork.naturalWidth * scale

  const imageHeight =
    artwork.naturalHeight * scale

  const imageX =
    (canvasWidth - imageWidth) / 2

  const imageY =
    layout.artworkTop +
    (layout.artworkHeight - imageHeight) / 2

  context.save()

  context.imageSmoothingEnabled = false

  context.beginPath()

  context.rect(
    margin + 4,
    layout.artworkTop + 4,
    width - 8,
    layout.artworkHeight - 8,
  )

  context.clip()

  context.drawImage(
    artwork,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
  )

  context.restore()
}

/*
 * Draws one section with its two
 * character customization fields.
 */

function drawSection(
  context: CanvasRenderingContext2D,
  section: CharacterExportSection,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  drawPanel(
    context,
    x,
    y,
    width,
    height,
  )

  const textX = x + 26
  const textWidth = width - 52

  drawFittedText(
    context,
    section.title,
    textX,
    y + 45,
    textWidth,
    18,
    12,
    colors.green,
  )

  context.fillStyle = colors.border

  context.fillRect(
    x + 26,
    y + 65,
    width - 52,
    2,
  )

  section.fields.forEach((field, index) => {
    const labelY =
      y +
      Math.round(
        height * (index === 0 ? 0.32 : 0.65),
      )

    const valueY = labelY + 39

    drawFittedText(
      context,
      field.label.toUpperCase(),
      textX,
      labelY,
      textWidth,
      15,
      11,
      colors.muted,
    )

    drawFittedText(
      context,
      field.value,
      textX,
      valueY,
      textWidth,
      23,
      14,
      colors.cream,
    )
  })
}

/*
 * Renders a complete saved-character
 * sheet into a canvas.
 *
 * The Story and Portrait formats use
 * independent vertical layouts.
 */

export function renderCharacterPng(
  data: CharacterExportData,
  artwork: HTMLImageElement,
  format: CharacterPngFormat,
): HTMLCanvasElement {
  const dimensions =
    characterPngDimensions[format]

  const layout = layouts[format]

  const canvas =
    document.createElement('canvas')

  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error(
      'Canvas rendering is unavailable.',
    )
  }

  if (
    artwork.naturalWidth <= 0 ||
    artwork.naturalHeight <= 0
  ) {
    throw new Error(
      'Character artwork is invalid.',
    )
  }

  const contentWidth =
    canvasWidth - margin * 2

  context.fillStyle = colors.background

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )

  /*
   * Header
   */

  drawFittedText(
    context,
    'ADVENTURE FILES',
    margin,
    79,
    contentWidth,
    23,
    16,
    colors.green,
  )

  drawFittedText(
    context,
    data.title,
    margin,
    123,
    contentWidth,
    20,
    14,
    colors.cream,
  )

  /*
   * Character artwork
   */

  drawArtwork(
    context,
    artwork,
    layout,
  )

  /*
   * Character identity
   */

  drawFittedText(
    context,
    data.name,
    canvasWidth / 2,
    layout.nameY,
    contentWidth,
    45,
    18,
    colors.cream,
    'center',
  )

  const classText =
    `${data.classFieldLabel.toUpperCase()}: ` +
    data.classLabel

  drawFittedText(
    context,
    classText,
    canvasWidth / 2,
    layout.classY,
    contentWidth,
    22,
    14,
    colors.green,
    'center',
  )

  /*
   * Four information sections
   */

  const sectionWidth =
    (contentWidth - columnGap) / 2

  data.sections.forEach(
    (section, index) => {
      const column = index % 2
      const row = Math.floor(index / 2)

      const x =
        margin +
        column *
          (sectionWidth + columnGap)

      const y =
        layout.sectionsTop +
        row *
          (
            layout.sectionHeight +
            layout.sectionGap
          )

      drawSection(
        context,
        section,
        x,
        y,
        sectionWidth,
        layout.sectionHeight,
      )
    },
  )

  /*
   * Footer
   */

  drawFittedText(
    context,
    'ADVENTURE FILES',
    canvasWidth / 2,
    layout.footerY,
    contentWidth,
    16,
    12,
    colors.muted,
    'center',
  )

  return canvas
}

/*
 * Loads the existing class illustration.
 */

function loadArtwork(
  source: string,
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const artwork = new Image()

      artwork.onload = () => {
        if (
          artwork.naturalWidth <= 0 ||
          artwork.naturalHeight <= 0
        ) {
          reject(
            new Error(
              'Character artwork is invalid.',
            ),
          )

          return
        }

        resolve(artwork)
      }

      artwork.onerror = () => {
        reject(
          new Error(
            'Unable to load character artwork.',
          ),
        )
      }

      artwork.src = source
    },
  )
}

/*
 * Generates a valid PNG Blob.
 */

export async function createCharacterPng(
  character: Character,
  language: Language,
  format: CharacterPngFormat,
): Promise<Blob> {
  const data =
    prepareCharacterExportData(
      character,
      language,
    )

  if (document.fonts) {
    await document.fonts.ready
  }

  const artwork = await loadArtwork(
    data.artworkSource,
  )

  const canvas = renderCharacterPng(
    data,
    artwork,
    format,
  )

  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                'Unable to generate PNG.',
              ),
            )

            return
          }

          resolve(blob)
        },
        'image/png',
      )
    },
  )
}

/*
 * Creates a safe download filename.
 */

export function getCharacterPngFilename(
  name: string,
  format: CharacterPngFormat,
): string {
  const normalizedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)

  const safeName =
    normalizedName || 'personagem'

  return (
    `adventure-files-${safeName}-${format}.png`
  )
}

/*
 * Downloads the generated PNG.
 *
 * No generated file is uploaded
 * or stored by the application.
 */

export async function downloadCharacterPng(
  character: Character,
  language: Language,
  format: CharacterPngFormat,
): Promise<void> {
  const blob = await createCharacterPng(
    character,
    language,
    format,
  )

  const url = URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url

  link.download =
    getCharacterPngFilename(
      character.name,
      format,
    )

  document.body.appendChild(link)

  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}