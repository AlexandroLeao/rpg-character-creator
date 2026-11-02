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
 * Both formats use the same approved character-sheet design,
 * the original class artwork and the actual project favicon.
 * Everything is rendered locally in the user's browser.
 */

export type CharacterPngFormat = 'story' | 'portrait'

export const characterPngDimensions = {
  story: { width: 1080, height: 1920 },
  portrait: { width: 1080, height: 1350 },
} as const

export const characterSheetLogoSource = '/favicon.png'

const colors = {
  background: '#03170c',
  panel: '#062113',
  border: '#91cf82',
  green: '#acf58c',
  cream: '#f5efd2',
  muted: '#b6cbb0',
} as const

type Layout = {
  logoTop: number
  logoSize: number
  brandY: number
  titleY: number
  artworkTop: number
  artworkHeight: number
  identityTop: number
  identityHeight: number
  sectionsTop: number
  sectionHeight: number
  sectionGap: number
  footerY: number
}

const layouts: Record<CharacterPngFormat, Layout> = {
  story: {
    logoTop: 58,
    logoSize: 82,
    brandY: 220,
    titleY: 281,
    artworkTop: 328,
    artworkHeight: 640,
    identityTop: 989,
    identityHeight: 135,
    sectionsTop: 1149,
    sectionHeight: 288,
    sectionGap: 24,
    footerY: 1855,
  },
  portrait: {
    logoTop: 32,
    logoSize: 65,
    brandY: 151,
    titleY: 199,
    artworkTop: 227,
    artworkHeight: 344,
    identityTop: 587,
    identityHeight: 112,
    sectionsTop: 717,
    sectionHeight: 216,
    sectionGap: 18,
    footerY: 1284,
  },
}

const canvasWidth = 1080
const margin = 40
const columnGap = 18
const contentWidth = canvasWidth - margin * 2
const columnWidth = (contentWidth - columnGap) / 2

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
): number {
  const displayValue = value.toLocaleUpperCase()
  let fontSize = initialSize

  context.fillStyle = color
  context.textAlign = align
  context.textBaseline = 'alphabetic'

  while (fontSize > minimumSize) {
    context.font = fontSize + 'px "Press Start 2P", monospace'
    if (context.measureText(displayValue).width <= maxWidth) {
      break
    }
    fontSize -= 1
  }

  context.font = fontSize + 'px "Press Start 2P", monospace'
  context.fillText(displayValue, x, y, maxWidth)
  return Math.min(context.measureText(displayValue).width, maxWidth)
}

function drawPanel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  context.fillStyle = colors.panel
  context.fillRect(x, y, width, height)
  context.strokeStyle = colors.border
  context.lineWidth = 3
  context.strokeRect(x, y, width, height)
}

/* Pixel-stepped double border from the approved export reference. */
function drawOuterFrame(
  context: CanvasRenderingContext2D,
  height: number,
): void {
  context.strokeStyle = colors.green
  context.lineWidth = 5
  context.strokeRect(15, 17, canvasWidth - 30, height - 34)

  context.lineWidth = 2
  context.strokeRect(27, 29, canvasWidth - 54, height - 58)

  context.fillStyle = colors.green
  for (const atRight of [false, true]) {
    for (const atBottom of [false, true]) {
      const edgeX = atRight ? canvasWidth - 16 : 10
      const edgeY = atBottom ? height - 18 : 12
      const xDirection = atRight ? -1 : 1
      const yDirection = atBottom ? -1 : 1

      context.fillRect(edgeX, edgeY, xDirection * 17, yDirection * 7)
      context.fillRect(
        edgeX + xDirection * 7,
        edgeY + yDirection * 7,
        xDirection * 16,
        yDirection * 7,
      )
      context.fillRect(
        edgeX + xDirection * 14,
        edgeY + yDirection * 14,
        xDirection * 13,
        yDirection * 6,
      )
    }
  }
}

