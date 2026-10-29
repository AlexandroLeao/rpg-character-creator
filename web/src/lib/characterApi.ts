export type Character = {
  id: string
  name: string
  characterClass: string
  ancestry: string
  background: string
  weapon: string
  artifact: string
  personality: string
  aura: string
  companion: string
  createdAt: string
  updatedAt: string
}

export type CharacterApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'unavailable'
  | 'invalidResponse'

export class CharacterApiError extends Error {
  readonly kind: CharacterApiErrorKind

  constructor(kind: CharacterApiErrorKind) {
    super(kind)

    this.kind = kind
    this.name = 'CharacterApiError'
  }
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

const characterFields = [
  'id',
  'name',
  'characterClass',
  'ancestry',
  'background',
  'weapon',
  'artifact',
  'personality',
  'aura',
  'companion',
  'createdAt',
  'updatedAt',
] as const

function isCloudShellPreview(): boolean {
  return (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('.cloudshell.dev')
  )
}

export async function getMyCharacter(
  accessToken: string,
  signal?: AbortSignal,
): Promise<Character | null> {
  if (!accessToken) {
    throw new CharacterApiError('unauthorized')
  }

  const authorizationHeader = isCloudShellPreview()
    ? 'X-Rpg-Authorization'
    : 'Authorization'

  const response = await fetch('/api/characters/me', {
    method: 'GET',
    headers: {
      [authorizationHeader]: `Bearer ${accessToken}`,
    },
    signal,
  })

  if (response.status === 404) {
    return null
  }

  if (response.status === 401) {
    throw new CharacterApiError('unauthorized')
  }

  if (response.status === 403) {
    throw new CharacterApiError('forbidden')
  }

  if (!response.ok) {
    throw new CharacterApiError('unavailable')
  }

  const payload: unknown = await response.json().catch(
    () => null,
  )

  if (
    !isRecord(payload) ||
    !isRecord(payload.character)
  ) {
    throw new CharacterApiError('invalidResponse')
  }

  const character = payload.character

  const hasInvalidFields = characterFields.some(
    (field) => typeof character[field] !== 'string',
  )

  if (hasInvalidFields) {
    throw new CharacterApiError('invalidResponse')
  }

  return character as Character
}