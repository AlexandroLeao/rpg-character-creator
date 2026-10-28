import express, { type ErrorRequestHandler } from 'express'
import cors from 'cors'

const app = express()

const allowedOrigins = (
  process.env.CORS_ORIGIN ?? 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())

app.disable('x-powered-by')

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

  console.error('Unhandled API error:', error)

  res.status(500).json({
    error: 'Internal server error',
  })
}

app.use(errorHandler)

export default app