function drawLogo(
  context: CanvasRenderingContext2D,
  logo: HTMLImageElement | undefined,
  centerX: number,
  top: number,
  size: number,
): void {
  if (!logo) {
    return
  }

  context.save()
  context.imageSmoothingEnabled = false
  context.drawImage(logo, centerX - size / 2, top, size, size)
  context.restore()
}

function drawHeader(
  context: CanvasRenderingContext2D,
  data: CharacterExportData,
  layout: Layout,
  logo: HTMLImageElement | undefined,
): void {
  const center = canvasWidth / 2
  const ornamentY = layout.logoTop + layout.logoSize / 2

  context.fillStyle = colors.green
  context.fillRect(155, ornamentY, 265, 2)
  context.fillRect(660, ornamentY, 265, 2)
  context.fillRect(436, ornamentY - 4, 8, 8)
  context.fillRect(636, ornamentY - 4, 8, 8)

  drawLogo(context, logo, center, layout.logoTop, layout.logoSize)

  drawFittedText(
    context, 'ADVENTURE FILES', center, layout.brandY,
    contentWidth, 43, 30, colors.green, 'center',
  )
  drawFittedText(
    context, data.title, center, layout.titleY,
    contentWidth, 25, 19, colors.cream, 'center',
  )
}

function drawArtwork(
  context: CanvasRenderingContext2D,
  artwork: HTMLImageElement,
  layout: Layout,
): void {
  drawPanel(
    context, margin, layout.artworkTop,
    contentWidth, layout.artworkHeight,
  )

  const availableWidth = contentWidth - 50
  const availableHeight = layout.artworkHeight - 38
  const scale = Math.min(
    availableWidth / artwork.naturalWidth,
    availableHeight / artwork.naturalHeight,
  )
  const imageWidth = artwork.naturalWidth * scale
  const imageHeight = artwork.naturalHeight * scale

  context.save()
  context.imageSmoothingEnabled = false
  context.beginPath()
  context.rect(
    margin + 5, layout.artworkTop + 5,
    contentWidth - 10, layout.artworkHeight - 10,
  )
  context.clip()
  context.drawImage(
    artwork,
    (canvasWidth - imageWidth) / 2,
    layout.artworkTop + (layout.artworkHeight - imageHeight) / 2,
    imageWidth, imageHeight,
  )
  context.restore()
}

function drawIdentityPanel(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  height: number,
  valueColor: string,
  valueSize: number,
): void {
  drawPanel(context, x, y, columnWidth, height)
  const center = x + columnWidth / 2
  const labelY = y + (height < 120 ? 37 : 42)

  context.fillStyle = colors.border
  context.fillRect(x + 30, labelY - 7, 115, 2)
  context.fillRect(x + columnWidth - 145, labelY - 7, 115, 2)

  drawFittedText(
    context, label, center, labelY,
    columnWidth - 300, 19, 14, colors.muted, 'center',
  )
  drawFittedText(
    context, value, center, y + height - 34,
    columnWidth - 50, valueSize, 17, valueColor, 'center',
  )
}

function drawSection(
  context: CanvasRenderingContext2D,
  section: CharacterExportSection,
  x: number,
  y: number,
  height: number,
): void {
  drawPanel(context, x, y, columnWidth, height)
  const padding = 24
  const innerWidth = columnWidth - padding * 2

  drawFittedText(
    context, section.title, x + padding, y + 42,
    innerWidth, 22, 14, colors.green,
  )

  context.fillStyle = colors.border
  context.fillRect(x + padding, y + 63, innerWidth, 2)

  // The lower row needs equal breathing room above the text and
  // below its baseline. Keep both format sizes and panel positions.
  const firstY = y + (height < 240 ? 117 : 141)
  const secondY = y + (height < 240 ? 195 : 250)

  context.fillStyle = colors.border
  context.fillRect(
    x + padding, (firstY + secondY) / 2,
    innerWidth, 1,
  )

  section.fields.slice(0, 2).forEach((field, index) => {
    const rowY = index === 0 ? firstY : secondY

    // Reserve only the space the label needs. The remaining width
    // belongs to the value, so longer choices stay legible without
    // colliding with their labels (in Story and Portrait alike).
    const labelWidth = drawFittedText(
      context, field.label,
      x + padding, rowY,
      innerWidth * 0.58, 17, 14, colors.muted,
    )

    drawFittedText(
      context, field.value,
      x + columnWidth - padding, rowY,
      innerWidth - labelWidth - 22,
      21, 15, colors.cream, 'right',
    )
  })
}

