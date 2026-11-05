import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import {
  createAdminAuthClient,
  createAuthClient,
} from '../lib/supabase.js'

export const accountRouter = Router()

/**
 * DELETE /api/account/me
 *
 * Only the holder of the authenticated session may request deletion.
 * A fresh password verification protects against a stolen access token.
 * No user ID or email is accepted from the request body.
 */
accountRouter.delete('/me', requireAuth, async (req, res) => {
  res.set('Cache-Control', 'no-store')

  const body: unknown = req.body

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body)
  ) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }

  const { password, confirmation, captchaToken } = body as Record<string, unknown>

  if (
    typeof password !== 'string' ||
    password.length === 0 ||
    password.length > 1024 ||
    confirmation !== 'DELETE' ||
    (captchaToken !== undefined &&
      (typeof captchaToken !== 'string' ||
        captchaToken.length === 0 ||
        captchaToken.length > 4096))
  ) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }

  const userId: unknown = res.locals.authenticatedUserId
  const email: unknown = res.locals.authenticatedEmail

  if (typeof userId !== 'string' || !userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (typeof email !== 'string' || !email) {
    res.status(409).json({
      error: 'Account cannot be verified',
    })
    return
  }

  // Deliberately check that the server-side credential exists before
  // attempting reauthentication. No privileged key is returned to the caller.
  let admin: ReturnType<typeof createAdminAuthClient>
  try {
    admin = createAdminAuthClient()
  } catch {
    // Server-side only: never log the key, password or user identity.
    console.error('[account-delete] admin_client_unavailable')
    res.status(503).json({
      error: 'Account deletion unavailable',
    })
    return
  }

  let phase: 'password_verification' | 'admin_delete' =
    'password_verification'
  try {
    const authClient = createAuthClient()
    const verifiedCaptchaToken =
      typeof captchaToken === 'string' ? captchaToken : undefined
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
      ...(verifiedCaptchaToken
        ? { options: { captchaToken: verifiedCaptchaToken } }
        : {}),
    })

    if (error || !data.user || data.user.id !== userId) {
      res.status(403).json({
        error: 'Identity confirmation failed',
      })
      return
    }

    // No account ID from the request is used here. The identity comes
    // exclusively from the independently authenticated Bearer token.
    phase = 'admin_delete'
    const { error: deleteError } =
      await admin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('[account-delete] admin_delete_rejected', {
        status: typeof deleteError.status === 'number'
          ? deleteError.status
          : null,
        code: 'code' in deleteError && typeof deleteError.code === 'string'
          ? deleteError.code
          : 'unknown',
      })
      res.status(503).json({
        error: 'Account deletion unavailable',
      })
      return
    }

    // Existing public.characters FK uses ON DELETE CASCADE.
    res.status(204).send()
  } catch {
    console.error(`[account-delete] ${phase}_exception`)
    res.status(503).json({
      error: 'Account deletion unavailable',
    })
  }
})
