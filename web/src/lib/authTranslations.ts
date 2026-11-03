export type AuthMode =
  | 'signIn'
  | 'signUp'
  | 'forgotPassword'
  | 'verifyRecoveryCode'
  | 'resetPassword'

export type Language = 'en' | 'pt'

export const authTranslations = {
  en: {
    titles: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      forgotPassword: 'Recover Password',
      verifyRecoveryCode: 'Verify Recovery Code',
      resetPassword: 'Reset Password',
    },

    submitLabels: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      forgotPassword: 'Send Recovery Email',
      verifyRecoveryCode: 'Verify Code',
      resetPassword: 'Update Password',
    },

    languageSelector: 'Language',
    myCharacter: 'My Character',
    displayName: 'Display Name',
    email: 'Email',
    password: 'Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    recoveryCode: 'Recovery Code',
    recoveryCodeHelp: 'Enter the one-time code sent to this email address.',

    accountOptions: 'Account options',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password?',
    backToSignIn: 'Back to Sign In',

    signOut: 'Sign Out',
    signingOut: 'Signing out...',
    pleaseWait: 'Please wait...',
    checkingSession: 'Checking your session...',

    requestNewLink: 'Request a New Link',
    haveRecoveryCode: 'I Have a Recovery Code',
    requestNewCode: 'Request a New Code',
    recoveryAccountLabel: 'Changing the password for:',

    recoveryLinkInvalid:
      'Your recovery link could not be verified. It may be invalid or expired.',

    displayNameTooShort:
      'Display name must contain at least 2 characters.',

    passwordTooShort:
      'Password must contain at least 8 characters.',

    passwordsMismatch:
      'Passwords do not match.',

    recoveryRequestFailure:
      'Unable to process your request. Please try again later.',
    recoveryRateLimited:
      'Too many recovery attempts or emails have been sent. Please wait before trying again.',
    recoveryCodeInvalid:
      'The recovery code is invalid or expired. Check the email and try again, or request a new code.',

    recoveryRequestSuccess:
      'If an account exists for this email, a recovery message will be sent shortly.',

    invalidRecoverySession:
      'Your recovery session is invalid or expired. Please request a new link.',

    updatePasswordFailure:
      'Unable to update your password. Please request a new recovery link if needed.',

    updatePasswordSuccess:
      'Your password has been updated successfully.',

    passwordUpdatedSignOutFailure:
      'Password updated, but sign-out failed. Please sign out before continuing.',

    signUpFailure:
      'Unable to create an account. Please review your details.',

    signUpSuccess:
      'If registration is available for this email, check your inbox for a confirmation link.',

    signInFailure:
      'Unable to sign in. Please check your details.',

    unexpectedError:
      'Something went wrong. Please try again later.',

    signOutFailure:
      'Unable to sign out. Please try again.',
  },

  pt: {
    titles: {
      signIn: 'Entrar',
      signUp: 'Criar Conta',
      forgotPassword: 'Recuperar Senha',
      verifyRecoveryCode: 'Validar Código',
      resetPassword: 'Nova Senha',
    },

    submitLabels: {
      signIn: 'Entrar',
      signUp: 'Criar Conta',
      forgotPassword: 'Enviar Email',
      verifyRecoveryCode: 'Validar Código',
      resetPassword: 'Atualizar Senha',
    },

    languageSelector: 'Idioma',
    myCharacter: 'Meu Personagem',
    displayName: 'Nome de Exibição',
    email: 'Email',
    password: 'Senha',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Senha',
    recoveryCode: 'Código de Recuperação',
    recoveryCodeHelp: 'Digite o código temporário enviado para este email.',

    accountOptions: 'Opções da conta',
    createAccount: 'Criar Conta',
    forgotPassword: 'Esqueceu a Senha?',
    backToSignIn: 'Voltar para Entrar',

    signOut: 'Sair',
    signingOut: 'Saindo...',
    pleaseWait: 'Aguarde...',
    checkingSession: 'Verificando sua sessão...',

    requestNewLink: 'Solicitar Novo Link',
    haveRecoveryCode: 'Já Tenho um Código',
    requestNewCode: 'Solicitar Novo Código',
    recoveryAccountLabel: 'Alterando a senha da conta:',

    recoveryLinkInvalid:
      'Não foi possível verificar o link de recuperação. Ele pode ser inválido ou ter expirado.',

    displayNameTooShort:
      'O nome de exibição deve ter pelo menos 2 caracteres.',

    passwordTooShort:
      'A senha deve ter pelo menos 8 caracteres.',

    passwordsMismatch:
      'As senhas não coincidem.',

    recoveryRequestFailure:
      'Não foi possível processar sua solicitação. Tente novamente mais tarde.',
    recoveryRateLimited:
      'Muitas solicitações de recuperação foram realizadas. Aguarde antes de tentar novamente.',
    recoveryCodeInvalid:
      'O código é inválido ou expirou. Confira o email ou solicite um novo código.',

    recoveryRequestSuccess:
      'Se existir uma conta com este email, enviaremos uma mensagem de recuperação em breve.',

    invalidRecoverySession:
      'Sua sessão de recuperação é inválida ou expirou. Solicite um novo link.',

    updatePasswordFailure:
      'Não foi possível atualizar sua senha. Solicite um novo link, se necessário.',

    updatePasswordSuccess:
      'Sua senha foi atualizada com sucesso.',

    passwordUpdatedSignOutFailure:
      'Senha alterada, mas não foi possível encerrar a sessão. Saia da conta antes de continuar.',

    signUpFailure:
      'Não foi possível criar a conta. Confira as informações.',

    signUpSuccess:
      'Se o cadastro estiver disponível para este email, verifique sua caixa de entrada.',

    signInFailure:
      'Não foi possível entrar. Confira suas informações.',

    unexpectedError:
      'Algo deu errado. Tente novamente mais tarde.',

    signOutFailure:
      'Não foi possível sair. Tente novamente.',
  },
} as const