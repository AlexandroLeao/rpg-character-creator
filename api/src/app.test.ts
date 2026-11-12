import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import app from './app.js'

describe('API Health Check', () => {
  it('should return HTTP 200 when the API is available', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.headers['cache-control']).toBeUndefined()

    expect(response.body).toEqual({
      status: 'ok',
      service: 'rpg-character-creator-api',
    })
  })

  it('should return HTTP 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown')

    expect(response.status).toBe(404)

    expect(response.body).toEqual({
      error: 'Route not found',
    })
  })
})

describe('Private API cache policy', () => {
  it.each([
    ['get', '/api/characters/me'],
    ['put', '/api/characters/me'],
    ['delete', '/api/characters/me'],
    ['delete', '/api/account/me'],
  ] as const)('applies no-store to unauthenticated %s %s', async (method, path) => {
    const response = await request(app)[method](path)

    expect(response.status).toBe(401)
    expect(response.headers['cache-control']).toBe('no-store')
  })

  it.each([
    ['put', '/api/characters/me'],
    ['delete', '/api/account/me'],
  ] as const)('applies no-store before parsing malformed JSON on %s %s', async (method, path) => {
    const response = await request(app)[method](path)
      .set('Content-Type', 'application/json')
      .send('{"invalid":')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Invalid JSON body' })
    expect(response.headers['cache-control']).toBe('no-store')
  })

  it('preserves no-store and logs only a fixed event on oversized input', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const response = await request(app)
        .put('/api/characters/me')
        .send({ name: 'synthetic-private-value'.repeat(1000) })

      // Preserve the existing generic error response contract.
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal server error' })
      expect(response.headers['cache-control']).toBe('no-store')
      expect(log.mock.calls).toEqual([['[api] unhandled_error']])
    } finally {
      log.mockRestore()
    }
  })

  it('preserves no-store on CORS preflight', async () => {
    const response = await request(app)
      .options('/api/characters/me')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET')

    expect(response.status).toBe(204)
    expect(response.headers['cache-control']).toBe('no-store')
  })

  it('applies no-store to unknown routes in a private namespace', async () => {
    const response = await request(app).get('/api/account/unknown')

    expect(response.status).toBe(404)
    expect(response.headers['cache-control']).toBe('no-store')
  })
})
