import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from './lib/supabase'

import {
  sendPasswordReset,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  updatePassword,
} from './lib/auth'

import {
  authTranslations,
  type AuthMode,
  type Language,
} from './lib/authTranslations'

import { CharacterDashboard } from './CharacterDashboard'
import { StartScreen } from './StartScreen'

import './App.css'

type Feedback = {
  kind: 'error' | 'success'
  text: string
} | null

const LANGUAGE_STORAGE_KEY = 'adventure-files-language'

function getInitialLanguage(): Language {
  try {
    const storedLanguage = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    )

    return storedLanguage === 'pt' ? 'pt' : 'en'
  } catch {
    return 'en'
  }
}

function App() {
  /*
   * SESSION AND AUTHENTICATION
   */

  const [session, setSession] = useState<Session | null>(null)

  const [checkingSession, setCheckingSession] = useState(true)

  const [hasStarted, setHasStarted] = useState(
    () => window.location.pathname === '/reset-password',
  )

  const [showLoginReveal, setShowLoginReveal] = useState(false)

  const [mode, setMode] = useState<AuthMode>(() =>
    window.location.pathname === '/reset-password'
      ? 'resetPassword'
      : 'signIn',
  )

  /*
   * LANGUAGE
   */

  const [language, setLanguage] = useState<Language>(
    getInitialLanguage,
  )

  /*
   * AUTHENTICATION FORM
   */

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [working, setWorking] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  /*
   * CHARACTER CREATOR PROGRESS
   *
   * null = creator is closed
   * 1    = identity (class and name)
   * 2    = origins (ancestry and background)
   * 3    = equipment (weapon and artifact)
   * 4    = essence (personality and aura)
   * 5    = journey (companion and motivation)
   * 6    = final review and save
   */

  const [creatorStep, setCreatorStep] =
    useState<number | null>(null)

  const copy = authTranslations[language]

  const isDashboard =
    session !== null && mode !== 'resetPassword'

  /*
   * SUPABASE SESSION
   */

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        setSession(nextSession)
        setCheckingSession(false)

        /*
         * Reset creator progress when the
         * authenticated session ends.
         */

        if (!nextSession) {
          setCreatorStep(null)
        }

        if (event === 'PASSWORD_RECOVERY') {
          setMode('resetPassword')
          setFeedback(null)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [])

  /*
   * LANGUAGE SELECTION
   */

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)

    try {
      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        nextLanguage,
      )
    } catch {
      // The interface remains usable if storage is unavailable.
    }
  }

  /*
   * AUTHENTICATION MODES
   */

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setPassword('')
    setConfirmPassword('')
    setFeedback(null)
  }

  function requestNewRecoveryLink() {
    window.history.replaceState(null, '', '/')
    changeMode('forgotPassword')
  }

  /*
   * LOGIN / REGISTRATION / PASSWORD RECOVERY
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setFeedback(null)

    /*
     * DISPLAY NAME VALIDATION
     */

    if (
      mode === 'signUp' &&
      displayName.trim().length < 2
    ) {
      setFeedback({
        kind: 'error',
        text: copy.displayNameTooShort,
      })

      return
    }

    /*
     * PASSWORD VALIDATION
     */

    const requiresNewPassword =
      mode === 'signUp' || mode === 'resetPassword'

    if (
      requiresNewPassword &&
      password.length < 8
    ) {
      setFeedback({
        kind: 'error',
        text: copy.passwordTooShort,
      })

      return
    }

    if (
      requiresNewPassword &&
      password !== confirmPassword
    ) {
      setFeedback({
        kind: 'error',
        text: copy.passwordsMismatch,
      })

      return
    }

    setWorking(true)

    try {
      /*
       * PASSWORD RECOVERY REQUEST
       */

      if (mode === 'forgotPassword') {
        const { error } = await sendPasswordReset(email)

        setFeedback(
          error
            ? {
                kind: 'error',
                text: copy.recoveryRequestFailure,
              }
            : {
                kind: 'success',
                text: copy.recoveryRequestSuccess,
              },
        )

        return
      }

      /*
       * RESET PASSWORD
       */

      if (mode === 'resetPassword') {
        if (!session) {
          setFeedback({
            kind: 'error',
            text: copy.invalidRecoverySession,
          })

          return
        }

        const { error } = await updatePassword(password)

        if (error) {
          setFeedback({
            kind: 'error',
            text: copy.updatePasswordFailure,
          })

          return
        }

        window.history.replaceState(null, '', '/')

        setMode('signIn')

        setFeedback({
          kind: 'success',
          text: copy.updatePasswordSuccess,
        })

        return
      }

      /*
       * CREATE ACCOUNT
       */

      if (mode === 'signUp') {
        const { error } = await signUpWithEmail(
          displayName,
          email,
          password,
        )

        if (error) {
          setFeedback({
            kind: 'error',
            text: copy.signUpFailure,
          })

          return
        }

        setMode('signIn')

        setFeedback({
          kind: 'success',
          text: copy.signUpSuccess,
        })

        return
      }

      /*
       * SIGN IN
       */

      const { error } = await signInWithEmail(
        email,
        password,
      )

      if (error) {
        setFeedback({
          kind: 'error',
          text: copy.signInFailure,
        })
      }
    } catch {
      setFeedback({
        kind: 'error',
        text: copy.unexpectedError,
      })
    } finally {
      setPassword('')
      setConfirmPassword('')
      setWorking(false)
    }
  }

  /*
   * SIGN OUT
   */

  async function handleSignOut() {
    setWorking(true)
    setFeedback(null)

    try {
      const { error } = await signOut()

      if (error) {
        setFeedback({
          kind: 'error',
          text: copy.signOutFailure,
        })
      }
    } catch {
      setFeedback({
        kind: 'error',
        text: copy.signOutFailure,
      })
    } finally {
      setWorking(false)
    }
  }

  /*
   * ADVENTURE FILES START SCREEN
   */

  if (
    !hasStarted &&
    !session &&
    mode !== 'resetPassword'
  ) {
    return (
      <StartScreen
        onStart={() => {
          setShowLoginReveal(true)
          setHasStarted(true)
        }}
      />
    )
  }

  /*
   * AUTHENTICATION AND CHARACTER AREA
   */

  const shellClassName = [
    'auth-shell',
    showLoginReveal ? 'auth-shell--reveal' : '',
    isDashboard ? 'auth-shell--dashboard' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const windowClassName = [
    'auth-window',
    isDashboard ? 'auth-window--dashboard' : '',
  ]
    .filter(Boolean)
    .join(' ')

  /*
   * WINDOW HEADER
   *
   * During character creation, show
   * the current step on the left.
   *
   * The creator contains six stages.
   *
   * PT / EN remains on the right.
   *
   * The dashboard title uses uppercase.
   */

  const heading = isDashboard
    ? creatorStep === null
      ? copy.myCharacter.toUpperCase()
      : `${String(creatorStep).padStart(2, '0')} / 06`
    : copy.titles[mode]

  /*
   * RENDER
   */

  return (
    <main className={shellClassName}>
      <section className={windowClassName}>
        {/* WINDOW HEADER */}

        <header className="auth-titlebar">
          <h1 className="auth-titlebar__heading">
            {heading}
          </h1>

          {/* LANGUAGE SELECTOR */}

          <nav
            className="auth-language"
            aria-label={copy.languageSelector}
          >
            <button
              type="button"
              aria-label="Português"
              aria-pressed={language === 'pt'}
              onClick={() => changeLanguage('pt')}
            >
              PT
            </button>

            <span aria-hidden="true">/</span>

            <button
              type="button"
              aria-label="English"
              aria-pressed={language === 'en'}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
          </nav>
        </header>

        {/* WINDOW CONTENT */}

        <div className="auth-content">
          {checkingSession ? (
            /*
             * CHECKING SESSION
             */

            <p role="status">
              {copy.checkingSession}
            </p>
          ) : mode === 'resetPassword' && !session ? (
            /*
             * INVALID PASSWORD RECOVERY SESSION
             */

            <div className="auth-success">
              <p role="alert">
                {copy.recoveryLinkInvalid}
              </p>

              <button
                type="button"
                onClick={requestNewRecoveryLink}
              >
                {copy.requestNewLink}
              </button>
            </div>
          ) : isDashboard && session ? (
            /*
             * AUTHENTICATED CHARACTER DASHBOARD
             */

            <div className="auth-success">
              <CharacterDashboard
                key={session.user.id}
                accessToken={session.access_token}
                language={language}
                onCreatorStepChange={setCreatorStep}
              />

              {/* SIGN OUT */}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={working}
              >
                {working
                  ? copy.signingOut
                  : copy.signOut}
              </button>
            </div>
          ) : (
            /*
             * AUTHENTICATION FORM
             */

            <>
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                {/* DISPLAY NAME */}

                {mode === 'signUp' && (
                  <>
                    <label htmlFor="displayName">
                      {copy.displayName}
                    </label>

                    <input
                      id="displayName"
                      type="text"
                      autoComplete="nickname"
                      required
                      minLength={2}
                      value={displayName}
                      onChange={(event) =>
                        setDisplayName(event.target.value)
                      }
                    />
                  </>
                )}

                {/* EMAIL */}

                {mode !== 'resetPassword' && (
                  <>
                    <label htmlFor="email">
                      {copy.email}
                    </label>

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                    />
                  </>
                )}

                {/* PASSWORD */}

                {mode !== 'forgotPassword' && (
                  <>
                    <label htmlFor="password">
                      {mode === 'resetPassword'
                        ? copy.newPassword
                        : copy.password}
                    </label>

                    <input
                      id="password"
                      type="password"
                      autoComplete={
                        mode === 'signIn'
                          ? 'current-password'
                          : 'new-password'
                      }
                      required
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                    />
                  </>
                )}

                {/* CONFIRM PASSWORD */}

                {(mode === 'signUp' ||
                  mode === 'resetPassword') && (
                  <>
                    <label htmlFor="confirmPassword">
                      {copy.confirmPassword}
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value,
                        )
                      }
                    />
                  </>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={working}
                >
                  {working
                    ? copy.pleaseWait
                    : copy.submitLabels[mode]}
                </button>
              </form>

              {/* ACCOUNT OPTIONS */}

              {mode !== 'resetPassword' && (
                <nav
                  className="auth-nav"
                  aria-label={copy.accountOptions}
                >
                  {mode === 'signIn' ? (
                    <>
                      <button
                        type="button"
                        disabled={working}
                        onClick={() =>
                          changeMode('signUp')
                        }
                      >
                        {copy.createAccount}
                      </button>

                      <button
                        type="button"
                        disabled={working}
                        onClick={() =>
                          changeMode('forgotPassword')
                        }
                      >
                        {copy.forgotPassword}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={working}
                      onClick={() =>
                        changeMode('signIn')
                      }
                    >
                      {copy.backToSignIn}
                    </button>
                  )}
                </nav>
              )}
            </>
          )}

          {/* FEEDBACK MESSAGES */}

          {feedback && (
            <p
              role={
                feedback.kind === 'error'
                  ? 'alert'
                  : 'status'
              }
            >
              {feedback.text}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App