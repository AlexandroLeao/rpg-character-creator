import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  signInWithPassword: vi.fn(),
  deleteUser: vi.fn(),
  createAdminAuthClient: vi.fn(),
}))

vi.mock('../lib/supabase.js', () => ({
  createAuthClient: () => ({
    auth: {
      getUser: mocks.getUser,
      signInWithPassword: mocks.signInWithPassword,
    },
  }),
  createAdminAuthClient: mocks.createAdminAuthClient,
}))

import app from '../app.js'

const endpoint = '/api/account/me'
const identity = {
  id: 'authenticated-owner-1',
  email: 'owner@example.test',
  email_confirmed_at: '2026-11-01T12:00:00Z',
}

function deletionRequest() {
  return request(app)
    .delete(endpoint)
    .set('Authorization', 'Bearer verified-owner-token')
    .send({
      password: 'correct-owner-password',
      confirmation: 'DELETE',
      captchaToken: 'fresh-captcha-token',
    })
}

describe('DELETE /api/account/me', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({
      data: { user: identity },
      error: null,
    })
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: identity },
      error: null,
    })
    mocks.deleteUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
    mocks.createAdminAuthClient.mockReturnValue({
      auth: { admin: { deleteUser: mocks.deleteUser } },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requires a valid authenticated session', async () => {
    const response = await request(app)
      .delete(endpoint)
      .send({ password: 'password', confirmation: 'DELETE' })

    expect(response.status).toBe(401)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('rejects an invalid or expired session before attempting deletion', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Expired'),
    })

    const response = await deletionRequest()

    expect(response.status).toBe(401)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(mocks.signInWithPassword).not.toHaveBeenCalled()
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('rejects unverified email accounts', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { ...identity, email_confirmed_at: null } },
      error: null,
    })

    expect((await deletionRequest()).status).toBe(403)
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('requires an explicit confirmation and a nonempty bounded password', async () => {
    for (const body of [
      {},
      { password: 'value' },
      { password: '', confirmation: 'DELETE' },
      { password: 4, confirmation: 'DELETE' },
      { password: 'x'.repeat(1025), confirmation: 'DELETE' },
      { password: 'value', confirmation: 'YES' },
      { password: 'value', confirmation: 'DELETE', captchaToken: 123 },
      { password: 'value', confirmation: 'DELETE', captchaToken: '' },
      { password: 'value', confirmation: 'DELETE', captchaToken: 'x'.repeat(4097) },
    ]) {
      const response = await request(app)
        .delete(endpoint)
        .set('Authorization', 'Bearer verified-owner-token')
        .send(body)
      expect(response.status).toBe(400)
      expect(response.headers['cache-control']).toBe('no-store')
    }
    expect(mocks.signInWithPassword).not.toHaveBeenCalled()
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('never deletes if the password is incorrect', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: new Error('Invalid login credentials'),
    })

    const response = await deletionRequest()
    expect(response.status).toBe(403)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(response.body).toEqual({
      error: 'Identity confirmation failed',
    })
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('does not delete if Supabase rejects the CAPTCHA proof', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: Object.assign(new Error('CAPTCHA rejected'), {
        code: 'captcha_failed',
      }),
    })

    const response = await deletionRequest()
    expect(response.status).toBe(403)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@example.test',
      password: 'correct-owner-password',
      options: { captchaToken: 'fresh-captcha-token' },
    })
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('rejects a mismatched reauthenticated identity', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'different-owner-id' } },
      error: null,
    })

    expect((await deletionRequest()).status).toBe(403)
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('deletes only the Bearer-token owner and returns no sensitive data', async () => {
    const response = await request(app)
      .delete(endpoint)
      .set('Authorization', 'Bearer verified-owner-token')
      .send({
        password: 'correct-owner-password',
        confirmation: 'DELETE',
        captchaToken: 'fresh-captcha-token',
        userId: 'victim-user-id',
        email: 'victim@example.test',
      })

    expect(response.status).toBe(204)
    expect(response.text).toBe('')
    expect(response.headers['cache-control']).toBe('no-store')
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@example.test',
      password: 'correct-owner-password',
      options: { captchaToken: 'fresh-captcha-token' },
    })
    expect(mocks.deleteUser).toHaveBeenCalledOnce()
    expect(mocks.deleteUser).toHaveBeenCalledWith('authenticated-owner-1')
  })

  it('does not delete if the privileged server key is unavailable', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.createAdminAuthClient.mockImplementation(() => {
      throw new Error('Configuration missing')
    })
    const response = await deletionRequest()
    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(response.text).not.toContain('Configuration missing')
    expect(mocks.deleteUser).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('[account-delete] admin_client_unavailable')
  })

  it('handles failed admin deletion without reporting success', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.deleteUser.mockResolvedValue({
      data: { user: null },
      error: Object.assign(new Error('Private database details'), {
        status: 500,
        code: 'synthetic-private-provider-code',
      }),
    })

    const response = await deletionRequest()
    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(response.text).not.toContain('Private database details')
    expect(log.mock.calls).toEqual([['[account-delete] admin_delete_rejected']])
    expect(JSON.stringify(log.mock.calls)).not.toContain('Private database details')
    expect(JSON.stringify(log.mock.calls)).not.toContain('synthetic-private-provider-code')
  })

  it('handles auth service exceptions without exposing internals', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.signInWithPassword.mockRejectedValue(
      new Error('private authentication information'),
    )
    const response = await deletionRequest()
    expect(response.status).toBe(503)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(response.text).not.toContain('private authentication information')
    expect(mocks.deleteUser).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('[account-delete] password_verification_exception')
  })
})
