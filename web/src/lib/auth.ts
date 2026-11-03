import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export function signUpWithEmail(
  displayName: string,
  email: string,
  password: string,
) {
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
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
      redirectTo: `${window.location.origin}/reset-password`,
    },
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

export function signOut() {
  return supabase.auth.signOut()
}