// @vitest-environment jsdom

import type { Session } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockAuth = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  getUser: vi.fn(),
  getSession: vi.fn(),
  verifyOtp: vi.fn(),
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
  verifyPasswordRecoveryToken,
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

  it('verifies the recovery token hash on the Auth server', () => {
    verifyPasswordRecoveryToken('one-time-recovery-hash')

    expect(mockAuth.verifyOtp).toHaveBeenCalledWith({
      token_hash: 'one-time-recovery-hash',
      type: 'recovery',
    })
  })

  const recoveredSession = {
    access_token: 'verified-recovery-access-token',
    user: { id: 'recovered-user-id' },
  } as Session

  it('updates the verified recovery account password', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: { id: 'recovered-user-id' } },
      error: null,
    })
    mockAuth.getSession.mockResolvedValue({
      data: { session: recoveredSession },
      error: null,
    })
    mockAuth.updateUser.mockResolvedValue({ error: null })

    const result = await updatePassword(
      'NewPassword123!',
      recoveredSession,
    )

    expect(result.error).toBeNull()
    expect(mockAuth.updateUser).toHaveBeenCalledWith({
      password: 'NewPassword123!',
    })
  })

  it('refuses to update a different authenticated account', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: { id: 'other-user-id' } },
      error: null,
    })

    const result = await updatePassword(
      'NewPassword123!',
      recoveredSession,
    )

    expect(result.error).toBeTruthy()
    expect(mockAuth.getSession).not.toHaveBeenCalled()
    expect(mockAuth.updateUser).not.toHaveBeenCalled()
  })

  it('refuses recovery after the browser session changes', async () => {
    mockAuth.getUser.mockResolvedValue({
      data: { user: { id: 'recovered-user-id' } },
      error: null,
    })
    mockAuth.getSession.mockResolvedValue({
      data: {
        session: {
          ...recoveredSession,
          access_token: 'different-session-token',
        },
      },
      error: null,
    })

    const result = await updatePassword(
      'NewPassword123!',
      recoveredSession,
    )

    expect(result.error).toBeTruthy()
    expect(mockAuth.updateUser).not.toHaveBeenCalled()
  })

  it('signs out only the current tab by default', () => {
    signOut()

    expect(mockAuth.signOut).toHaveBeenCalledWith({
      scope: 'local',
    })
  })

  it('can revoke all account sessions after password recovery', () => {
    signOut('global')

    expect(mockAuth.signOut).toHaveBeenCalledWith({
      scope: 'global',
    })
  })
})
