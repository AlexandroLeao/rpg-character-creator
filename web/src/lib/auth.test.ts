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
  verifyPasswordRecoveryCode,
  isRecoveryRateLimited,
  signOut,
} from './auth'

describe('Supabase authentication helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('trims the email and registers without optional profile metadata', () => {
    signUpWithEmail(
      '  adventurer@example.com  ',
      'TestPassword123!',
    )

    expect(mockAuth.signUp).toHaveBeenCalledWith({
      email: 'adventurer@example.com',
      password: 'TestPassword123!',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
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

  it('forwards the security proof to Supabase registration, sign-in and recovery', () => {
    signUpWithEmail(
      'adventurer@example.com',
      'LongPassword123!',
      'signup-proof',
    )
    expect(mockAuth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ captchaToken: 'signup-proof' }),
      }),
    )

    signInWithEmail('adventurer@example.com', 'LongPassword123!', 'signin-proof')
    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: 'adventurer@example.com',
      password: 'LongPassword123!',
      options: { captchaToken: 'signin-proof' },
    })

    sendPasswordReset('adventurer@example.com', 'recovery-proof')
    expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
      'adventurer@example.com',
      {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: 'recovery-proof',
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

  it('verifies a one-time recovery code for the requested email', () => {
    verifyPasswordRecoveryCode(
      '  adventurer@example.com  ',
      ' 123456 ',
    )

    expect(mockAuth.verifyOtp).toHaveBeenCalledWith({
      email: 'adventurer@example.com',
      token: '123456',
      type: 'recovery',
    })
  })

  it('distinguishes Auth rate limits without exposing account details', () => {
    expect(isRecoveryRateLimited({ status: 429 })).toBe(true)
    expect(isRecoveryRateLimited({ code: 'over_email_send_rate_limit' })).toBe(true)
    expect(isRecoveryRateLimited({ code: 'over_request_rate_limit' })).toBe(true)
    expect(isRecoveryRateLimited({ status: 400 })).toBe(false)
    expect(isRecoveryRateLimited(null)).toBe(false)
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
