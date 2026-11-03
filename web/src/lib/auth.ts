import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

// Configure this to a stable, allowed application origin in Vercel.
// Per-deployment preview URLs must not be used in recovery emails.
function authRedirectOrigin(): string {
  const configured = import.meta.env.VITE_AUTH_REDIRECT_ORIGIN?.trim()
  return configured ? new URL(configured).origin : window.location.origin
}

export function signUpWithEmail(
  displayName: string,
  email: string,
  password: string,
) {
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${authRedirectOrigin()}/`,
      data: {
        display_name: displayName.trim(),
      },
    },
  })
}

export function signInWithEmail(
  email: string,
  password: string,
) {
  return supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
}

export function sendPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(
    email.trim(),
    {
      redirectTo: `${authRedirectOrigin()}/reset-password`,
    },
  )
}

// A custom recovery email can link directly to /reset-password with a
// token_hash. Supabase verifies the single-use proof on the Auth server.
export function verifyPasswordRecoveryToken(tokenHash: string) {
  return supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'recovery',
  })
}

// Email + one-time code is less vulnerable to mail scanners consuming
// single-use links before the user opens them.
export function verifyPasswordRecoveryCode(email: string, code: string) {
  return supabase.auth.verifyOtp({
    email: email.trim(),
    token: code.trim(),
    type: 'recovery',
  })
}

// Keep response codes private while providing useful, non-enumerating
// feedback when the Auth service refuses too many recovery attempts.
export function isRecoveryRateLimited(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const authError = error as { status?: unknown; code?: unknown }
  return (
    authError.status === 429 ||
    authError.code === 'over_email_send_rate_limit' ||
    authError.code === 'over_request_rate_limit'
  )
}

export async function updatePassword(
  password: string,
  recoverySession: Session,
) {
  // Verify the authenticated identity using the Auth server.
  // A persisted session for a different account must never authorize recovery.
  const { data: userData, error: userError } =
    await supabase.auth.getUser()

  if (userError || userData.user?.id !== recoverySession.user.id) {
    return { error: new Error('Recovery account mismatch') }
  }

  // Also require the exact session issued for the recovery event.
  // This prevents another tab's sign-in from switching accounts mid-flow.
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (
    sessionError ||
    sessionData.session?.user.id !== recoverySession.user.id ||
    sessionData.session?.access_token !== recoverySession.access_token
  ) {
    return { error: new Error('Recovery session mismatch') }
  }

  return supabase.auth.updateUser({ password })
}

export function signOut(scope: 'local' | 'global' = 'local') {
  return supabase.auth.signOut({ scope })
}