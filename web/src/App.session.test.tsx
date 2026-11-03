// @vitest-environment jsdom

import type { Session } from '@supabase/supabase-js'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import App from './App'

const mocks = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithEmail: vi.fn(),
  sendPasswordReset: vi.fn(),
  updatePassword: vi.fn(),
  signOut: vi.fn(),
  dashboardRender: vi.fn(),
}))

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: mocks.onAuthStateChange,
    },
  },
}))

vi.mock('./lib/auth', () => ({
  signUpWithEmail: mocks.signUpWithEmail,
  signInWithEmail: mocks.signInWithEmail,
  sendPasswordReset: mocks.sendPasswordReset,
  updatePassword: mocks.updatePassword,
  signOut: mocks.signOut,
}))

vi.mock('./CharacterDashboard', () => ({
  CharacterDashboard: ({
    accessToken,
    language,
  }: {
    accessToken: string
    language: 'pt' | 'en'
  }) => {
    mocks.dashboardRender(accessToken, language)

    return <p>Meu personagem</p>
  },
}))

const testSession = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',

  user: {
    id: 'test-user',
    email: 'recovered@example.com',
    aud: 'authenticated',
    app_metadata: {},
    user_metadata: {},
    created_at: '2026-01-01T00:00:00Z',
  },
} as unknown as Session

type AuthCallback = (
  event: string,
  session: Session | null,
) => void

function mockSessionEvent(
  event: string,
  session: Session | null,
) {
  mocks.onAuthStateChange.mockImplementation(
    (callback: AuthCallback) => {
      callback(event, session)

      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }
    },
  )
}

describe('Authentication sessions and errors', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    window.localStorage.removeItem(
      'adventure-files-language',
    )

    vi.stubGlobal('matchMedia', () => ({
      matches: true,
    }))

    window.history.replaceState(null, '', '/')

    mockSessionEvent('INITIAL_SESSION', null)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()

    window.history.replaceState(null, '', '/')
  })

  it('restores an existing authenticated session', () => {
    mockSessionEvent('INITIAL_SESSION', testSession)

    render(<App />)

    expect(
      screen.getByText('Meu personagem'),
    ).toBeTruthy()

    expect(
      mocks.dashboardRender,
    ).toHaveBeenCalledWith(
      'test-access-token',
      'en',
    )

    expect(
      screen.getByRole('button', {
        name: 'Sign Out',
      }),
    ).toBeTruthy()
  })

  it('passes the selected language to the dashboard', () => {
    mockSessionEvent('INITIAL_SESSION', testSession)

    render(<App />)

    expect(
      mocks.dashboardRender,
    ).toHaveBeenCalledWith(
      'test-access-token',
      'en',
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Português',
      }),
    )

    expect(
      mocks.dashboardRender,
    ).toHaveBeenLastCalledWith(
      'test-access-token',
      'pt',
    )

    expect(
      window.localStorage.getItem(
        'adventure-files-language',
      ),
    ).toBe('pt')
  })

  it('shows a generic error when sign in fails', async () => {
    mocks.signInWithEmail.mockResolvedValue({
      error: new Error('Unknown account'),
    })

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'PRESS START',
      }),
    )

    fireEvent.change(
      screen.getByLabelText('Email'),
      {
        target: {
          value: 'adventurer@example.com',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Password'),
      {
        target: {
          value: 'IncorrectPassword123!',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Sign In',
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      'Unable to sign in. Please check your details.',
    )

    expect(
      screen.queryByText('Unknown account'),
    ).toBeNull()
  })

  it('updates the password during a recovery session', async () => {
    window.history.replaceState(
      null,
      '',
      '/reset-password',
    )

    mockSessionEvent(
      'PASSWORD_RECOVERY',
      testSession,
    )

    mocks.updatePassword.mockResolvedValue({
      error: null,
    })
    mocks.signOut.mockResolvedValue({ error: null })

    render(<App />)

    fireEvent.change(
      screen.getByLabelText('New Password'),
      {
        target: {
          value: 'NewPassword123!',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Confirm Password'),
      {
        target: {
          value: 'NewPassword123!',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Update Password',
      }),
    )

    expect(
      mocks.updatePassword,
    ).toHaveBeenCalledWith(
      'NewPassword123!',
      testSession,
    )
    await waitFor(() => {
      expect(mocks.signOut).toHaveBeenCalledTimes(1)
    })

    expect(
      await screen.findByText(
        'Your password has been updated successfully.',
      ),
    ).toBeTruthy()
    expect(screen.queryByText('Meu personagem')).toBeNull()
    expect(
      screen.getByRole('button', { name: 'Sign In' }),
    ).toBeTruthy()
  })

  it('rejects a reset page opened with only a persisted login', () => {
    window.history.replaceState(null, '', '/reset-password')
    mockSessionEvent('INITIAL_SESSION', testSession)

    render(<App />)

    expect(
      screen.getByText(
        'Your recovery link could not be verified. It may be invalid or expired.',
      ),
    ).toBeTruthy()
    expect(screen.queryByLabelText('New Password')).toBeNull()
    expect(mocks.updatePassword).not.toHaveBeenCalled()
  })

  it('invalidates recovery when another account signs in', () => {
    window.history.replaceState(null, '', '/reset-password')

    let emitAuthEvent: AuthCallback = () => {
      throw new Error('Auth callback not registered')
    }

    mocks.onAuthStateChange.mockImplementation(
      (callback: AuthCallback) => {
        emitAuthEvent = callback
        callback('PASSWORD_RECOVERY', testSession)
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        }
      },
    )

    render(<App />)

    expect(
      screen.getByText('recovered@example.com'),
    ).toBeTruthy()

    const anotherSession = {
      ...testSession,
      access_token: 'another-account-token',
      user: {
        ...testSession.user,
        id: 'another-user',
        email: 'another@example.com',
      },
    } as Session

    act(() => {
      emitAuthEvent('SIGNED_IN', anotherSession)
    })

    expect(screen.queryByLabelText('New Password')).toBeNull()
    expect(mocks.updatePassword).not.toHaveBeenCalled()
    expect(
      screen.getByText(
        'Your recovery link could not be verified. It may be invalid or expired.',
      ),
    ).toBeTruthy()
  })

  it('never opens the dashboard if sign-out fails after reset', async () => {
    window.history.replaceState(null, '', '/reset-password')
    mockSessionEvent('PASSWORD_RECOVERY', testSession)
    mocks.updatePassword.mockResolvedValue({ error: null })
    mocks.signOut.mockResolvedValue({
      error: new Error('Sign-out failure'),
    })

    render(<App />)

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'NewPassword123!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'NewPassword123!' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Update Password' }),
    )

    expect(
      await screen.findByText(
        'Password updated, but sign-out failed. Please sign out before continuing.',
      ),
    ).toBeTruthy()
    expect(screen.queryByText('Meu personagem')).toBeNull()
  })
})