import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'

if (process.env.E2E_LOCAL_SUPABASE_URL !== 'http://127.0.0.1:54321' ||
    process.env.VITE_SUPABASE_URL !== 'http://127.0.0.1:54321' ||
    process.env.SUPABASE_URL !== 'http://127.0.0.1:54321' ||
    process.env.VITE_TURNSTILE_SITE_KEY !== '' ||
    !process.env.E2E_LOCAL_ADMIN_KEY) {
  throw new Error('Run npm test through the local-only E2E launcher.')
}

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:5173',
    reducedMotion: 'reduce',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    acceptDownloads: true,
  },
  webServer: [
    {
      command: 'npm start',
      cwd: fileURLToPath(new URL('../api/', import.meta.url)),
      url: 'http://127.0.0.1:3000/api/health',
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
      cwd: fileURLToPath(new URL('../web/', import.meta.url)),
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
})
