import express, { type ErrorRequestHandler } from 'express'
import cors from 'cors'
import { characterRouter } from './routes/characters.js'
import { accountRouter } from './routes/account.js'

const app = express()

const allowedOrigins = (
  process.env.CORS_ORIGIN ?? 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())

app.disable('x-powered-by')

// Apply before CORS, parsing and authentication so private route errors
// and successful responses follow the same cache policy.
app.use(['/api/characters', '/api/account'], (_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use(
  cors({
    origin: allowedOrigins,
  }),
)

app.use(express.json({ limit: '16kb' }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'rpg-character-creator-api',
  })
})

app.use('/api/characters', characterRouter)
app.use('/api/account', accountRouter)

app.use((_req, res) => {
  res.status(404).json({
    error: 'Route not found',
  })
})

const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: 'Invalid JSON body',
    })
    return
  }

  // Exceptions can carry request bodies, headers or upstream details.
  // Keep server logs limited to a stable, non-sensitive event identifier.
  console.error('[api] unhandled_error')

  res.status(500).json({
    error: 'Internal server error',
  })
}

app.use(errorHandler)

export default app