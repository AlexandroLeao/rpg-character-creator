import { readFileSync } from 'node:fs'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { characterOptions, validateCharacterInput } from './lib/characterValidation.js'

type JsonObject = Record<string, unknown>
type Schema = {
  $ref?: string
  type?: string | string[]
  const?: unknown
  enum?: unknown[]
  required?: string[]
  properties?: Record<string, Schema>
  additionalProperties?: boolean | Schema
  oneOf?: Schema[]
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: string
}
type Media = {
  schema: Schema
  example?: unknown
  examples?: Record<string, { value: unknown }>
}
type ResponseContract = {
  description: string
  headers?: Record<string, { $ref: string }>
  content?: Record<string, Media>
}
type Operation = {
  operationId: string
  security: Record<string, string[]>[]
  requestBody?: { required: boolean; content: Record<string, Media> }
  responses: Record<string, ResponseContract>
}

const contract = JSON.parse(
  readFileSync(new URL('../openapi.json', import.meta.url), 'utf8'),
) as {
  openapi: string
  paths: Record<string, Record<string, Operation>>
  components: {
    schemas: Record<string, Schema>
    headers: Record<string, { required: boolean; schema: Schema }>
    securitySchemes: Record<string, JsonObject>
  }
}

function resolve(ref: string): unknown {
  expect(ref.startsWith('#/')).toBe(true)
  return ref.slice(2).split('/').reduce<unknown>((node, key) => {
    expect(node).toBeTypeOf('object')
    expect(node).not.toBeNull()
    const next = (node as JsonObject)[key]
    expect(next).toBeDefined()
    return next
  }, contract)
}

// Small, intentionally bounded check of the JSON Schema keywords used by
// this document. This is not a general OpenAPI/JSON Schema validator.
function check(value: unknown, schema: Schema): void {
  if (schema.$ref) {
    check(value, resolve(schema.$ref) as Schema)
    return
  }
  if (schema.oneOf) {
    let matches = 0
    for (const option of schema.oneOf) {
      try {
        check(value, option)
        matches++
      } catch {
        // A nonmatching alternative is expected.
      }
    }
    expect(matches).toBe(1)
    return
  }
  if ('const' in schema) expect(value).toEqual(schema.const)
  if (schema.enum) expect(schema.enum).toContain(value)
  const kind = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
  if (schema.type) {
    expect(Array.isArray(schema.type) ? schema.type : [schema.type]).toContain(kind)
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined) expect(Array.from(value).length).toBeGreaterThanOrEqual(schema.minLength)
    if (schema.maxLength !== undefined) expect(Array.from(value).length).toBeLessThanOrEqual(schema.maxLength)
    if (schema.pattern) expect(value).toMatch(new RegExp(schema.pattern, 'u'))
    if (schema.format === 'uuid') expect(value).toMatch(/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i)
    if (schema.format === 'date-time') expect(Number.isNaN(Date.parse(value))).toBe(false)
  }
  if (kind === 'object') {
    const object = value as JsonObject
    for (const key of schema.required ?? []) expect(Object.hasOwn(object, key)).toBe(true)
    for (const [key, item] of Object.entries(object)) {
      const property = schema.properties?.[key]
      if (property) check(item, property)
      else if (schema.additionalProperties === false) throw new Error('Unexpected property: ' + key)
      else if (typeof schema.additionalProperties === 'object') check(item, schema.additionalProperties)
    }
  }
}

function checkMedia(media: Media) {
  if ('example' in media) check(media.example, media.schema)
  for (const item of Object.values(media.examples ?? {})) check(item.value, media.schema)
}

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  deleteUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('./lib/supabase.js', () => ({
  createAuthClient: () => ({ auth: { getUser: mocks.getUser, signInWithPassword: mocks.signInWithPassword } }),
  createAdminAuthClient: () => ({ auth: { admin: { deleteUser: mocks.deleteUser } } }),
  createUserDatabaseClient: () => ({ from: mocks.from }),
}))

import app from './app.js'

const input = {
  name: 'Eldrin',
  characterClass: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
  motivation: 'knowledge',
}
const row = {
  id: '11111111-1111-4111-8111-111111111111',
  user_id: 'local-owner',
  name: input.name,
  character_class: input.characterClass,
  ancestry: input.ancestry,
  background: input.background,
  weapon: input.weapon,
  artifact: input.artifact,
  personality: input.personality,
  aura: input.aura,
  companion: input.companion,
  motivation: input.motivation,
  created_at: '2026-10-29T10:00:00Z',
  updated_at: '2026-10-29T10:00:00Z',
}
const user = { id: 'local-owner', email: 'local@example.test', email_confirmed_at: '2026-11-01T12:00:00Z' }

function verifyResponse(path: string, method: string, status: number, response: { status: number; body: unknown; text: string; headers: Record<string, unknown> }) {
  expect(response.status).toBe(status)
  const documented = contract.paths[path][method].responses[String(status)]
  expect(documented).toBeDefined()
  const media = documented.content?.['application/json']
  if (media) check(response.body, media.schema)
  else expect(response.text).toBe('')
  if (documented.headers?.['Cache-Control']) expect(response.headers['cache-control']).toBe('no-store')
}

