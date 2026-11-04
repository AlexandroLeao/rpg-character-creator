import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
import type { Language } from './lib/authTranslations'

type ExtrasDialogProps = {
  language: Language
  onClose: () => void
}

const translations = {
  pt: {
    aboutTitle: 'SOBRE O PROJETO',
    about: 'Adventure Files é um criador de personagens de RPG desenvolvido como projeto full stack de portfólio.',
    creditsTitle: 'CRÉDITOS',
    credits: 'Idealização, direção criativa e desenvolvimento:',
    inspirationsTitle: 'INSPIRAÇÕES',
    inspirations: 'RPGs de mesa, aventuras e jogos clássicos, pixel art e interfaces de computadores dos anos 80 e 90.',
    contactTitle: 'SUPORTE E CONTATO',
    close: 'FECHAR',
  },
  en: {
    aboutTitle: 'ABOUT THE PROJECT',
    about: 'Adventure Files is an RPG character creator built as a full-stack portfolio project.',
    creditsTitle: 'CREDITS',
    credits: 'Concept, creative direction and development:',
    inspirationsTitle: 'INSPIRATIONS',
    inspirations: 'Tabletop RPGs, classic adventure games, pixel art, and computer interfaces from the 1980s and 1990s.',
    contactTitle: 'SUPPORT & CONTACT',
    close: 'CLOSE',
  },
} as const

export function ExtrasDialog({ language, onClose }: ExtrasDialogProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const copy = translations[language]

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    return () => {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const items = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href]',
    )
    if (!items?.length) return

    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="character-delete-overlay">
      <div
        ref={dialogRef}
        className="character-delete-dialog extras-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
      >
        <div className="extras-dialog__header">
          <h2 id={titleId} className="character-delete-dialog__title">
            EXTRAS
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="extras-dialog__close"
            onClick={onClose}
          >
            {copy.close}
          </button>
        </div>

        <section className="extras-dialog__section">
          <h3>{copy.aboutTitle}</h3>
          <p>{copy.about}</p>
        </section>
        <section className="extras-dialog__section">
          <h3>{copy.creditsTitle}</h3>
          <p>{copy.credits} <strong>Alexandro Milhomes Leão</strong>.</p>
        </section>
        <section className="extras-dialog__section">
          <h3>{copy.inspirationsTitle}</h3>
          <p>{copy.inspirations}</p>
        </section>
        <section className="extras-dialog__section">
          <h3>{copy.contactTitle}</h3>
          <p>
            <a href="mailto:adventurefiles.suporte@gmail.com">
              adventurefiles.suporte@gmail.com
            </a>
          </p>
          <p>
            <a
              href="https://github.com/AlexandroLeao"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/AlexandroLeao
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
