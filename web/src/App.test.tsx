// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

const mocks = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(),
  signUpWithEmail: vi.fn(),
  signInWithEmail: vi.fn(),
  sendPasswordReset: vi.fn(),
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
  updatePassword: mocks.updatePassword,
  signOut: mocks.signOut,
}))

describe('Authentication interface', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    window.history.replaceState(null, '', '/')

    mocks.onAuthStateChange.mockImplementation(
      (callback: (event: string, session: null) => void) => {
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
    window.history.replaceState(null, '', '/')
  })

  it('shows the sign-in screen to guests', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Create Your Legend' }),
    ).toBeTruthy()

    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()

    expect(
      screen.getByRole('button', { name: 'Sign In' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', { name: 'Create Account' }),
    ).toBeTruthy()
  })

  it('prevents registration when passwords do not match', async () => {
    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Create Account' }),
    )

    fireEvent.change(screen.getByLabelText('Display Name'), {
      target: { value: 'Test Adventurer' },
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    })

    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Different123!' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Create Account' }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty('textContent', 'Passwords do not match.')

    expect(mocks.signUpWithEmail).not.toHaveBeenCalled()
  })

  it('shows a neutral password recovery message', async () => {
    mocks.sendPasswordReset.mockResolvedValue({
      error: null,
    })

    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Forgot Password?' }),
    )

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'adventurer@example.com' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Send Recovery Email' }),
    )

    expect(
      await screen.findByText(
        /If an account exists for this email/i,
      ),
    ).toBeTruthy()

    expect(mocks.sendPasswordReset).toHaveBeenCalledWith(
      'adventurer@example.com',
    )
  })

  it('rejects a reset page without a recovery session', async () => {
    window.history.replaceState(null, '', '/reset-password')

    render(<App />)

    expect(
      await screen.findByRole('alert'),
    ).toHaveProperty(
      'textContent',
      expect.stringContaining(
        'Your recovery link could not be verified.',
      ),
    )

    expect(
      screen.getByRole('button', { name: 'Request a New Link' }),
    ).toBeTruthy()

    expect(mocks.updatePassword).not.toHaveBeenCalled()
  })
})

