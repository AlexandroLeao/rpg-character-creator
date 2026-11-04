// @vitest-environment jsdom

import { act, cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TurnstileChallenge } from './TurnstileChallenge'

describe('Cloudflare Turnstile challenge', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('uses a token once and resets the verification after an auth attempt', async () => {
    const client = {
      render: vi.fn((_container: HTMLElement, _options: unknown) => 'widget-1'),
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
      <TurnstileChallenge {...props} resetSignal={0} />,
    )

    await waitFor(() => expect(client.render).toHaveBeenCalledTimes(1))
    const options = client.render.mock.calls[0][1] as {
      callback: (token: string) => void
      'expired-callback': () => void
      appearance: string
      language: string
    }
    expect(options.appearance).toBe('interaction-only')
    expect(options.language).toBe('pt-BR')

    act(() => options.callback('single-use-token'))
    expect(onTokenChange).toHaveBeenLastCalledWith('single-use-token')

    rerender(<TurnstileChallenge {...props} resetSignal={1} />)
    expect(client.reset).toHaveBeenCalledWith('widget-1')
    expect(onTokenChange).toHaveBeenLastCalledWith(null)

    act(() => options['expired-callback']())
    expect(onTokenChange).toHaveBeenLastCalledWith(null)

    unmount()
    expect(client.remove).toHaveBeenCalledWith('widget-1')
  })
})
