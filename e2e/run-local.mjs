import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const api = fileURLToPath(new URL('../api/', import.meta.url))
const e2e = fileURLToPath(new URL('./', import.meta.url))
const localUrl = 'http://127.0.0.1:54321'
const webUrl = 'http://127.0.0.1:5173'

// Never read credentials from hosted project settings or a project .env.
let status
try {
  status = execFileSync('supabase', ['status', '-o', 'env'], {
    cwd: root, encoding: 'utf8', timeout: 30_000,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
} catch {
  throw new Error('Start a disposable local Supabase stack from the repository root first.')
}
const values = {}
for (const line of status.split(/\r?\n/)) {
  const match = line.trim().match(/^([A-Z][A-Z0-9_]*)=(.*)$/)
  if (match) values[match[1]] = match[2].replace(/^["']|["']$/g, '')
}
if (values.API_URL !== localUrl || !values.ANON_KEY || !values.SERVICE_ROLE_KEY) {
  throw new Error('E2E requires the isolated local Supabase API at 127.0.0.1:54321 and local CLI keys.')
}

const env = {
  ...process.env,
  NODE_ENV: 'development',
  PORT: '3000',
  CORS_ORIGIN: webUrl,
  SUPABASE_URL: localUrl,
  SUPABASE_PUBLISHABLE_KEY: values.ANON_KEY,
  SUPABASE_SECRET_KEY: values.SERVICE_ROLE_KEY,
  VITE_SUPABASE_URL: localUrl,
  VITE_SUPABASE_PUBLISHABLE_KEY: values.ANON_KEY,
  VITE_AUTH_REDIRECT_ORIGIN: webUrl,
  VITE_TURNSTILE_SITE_KEY: '',
  E2E_LOCAL_SUPABASE_URL: localUrl,
  E2E_LOCAL_ADMIN_KEY: values.SERVICE_ROLE_KEY,
}

// Force loopback configuration regardless of inherited variables or local .env.
// No environment values or CLI status are printed.
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, env, stdio: 'inherit' })
  if (result.error || result.status !== 0) process.exit(result.status || 1)
}
run('npm', ['run', 'build'], api)
run(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], e2e)
