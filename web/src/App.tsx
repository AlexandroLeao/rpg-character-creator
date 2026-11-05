import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'

import { supabase } from './lib/supabase'

import {
  isRecoveryRateLimited,
  sendPasswordReset,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  updatePassword,
  verifyPasswordRecoveryCode,
  verifyPasswordRecoveryToken,
} from './lib/auth'

import {
  authTranslations,
  type AuthMode,
  type Language,
} from './lib/authTranslations'

import { CharacterDashboard } from './CharacterDashboard'
import { StartScreen } from './StartScreen'
import { SignupTerms } from './SignupTerms'
import { TurnstileChallenge } from './TurnstileChallenge'

import './App.css'

type Feedback = {
  kind: 'error' | 'success'
  text: string
} | null

const LANGUAGE_STORAGE_KEY = 'adventure-files-language'
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim()

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

// An OTP email opens the recovery route without a credential in its URL.
// Older emailed PKCE/token-hash links must still complete Auth verification.
function getInitialAuthMode(): AuthMode {
  if (window.location.pathname !== '/reset-password') {
    return 'signIn'
  }

  const params = new URLSearchParams(window.location.search)
  const hasLegacyRecoveryLink =
    params.has('code') ||
    (params.get('type') === 'recovery' && params.has('token_hash')) ||
    window.location.hash.includes('access_token=')

  return hasLegacyRecoveryLink ? 'resetPassword' : 'verifyRecoveryCode'
}

