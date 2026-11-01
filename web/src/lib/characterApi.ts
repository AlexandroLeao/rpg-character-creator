
/*
 * ADVENTURE FILES
 * CHARACTER API CLIENT
 *
 * GET /api/characters/me
 * PUT /api/characters/me
 * DELETE /api/characters/me
 *
 * Authentication uses the access token
 * provided by Supabase Auth.
 */

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

  /*
   * Legacy characters may not have
   * a selected motivation.
   */

  motivation: string | null

  createdAt: string
  updatedAt: string
}

/* ==========================================
   CHARACTER SAVE INPUT
   ========================================== */

export type CharacterSaveInput = Omit<
  Character,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'motivation'
> & {
  motivation: string
}

/* ==========================================
   API ERROR TYPES
   ========================================== */

export type CharacterApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'invalidRequest'
  | 'conflict'
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

/* ==========================================
   VALIDATION HELPERS
   ========================================== */

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

/* ==========================================
   CLOUD SHELL COMPATIBILITY
   ========================================== */

function isCloudShellPreview(): boolean {
  return (
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith(
      '.cloudshell.dev',
    )
  )
}

function getAuthorizationHeader(): string {
  return isCloudShellPreview()
    ? 'X-Rpg-Authorization'
    : 'Authorization'
}

/* ==========================================
   AUTHENTICATION VALIDATION
   ========================================== */

function requireAccessToken(
  accessToken: string,
): void {
  if (!accessToken) {
    throw new CharacterApiError(
      'unauthorized',
    )
  }
}

/* ==========================================
   RESPONSE STATUS HANDLING
   ========================================== */

function checkResponseStatus(
  response: Response,
): void {
  if (response.status === 401) {
    throw new CharacterApiError(
      'unauthorized',
    )
  }

  if (response.status === 403) {
    throw new CharacterApiError(
      'forbidden',
    )
  }

  if (response.status === 400) {
    throw new CharacterApiError(
      'invalidRequest',
    )
  }

  if (response.status === 409) {
    throw new CharacterApiError(
      'conflict',
    )
  }

  if (!response.ok) {
    throw new CharacterApiError(
      'unavailable',
    )
  }
}

/* ==========================================
   CHARACTER RESPONSE VALIDATION
   ========================================== */

async function readCharacterResponse(
  response: Response,
): Promise<Character> {
  const payload: unknown =
    await response.json().catch(
      () => null,
    )

  if (
    !isRecord(payload) ||
    !isRecord(payload.character)
  ) {
    throw new CharacterApiError(
      'invalidResponse',
    )
  }

  const character = payload.character

  const hasInvalidFields =
    characterFields.some(
      (field) =>
        typeof character[field] !== 'string',
    )

  if (hasInvalidFields) {
    throw new CharacterApiError(
      'invalidResponse',
    )
  }

  /*
   * Motivation must be present.
   *
   * NULL is accepted when reading
   * characters created before the
   * six-stage creator was introduced.
   */

  if (
    !Object.prototype.hasOwnProperty.call(
      character,
      'motivation',
    ) ||
    (
      character.motivation !== null &&
      typeof character.motivation !== 'string'
    )
  ) {
    throw new CharacterApiError(
      'invalidResponse',
    )
  }

  return character as Character
}

/* ==========================================
   GET MY CHARACTER
   ========================================== */

export async function getMyCharacter(
  accessToken: string,
  signal?: AbortSignal,
): Promise<Character | null> {
  requireAccessToken(accessToken)

  const authorizationHeader =
    getAuthorizationHeader()

  const response = await fetch(
    '/api/characters/me',
    {
      method: 'GET',

      headers: {
        [authorizationHeader]:
          `Bearer ${accessToken}`,
      },

      signal,
    },
  )

  /*
   * No saved character.
   */

  if (response.status === 404) {
    return null
  }

  checkResponseStatus(response)

  return readCharacterResponse(response)
}

/* ==========================================
   SAVE MY CHARACTER
   ========================================== */

export async function saveMyCharacter(
  accessToken: string,
  input: CharacterSaveInput,
  signal?: AbortSignal,
): Promise<Character> {
  requireAccessToken(accessToken)

  const authorizationHeader =
    getAuthorizationHeader()

  const response = await fetch(
    '/api/characters/me',
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',

        [authorizationHeader]:
          `Bearer ${accessToken}`,
      },

      body: JSON.stringify(input),

      signal,
    },
  )

  checkResponseStatus(response)

  const character =
    await readCharacterResponse(response)

  /*
   * A newly saved character must contain
   * the motivation selected in Step 05.
   */

  if (character.motivation === null) {
    throw new CharacterApiError(
      'invalidResponse',
    )
  }

  return character
}

/* ==========================================
   DELETE MY CHARACTER
   ========================================== */

/*
 * Deletes the authenticated user's
 * saved character.
 *
 * The server identifies the character
 * from the authenticated session.
 *
 * A successful DELETE returns
 * HTTP 204 No Content.
 */

export async function deleteMyCharacter(
  accessToken: string,
  signal?: AbortSignal,
): Promise<void> {
  requireAccessToken(accessToken)

  const authorizationHeader =
    getAuthorizationHeader()

  const response = await fetch(
    '/api/characters/me',
    {
      method: 'DELETE',

      headers: {
        [authorizationHeader]:
          `Bearer ${accessToken}`,
      },

      signal,
    },
  )

  /*
   * Handles authentication failures,
   * conflicts, and server errors.
   *
   * HTTP 204 is accepted as success.
   */

  checkResponseStatus(response)

  /*
   * DELETE returns no response body.
   *
   * Do not attempt response.json().
   */
}
