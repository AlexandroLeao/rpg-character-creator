// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockAuth = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('./supabase', () => ({
  supabase: {
    auth: mockAuth,
  },
}))

import {
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
  updatePassword,
  signOut,
} from './auth'

describe('Supabase authentication helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('trims account details during registration', () => {
    signUpWithEmail(
      '  Test Adventurer  ',
      '  adventurer@example.com  ',
      'TestPassword123!',
    )

    expect(mockAuth.signUp).toHaveBeenCalledWith({
      email: 'adventurer@example.com',
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: 'Test Adventurer',
        },
      },
    })
  })

  it('trims the email address during sign in', () => {
    signInWithEmail(
      '  adventurer@example.com  ',
      'TestPassword123!',
    )

    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'adventurer@example.com',
      password: 'TestPassword123!',
    })
  })

  it('uses the password reset page as the recovery redirect', () => {
    sendPasswordReset('  adventurer@example.com  ')

    expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
      'adventurer@example.com',
      {
        redirectTo: `${window.location.origin}/reset-password`,
      },
    )
  })

  it('updates the authenticated user password', () => {
    updatePassword('NewPassword123!')

    expect(mockAuth.updateUser).toHaveBeenCalledWith({
      password: 'NewPassword123!',
    })
  })

  it('signs out through Supabase Auth', () => {
    signOut()

    expect(mockAuth.signOut).toHaveBeenCalledTimes(1)
  })
})