function App() {
  /*
   * SESSION AND AUTHENTICATION
   */

  const [session, setSession] = useState<Session | null>(null)

  // A normal persisted login must not authorize password recovery.
  const [recoverySession, setRecoverySession] =
    useState<Session | null>(null)

  const [checkingSession, setCheckingSession] = useState(true)
  const [verifyingRecoveryLink, setVerifyingRecoveryLink] = useState(
    () =>
      window.location.pathname === '/reset-password' &&
      new URLSearchParams(window.location.search).get('type') ===
        'recovery' &&
      Boolean(new URLSearchParams(window.location.search).get('token_hash')),
  )
  const recoveryTokenHashRef = useRef<string | null>(null)
  const recoveryVerificationRef = useRef<
    ReturnType<typeof verifyPasswordRecoveryToken> | null
  >(null)

  const [hasStarted, setHasStarted] = useState(
    () => window.location.pathname === '/reset-password',
  )

  const [showLoginReveal, setShowLoginReveal] = useState(false)

  const [mode, setMode] = useState<AuthMode>(getInitialAuthMode)

  /*
   * LANGUAGE
   */

  const [language, setLanguage] = useState<Language>(
    getInitialLanguage,
  )

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'
  }, [language])

  /*
   * AUTHENTICATION FORM
   */

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0)

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
    session !== null &&
    mode !== 'resetPassword' &&
    mode !== 'forgotPassword' &&
    mode !== 'verifyRecoveryCode'

  const canResetPassword =
    recoverySession !== null &&
    session !== null &&
    recoverySession.user.id === session.user.id &&
    recoverySession.access_token === session.access_token

  /*
   * SUPABASE SESSION
   */

  useEffect(() => {
    let active = true

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

        setRecoverySession((verified) => {
          if (event === 'PASSWORD_RECOVERY') {
            return nextSession
          }

          if (!verified || !nextSession) {
            return null
          }

          if (
            event === 'TOKEN_REFRESHED' &&
            nextSession.user.id === verified.user.id
          ) {
            return nextSession
          }

          // Switching users or sessions invalidates the recovery grant.
          const sameSession =
            nextSession.user.id === verified.user.id &&
            nextSession.access_token === verified.access_token

          return sameSession ? verified : null
        })

        if (event === 'PASSWORD_RECOVERY') {
          setMode('resetPassword')
          setFeedback(null)
        }
      },
    )

    // The customized email template links directly to the application.
    // Verify its single-use token on Supabase before enabling a reset.
    const params = new URLSearchParams(window.location.search)
    if (
      window.location.pathname === '/reset-password' &&
      params.get('type') === 'recovery' &&
      params.get('token_hash')
    ) {
      recoveryTokenHashRef.current = params.get('token_hash')

      // Never keep a recovery token in the address bar or browser history.
      params.delete('token_hash')
      params.delete('type')
      const remaining = params.toString()
      window.history.replaceState(
        null,
        '',
        `/reset-password${remaining ? `?${remaining}` : ''}`,
      )
    }

    if (recoveryTokenHashRef.current) {
      // React StrictMode can run this effect twice in development.
      // Reuse the request: an OTP must only be verified once.
      if (!recoveryVerificationRef.current) {
        recoveryVerificationRef.current =
          verifyPasswordRecoveryToken(recoveryTokenHashRef.current)
      }

      void recoveryVerificationRef.current
        .then(({ data, error }) => {
          if (!active) return

          if (!error && data.session) {
            setSession(data.session)
            setRecoverySession(data.session)
            setMode('resetPassword')
          } else {
            setRecoverySession(null)
          }

          setCheckingSession(false)
          setVerifyingRecoveryLink(false)
        })
        .catch(() => {
          if (!active) return
          setRecoverySession(null)
          setCheckingSession(false)
          setVerifyingRecoveryLink(false)
        })
    }

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  /*
   * LANGUAGE SELECTION
   */

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    setCaptchaToken(null)

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
    setCaptchaToken(null)
    setPassword('')
    setConfirmPassword('')
    setTermsAccepted(false)
    setRecoveryCode('')
    setFeedback(null)
  }

  function requestNewRecoveryLink() {
    setRecoverySession(null)
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

    /* A terms acknowledgement is required before sign-up. */
    if (mode === 'signUp' && !termsAccepted) {
      setFeedback({ kind: 'error', text: copy.termsRequired })
      return
    }

    /*
     * PASSWORD VALIDATION
     */

    const requiresNewPassword =
      mode === 'signUp' || mode === 'resetPassword'

    if (
      requiresNewPassword &&
      password.length < 15
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

    const needsCaptcha =
      mode === 'signIn' || mode === 'signUp' || mode === 'forgotPassword'

    if (TURNSTILE_SITE_KEY && needsCaptcha && !captchaToken) {
      setFeedback({ kind: 'error', text: copy.captchaRequired })
      return
    }

    setWorking(true)

    try {
      /*
       * PASSWORD RECOVERY REQUEST
       */

      if (mode === 'forgotPassword') {
        const { error } = await sendPasswordReset(email, captchaToken ?? undefined)

        if (!error) {
          // Support both custom OTP emails and legacy recovery links.
          setMode('verifyRecoveryCode')
        }

        setFeedback(
          error
            ? {
                kind: 'error',
                text: isRecoveryRateLimited(error)
                  ? copy.recoveryRateLimited
                  : copy.recoveryRequestFailure,
              }
            : {
                kind: 'success',
                text: copy.recoveryRequestSuccess,
              },
        )

        return
      }

      /*
       * VERIFY EMAIL + ONE-TIME RECOVERY CODE
       */

      if (mode === 'verifyRecoveryCode') {
        const { data, error } = await verifyPasswordRecoveryCode(
          email,
          recoveryCode,
        )

        const verifiedSession = data?.session
        const expectedEmail = email.trim().toLowerCase()
        const identityMatches =
          verifiedSession &&
          data.user?.id === verifiedSession.user.id &&
          data.user?.email?.toLowerCase() === expectedEmail &&
          verifiedSession.user.email?.toLowerCase() === expectedEmail

        if (error || !verifiedSession || !identityMatches) {
          if (!error && verifiedSession) {
            // Never authorize a mismatched account, even if Auth
            // unexpectedly issued a session during verification.
            try {
              await signOut('local')
            } catch {
              // Refuse recovery even if revocation temporarily fails.
            }
            setSession(null)
            setRecoverySession(null)
          }

          setFeedback({
            kind: 'error',
            text: error && isRecoveryRateLimited(error)
              ? copy.recoveryRateLimited
              : copy.recoveryCodeInvalid,
          })
          return
        }

        // Keep this verified grant bound to the exact Auth session.
        setSession(verifiedSession)
        setRecoverySession(verifiedSession)
        setMode('resetPassword')
        setFeedback(null)
        window.history.replaceState(null, '', '/reset-password')
        return
      }

      /*
       * RESET PASSWORD
       */

      if (mode === 'resetPassword') {
        if (!canResetPassword || !recoverySession) {
          setFeedback({
            kind: 'error',
            text: copy.invalidRecoverySession,
          })
          return
        }

        const { error } = await updatePassword(
          password,
          recoverySession,
        )

        if (error) {
          setFeedback({
            kind: 'error',
            text: copy.updatePasswordFailure,
          })
          return
        }

        // Never display a previously authenticated account after reset.
        try {
          const { error: signOutError } = await signOut('global')
          if (signOutError) {
            throw signOutError
          }
        } catch {
          setRecoverySession(null)
          setFeedback({
            kind: 'error',
            text: copy.passwordUpdatedSignOutFailure,
          })
          return
        }

        setRecoverySession(null)
        setSession(null)
        setEmail(recoverySession.user.email ?? '')
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
          email,
          password,
          captchaToken ?? undefined,
        )

        if (error) {
          setFeedback({
            kind: 'error',
            text: copy.signUpFailure,
          })

          return
        }

        setMode('signIn')
        setTermsAccepted(false)

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
        captchaToken ?? undefined,
      )

      if (error) {
        setFeedback({
          kind: 'error',
          text: copy.signInFailure,
        })
      }
    } catch (error) {
      setFeedback({
        kind: 'error',
        text: isRecoveryRateLimited(error)
          ? copy.recoveryRateLimited
          : copy.unexpectedError,
      })
    } finally {
      setPassword('')
      setConfirmPassword('')
      setRecoveryCode('')
      setCaptchaToken(null)
      if (TURNSTILE_SITE_KEY && needsCaptcha) {
        setCaptchaResetSignal((signal) => signal + 1)
      }
      setWorking(false)
    }
  }

  /*
   * SIGN OUT
   */

  async function handleAccountDeleted() {
    // Auth user is already deleted on the server. Revoke this tab's local
    // tokens even if the remote session is no longer available.
    try {
      await signOut('local')
    } catch {
      // The Auth user may already be unavailable after deletion.
    }

    setSession(null)
    setRecoverySession(null)
    setCreatorStep(null)
    setHasStarted(false)
    setMode('signIn')
    setFeedback(null)
    window.history.replaceState(null, '', '/')
  }

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
    mode === 'signUp' ? 'auth-window--signup' : '',
    mode === 'forgotPassword' || mode === 'verifyRecoveryCode'
      ? 'auth-window--recovery'
      : '',
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
          {checkingSession || verifyingRecoveryLink ? (
            /*
             * CHECKING SESSION
             */

            <p role="status">
              {copy.checkingSession}
            </p>
          ) : mode === 'resetPassword' && !canResetPassword ? (
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

              <button
                type="button"
                onClick={() => changeMode('verifyRecoveryCode')}
              >
                {copy.haveRecoveryCode}
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
                onSignOut={handleSignOut}
                onAccountDeleted={() => { void handleAccountDeleted() }}
                signOutLabel={working ? copy.signingOut : copy.signOut}
                signingOut={working}
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
                {/* VERIFIED RECOVERY ACCOUNT */}

                {mode === 'resetPassword' && canResetPassword && (
                  <p className="auth-recovery-account">
                    {copy.recoveryAccountLabel}
                    <strong>{recoverySession?.user.email}</strong>
                  </p>
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

                {/* ONE-TIME RECOVERY CODE */}

                {mode === 'verifyRecoveryCode' && (
                  <>
                    <label htmlFor="recoveryCode">
                      {copy.recoveryCode}
                    </label>
                    <input
                      id="recoveryCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      value={recoveryCode}
                      onChange={(event) =>
                        setRecoveryCode(event.target.value)
                      }
                      aria-describedby="recoveryCodeHelp"
                    />
                    <p id="recoveryCodeHelp">
                      {copy.recoveryCodeHelp}
                    </p>
                  </>
                )}

                {/* PASSWORD */}

                {mode !== 'forgotPassword' &&
                  mode !== 'verifyRecoveryCode' && (
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

                {mode === 'signUp' && (
                  <SignupTerms
                    language={language}
                    accepted={termsAccepted}
                    onAcceptedChange={setTermsAccepted}
                  />
                )}

                {TURNSTILE_SITE_KEY &&
                  (mode === 'signIn' ||
                    mode === 'signUp' ||
                    mode === 'forgotPassword') && (
                    <TurnstileChallenge
                      key={`${mode}-${language}`}
                      siteKey={TURNSTILE_SITE_KEY}
                      language={language}
                      action={mode}
                      resetSignal={captchaResetSignal}
                      onTokenChange={setCaptchaToken}
                      verified={Boolean(captchaToken)}
                    />
                  )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    working ||
                    (mode === 'signUp' && !termsAccepted) ||
                    (Boolean(TURNSTILE_SITE_KEY) &&
                      (mode === 'signIn' ||
                        mode === 'signUp' ||
                        mode === 'forgotPassword') &&
                      !captchaToken)
                  }
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
                      {mode === 'forgotPassword'
                        ? copy.backFromRecovery
                        : mode === 'verifyRecoveryCode'
                          ? copy.backFromCode
                          : copy.backToSignIn}
                    </button>
                  )}

                  {(mode === 'forgotPassword' ||
                    mode === 'verifyRecoveryCode') && (
                    <button
                      type="button"
                      disabled={working}
                      onClick={() =>
                        mode === 'forgotPassword'
                          ? changeMode('verifyRecoveryCode')
                          : changeMode('forgotPassword')
                      }
                    >
                      {mode === 'forgotPassword'
                        ? copy.checkRecoveryCode
                        : copy.requestNewCode}
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