import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import type { Language } from './lib/authTranslations'
import {
  AccountDeleteError,
  deleteMyAccount,
} from './lib/accountApi'

type AccountDeleteDialogProps = {
  language: Language
  accessToken: string
  onClose: () => void
  onDeleted: () => void
}

const translations = {
  pt: {
    title: 'EXCLUIR CONTA?',
    description: 'Sua conta, seus dados de acesso e seu personagem salvo serão excluídos permanentemente.',
    warning: 'ESTA AÇÃO NÃO PODE SER DESFEITA.',
    passwordLabel: 'CONFIRME SUA SENHA',
    phraseLabel: 'DIGITE EXCLUIR PARA CONFIRMAR',
    phrase: 'EXCLUIR',
    cancel: 'CANCELAR',
    confirm: 'EXCLUIR CONTA',
    deleting: 'EXCLUINDO...',
    passwordError: 'Senha incorreta ou identidade não confirmada. Tente novamente.',
    sessionError: 'Sua sessão expirou. Entre novamente antes de excluir a conta.',
    invalidError: 'Verifique a senha e a confirmação digitada.',
    unavailableError: 'Não foi possível excluir sua conta agora. Nenhum sucesso foi confirmado. Tente novamente mais tarde ou contate o suporte.',
  },
  en: {
    title: 'DELETE ACCOUNT?',
    description: 'Your account, sign-in data and saved character will be permanently deleted.',
    warning: 'THIS ACTION CANNOT BE UNDONE.',
    passwordLabel: 'CONFIRM YOUR PASSWORD',
    phraseLabel: 'TYPE DELETE TO CONFIRM',
    phrase: 'DELETE',
    cancel: 'CANCEL',
    confirm: 'DELETE ACCOUNT',
    deleting: 'DELETING...',
    passwordError: 'Incorrect password or identity not confirmed. Please try again.',
    sessionError: 'Your session has expired. Sign in again before deleting your account.',
    invalidError: 'Check your password and confirmation.',
    unavailableError: 'We could not confirm account deletion. Try again later or contact support.',
  },
} as const

export function AccountDeleteDialog({
  language,
  accessToken,
  onClose,
  onDeleted,
}: AccountDeleteDialogProps) {
  const copy = translations[language]
  const titleId = useId()
  const descriptionId = useId()
  const passwordId = useId()
  const phraseId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const inProgress = useRef(false)
  const originalToken = useRef(accessToken)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    passwordRef.current?.focus()
    return () => {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [])

  const confirmed =
    confirmation.trim().toUpperCase() === copy.phrase

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (!inProgress.current) onClose()
      return
    }
    if (event.key !== 'Tab') return

    const items = dialogRef.current?.querySelectorAll<HTMLElement>(
      'input:not([disabled]), button:not([disabled])',
    )
    if (!items?.length) return

    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (
      inProgress.current ||
      !password ||
      !confirmed ||
      accessToken !== originalToken.current
    ) return

    inProgress.current = true
    setDeleting(true)
    setError(null)

    try {
      await deleteMyAccount(originalToken.current, password)
      setPassword('')
      onDeleted()
    } catch (cause) {
      const kind =
        cause instanceof AccountDeleteError
          ? cause.kind
          : 'unavailable'
      setError(
        kind === 'password'
          ? copy.passwordError
          : kind === 'unauthorized'
            ? copy.sessionError
            : kind === 'invalid'
              ? copy.invalidError
              : copy.unavailableError,
      )
      setPassword('')
      passwordRef.current?.focus()
    } finally {
      inProgress.current = false
      setDeleting(false)
    }
  }

  return (
    <div className="character-delete-overlay">
      <div
        ref={dialogRef}
        className="character-delete-dialog account-delete-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={deleting}
        onKeyDown={handleKeyDown}
      >
        <h2 id={titleId} className="character-delete-dialog__title">
          {copy.title}
        </h2>
        <p id={descriptionId} className="character-delete-dialog__description">
          {copy.description}
        </p>
        <p className="character-delete-dialog__warning">
          {copy.warning}
        </p>

        <form onSubmit={(event) => { void handleSubmit(event) }}>
          <label className="account-delete-dialog__label" htmlFor={passwordId}>
            {copy.passwordLabel}
          </label>
          <input
            id={passwordId}
            ref={passwordRef}
            className="account-delete-dialog__input"
            type="password"
            autoComplete="current-password"
            value={password}
            maxLength={1024}
            onChange={(event) => setPassword(event.target.value)}
            disabled={deleting}
            required
          />
          <label className="account-delete-dialog__label" htmlFor={phraseId}>
            {copy.phraseLabel}
          </label>
          <input
            id={phraseId}
            className="account-delete-dialog__input"
            type="text"
            value={confirmation}
            autoComplete="off"
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={deleting}
            required
          />

          {error && <p role="alert" className="account-delete-dialog__error">{error}</p>}

          <div className="character-delete-dialog__actions">
            <button
              type="button"
              className="character-delete-dialog__cancel"
              disabled={deleting}
              onClick={onClose}
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              className="character-delete-dialog__confirm"
              disabled={deleting || !password || !confirmed}
            >
              {deleting ? copy.deleting : copy.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
