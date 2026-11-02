
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

import type { Language } from './lib/authTranslations'

import {
  CharacterApiError,
  deleteMyCharacter,
  getMyCharacter,
  type Character,
} from './lib/characterApi'

import {
  characterTranslations,
} from './lib/characterTranslations'

import { CharacterSheet } from './CharacterSheet'
import { CharacterCreator } from './CharacterCreator'

import './CharacterDashboard.css'

/*
 * ADVENTURE FILES
 * CHARACTER DASHBOARD
 *
 * Creation, viewing, editing and
 * confirmed deletion of characters.
 */

type DashboardState =
  | { status: 'loading' }
  | { status: 'empty' }
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

/* ==========================================
   DELETE ERROR MESSAGES
   ========================================== */

function getDeleteErrorMessage(
  language: Language,
  error: unknown,
): string {
  if (error instanceof CharacterApiError) {
    if (
      error.kind === 'unauthorized' ||
      error.kind === 'forbidden'
    ) {
      return language === 'pt'
        ? 'Sua sessão não pôde ser validada. Entre novamente.'
        : 'Your session could not be verified. Please sign in again.'
    }

    if (error.kind === 'conflict') {
      return language === 'pt'
        ? 'O personagem foi alterado. Tente novamente.'
        : 'The character has changed. Please try again.'
    }
  }

  return language === 'pt'
    ? 'Não foi possível excluir o personagem. Verifique sua conexão e tente novamente.'
    : 'Unable to delete the character. Check your connection and try again.'
}

/* ==========================================
   CHARACTER DASHBOARD
   ========================================== */

