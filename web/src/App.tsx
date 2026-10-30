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
import { CharacterDashboard } from './CharacterDashboard'
import { StartScreen } from './StartScreen'
import './App.css'

type AuthMode =
  | 'signIn'
  | 'signUp'
  | 'forgotPassword'
  | 'resetPassword'

type Feedback = {
  kind: 'error' | 'success'
  text: string
} | null

const titles: Record<AuthMode, string> = {
  signIn: 'Create Your Legend',
  signUp: 'Join the Realm',
  forgotPassword: 'Recover Your Account',
  resetPassword: 'Choose a New Password',
}

const submitLabels: Record<AuthMode, string> = {
  signIn: 'Sign In',
  signUp: 'Create Account',
  forgotPassword: 'Send Recovery Email',
  resetPassword: 'Update Password',
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasStarted, setHasStarted] = useState(
    () => window.location.pathname === '/reset-password',
  )

  const [mode, setMode] = useState<AuthMode>(() =>
    window.location.pathname === '/reset-password'
      ? 'resetPassword'
      : 'signIn',
  )

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [working, setWorking] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      setCheckingSession(false)

      if (event === 'PASSWORD_RECOVERY') {
        setMode('resetPassword')
        setFeedback(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    if (mode === 'signUp' && displayName.trim().length < 2) {
      setFeedback({
        kind: 'error',
        text: 'Display name must contain at least 2 characters.',
      })
      return
    }

    const requiresNewPassword =
      mode === 'signUp' || mode === 'resetPassword'

    if (requiresNewPassword && password.length < 8) {
      setFeedback({
        kind: 'error',
        text: 'Password must contain at least 8 characters.',
      })
      return
    }

    if (requiresNewPassword && password !== confirmPassword) {
      setFeedback({
        kind: 'error',
        text: 'Passwords do not match.',
      })
      return
    }

    setWorking(true)

    try {
      if (mode === 'forgotPassword') {
        const { error } = await sendPasswordReset(email)

        setFeedback(
          error
            ? {
                kind: 'error',
                text: 'Unable to process your request. Please try again later.',
              }
            : {
                kind: 'success',
                text: 'If an account exists for this email, a recovery message will be sent shortly.',
              },
        )

        return
      }

      if (mode === 'resetPassword') {
        if (!session) {
          setFeedback({
            kind: 'error',
            text: 'Your recovery session is invalid or expired. Please request a new link.',
          })
          return
        }

        const { error } = await updatePassword(password)

        if (error) {
          setFeedback({
            kind: 'error',
            text: 'Unable to update your password. Please request a new recovery link if needed.',
          })
          return
        }

        window.history.replaceState(null, '', '/')
        setMode('signIn')

        setFeedback({
          kind: 'success',
          text: 'Your password has been updated successfully.',
        })

        return
      }

      if (mode === 'signUp') {
        const { error } = await signUpWithEmail(
          displayName,
          email,
          password,
        )

        if (error) {
          setFeedback({
            kind: 'error',
            text: 'Unable to create an account. Please review your details.',
          })
          return
        }

        setMode('signIn')

        setFeedback({
          kind: 'success',
          text: 'If registration is available for this email, check your inbox for a confirmation link.',
        })

        return
      }

      const { error } = await signInWithEmail(email, password)

      if (error) {
        setFeedback({
          kind: 'error',
          text: 'Unable to sign in. Please check your details.',
        })
      }
    } catch {
      setFeedback({
        kind: 'error',
        text: 'Something went wrong. Please try again later.',
      })
    } finally {
      setPassword('')
      setConfirmPassword('')
      setWorking(false)
    }
  }

  async function handleSignOut() {
    setWorking(true)
    setFeedback(null)

    try {
      const { error } = await signOut()

      if (error) {
        setFeedback({
          kind: 'error',
          text: 'Unable to sign out. Please try again.',
        })
      }
    } catch {
      setFeedback({
        kind: 'error',
        text: 'Unable to sign out. Please try again.',
      })
    } finally {
      setWorking(false)
    }
  }

  if (!hasStarted && !session && mode !== 'resetPassword') {
    return <StartScreen onStart={() => setHasStarted(true)} />
  }

  return (
    <main className="auth-shell">
      <section className="auth-window">
        <header className="auth-titlebar">
          <span>ADVENTURE FILES</span>
          <span aria-hidden="true">◆</span>
        </header>

        <div className="auth-content">
          <p className="auth-kicker">WELCOME TO THE REALM</p>

          <h1>{titles[mode]}</h1>

          {checkingSession ? (
            <p role="status">Checking your session...</p>
          ) : mode === 'resetPassword' && !session ? (
            <div className="auth-success">
              <p role="alert">
                Your recovery link could not be verified.
                It may be invalid or expired.
              </p>

              <button
                type="button"
                onClick={requestNewRecoveryLink}
              >
                Request a New Link
              </button>
            </div>
          ) : session && mode !== 'resetPassword' ? (
            <div className="auth-success">
              <CharacterDashboard
                key={session.user.id}
                accessToken={session.access_token}
              />

              <button
                type="button"
                onClick={handleSignOut}
                disabled={working}
              >
                {working ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <>
              <form className="auth-form" onSubmit={handleSubmit}>
                {mode === 'signUp' && (
                  <>
                    <label htmlFor="displayName">Display Name</label>
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

                {mode !== 'resetPassword' && (
                  <>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </>
                )}

                {mode !== 'forgotPassword' && (
                  <>
                    <label htmlFor="password">
                      {mode === 'resetPassword'
                        ? 'New Password'
                        : 'Password'}
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

                {(mode === 'signUp' ||
                  mode === 'resetPassword') && (
                  <>
                    <label htmlFor="confirmPassword">
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                    />
                  </>
                )}

                <button type="submit" disabled={working}>
                  {working ? 'Please wait...' : submitLabels[mode]}
                </button>
              </form>

              {mode !== 'resetPassword' && (
                <nav
                  className="auth-nav"
                  aria-label="Account options"
                >
                  {mode === 'signIn' ? (
                    <>
                      <button
                        type="button"
                        disabled={working}
                        onClick={() => changeMode('signUp')}
                      >
                        Create Account
                      </button>

                      <button
                        type="button"
                        disabled={working}
                        onClick={() =>
                          changeMode('forgotPassword')
                        }
                      >
                        Forgot Password?
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={working}
                      onClick={() => changeMode('signIn')}
                    >
                      Back to Sign In
                    </button>
                  )}
                </nav>
              )}
            </>
          )}

          {feedback && (
            <p
              role={feedback.kind === 'error' ? 'alert' : 'status'}
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