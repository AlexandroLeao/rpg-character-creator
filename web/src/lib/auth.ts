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
      emailRedirectTo: window.location.origin,
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
      redirectTo: window.location.origin,
    },
  )
}

export function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  })
}

export function signOut() {
  return supabase.auth.signOut()
}