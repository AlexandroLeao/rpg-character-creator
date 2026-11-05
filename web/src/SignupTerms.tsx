import type { Language } from './lib/authTranslations'
import './SignupTerms.css'

type SignupTermsProps = {
  language: Language
  accepted: boolean
  onAcceptedChange: (accepted: boolean) => void
}

const translations = {
  en: {
    expand: 'READ TERMS & PRIVACY',
    termsTitle: 'TERMS OF USE',
    termsIntro: 'Adventure Files is a free, non-commercial full-stack portfolio demonstration for creating fictional RPG characters. It is not a playable game.',
    termsRules: 'Use an email address you control, keep your credentials secure, and do not misuse the service or enter unlawful content.',
    termsAvailability: 'The demo uses free hosting and email services. Availability and delivery times may vary, and the project may be updated.',
    privacyTitle: 'PRIVACY NOTICE',
    privacyAccount: 'We use an email address and authentication data to operate accounts. Supabase Auth handles passwords; the application does not store readable passwords.',
    privacyCharacter: 'One fictional character and its selections may be saved per account in Supabase. Authenticated owner-only rules protect character access. PNG sheets are generated in the browser.',
    privacyProviders: 'Supabase provides authentication and storage, Render hosts the API, Vercel hosts the website, and an email provider sends verification messages. Providers may retain technical access and security logs under their own policies.',
    privacyDeletion: 'You can delete your account from the authenticated character area by confirming your password and the deletion phrase. The active account and linked character are removed; provider backups and technical logs may follow separate retention schedules.',
    contactTitle: 'SUPPORT',
    contactText: 'For questions or requests about your account or data:',
    accept: 'I accept the Terms of Use and acknowledge the Privacy Notice.',
    updated: 'Updated: November 4, 2026.',
  },
  pt: {
    expand: 'LER TERMOS E PRIVACIDADE',
    termsTitle: 'TERMOS DE USO',
    termsIntro: 'Adventure Files é uma demonstração gratuita e não comercial de portfólio full stack para criar personagens fictícios de RPG. Não é um jogo jogável.',
    termsRules: 'Use um e-mail ao qual você tenha acesso, proteja sua senha e não utilize o serviço de forma abusiva ou para conteúdo ilícito.',
    termsAvailability: 'A demonstração utiliza hospedagem e serviços de e-mail gratuitos. A disponibilidade e o tempo de entrega de mensagens podem variar, e o projeto pode receber atualizações.',
    privacyTitle: 'AVISO DE PRIVACIDADE',
    privacyAccount: 'Utilizamos e-mail e dados de autenticação para manter sua conta. As senhas são gerenciadas pelo Supabase Auth; a aplicação não armazena senhas legíveis.',
    privacyCharacter: 'Cada conta pode salvar um personagem fictício e suas escolhas no Supabase. As regras de autenticação e acesso por proprietário protegem a ficha. Os PNGs são gerados no navegador.',
    privacyProviders: 'O Supabase fornece autenticação e banco de dados, o Render hospeda a API, a Vercel hospeda o site e um provedor de e-mail envia verificações. Esses serviços podem manter registros técnicos de acesso e segurança conforme suas políticas.',
    privacyDeletion: 'Você pode excluir sua conta na área autenticada do personagem, confirmando a senha e a frase de exclusão. A conta ativa e o personagem associado são removidos; cópias de segurança e registros técnicos dos provedores podem seguir prazos próprios.',
    contactTitle: 'SUPORTE',
    contactText: 'Para dúvidas ou solicitações sobre sua conta ou seus dados:',
    accept: 'Aceito os Termos de Uso e estou ciente do Aviso de Privacidade.',
    updated: 'Atualizado em 4 de novembro de 2026.',
  },
} as const

export function SignupTerms({
  language,
  accepted,
  onAcceptedChange,
}: SignupTermsProps) {
  const copy = translations[language]

  return (
    <section className="signup-terms" aria-label={copy.expand}>
      <details className="signup-terms__details">
        <summary>{copy.expand}</summary>
        <div className="signup-terms__body">
          <h3>{copy.termsTitle}</h3>
          <p>{copy.termsIntro}</p>
          <p>{copy.termsRules}</p>
          <p>{copy.termsAvailability}</p>

          <h3>{copy.privacyTitle}</h3>
          <p>{copy.privacyAccount}</p>
          <p>{copy.privacyCharacter}</p>
          <p>{copy.privacyProviders}</p>
          <p>{copy.privacyDeletion}</p>

          <h3>{copy.contactTitle}</h3>
          <p>
            {copy.contactText}{' '}
            <a href="mailto:adventurefiles.suporte@gmail.com">
              adventurefiles.suporte@gmail.com
            </a>
          </p>
          <p className="signup-terms__updated">{copy.updated}</p>
        </div>
      </details>

      <label className="signup-terms__accept">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(event) => onAcceptedChange(event.target.checked)}
        />
        <span>{copy.accept}</span>
      </label>
    </section>
  )
}
