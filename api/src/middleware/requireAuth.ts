import type { RequestHandler } from 'express'
import { createAuthClient } from '../lib/supabase.js'

export const requireAuth: RequestHandler = async (
  req,
  res,
  next,
) => {
  const authorization = req.headers.authorization

  if (!authorization || authorization.length > 8192) {
    res.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const match = authorization.match(/^Bearer\s+(\S+)$/i)

  if (!match) {
    res.status(401).json({
      error: 'Unauthorized',
    })
    return
  }

  const accessToken = match[1]

  try {
    const supabase = createAuthClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken)

    if (error) {
      const serviceUnavailable =
        error.name === 'AuthRetryableFetchError' ||
        error.status === 0 ||
        (
          typeof error.status === 'number' &&
          error.status >= 500
        )

      if (serviceUnavailable) {
        res.status(503).json({
          error: 'Authentication service unavailable',
        })
        return
      }

      res.status(401).json({
        error: 'Unauthorized',
      })
      return
    }

    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
      })
      return
    }

    if (!user.email_confirmed_at) {
      res.status(403).json({
        error: 'Email verification required',
      })
      return
    }

    res.locals.authenticatedUserId = user.id

    next()
  } catch {
    res.status(503).json({
      error: 'Authentication service unavailable',
    })
  }
}
