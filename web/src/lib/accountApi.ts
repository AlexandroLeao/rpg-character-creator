/**
 * Self-service account deletion.
 * The password is sent only to our authenticated HTTPS backend;
 * no administrative Supabase credential is ever present in the web build.
 */

export type AccountDeleteErrorKind =
  | 'unauthorized'
  | 'password'
  | 'invalid'
  | 'unavailable'

export class AccountDeleteError extends Error {
  readonly kind: AccountDeleteErrorKind

  constructor(kind: AccountDeleteErrorKind) {
    super(kind)
    this.kind = kind
    this.name = 'AccountDeleteError'
  }
}

export async function deleteMyAccount(
  accessToken: string,
  password: string,
): Promise<void> {
  if (!accessToken || !password) {
    throw new AccountDeleteError('invalid')
  }

  // CloudShell proxies may reserve the Authorization header.
  const authorizationHeader =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('.cloudshell.dev')
      ? 'X-Rpg-Authorization'
      : 'Authorization'

  let response: Response
  try {
    response = await fetch('/api/account/me', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        [authorizationHeader]: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        password,
        confirmation: 'DELETE',
      }),
    })
  } catch {
    throw new AccountDeleteError('unavailable')
  }

  if (response.status === 204) return
  if (response.status === 401) {
    throw new AccountDeleteError('unauthorized')
  }
  if (response.status === 403) {
    throw new AccountDeleteError('password')
  }
  if (response.status === 400) {
    throw new AccountDeleteError('invalid')
  }
  throw new AccountDeleteError('unavailable')
}
