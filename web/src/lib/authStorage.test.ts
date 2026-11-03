// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import { createPerTabAuthStorage } from './authStorage'

const storage = createPerTabAuthStorage('instance-A')

describe('Per-tab Supabase Auth storage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  })

  it('keeps account sessions in this tab only', () => {
    storage.setItem('instance-A', 'account-a')

    expect(window.sessionStorage.getItem('adventure-files-auth')).toBe(
      'account-a',
    )
    expect(window.localStorage.getItem('adventure-files-auth')).toBeNull()
  })

  it('shares only the PKCE verifier needed by email callbacks', () => {
    storage.setItem(
      'instance-A-code-verifier',
      'short-lived-verifier',
    )

    expect(
      window.localStorage.getItem('adventure-files-auth-code-verifier'),
    ).toBe('short-lived-verifier')
    expect(
      window.sessionStorage.getItem('adventure-files-auth-code-verifier'),
    ).toBeNull()
  })

  it('restores a tab session after a client reload with a new broadcast key', () => {
    storage.setItem('instance-A', 'saved-account')

    const reloaded = createPerTabAuthStorage('instance-B')
    expect(reloaded.getItem('instance-B')).toBe('saved-account')
  })

  it('removes session and verifier values from the correct stores', () => {
    storage.setItem('instance-A', 'session')
    storage.setItem('instance-A-code-verifier', 'proof')

    storage.removeItem('instance-A')
    storage.removeItem('instance-A-code-verifier')

    expect(window.sessionStorage.length).toBe(0)
    expect(window.localStorage.length).toBe(0)
  })
})
