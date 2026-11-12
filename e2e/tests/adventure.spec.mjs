import { test as base, expect } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const LOCAL_SUPABASE = 'http://127.0.0.1:54321'
const LOCAL_WEB = 'http://127.0.0.1:5173'
const adminKey = process.env.E2E_LOCAL_ADMIN_KEY
if (process.env.E2E_LOCAL_SUPABASE_URL !== LOCAL_SUPABASE || !adminKey) {
  throw new Error('Local Supabase configuration required.')
}

async function adminRequest(path, method, data) {
  const response = await fetch(LOCAL_SUPABASE + '/auth/v1/admin/users' + path, {
    method,
    headers: {
      apikey: adminKey,
      Authorization: 'Bearer ' + adminKey,
      'Content-Type': 'application/json',
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error('Local account ' + method + ' failed: HTTP ' + response.status)
  if (method === 'POST') return response.json()
}

const test = base.extend({
  accounts: async ({ browserName: _browserName }, use) => {
    const owned = []
    try {
      for (let index = 0; index < 2; index++) {
        const email = 'adventure-e2e-' + randomUUID() + '@example.com'
        const password = 'LocalOnly-' + randomUUID() + '-Aa1!'
        const created = await adminRequest('', 'POST', {
          email, password, email_confirm: true,
        })
        const id = created.id ?? created.user?.id
        if (!id) throw new Error('Local account ID missing.')
        owned.push({ id, email, password })
      }
      await use({ a: owned[0], b: owned[1] })
    } finally {
      const results = await Promise.allSettled(
        owned.map(account => adminRequest('/' + encodeURIComponent(account.id), 'DELETE')),
      )
      if (results.some(result => result.status === 'rejected')) {
        throw new Error('Disposable local account cleanup failed.')
      }
    }
  },
})

async function restrictNetwork(context) {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.origin === LOCAL_WEB || url.origin === LOCAL_SUPABASE ||
        url.protocol === 'blob:' || url.protocol === 'data:') {
      await route.continue()
    } else {
      await route.abort()
    }
  })
}

test.beforeEach(async ({ context }) => {
  await restrictNetwork(context)
})

function button(page, name) {
  return page.getByRole('button', { name, exact: true })
}

async function openLogin(page) {
  await page.goto('/')
  await button(page, 'PRESS START').click()
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
}

async function loginPt(page, account) {
  await openLogin(page)
  await button(page, 'Português').click()
  await page.getByLabel('Email', { exact: true }).fill(account.email)
  await page.getByLabel('Senha', { exact: true }).fill(account.password)
  await button(page, 'Entrar').click()
  await expect(page.getByRole('heading', { name: 'MEU PERSONAGEM', exact: true })).toBeVisible()
}

async function fillNewCharacter(page, name) {
  await button(page, 'Criar Personagem').click()
  await expect(page.getByRole('heading', { name: '01 / 06' })).toBeVisible()
  await button(page, 'Mago').click()
  await page.getByLabel('NOME DO PERSONAGEM').fill(name)
  await button(page, 'CONTINUAR').click()
  await expect(page.getByRole('heading', { name: '02 / 06' })).toBeVisible()
  await button(page, 'Elfo').click()
  await button(page, 'Estudioso').click()
  await button(page, 'CONTINUAR').click()
  await expect(page.getByRole('heading', { name: '03 / 06' })).toBeVisible()
  await button(page, 'Espada').click()
  await button(page, 'Selo Arcano').click()
  await button(page, 'CONTINUAR').click()
  await expect(page.getByRole('heading', { name: '04 / 06' })).toBeVisible()
  await button(page, 'Corajoso').click()
  await button(page, 'Fogo').click()
  await button(page, 'CONTINUAR').click()
  await expect(page.getByRole('heading', { name: '05 / 06' })).toBeVisible()
  await button(page, 'Coruja').click()
  await button(page, 'Proteção').click()
  await button(page, 'CONTINUAR').click()
  await expect(page.getByRole('heading', { name: '06 / 06' })).toBeVisible()
}

async function saveCharacter(page, status, name) {
  const saved = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/characters/me' &&
    response.request().method() === 'PUT')
  await button(page, 'SALVAR').click()
  expect((await saved).status()).toBe(status)
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
}

