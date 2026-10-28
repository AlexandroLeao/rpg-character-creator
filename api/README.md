# RPG Character Creator API

REST API for the RPG Character Creator application.

Built with Node.js, Express, and TypeScript.

## Technology Stack

- Node.js
- Express
- TypeScript
- ESLint
- Vitest
- Supertest

## Requirements

- Node.js 24
- npm 11

## Installation

Navigate to the API directory:

```bash
cd api
```

Install dependencies:

```bash
npm ci
```

## Environment Configuration

Create a local environment file:

```bash
cp .env.example .env
```

Available environment variables:

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP server port | `3000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

For multiple allowed origins, use a comma-separated list.

Never commit real credentials or sensitive environment files.

## Development

Start the development server:

```bash
npm run dev
```

The API runs on:

`http://localhost:3000`

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run the compiled server |
| `npm run lint` | Run ESLint |
| `npm test` | Run automated tests |

## API Endpoints

### GET /api/health

Checks whether the API is available.

**Response:**

HTTP 200 OK

```json
{
  "status": "ok",
  "service": "rpg-character-creator-api"
}
```

### Unknown Routes

Requests to nonexistent endpoints return HTTP 404.

```json
{
  "error": "Route not found"
}
```

## Testing

Run automated tests:

```bash
npm test
```

Current tests cover:

- Successful API health checks.
- Unknown route handling.

## Project Structure

```text
api/
├── src/
│   ├── app.ts
│   ├── app.test.ts
│   └── server.ts
├── .env.example
├── eslint.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Current Status

The initial REST API foundation is implemented.

Authentication, database integration, and character management
endpoints will be added in subsequent development phases.

## Related Documentation

- [System Architecture](../docs/architecture.md)
- [System Requirements](../docs/requirements.md)
- [Project Overview](../docs/project-overview.md)