describe('OpenAPI contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user }, error: null })
    mocks.signInWithPassword.mockResolvedValue({ data: { user }, error: null })
    mocks.deleteUser.mockResolvedValue({ error: null })
  })

  it('documents exactly the implemented operations and expected response statuses', () => {
    expect(contract.openapi).toBe('3.1.0')
    expect(Object.keys(contract.paths).sort()).toEqual(['/api/account/me', '/api/characters/me', '/api/health'])
    expect(Object.keys(contract.paths['/api/characters/me']).sort()).toEqual(['delete', 'get', 'put'])
    expect(Object.keys(contract.paths['/api/account/me'])).toEqual(['delete'])
    expect(Object.keys(contract.paths['/api/health'])).toEqual(['get'])
    const statuses = (path: string, method: string) => Object.keys(contract.paths[path][method].responses).sort()
    expect(statuses('/api/health', 'get')).toEqual(['200'])
    expect(statuses('/api/characters/me', 'get')).toEqual(['200', '401', '403', '404', '500', '503'])
    expect(statuses('/api/characters/me', 'put')).toEqual(['200', '201', '400', '401', '403', '409', '500', '503'])
    expect(statuses('/api/characters/me', 'delete')).toEqual(['204', '401', '403', '500', '503'])
    expect(statuses('/api/account/me', 'delete')).toEqual(['204', '400', '401', '403', '409', '500', '503'])
  })

  it('resolves every local reference and checks every documented JSON example', () => {
    function walk(value: unknown) {
      if (!value || typeof value !== 'object') return
      if (Array.isArray(value)) {
        value.forEach(walk)
        return
      }
      const object = value as JsonObject
      if (typeof object.$ref === 'string') resolve(object.$ref)
      Object.values(object).forEach(walk)
    }
    walk(contract)
    for (const operations of Object.values(contract.paths)) {
      for (const operation of Object.values(operations)) {
        for (const media of Object.values(operation.requestBody?.content ?? {})) checkMedia(media)
        for (const response of Object.values(operation.responses)) {
          expect(response.description.length).toBeGreaterThan(0)
          for (const media of Object.values(response.content ?? {})) checkMedia(media)
        }
      }
    }
  })

  it('requires Bearer authentication and no-store on every private response, not on health', () => {
    expect(contract.components.securitySchemes.bearerAuth).toMatchObject({ type: 'http', scheme: 'bearer' })
    expect(contract.components.headers.NoStore).toMatchObject({ required: true, schema: { const: 'no-store' } })
    for (const [path, operations] of Object.entries(contract.paths)) {
      for (const operation of Object.values(operations)) {
        expect(operation.security).toEqual(path === '/api/health' ? [] : [{ bearerAuth: [] }])
        for (const [status, response] of Object.entries(operation.responses)) {
          if (path !== '/api/health') expect(response.headers?.['Cache-Control']).toEqual({ $ref: '#/components/headers/NoStore' })
          if (status === '204') expect(response.content).toBeUndefined()
        }
      }
    }
  })

  it('keeps write options and the required fields aligned with the runtime validator', () => {
    const schema = contract.components.schemas.CharacterInput
    expect(schema.required?.sort()).toEqual(['name', ...Object.keys(characterOptions)].sort())
    expect(schema.additionalProperties).toBe(false)
    for (const [field, options] of Object.entries(characterOptions)) {
      expect(schema.properties?.[field].enum).toEqual([...options])
    }
    const example = contract.paths['/api/characters/me'].put.requestBody?.content['application/json'].example
    expect(validateCharacterInput(example).success).toBe(true)
    expect(validateCharacterInput({ ...input, motivation: null }).success).toBe(false)
    expect(validateCharacterInput({ ...input, name: '  ' }).success).toBe(false)
  })

  it('allows legacy stored values and null motivation in read responses', () => {
    const example = contract.paths['/api/characters/me'].get.responses['200'].content?.['application/json'].example as { character: JsonObject }
    check({ character: { ...example.character, artifact: 'legacy-artifact', motivation: null } }, contract.components.schemas.CharacterEnvelope)
  })

  it('describes the actual public health response', async () => {
    const response = await request(app).get('/api/health')
    verifyResponse('/api/health', 'get', 200, response)
    expect(response.headers['cache-control']).toBeUndefined()
  })

  it.each([
    ['get', '/api/characters/me'],
    ['put', '/api/characters/me'],
    ['delete', '/api/characters/me'],
    ['delete', '/api/account/me'],
  ] as const)('matches unauthenticated %s %s', async (method, path) => {
    verifyResponse(path, method, 401, await request(app)[method](path))
  })

  it('matches the actual character GET response', async () => {
    mocks.from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row, error: null }) }) }) })
    const response = await request(app).get('/api/characters/me').set('Authorization', 'Bearer fictional-token')
    verifyResponse('/api/characters/me', 'get', 200, response)
  })

  it.each([200, 201])('matches character PUT success %s', async (status) => {
    mocks.from.mockReturnValue({
      update: () => ({ eq: () => ({ select: () => ({ maybeSingle: async () => ({ data: status === 200 ? row : null, error: null }) }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: row, error: null }) }) }),
    })
    const response = await request(app).put('/api/characters/me').set('Authorization', 'Bearer fictional-token').send(input)
    verifyResponse('/api/characters/me', 'put', status, response)
  })

  it('matches a character validation error', async () => {
    const response = await request(app).put('/api/characters/me').set('Authorization', 'Bearer fictional-token').send({ ...input, motivation: null })
    verifyResponse('/api/characters/me', 'put', 400, response)
  })

  it('matches character deletion without a response body', async () => {
    mocks.from.mockReturnValue({ delete: () => ({ eq: async () => ({ error: null }) }) })
    verifyResponse('/api/characters/me', 'delete', 204, await request(app).delete('/api/characters/me').set('Authorization', 'Bearer fictional-token'))
  })

  it('matches account deletion with mocked services and a fictional password', async () => {
    const example = contract.paths['/api/account/me'].delete.requestBody?.content['application/json'].example as JsonObject
    const response = await request(app).delete('/api/account/me').set('Authorization', 'Bearer fictional-token').send(example)
    verifyResponse('/api/account/me', 'delete', 204, response)
    expect(mocks.deleteUser).toHaveBeenCalledWith(user.id)
  })
})
