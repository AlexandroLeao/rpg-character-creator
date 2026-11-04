// @vitest-environment jsdom

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import App from './App'

const mocks = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithEmail: vi.fn(),
  sendPasswordReset: vi.fn(),
  verifyPasswordRecoveryCode: vi.fn(),
  isRecoveryRateLimited: vi.fn(),
  updatePassword: vi.fn(),
  signOut: vi.fn(),
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
  verifyPasswordRecoveryCode: mocks.verifyPasswordRecoveryCode,
  isRecoveryRateLimited: mocks.isRecoveryRateLimited,
  updatePassword: mocks.updatePassword,
  signOut: mocks.signOut,
}))

describe('Authentication interface', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.isRecoveryRateLimited.mockImplementation(
      (error: { status?: number }) => error?.status === 429,
    )

    window.localStorage.removeItem(
      'adventure-files-language',
    )

    vi.stubGlobal('matchMedia', () => ({
      matches: true,
    }))

    window.history.replaceState(null, '', '/')

    mocks.onAuthStateChange.mockImplementation(
      (
        callback: (
          event: string,
          session: null,
        ) => void,
      ) => {
        callback('INITIAL_SESSION', null)

        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        }
      },
    )
  })

  afterEach(() => {
    cleanup()

    vi.unstubAllGlobals()

    window.history.replaceState(null, '', '/')

    window.localStorage.removeItem(
      'adventure-files-language',
    )
  })

  /*
   * SIGN IN
   */

  it('shows the sign-in screen to guests', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'ADVENTURE FILES',
      }),
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'PRESS START',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Sign In',
      }),
    ).toBeTruthy()

    expect(
      screen.getByLabelText('Email'),
    ).toBeTruthy()

    expect(
      screen.getByLabelText('Password'),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Sign In',
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    ).toBeTruthy()
  })

  /*
   * REGISTRATION VALIDATION
   */

  it('prevents registration when passwords do not match', async () => {
    render(<App />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'PRESS START',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    )

    fireEvent.change(
      screen.getByLabelText('Display Name'),
      {
        target: {
          value: 'Test Adventurer',
        },
      },
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
          value: 'Password123!',
        },
      },
    )

    fireEvent.change(
      screen.getByLabelText('Confirm Password'),
      {
        target: {
          value: 'Different123!',
        },
      },
    )

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: /I accept the Terms of Use/i,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Account',
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      'Passwords do not match.',
    )

    expect(
      mocks.signUpWithEmail,
    ).not.toHaveBeenCalled()
  })


  it('requires an explicit terms acceptance before account creation and resets it on navigation', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    const checkbox = screen.getByRole('checkbox', {
      name: /I accept the Terms of Use/i,
    }) as HTMLInputElement
    const submit = screen.getByRole('button', {
      name: 'Create Account',
    }) as HTMLButtonElement

    expect(checkbox.checked).toBe(false)
    expect(submit.disabled).toBe(true)
    expect(mocks.signUpWithEmail).not.toHaveBeenCalled()

    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
    expect(submit.disabled).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'Back to Sign In' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect((screen.getByRole('checkbox', {
      name: /I accept the Terms of Use/i,
    }) as HTMLInputElement).checked).toBe(false)
    expect((screen.getByRole('button', {
      name: 'Create Account',
    }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('rejects a programmatic signup submit without terms acceptance', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    fireEvent.change(screen.getByLabelText('Display Name'), {
      target: { value: 'Test Adventurer' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'LongPassword123!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'LongPassword123!' },
    })

    const form = screen.getByRole('button', {
      name: 'Create Account',
    }).closest('form')
    expect(form).toBeTruthy()
    fireEvent.submit(form!)

    expect(screen.getByRole('alert').textContent).toBe(
      'Accept the Terms of Use to create your account.',
    )
    expect(mocks.signUpWithEmail).not.toHaveBeenCalled()
  })

  it('makes the Portuguese terms and privacy notice readable within signup', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Português' }))
    expect(document.documentElement.lang).toBe('pt-BR')
    fireEvent.click(screen.getByRole('button', { name: 'Criar Conta' }))

    const summary = screen.getByText('LER TERMOS E PRIVACIDADE')
    const details = summary.closest('details') as HTMLDetailsElement
    expect(details).toBeTruthy()
    fireEvent.click(summary)
    expect(details.open).toBe(true)
    expect(screen.getByText('TERMOS DE USO')).toBeTruthy()
    expect(screen.getByText('AVISO DE PRIVACIDADE')).toBeTruthy()
    expect(screen.getByRole('link', {
      name: 'adventurefiles.suporte@gmail.com',
    }).getAttribute('href')).toBe('mailto:adventurefiles.suporte@gmail.com')

    const checkbox = screen.getByRole('checkbox', {
      name: /Aceito os Termos de Uso/i,
    }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('submits a valid signup after accepting terms', async () => {
    mocks.signUpWithEmail.mockResolvedValue({ error: null })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    fireEvent.change(screen.getByLabelText('Display Name'), {
      target: { value: 'Test Adventurer' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'LongPassword123!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'LongPassword123!' },
    })
    fireEvent.click(screen.getByRole('checkbox', {
      name: /I accept the Terms of Use/i,
    }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByText(
      /If registration is available for this email/i,
    )).toBeTruthy()
    expect(mocks.signUpWithEmail).toHaveBeenCalledWith(
      'Test Adventurer',
      'adventurer@example.com',
      'LongPassword123!',
    )
  })

  /*
   * PASSWORD RECOVERY
   */

  it('uses compact Portuguese recovery labels without changing other screens', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Português' }))
    fireEvent.click(screen.getByRole('button', { name: 'Esqueceu a Senha?' }))

    expect(screen.getByRole('button', { name: 'Voltar' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Conferir Código' })).toBeTruthy()
    expect(document.querySelector('.auth-window--recovery')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Conferir Código' }))
    expect(screen.getByRole('button', { name: 'Início' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Novo Código' })).toBeTruthy()
    expect(screen.getByText('Digite o código recebido por e-mail.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Novo Código' }))
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeTruthy()
    expect(document.querySelector('.auth-window--recovery')).toBeNull()
  })

  it('shows a neutral password recovery message', async () => {
    mocks.sendPasswordReset.mockResolvedValue({
      error: null,
    })

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'PRESS START',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Forgot Password?',
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

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Send Recovery Email',
      }),
    )

    expect(
      await screen.findByText(
        /If registered, check your email/i,
      ),
    ).toBeTruthy()

    expect(
      mocks.sendPasswordReset,
    ).toHaveBeenCalledWith(
      'adventurer@example.com',
    )

    expect(
      screen.getByRole('heading', {
        name: 'Verify Recovery Code',
      }),
    ).toBeTruthy()
  })

  it('shows a meaningful rate-limit error without revealing account existence', async () => {
    mocks.sendPasswordReset.mockResolvedValue({
      error: { status: 429, code: 'over_email_send_rate_limit' },
    })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Forgot Password?' }))
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send Recovery Email' }))

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('Too many recovery attempts'),
    )
    expect(screen.getByRole('heading', { name: 'Recover Password' })).toBeTruthy()
  })

  it('requires a valid email and one-time code before enabling a password reset', async () => {
    const verifiedSession = {
      access_token: 'verified-access-token',
      user: { id: 'account-a', email: 'adventurer@example.com' },
    }
    mocks.sendPasswordReset.mockResolvedValue({ error: null })
    mocks.verifyPasswordRecoveryCode.mockResolvedValue({
      data: { session: verifiedSession, user: verifiedSession.user },
      error: null,
    })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Forgot Password?' }))
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send Recovery Email' }))
    expect(await screen.findByLabelText('Recovery Code')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Recovery Code'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code' }))

    expect(await screen.findByRole('heading', { name: 'Reset Password' })).toBeTruthy()
    expect(mocks.verifyPasswordRecoveryCode).toHaveBeenCalledWith(
      'adventurer@example.com',
      '123456',
    )
    expect(screen.getByText('adventurer@example.com')).toBeTruthy()
    expect(screen.getByLabelText('New Password')).toBeTruthy()
    expect(mocks.updatePassword).not.toHaveBeenCalled()
  })

  it('rejects a recovery code that resolves to another account', async () => {
    const otherSession = {
      access_token: 'other-access-token',
      user: { id: 'account-b', email: 'other@example.com' },
    }
    mocks.sendPasswordReset.mockResolvedValue({ error: null })
    mocks.verifyPasswordRecoveryCode.mockResolvedValue({
      data: { session: otherSession, user: otherSession.user },
      error: null,
    })
    mocks.signOut.mockResolvedValue({ error: null })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    fireEvent.click(screen.getByRole('button', { name: 'Forgot Password?' }))
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send Recovery Email' }))
    expect(await screen.findByLabelText('Recovery Code')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Recovery Code'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code' }))

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('invalid or expired'),
    )
    expect(mocks.signOut).toHaveBeenCalledWith('local')
    expect(mocks.updatePassword).not.toHaveBeenCalled()
  })

  /*
   * INVALID RECOVERY SESSION
   */

  it('opens the code form for a recovery email without a magic link', async () => {
    window.history.replaceState(null, '', '/reset-password')

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Verify Recovery Code' }),
    ).toBeTruthy()
    expect(screen.getByLabelText('Recovery Code')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(mocks.updatePassword).not.toHaveBeenCalled()
  })

  it('still rejects unverified legacy recovery links', async () => {
    window.history.replaceState(
      null,
      '',
      '/reset-password?code=unverified-old-link',
    )

    render(<App />)

    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('Your recovery link could not be verified.'),
    )
    expect(screen.getByRole('button', { name: 'I Have a Recovery Code' })).toBeTruthy()
    expect(mocks.updatePassword).not.toHaveBeenCalled()
  })

  /*
   * LANGUAGE SELECTION
   */

  it('switches the authentication interface to Portuguese', () => {
    render(<App />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'PRESS START',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Português',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Entrar',
      }),
    ).toBeTruthy()

    expect(
      screen.getByLabelText('Senha'),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: 'Criar Conta',
      }),
    ).toBeTruthy()

    expect(
      window.localStorage.getItem(
        'adventure-files-language',
      ),
    ).toBe('pt')

    expect(
      screen
        .getByRole('button', {
          name: 'Português',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })

  /*
   * LANGUAGE PERSISTENCE
   */

  it('restores the saved language and allows switching back to English', () => {
    window.localStorage.setItem(
      'adventure-files-language',
      'pt',
    )

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'PRESS START',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Entrar',
      }),
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'English',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Sign In',
      }),
    ).toBeTruthy()

    expect(
      screen.getByLabelText('Password'),
    ).toBeTruthy()

    expect(
      window.localStorage.getItem(
        'adventure-files-language',
      ),
    ).toBe('en')

    expect(
      screen
        .getByRole('button', {
          name: 'English',
        })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })
})