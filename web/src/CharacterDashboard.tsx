import { useEffect, useState } from 'react'

import {
  CharacterApiError,
  getMyCharacter,
  type Character,
} from './lib/characterApi'

type DashboardState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'ready'; character: Character }
  | { status: 'error'; message: string }

type CharacterDashboardProps = {
  accessToken: string
}

export function CharacterDashboard({
  accessToken,
}: CharacterDashboardProps) {
  const [state, setState] = useState<DashboardState>({
    status: 'loading',
  })

  const [attempt, setAttempt] = useState(0)

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
          message: sessionError
            ? 'Sua sessão não pôde ser validada. Entre novamente.'
            : 'Não foi possível carregar seu personagem.',
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
      aria-label="Meu personagem"
    >
      <h2>Meu personagem</h2>

      {state.status === 'loading' && (
        <p role="status">
          Carregando personagem...
        </p>
      )}

      {state.status === 'empty' && (
        <div className="character-empty">
          <p>Você ainda não criou seu personagem.</p>
          <p>
            Em breve, você poderá começar sua aventura!
          </p>
        </div>
      )}

      {state.status === 'ready' && (
        <div className="character-details">
          <h3>{state.character.name}</h3>

          <dl>
            <dt>Classe</dt>
            <dd>{state.character.characterClass}</dd>

            <dt>Ancestralidade</dt>
            <dd>{state.character.ancestry}</dd>

            <dt>Origem</dt>
            <dd>{state.character.background}</dd>

            <dt>Arma</dt>
            <dd>{state.character.weapon}</dd>

            <dt>Artefato</dt>
            <dd>{state.character.artifact}</dd>

            <dt>Personalidade</dt>
            <dd>{state.character.personality}</dd>

            <dt>Aura</dt>
            <dd>{state.character.aura}</dd>

            <dt>Companheiro</dt>
            <dd>{state.character.companion}</dd>
          </dl>
        </div>
      )}

      {state.status === 'error' && (
        <div className="character-error">
          <p role="alert">{state.message}</p>

          <button
            type="button"
            onClick={retry}
          >
            Tentar novamente
          </button>
        </div>
      )}
    </section>
  )
}