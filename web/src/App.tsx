import { useEffect, useState, type FormEvent } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { signInWithEmail, signOut } from './lib/auth'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setCheckingSession(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setWorking(true)
    setMessage('')

    try {
      const { error } = await signInWithEmail(email, password)

      if (error) {
        setMessage('Unable to sign in. Please check your details.')
      }
    } catch {
      setMessage('Unable to sign in. Please try again later.')
    } finally {
      setPassword('')
      setWorking(false)
    }
  }

  async function handleSignOut() {
    setWorking(true)
    setMessage('')

    try {
      const { error } = await signOut()

      if (error) {
        setMessage('Unable to sign out. Please try again.')
      }
    } catch {
      setMessage('Unable to sign out. Please try again.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-window">
        <header className="auth-titlebar">
          <span>RPG CHARACTER CREATOR</span>
          <span aria-hidden="true">◆</span>
        </header>

        <div className="auth-content">
          <p className="auth-kicker">WELCOME TO THE REALM</p>
          <h1>Create Your Legend</h1>

          {checkingSession ? (
            <p role="status">Checking your session...</p>
          ) : session ? (
            <div className="auth-success">
              <h2>Welcome back, adventurer!</h2>
              <p>Your session is active.</p>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={working}
              >
                {working ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="auth-form">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button type="submit" disabled={working}>
                {working ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {message && <p role="alert">{message}</p>}
        </div>
      </section>
    </main>
  )
}

export default App