async function verifyPng(page, label, width, height) {
  const pending = page.waitForEvent('download')
  await button(page, label).click()
  const download = await pending
  expect(download.suggestedFilename()).toMatch(/\.png$/i)
  const bytes = await readFile(await download.path())
  expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  expect(bytes.subarray(12, 16).toString('ascii')).toBe('IHDR')
  expect(bytes.readUInt32BE(16)).toBe(width)
  expect(bytes.readUInt32BE(20)).toBe(height)
  await download.delete()
}

test('six stages, safe retry, persistence, edit and both PNG downloads', async ({ page, accounts }) => {
  await loginPt(page, accounts.a)
  await fillNewCharacter(page, 'Luna E2E')
  // Deliberate browser-side failure for one save only. The retry below is real.
  const failPut = async route => {
    if (route.request().method() !== 'PUT') return route.fallback()
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Character storage unavailable' }),
    })
  }
  await page.route('**/api/characters/me', failPut)
  await button(page, 'SALVAR').click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(button(page, 'SALVAR')).toBeEnabled()
  await page.unroute('**/api/characters/me', failPut)
  await saveCharacter(page, 201, 'LUNA E2E')

  await page.reload()
  await expect(page.getByRole('heading', { name: 'LUNA E2E', exact: true })).toBeVisible()

  await button(page, 'Editar').click()
  await page.getByLabel('NOME DO PERSONAGEM').fill('Luna Nova')
  for (let step = 1; step <= 5; step++) {
    await button(page, 'CONTINUAR').click()
  }
  await saveCharacter(page, 200, 'LUNA NOVA')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'LUNA NOVA', exact: true })).toBeVisible()

  await button(page, 'Exportar').click()
  await verifyPng(page, 'PNG STORY — 1080 × 1920', 1080, 1920)
  await verifyPng(page, 'PNG RETRATO — 1080 × 1350', 1080, 1350)

  await page.locator('.character-dashboard').getByRole('button', { name: 'Sair', exact: true }).click()
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
  await loginPt(page, accounts.a)
  await expect(page.getByRole('heading', { name: 'LUNA NOVA', exact: true })).toBeVisible()
})

test('separate browser sessions keep two real accounts isolated', async ({ page, browser, accounts }) => {
  await loginPt(page, accounts.a)
  await fillNewCharacter(page, 'Aurora E2E')
  await saveCharacter(page, 201, 'AURORA E2E')
  const contextB = await browser.newContext({ baseURL: LOCAL_WEB, reducedMotion: 'reduce' })
  try {
    await restrictNetwork(contextB)
    const pageB = await contextB.newPage()
    await loginPt(pageB, accounts.b)
    await expect(button(pageB, 'Criar Personagem')).toBeVisible()
    await expect(pageB.getByRole('heading', { name: 'AURORA E2E', exact: true })).toHaveCount(0)
    await fillNewCharacter(pageB, 'Orion E2E')
    await saveCharacter(pageB, 201, 'ORION E2E')
    await page.reload()
    await expect(page.getByRole('heading', { name: 'AURORA E2E', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'ORION E2E', exact: true })).toHaveCount(0)
    await pageB.reload()
    await expect(pageB.getByRole('heading', { name: 'ORION E2E', exact: true })).toBeVisible()
  } finally {
    await contextB.close()
  }
})

test.describe('mobile and language', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  test('language switch, invalid login and real mobile login', async ({ page, accounts }) => {
    await openLogin(page)
    await expect(page.getByRole('heading', { name: 'Sign In', exact: true })).toBeVisible()
    await button(page, 'Português').click()
    await expect(page.getByRole('heading', { name: 'Entrar', exact: true })).toBeVisible()
    await page.getByLabel('Email', { exact: true }).fill(accounts.a.email)
    await page.getByLabel('Senha', { exact: true }).fill('Incorrect-local-test-password!')
    await button(page, 'Entrar').click()
    await expect(page.getByRole('alert')).toContainText('Não foi possível entrar')
    await page.getByLabel('Senha', { exact: true }).fill(accounts.a.password)
    await button(page, 'Entrar').click()
    await expect(button(page, 'Criar Personagem')).toBeVisible()
    await button(page, 'English').click()
    await expect(button(page, 'Create Character')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
  })
})