function drawFooter(
  context: CanvasRenderingContext2D,
  layout: Layout,
  logo: HTMLImageElement | undefined,
): void {
  const lineY = layout.footerY - 15
  context.fillStyle = colors.green
  context.fillRect(80, lineY, 200, 2)
  context.fillRect(800, lineY, 200, 2)
  context.fillRect(298, lineY - 4, 8, 8)
  context.fillRect(774, lineY - 4, 8, 8)

  // Use an exact 4:1 pixel reduction from the 256px favicon for a crisp D20.
  drawLogo(context, logo, 402, layout.footerY - 49, 64)

  drawFittedText(
    context, 'ADVENTURE FILES', 448, layout.footerY,
    380, 18, 14, colors.green, 'left',
  )
}

export function renderCharacterPng(
  data: CharacterExportData,
  artwork: HTMLImageElement,
  format: CharacterPngFormat,
  logo?: HTMLImageElement,
): HTMLCanvasElement {
  const dimensions = characterPngDimensions[format]
  const layout = layouts[format]
  const canvas = document.createElement('canvas')

  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas rendering is unavailable.')
  }
  if (artwork.naturalWidth <= 0 || artwork.naturalHeight <= 0) {
    throw new Error('Character artwork is invalid.')
  }
  if (logo && (logo.naturalWidth <= 0 || logo.naturalHeight <= 0)) {
    throw new Error('Character sheet logo is invalid.')
  }

  context.fillStyle = colors.background
  context.fillRect(0, 0, canvas.width, canvas.height)

  drawOuterFrame(context, canvas.height)
  drawHeader(context, data, layout, logo)
  drawArtwork(context, artwork, layout)

  const nameLabel = data.title === 'CHARACTER SHEET' ? 'NAME' : 'NOME'
  drawIdentityPanel(
    context, nameLabel, data.name,
    margin, layout.identityTop, layout.identityHeight,
    colors.cream, 30,
  )
  drawIdentityPanel(
    context, data.classFieldLabel, data.classLabel,
    margin + columnWidth + columnGap,
    layout.identityTop, layout.identityHeight,
    colors.green, 25,
  )

  data.sections.forEach((section, index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const x = margin + column * (columnWidth + columnGap)
    const y = layout.sectionsTop +
      row * (layout.sectionHeight + layout.sectionGap)

    drawSection(context, section, x, y, layout.sectionHeight)
  })

  drawFooter(context, layout, logo)
  return canvas
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        reject(new Error('Image is invalid.'))
        return
      }
      resolve(image)
    }

    image.onerror = () => reject(new Error('Unable to load image.'))
    image.src = source
  })
}

export async function createCharacterPng(
  character: Character,
  language: Language,
  format: CharacterPngFormat,
): Promise<Blob> {
  const data = prepareCharacterExportData(character, language)

  if (document.fonts) {
    await document.fonts.ready
  }

  const [artwork, logo] = await Promise.all([
    loadImage(data.artworkSource),
    loadImage(characterSheetLogoSource),
  ])

  const canvas = renderCharacterPng(data, artwork, format, logo)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to generate PNG.'))
        return
      }
      resolve(blob)
    }, 'image/png')
  })
}

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

  const safeName = normalizedName || 'personagem'
  return 'adventure-files-' + safeName + '-' + format + '.png'
}

export async function downloadCharacterPng(
  character: Character,
  language: Language,
  format: CharacterPngFormat,
): Promise<void> {
  const blob = await createCharacterPng(character, language, format)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = getCharacterPngFilename(character.name, format)
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}
