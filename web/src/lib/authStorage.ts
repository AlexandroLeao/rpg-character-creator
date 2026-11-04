// A unique Supabase storageKey isolates Auth's BroadcastChannel per page.
// Keep the underlying sessionStorage key stable so logins survive refreshes.
// PKCE verifiers use the same key in localStorage across tabs because email
// links usually open in a different tab of the same browser.
const STABLE_STORAGE_KEY = 'adventure-files-auth'
const fallback = new Map<string, string>()

export function createPerTabAuthStorage(instanceKey: string) {
  function resolvedKey(key: string): string {
    if (!key.startsWith(instanceKey)) {
      throw new Error('Unexpected Supabase Auth storage key')
    }

    return STABLE_STORAGE_KEY + key.slice(instanceKey.length)
  }

  function backingStorage(key: string): Storage {
    return key.endsWith('-code-verifier')
      ? window.localStorage
      : window.sessionStorage
  }

  return {
    getItem(key: string): string | null {
      const name = resolvedKey(key)
      try {
        return backingStorage(name).getItem(name)
      } catch {
        return fallback.get(name) ?? null
      }
    },
    setItem(key: string, value: string): void {
      const name = resolvedKey(key)
      try {
        backingStorage(name).setItem(name, value)
      } catch {
        fallback.set(name, value)
      }
    },
    removeItem(key: string): void {
      const name = resolvedKey(key)
      try {
        backingStorage(name).removeItem(name)
      } catch {
        // Browser storage was unavailable; remove the in-memory copy.
      }
      fallback.delete(name)
    },
  }
}
