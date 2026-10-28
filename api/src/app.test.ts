import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from './app.js'

describe('API Health Check', () => {
  it('should return HTTP 200 when the API is available', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)

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