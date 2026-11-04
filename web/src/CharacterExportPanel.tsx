
import {
  useId,
  useRef,
  useState,
} from 'react'

import type { Language } from './lib/authTranslations'
import type { Character } from './lib/characterApi'

import {
  downloadCharacterPng,
  type CharacterPngFormat,
} from './lib/characterPngExport'

import './CharacterExportPanel.css'

/*
 * ADVENTURE FILES
 * CHARACTER EXPORT PANEL
 *
 * Offers downloadable PNG formats
 * for an already saved character.
 */

type CharacterExportPanelProps = {
  character: Character
  language: Language
}

const translations = {
  pt: {
    title: 'Exportar',
    choose: 'ESCOLHA O FORMATO',
    story: 'PNG STORY — 1080 × 1920',
    portrait: 'PNG RETRATO — 1080 × 1350',
    generating: 'GERANDO ARQUIVO...',
    error:
      'Não foi possível gerar a imagem. Tente novamente.',
  },

  en: {
    title: 'Export',
    choose: 'CHOOSE A FORMAT',
    story: 'PNG STORY — 1080 × 1920',
    portrait: 'PNG PORTRAIT — 1080 × 1350',
    generating: 'GENERATING FILE...',
    error:
      'Unable to generate the image. Please try again.',
  },
} as const

export function CharacterExportPanel({
  character,
  language,
}: CharacterExportPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [generating, setGenerating] =
    useState<CharacterPngFormat | null>(null)

  const [error, setError] = useState<string | null>(null)

  const inProgress = useRef(false)

  const optionsId = useId()

  const copy = translations[language]

  /* ========================================
     OPEN / CLOSE EXPORT OPTIONS
     ======================================== */

  function togglePanel() {
    if (inProgress.current) {
      return
    }

    setError(null)
    setIsOpen((current) => !current)
  }

  /* ========================================
     GENERATE PNG
     ======================================== */

  async function handleExport(
    format: CharacterPngFormat,
  ) {
    if (inProgress.current) {
      return
    }

    inProgress.current = true

    setGenerating(format)
    setError(null)

    try {
      await downloadCharacterPng(
        character,
        language,
        format,
      )
    } catch {
      setError(copy.error)
    } finally {
      inProgress.current = false
      setGenerating(null)
    }
  }

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      className="character-export"
      aria-label={copy.title}
    >
      <button
        type="button"
        className="character-export__toggle"
        aria-expanded={isOpen}
        aria-controls={optionsId}
        disabled={generating !== null}
        onClick={togglePanel}
      >
        {copy.title}
      </button>

      {isOpen && (
        <div
          id={optionsId}
          className="character-export__panel"
        >
          <p className="character-export__heading">
            {copy.choose}
          </p>

          <div className="character-export__options">
            <button
              type="button"
              className="character-export__option"
              disabled={generating !== null}
              onClick={() => {
                void handleExport('story')
              }}
            >
              {copy.story}
            </button>

            <button
              type="button"
              className="character-export__option"
              disabled={generating !== null}
              onClick={() => {
                void handleExport('portrait')
              }}
            >
              {copy.portrait}
            </button>
          </div>

          {generating !== null && (
            <p
              className="character-export__status"
              role="status"
            >
              {copy.generating}
            </p>
          )}

          {error && (
            <p
              className="character-export__error"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
