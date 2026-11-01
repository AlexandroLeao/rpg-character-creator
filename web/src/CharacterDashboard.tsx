import { useEffect, useState } from 'react'

import type { Language } from './lib/authTranslations'

import {
  CharacterApiError,
  getMyCharacter,
  type Character,
} from './lib/characterApi'

import {
  characterTranslations,
} from './lib/characterTranslations'

import { CharacterSheet } from './CharacterSheet'

import { CharacterCreator } from './CharacterCreator'

/*
 * ADVENTURE FILES
 * CHARACTER DASHBOARD
 *
 * Supports:
 * - Loading the saved character
 * - Creating a new character
 * - Viewing the saved character
 * - Editing the saved character
 * - Canceling without saving
 */

/* ==========================================
   DASHBOARD STATE
   ========================================== */

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

/* ==========================================
   COMPONENT PROPS
   ========================================== */

type CharacterDashboardProps = {
  accessToken: string

  language: Language

  onCreatorStepChange?: (
    step: number | null,
  ) => void
}

/* ==========================================
   CHARACTER DASHBOARD
   ========================================== */

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

  /* ========================================
     CREATION MODE
     ======================================== */

  const [creating, setCreating] =
    useState(false)

  /* ========================================
     EDITING MODE
     ======================================== */

  const [editing, setEditing] =
    useState(false)

  /*
   * The same creator is used for both
   * creating and editing characters.
   */

  const creatorOpen = creating || editing

  /* ========================================
     TRANSLATIONS
     ======================================== */

  const copy = characterTranslations[language]

  const dashboardTitle = editing
    ? language === 'pt'
      ? 'Editar personagem'
      : 'Edit Character'
    : creating
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
     START EDITING
     ======================================== */

  function startEditing() {
    /*
     * Editing is available only when
     * a saved character exists.
     */

    if (state.status !== 'ready') {
      return
    }

    setEditing(true)

    onCreatorStepChange?.(1)
  }

  /* ========================================
     CANCEL EDITING
     ======================================== */

  function cancelEditing() {
    /*
     * Closing the creator discards the
     * unfinished editing draft.
     *
     * No API request is sent.
     */

    setEditing(false)

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
     *
     * This works for both creation
     * and editing.
     */

    setState({
      status: 'ready',
      character,
    })

    setCreating(false)
    setEditing(false)

    onCreatorStepChange?.(null)
  }

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      className={
        creatorOpen
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
        editing ? (
          /*
           * EDITING MODE
           *
           * Restore existing selections
           * inside the six-stage creator.
           */

          <CharacterCreator
            language={language}
            accessToken={accessToken}
            initialCharacter={state.character}
            onCancel={cancelEditing}
            onStepChange={onCreatorStepChange}
            onSaved={handleCharacterSaved}
          />
        ) : (
          /*
           * SAVED CHARACTER SHEET
           */

          <div className="character-dashboard__saved">
            <CharacterSheet
              character={state.character}
              language={language}
            />

            {/* EDIT CHARACTER BUTTON */}

            <button
              type="button"
              className="character-empty__create-button"
              onClick={startEditing}
            >
              {language === 'pt'
                ? 'EDITAR PERSONAGEM'
                : 'EDIT CHARACTER'}
            </button>
          </div>
        )
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