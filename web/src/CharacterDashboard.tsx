import { Fragment, useEffect, useState } from 'react'

import type { Language } from './lib/authTranslations'

import {
  CharacterApiError,
  getMyCharacter,
  type Character,
} from './lib/characterApi'

import {
  characterFieldKeys,
  characterTranslations,
  translateCharacterOption,
} from './lib/characterTranslations'

type DashboardState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'ready'; character: Character }
  | {
      status: 'error'
      reason: 'session' | 'unavailable'
    }

type CharacterDashboardProps = {
  accessToken: string
  language: Language
}

export function CharacterDashboard({
  accessToken,
  language,
}: CharacterDashboardProps) {
  const [state, setState] = useState<DashboardState>({
    status: 'loading',
  })

  const [attempt, setAttempt] = useState(0)

  const copy = characterTranslations[language]

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
          setState({ status: 'empty' })
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

  function retry() {
    setState({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  return (
    <section
      className="character-dashboard"
      aria-label={copy.title}
    >
      <h2>{copy.title}</h2>

      {state.status === 'loading' && (
        <p role="status">
          {copy.loading}
        </p>
      )}

      {state.status === 'empty' && (
        <div className="character-empty">
          <p>{copy.empty}</p>
          <p>{copy.upcoming}</p>
        </div>
      )}

      {state.status === 'ready' && (
        <div className="character-details">
          <h3>{state.character.name}</h3>

          <dl>
            {characterFieldKeys.map((field) => (
              <Fragment key={field}>
                <dt>{copy.fields[field]}</dt>

                <dd>
                  {translateCharacterOption(
                    language,
                    field,
                    state.character[field],
                  )}
                </dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )}

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