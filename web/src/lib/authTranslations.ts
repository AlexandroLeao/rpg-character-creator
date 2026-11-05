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
    email: 'Email',
    password: 'Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    recoveryCode: 'Recovery Code',
    recoveryCodeHelp: 'Enter the code sent by email.',

    accountOptions: 'Account options',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password?',
    backToSignIn: 'Back to Sign In',
    backFromRecovery: 'Back',
    backFromCode: 'Home',

    signOut: 'Sign Out',
    signingOut: 'Signing out...',
    pleaseWait: 'Please wait...',
    checkingSession: 'Checking your session...',

    requestNewLink: 'Request a New Link',
    haveRecoveryCode: 'I Have a Recovery Code',
    checkRecoveryCode: 'Check Code',
    requestNewCode: 'New Code',
    recoveryAccountLabel: 'Changing the password for:',

    recoveryLinkInvalid:
      'Your recovery link could not be verified. It may be invalid or expired.',

    passwordTooShort:
      'Password must contain at least 15 characters.',

    passwordsMismatch:
      'Passwords do not match.',

    recoveryRequestFailure:
      'Unable to send email. Try again later.',
    recoveryRateLimited:
      'Too many recovery attempts. Wait and try again.',
    recoveryCodeInvalid:
      'Code invalid or expired. Request a new one.',

    recoveryRequestSuccess:
      'If registered, check your email.',

    invalidRecoverySession:
      'Your recovery session is invalid or expired. Please request a new link.',

    updatePasswordFailure:
      'Unable to update your password. Please request a new recovery link if needed.',

    updatePasswordSuccess:
      'Your password has been updated successfully.',

    passwordUpdatedSignOutFailure:
      'Password updated, but sign-out failed. Please sign out before continuing.',

    termsRequired: 'Accept the Terms of Use to create your account.',
    captchaRequired: 'Complete the security check and try again.',

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
    email: 'Email',
    password: 'Senha',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Senha',
    recoveryCode: 'Código de Recuperação',
    recoveryCodeHelp: 'Digite o código recebido por e-mail.',

    accountOptions: 'Opções da conta',
    createAccount: 'Criar Conta',
    forgotPassword: 'Esqueceu a Senha?',
    backToSignIn: 'Voltar para Entrar',
    backFromRecovery: 'Voltar',
    backFromCode: 'Início',

    signOut: 'Sair',
    signingOut: 'Saindo...',
    pleaseWait: 'Aguarde...',
    checkingSession: 'Verificando sua sessão...',

    requestNewLink: 'Solicitar Novo Link',
    haveRecoveryCode: 'Já Tenho um Código',
    checkRecoveryCode: 'Conferir Código',
    requestNewCode: 'Novo Código',
    recoveryAccountLabel: 'Alterando a senha da conta:',

    recoveryLinkInvalid:
      'Não foi possível verificar o link de recuperação. Ele pode ser inválido ou ter expirado.',

    passwordTooShort:
      'A senha deve ter pelo menos 15 caracteres.',

    passwordsMismatch:
      'As senhas não coincidem.',

    recoveryRequestFailure:
      'Não foi possível enviar. Tente mais tarde.',
    recoveryRateLimited:
      'Muitas tentativas. Aguarde e tente novamente.',
    recoveryCodeInvalid:
      'Código inválido ou expirado. Peça outro.',

    recoveryRequestSuccess:
      'Se houver conta, confira seu e-mail.',

    invalidRecoverySession:
      'Sua sessão de recuperação é inválida ou expirou. Solicite um novo link.',

    updatePasswordFailure:
      'Não foi possível atualizar sua senha. Solicite um novo link, se necessário.',

    updatePasswordSuccess:
      'Sua senha foi atualizada com sucesso.',

    passwordUpdatedSignOutFailure:
      'Senha alterada, mas não foi possível encerrar a sessão. Saia da conta antes de continuar.',

    termsRequired: 'Aceite os Termos de Uso para criar sua conta.',
    captchaRequired: 'Conclua a verificação de segurança e tente novamente.',

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