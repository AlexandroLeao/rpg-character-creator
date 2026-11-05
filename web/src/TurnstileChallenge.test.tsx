// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TurnstileChallenge } from './TurnstileChallenge'

describe('Cloudflare Turnstile challenge', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('uses a token once and resets the verification after an auth attempt', async () => {
    const client = {
      render: vi.fn((container: HTMLElement, options: unknown) => {
        void container
        void options
        return 'widget-1'
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    }
    vi.stubGlobal('turnstile', client)
    const onTokenChange = vi.fn()

    const props = {
      siteKey: 'public-test-site-key',
      language: 'pt' as const,
      action: 'signUp' as const,
      onTokenChange,
    }

    const { rerender, unmount } = render(
      <TurnstileChallenge {...props} resetSignal={0} verified={false} />,
    )

    await waitFor(() => expect(client.render).toHaveBeenCalledTimes(1))
    const options = client.render.mock.calls[0][1] as {
      callback: (token: string) => void
      'expired-callback': () => void
      appearance: string
      language: string
    }
    expect(options.appearance).toBe('always')
    expect(options.language).toBe('pt-BR')

    act(() => options.callback('single-use-token'))
    expect(onTokenChange).toHaveBeenLastCalledWith('single-use-token')

    rerender(<TurnstileChallenge {...props} resetSignal={1} verified={false} />)
    expect(client.reset).toHaveBeenCalledWith('widget-1')
    expect(onTokenChange).toHaveBeenLastCalledWith(null)

    act(() => options['expired-callback']())
    expect(onTokenChange).toHaveBeenLastCalledWith(null)

    expect(screen.getByRole('button', { name: 'TENTAR NOVAMENTE' })).toBeTruthy()

    unmount()
    expect(client.remove).toHaveBeenCalledWith('widget-1')
  })

  it('shows a retry action after verification errors and renders a fresh widget', async () => {
    const client = {
      render: vi.fn((container: HTMLElement, options: unknown) => {
        void container
        void options
        return 'widget-1'
      }),
      reset: vi.fn(),
      remove: vi.fn(),
    }
    vi.stubGlobal('turnstile', client)
    const onTokenChange = vi.fn()

    render(
      <TurnstileChallenge
        siteKey="public-test-site-key"
        language="en"
        action="signIn"
        resetSignal={0}
        onTokenChange={onTokenChange}
        verified={false}
      />,
    )

    await waitFor(() => expect(client.render).toHaveBeenCalledTimes(1))
    const options = client.render.mock.calls[0][1] as {
      'error-callback': () => void
      callback: (token: string) => void
    }

    act(() => options['error-callback']())
    expect(onTokenChange).toHaveBeenLastCalledWith(null)
    expect(screen.getByText('Security verification failed.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'TRY AGAIN' }))
    await waitFor(() => expect(client.render).toHaveBeenCalledTimes(2))
    expect(client.remove).toHaveBeenCalledWith('widget-1')

    const newOptions = client.render.mock.calls[1][1] as {
      callback: (token: string) => void
    }
    act(() => newOptions.callback('fresh-token'))
    expect(onTokenChange).toHaveBeenLastCalledWith('fresh-token')
    expect(screen.queryByText('Security verification failed.')).toBeNull()
  })
})
