import { useEffect, useRef } from 'react'
import type { Language } from './lib/authTranslations'

type TurnstileOptions = {
  sitekey: string
  action: string
  theme: 'dark'
  appearance: 'interaction-only'
  size: 'flexible'
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
  action: 'signIn' | 'signUp' | 'forgotPassword'
  resetSignal: number
  onTokenChange: (token: string | null) => void
}

export function TurnstileChallenge({
  siteKey,
  language,
  action,
  resetSignal,
  onTokenChange,
}: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<string | null>(null)

  useEffect(() => {
    let active = true

    void loadTurnstile()
      .then((client) => {
        if (!active || !containerRef.current) return

        widgetRef.current = client.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'dark',
          appearance: 'interaction-only',
          size: 'flexible',
          language: language === 'pt' ? 'pt-BR' : 'en',
          'response-field': false,
          callback: (token) => {
            if (active) onTokenChange(token)
          },
          'expired-callback': () => {
            if (active) onTokenChange(null)
          },
          'timeout-callback': () => {
            if (active) onTokenChange(null)
          },
          'error-callback': () => {
            if (active) onTokenChange(null)
          },
        })
      })
      .catch(() => {
        if (active) onTokenChange(null)
      })

    return () => {
      active = false
      if (widgetRef.current !== null) {
        window.turnstile?.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [siteKey, action, language, onTokenChange])

  useEffect(() => {
    if (resetSignal > 0 && widgetRef.current !== null) {
      onTokenChange(null)
      window.turnstile?.reset(widgetRef.current)
    }
  }, [resetSignal, onTokenChange])

  return (
    <div
      ref={containerRef}
      className="auth-turnstile"
      aria-label={language === 'pt'
        ? 'Verificação de segurança'
        : 'Security verification'}
    />
  )
}
