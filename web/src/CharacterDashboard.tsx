import { useEffect, useState } from 'react'

import type { Language } from './lib/authTranslations'

import {
  CharacterApiError,
  getMyCharacter,
  type Character,
} from './lib/characterApi'

import { characterTranslations } from './lib/characterTranslations'

import { CharacterSheet } from './CharacterSheet'

import { CharacterCreator } from './CharacterCreator'

/*
 * ADVENTURE FILES
 * CHARACTER DASHBOARD
 */

type DashboardState =
  | {
      status: 'loading'
    }
  | {
      status: 'empty'
    }
  | {
      status: 'ready'
      character: Character
    }
  | {
      status: 'error'
      reason: 'session' | 'unavailable'
    }

type CharacterDashboardProps = {
  accessToken: string
  language: Language

  onCreatorStepChange?: (
    step: number | null,
  ) => void
}

export function CharacterDashboard({
  accessToken,
  language,
  onCreatorStepChange,
}: CharacterDashboardProps) {
  /* ========================================
     DASHBOARD STATE
     ======================================== */

  const [state, setState] =
    useState<DashboardState>({
      status: 'loading',
    })

  const [attempt, setAttempt] = useState(0)

  const [creating, setCreating] =
    useState(false)

  /* ========================================
     TRANSLATIONS
     ======================================== */

  const copy = characterTranslations[language]

  const dashboardTitle = creating
    ? language === 'pt'
      ? 'Criar personagem'
      : 'Create Character'
    : copy.title

  /* ========================================
     LOAD CHARACTER
     ======================================== */

  useEffect(() => {
    const controller = new AbortController()

    void getMyCharacter(
      accessToken,
      controller.signal,
    )
      .then((character) => {
        if (controller.signal.aborted) {
          return
        }

        if (character === null) {
          setState({
            status: 'empty',
          })

          return
        }

        setState({
          status: 'ready',
          character,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        const sessionError =
          error instanceof CharacterApiError &&
          (
            error.kind === 'unauthorized' ||
            error.kind === 'forbidden'
          )

        setState({
          status: 'error',
          reason: sessionError
            ? 'session'
            : 'unavailable',
        })
      })

    return () => {
      controller.abort()
    }
  }, [accessToken, attempt])

  /* ========================================
     RETRY LOADING
     ======================================== */

  function retry() {
    setState({
      status: 'loading',
    })

    setAttempt((current) => current + 1)
  }

  /* ========================================
     START CREATING
     ======================================== */

  function startCreating() {
    setCreating(true)

    onCreatorStepChange?.(1)
  }

  /* ========================================
     CANCEL CREATION
     ======================================== */

  function cancelCreating() {
    setCreating(false)

    onCreatorStepChange?.(null)
  }

  /* ========================================
     CHARACTER SAVED
     ======================================== */

  function handleCharacterSaved(
    character: Character,
  ) {
    /*
     * Update the dashboard only after
     * the server confirms persistence.
     */

    setState({
      status: 'ready',
      character,
    })

    setCreating(false)

    onCreatorStepChange?.(null)
  }

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      className={
        creating
          ? 'character-dashboard character-dashboard--creating'
          : 'character-dashboard'
      }
      aria-label={dashboardTitle}
    >
      {/* ===================================
          LOADING
          =================================== */}

      {state.status === 'loading' && (
        <p role="status">
          {copy.loading}
        </p>
      )}

      {/* ===================================
          EMPTY STATE / CHARACTER CREATOR
          =================================== */}

      {state.status === 'empty' && (
        creating ? (
          <CharacterCreator
            language={language}
            accessToken={accessToken}
            onCancel={cancelCreating}
            onStepChange={onCreatorStepChange}
            onSaved={handleCharacterSaved}
          />
        ) : (
          <div className="character-empty">
            <button
              type="button"
              className="character-empty__create-button"
              onClick={startCreating}
            >
              {language === 'pt'
                ? 'Criar Personagem'
                : 'Create Character'}
            </button>
          </div>
        )
      )}

      {/* ===================================
          SAVED CHARACTER
          =================================== */}

      {state.status === 'ready' && (
        <CharacterSheet
          character={state.character}
          language={language}
        />
      )}

      {/* ===================================
          ERROR STATE
          =================================== */}

      {state.status === 'error' && (
        <div className="character-error">
          <p role="alert">
            {state.reason === 'session'
              ? copy.sessionError
              : copy.loadError}
          </p>

          <button
            type="button"
            onClick={retry}
          >
            {copy.retry}
          </button>
        </div>
      )}
    </section>
  )
}