export function CharacterDashboard({
  accessToken,
  language,
  onCreatorStepChange,
}: CharacterDashboardProps) {
  const [state, setState] =
    useState<DashboardState>({
      status: 'loading',
    })

  const [attempt, setAttempt] = useState(0)

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)

  const creatorOpen = creating || editing

  /* ========================================
     DELETE STATE
     ======================================== */

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false)

  const [deleting, setDeleting] = useState(false)

  const [
    deleteError,
    setDeleteError,
  ] = useState<string | null>(null)

  const deleteInProgress = useRef(false)

  const confirmationToken =
    useRef<string | null>(null)

  /* ========================================
     FOCUS MANAGEMENT
     ======================================== */

  const deleteTriggerRef =
    useRef<HTMLButtonElement>(null)

  const cancelDeleteRef =
    useRef<HTMLButtonElement>(null)

  const confirmDeleteRef =
    useRef<HTMLButtonElement>(null)

  const createButtonRef =
    useRef<HTMLButtonElement>(null)

  const focusCreateAfterDelete = useRef(false)

  const restoreFocusToDeleteButton =
    useRef(false)

  const deleteTitleId = useId()
  const deleteDescriptionId = useId()

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
     LOAD SAVED CHARACTER
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
     DIALOG FOCUS
     ======================================== */

  useEffect(() => {
    if (deleteDialogOpen) {
      cancelDeleteRef.current?.focus()
      return
    }

    if (restoreFocusToDeleteButton.current) {
      deleteTriggerRef.current?.focus()

      restoreFocusToDeleteButton.current = false
    }
  }, [deleteDialogOpen])

  /* ========================================
     FOCUS AFTER SUCCESSFUL DELETION
     ======================================== */

  useEffect(() => {
    if (
      state.status === 'empty' &&
      focusCreateAfterDelete.current
    ) {
      createButtonRef.current?.focus()

      focusCreateAfterDelete.current = false
    }
  }, [state.status])

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
     CREATE CHARACTER
     ======================================== */

  function startCreating() {
    setCreating(true)

    onCreatorStepChange?.(1)
  }

  function cancelCreating() {
    setCreating(false)

    onCreatorStepChange?.(null)
  }

  /* ========================================
     EDIT CHARACTER
     ======================================== */

  function startEditing() {
    if (
      state.status !== 'ready' ||
      deleteDialogOpen
    ) {
      return
    }

    setEditing(true)

    onCreatorStepChange?.(1)
  }

  function cancelEditing() {
    setEditing(false)

    onCreatorStepChange?.(null)
  }

  /* ========================================
     SAVE CALLBACK
     ======================================== */

  function handleCharacterSaved(
    character: Character,
  ) {
    setState({
      status: 'ready',
      character,
    })

    setCreating(false)
    setEditing(false)

    onCreatorStepChange?.(null)
  }

  /* ========================================
     OPEN DELETE CONFIRMATION
     ======================================== */

  function openDeleteConfirmation() {
    if (
      state.status !== 'ready' ||
      creatorOpen ||
      deleting
    ) {
      return
    }

    confirmationToken.current = accessToken

    restoreFocusToDeleteButton.current = false

    setDeleteError(null)
    setDeleteDialogOpen(true)
  }

  /* ========================================
     CANCEL DELETE
     ======================================== */

  function cancelDeleteConfirmation() {
    if (
      deleting ||
      deleteInProgress.current
    ) {
      return
    }

    restoreFocusToDeleteButton.current = true

    confirmationToken.current = null

    setDeleteError(null)
    setDeleteDialogOpen(false)
  }

  /* ========================================
     CONFIRM DELETE
     ======================================== */

  async function confirmDeletion() {
    if (
      state.status !== 'ready' ||
      !deleteDialogOpen ||
      deleteInProgress.current
    ) {
      return
    }

    if (
      confirmationToken.current !== accessToken
    ) {
      cancelDeleteConfirmation()
      return
    }

    deleteInProgress.current = true

    setDeleting(true)
    setDeleteError(null)

    try {
      await deleteMyCharacter(accessToken)

      focusCreateAfterDelete.current = true

      restoreFocusToDeleteButton.current = false

      confirmationToken.current = null

      setState({
        status: 'empty',
      })

      setDeleteDialogOpen(false)

      setCreating(false)
      setEditing(false)

      onCreatorStepChange?.(null)
    } catch (error: unknown) {
      setDeleteError(
        getDeleteErrorMessage(language, error),
      )
    } finally {
      deleteInProgress.current = false

      setDeleting(false)
    }
  }

  /* ========================================
     KEYBOARD SUPPORT
     ======================================== */

  function handleDeleteKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === 'Escape') {
      event.preventDefault()

      if (!deleting) {
        cancelDeleteConfirmation()
      }

      return
    }

    if (
      event.key !== 'Tab' ||
      deleting
    ) {
      return
    }

    const first = cancelDeleteRef.current
    const last = confirmDeleteRef.current

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault()

      last?.focus()
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault()

      first?.focus()
    }
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
      {/* LOADING */}

      {state.status === 'loading' && (
        <p role="status">
          {copy.loading}
        </p>
      )}

      {/* EMPTY STATE */}

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
              ref={createButtonRef}
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

      {/* SAVED CHARACTER */}

      {state.status === 'ready' && (
        editing ? (
          <CharacterCreator
            language={language}
            accessToken={accessToken}
            initialCharacter={state.character}
            onCancel={cancelEditing}
            onStepChange={onCreatorStepChange}
            onSaved={handleCharacterSaved}
          />
        ) : (
          <div className="character-dashboard__saved">
            <CharacterSheet
              character={state.character}
              language={language}
            />

            <div className="character-dashboard__actions">
              <button
                type="button"
                className="character-empty__create-button"
                onClick={startEditing}
                disabled={deleteDialogOpen}
              >
                {language === 'pt'
                  ? 'Editar personagem'
                  : 'Edit character'}
              </button>

              <button
                ref={deleteTriggerRef}
                type="button"
                className="character-dashboard__delete-button"
                onClick={openDeleteConfirmation}
                disabled={deleteDialogOpen}
              >
                {language === 'pt'
                  ? 'Excluir personagem'
                  : 'Delete character'}
              </button>
            </div>
          </div>
        )
      )}

      {/* LOADING ERROR */}

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

      {/* DELETE CONFIRMATION */}

      {deleteDialogOpen &&
        state.status === 'ready' &&
        !editing && (
          <div className="character-delete-overlay">
            <div
              className="character-delete-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={deleteTitleId}
              aria-describedby={deleteDescriptionId}
              aria-busy={deleting}
              onKeyDown={handleDeleteKeyDown}
            >
              <h2
                id={deleteTitleId}
                className="character-delete-dialog__title"
              >
                {language === 'pt'
                  ? 'EXCLUIR PERSONAGEM?'
                  : 'DELETE CHARACTER?'}
              </h2>

              <p
                id={deleteDescriptionId}
                className="character-delete-dialog__description"
              >
                {language === 'pt'
                  ? 'Você está prestes a excluir '
                  : 'You are about to delete '}

                <strong>
                  {state.character.name}
                </strong>.
              </p>

              <p className="character-delete-dialog__warning">
                {language === 'pt'
                  ? 'ESTA AÇÃO NÃO PODE SER DESFEITA.'
                  : 'THIS ACTION CANNOT BE UNDONE.'}
              </p>

              {deleteError && (
                <p role="alert">
                  {deleteError}
                </p>
              )}

              <div className="character-delete-dialog__actions">
                <button
                  ref={cancelDeleteRef}
                  type="button"
                  className="character-delete-dialog__cancel"
                  onClick={cancelDeleteConfirmation}
                  disabled={deleting}
                >
                  {language === 'pt'
                    ? 'CANCELAR'
                    : 'CANCEL'}
                </button>

                <button
                  ref={confirmDeleteRef}
                  type="button"
                  className="character-delete-dialog__confirm"
                  onClick={() => {
                    void confirmDeletion()
                  }}
                  disabled={deleting}
                >
                  {deleting
                    ? language === 'pt'
                      ? 'EXCLUINDO...'
                      : 'DELETING...'
                    : language === 'pt'
                      ? 'EXCLUIR DEFINITIVAMENTE'
                      : 'DELETE PERMANENTLY'}
                </button>
              </div>
            </div>
          </div>
        )}
    </section>
  )
}
