// @vitest-environment jsdom
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { CharacterDashboard } from './CharacterDashboard'

const mocks = vi.hoisted(() => ({
  getMyCharacter: vi.fn(),
  deleteMyCharacter: vi.fn(),
  deleteMyAccount: vi.fn(),
}))

vi.mock('./lib/characterApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./lib/characterApi')>()),
  getMyCharacter: mocks.getMyCharacter,
  deleteMyCharacter: mocks.deleteMyCharacter,
}))
vi.mock('./lib/accountApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./lib/accountApi')>()),
  deleteMyAccount: mocks.deleteMyAccount,
}))
vi.mock('./TurnstileChallenge', () => ({
  TurnstileChallenge: ({
    onTokenChange,
  }: {
    onTokenChange: (token: string) => void
  }) => (
    <button
      type="button"
      onClick={() => onTokenChange('fresh-captcha-token')}
    >
      Verify CAPTCHA
    </button>
  ),
}))

const character = {
  id: 'character-1',
  name: 'Eldrin',
  characterClass: 'mage',
  ancestry: 'elf',
  background: 'scholar',
  weapon: 'staff',
  artifact: 'moon-crystal',
  personality: 'curious',
  aura: 'arcane',
  companion: 'owl',
  motivation: 'knowledge',
  createdAt: '2026-11-01T12:00:00Z',
  updatedAt: '2026-11-01T12:00:00Z',
}

beforeEach(() => {
  vi.resetAllMocks()
  mocks.deleteMyCharacter.mockResolvedValue(undefined)
  mocks.deleteMyAccount.mockResolvedValue(undefined)
})
afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

describe('dashboard release actions', () => {
  it('shows Create, Extras and Delete Account in the empty state', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard accessToken="token" language="pt" />,
    )

    await screen.findByRole('button', { name: 'Criar Personagem' })
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '.character-empty > button',
      ),
    ).map((button) => button.textContent?.trim())

    expect(buttons).toEqual([
      'Criar Personagem',
      'EXTRAS',
      'EXCLUIR CONTA',
    ])
    expect(screen.queryByRole('button', { name: 'EXCLUIR PERSONAGEM' }))
      .toBeNull()
  })

  it('preserves five compact actions and the two delete options', async () => {
    mocks.getMyCharacter.mockResolvedValue(character)

    render(
      <CharacterDashboard
        accessToken="token"
        language="pt"
        onSignOut={vi.fn()}
      />,
    )

    await screen.findByRole('button', { name: 'Sair' })
    const labels = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '.character-dashboard__actions > button, ' +
        '.character-dashboard__actions > .character-export > button, ' +
        '.character-dashboard__actions > .character-dashboard__delete-menu > button',
      ),
    ).map((button) => button.textContent?.trim())

    expect(labels).toEqual([
      'Sair',
      'Editar',
      'Exportar',
      'Excluir',
      'EXTRAS',
    ])
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(screen.getByRole('button', { name: 'EXCLUIR PERSONAGEM' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'EXCLUIR CONTA' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'EXCLUIR PERSONAGEM' }))
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    expect(mocks.deleteMyCharacter).not.toHaveBeenCalled()
  })

  it('keeps Export and Delete option menus mutually exclusive', async () => {
    mocks.getMyCharacter.mockResolvedValue(character)
    render(
      <CharacterDashboard
        accessToken="token"
        language="pt"
        onSignOut={vi.fn()}
      />,
    )

    fireEvent.click(await screen.findByRole('button', { name: 'Exportar' }))
    expect(screen.getByText('ESCOLHA O FORMATO')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(screen.queryByText('ESCOLHA O FORMATO')).toBeNull()
    expect(screen.getByRole('button', { name: 'EXCLUIR PERSONAGEM' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Exportar' }))
    expect(screen.getByText('ESCOLHA O FORMATO')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'EXCLUIR PERSONAGEM' })).toBeNull()
  })

  it('shows the translated English labels', async () => {
    mocks.getMyCharacter.mockResolvedValue(character)
    render(
      <CharacterDashboard
        accessToken="token"
        language="en"
        onSignOut={vi.fn()}
      />,
    )
    expect(await screen.findByRole('button', { name: 'Edit' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Export' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'EXTRAS' })).toBeTruthy()
  })

  it('opens Extras from an empty dashboard and closes using Escape', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)
    render(
      <CharacterDashboard accessToken="token" language="pt" />,
    )
    fireEvent.click(await screen.findByRole('button', { name: 'EXTRAS' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('Alexandro Milhomes Leão')
    expect(dialog.textContent).toContain('direção criativa')
    expect(dialog.textContent).not.toContain('INTELIGÊNCIA ARTIFICIAL')
    expect(dialog.querySelectorAll('.extras-dialog__section')).toHaveLength(4)
    expect(dialog.textContent).toContain('adventurefiles.suporte@gmail.com')
    expect(dialog.querySelectorAll('a')).toHaveLength(2)
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('requires password and a typed phrase before deleting an empty account', async () => {
    mocks.getMyCharacter.mockResolvedValue(null)
    const onAccountDeleted = vi.fn()
    render(
      <CharacterDashboard
        accessToken="current-token"
        language="pt"
        onAccountDeleted={onAccountDeleted}
      />,
    )
    fireEvent.click(await screen.findByRole('button', { name: 'EXCLUIR CONTA' }))
    const dialog = screen.getByRole('alertdialog')
    const confirmButton = dialog.querySelector<HTMLButtonElement>(
      '.character-delete-dialog__confirm',
    )!

    expect(confirmButton.hasAttribute('disabled')).toBe(true)
    fireEvent.change(screen.getByLabelText('CONFIRME SUA SENHA'), {
      target: { value: 'correct-password' },
    })
    fireEvent.change(screen.getByLabelText('DIGITE EXCLUIR PARA CONFIRMAR'), {
      target: { value: 'EXCLUIR' },
    })
    expect(confirmButton.hasAttribute('disabled')).toBe(false)
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mocks.deleteMyAccount).toHaveBeenCalledWith(
        'current-token',
        'correct-password',
        undefined,
      )
      expect(onAccountDeleted).toHaveBeenCalledOnce()
    })
    expect(dialog).toBeTruthy()
  })

  it('requires a fresh Turnstile proof before deleting the current account', async () => {
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'public-test-site-key')
    mocks.getMyCharacter.mockResolvedValue(null)

    render(
      <CharacterDashboard
        accessToken="current-token"
        language="pt"
        onAccountDeleted={vi.fn()}
      />,
    )

    fireEvent.click(await screen.findByRole('button', { name: 'EXCLUIR CONTA' }))
    const dialog = screen.getByRole('alertdialog')
    const confirmButton = dialog.querySelector<HTMLButtonElement>(
      '.character-delete-dialog__confirm',
    )!

    fireEvent.change(screen.getByLabelText('CONFIRME SUA SENHA'), {
      target: { value: 'correct-password' },
    })
    fireEvent.change(screen.getByLabelText('DIGITE EXCLUIR PARA CONFIRMAR'), {
      target: { value: 'EXCLUIR' },
    })
    expect(confirmButton.disabled).toBe(true)
    expect(mocks.deleteMyAccount).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Verify CAPTCHA' }))
    expect(confirmButton.disabled).toBe(false)
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mocks.deleteMyAccount).toHaveBeenCalledWith(
        'current-token',
        'correct-password',
        'fresh-captcha-token',
      )
    })
  })
})
