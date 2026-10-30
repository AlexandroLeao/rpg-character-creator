import { useState } from 'react'

import type { Language } from './lib/authTranslations'
import type { CharacterClass } from './CharacterPreview'

import { CharacterClassStep } from './CharacterClassStep'

type CharacterCreatorProps = {
  language: Language
  onCancel: () => void
  onStepChange?: (step: number) => void
}

type CharacterDraft = {
  characterClass: CharacterClass | null
  name: string
}

export function CharacterCreator({
  language,
  onCancel,
  onStepChange,
}: CharacterCreatorProps) {
  const [step, setStep] = useState(1)

  const [draft, setDraft] = useState<CharacterDraft>({
    characterClass: null,
    name: '',
  })

  /*
   * STEP 01 — CLASS AND NAME
   */

  if (step === 1) {
    return (
      <CharacterClassStep
        language={language}
        initialClass={draft.characterClass}
        initialName={draft.name}
        onBack={onCancel}
        onNext={(data) => {
          setDraft(data)
          setStep(2)
          onStepChange?.(2)
        }}
      />
    )
  }

  /*
   * STEP 02 — ORIGINS
   *
   * Temporary screen until the next
   * character creation step is implemented.
   */

  return (
    <div className="character-creator-next">
      <h3>
        {language === 'pt'
          ? '02 / 04 — ORIGENS'
          : '02 / 04 — ORIGINS'}
      </h3>

      <p>
        {language === 'pt'
          ? 'A próxima etapa do criador será implementada em seguida.'
          : 'The next character creation step will be implemented next.'}
      </p>

      <button
        type="button"
        onClick={() => {
          setStep(1)
          onStepChange?.(1)
        }}
      >
        {language === 'pt' ? 'VOLTAR' : 'BACK'}
      </button>
    </div>
  )
}