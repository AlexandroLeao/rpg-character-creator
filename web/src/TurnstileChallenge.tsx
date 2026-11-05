import { useEffect, useRef, useState } from 'react'
import type { Language } from './lib/authTranslations'

type TurnstileOptions = {
  sitekey: string
  action: string
  theme: 'dark'
  appearance: 'always'
  size: 'flexible' | 'compact'
  language: 'pt-BR' | 'en'
  'response-field': false
  callback: (token: string) => void
  'expired-callback': () => void
  'timeout-callback': () => void
  'error-callback': () => void
}

type TurnstileClient = {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileClient
  }
}

let scriptPromise: Promise<TurnstileClient> | null = null

function loadTurnstile(): Promise<TurnstileClient> {
  if (window.turnstile) return Promise.resolve(window.turnstile)

  if (!scriptPromise) {
    scriptPromise = new Promise<TurnstileClient>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = () => {
        if (window.turnstile) {
          resolve(window.turnstile)
        } else {
          reject(new Error('Turnstile did not initialize'))
        }
      }
      script.onerror = () => {
        script.remove()
        reject(new Error('Unable to load Turnstile'))
      }
      document.head.appendChild(script)
    }).catch((error: unknown) => {
      scriptPromise = null
      throw error
    })
  }

  return scriptPromise
}

type TurnstileChallengeProps = {
  siteKey: string
  language: Language
  action: 'signIn' | 'signUp' | 'forgotPassword' | 'deleteAccount'
  resetSignal: number
  onTokenChange: (token: string | null) => void
  verified: boolean
}

export function TurnstileChallenge({
  siteKey,
  language,
  action,
  resetSignal,
  onTokenChange,
  verified,
}: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<string | null>(null)
  const [challengeFailed, setChallengeFailed] = useState(false)
  const [retryAttempt, setRetryAttempt] = useState(0)

  useEffect(() => {
    let active = true

    void loadTurnstile()
      .then((client) => {
        if (!active || !containerRef.current) return

        widgetRef.current = client.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'dark',
          appearance: 'always',
          size: window.innerWidth <= 420 ? 'compact' : 'flexible',
          language: language === 'pt' ? 'pt-BR' : 'en',
          'response-field': false,
          callback: (token) => {
            if (active) {
              setChallengeFailed(false)
              onTokenChange(token)
            }
          },
          'expired-callback': () => {
            if (active) {
              setChallengeFailed(true)
              onTokenChange(null)
            }
          },
          'timeout-callback': () => {
            if (active) {
              setChallengeFailed(true)
              onTokenChange(null)
            }
          },
          'error-callback': () => {
            if (active) {
              setChallengeFailed(true)
              onTokenChange(null)
            }
          },
        })
      })
      .catch(() => {
        if (active) {
          setChallengeFailed(true)
          onTokenChange(null)
        }
      })

    return () => {
      active = false
      if (widgetRef.current !== null) {
        window.turnstile?.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [siteKey, action, language, onTokenChange, retryAttempt])

  useEffect(() => {
    if (resetSignal > 0 && widgetRef.current !== null) {
      onTokenChange(null)
      window.turnstile?.reset(widgetRef.current)
    }
  }, [resetSignal, onTokenChange])

  function retryChallenge() {
    onTokenChange(null)
    setChallengeFailed(false)
    setRetryAttempt((attempt) => attempt + 1)
  }

  return (
    <div className="auth-turnstile-group">
      <div
        ref={containerRef}
        className="auth-turnstile"
        aria-label={
          language === 'pt' ? 'Verificação de segurança' : 'Security verification'
        }
      />
      {!verified && (
        <p
          className={
            challengeFailed
              ? 'auth-turnstile-message auth-turnstile-message--error'
              : 'auth-turnstile-message'
          }
          aria-live="polite"
        >
          {challengeFailed
            ? language === 'pt'
              ? 'Falha na verificação de segurança.'
              : 'Security verification failed.'
            : language === 'pt'
              ? 'Aguarde a verificação de segurança.'
              : 'Wait for security verification.'}
        </p>
      )}
      {challengeFailed && (
        <button
          className="auth-turnstile-retry"
          type="button"
          onClick={retryChallenge}
        >
          {language === 'pt' ? 'TENTAR NOVAMENTE' : 'TRY AGAIN'}
        </button>
      )}
    </div>
  )
}
