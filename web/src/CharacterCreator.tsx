import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import type { CharacterClass } from './CharacterPreview'

import { CharacterClassStep } from './CharacterClassStep'

import {
  CharacterOriginsStep,
  type CharacterAncestry,
  type CharacterBackground,
  type OriginsStepSelection,
  type OriginsStepData,
} from './CharacterOriginsStep'

import {
  CharacterEquipmentStep,
  type CharacterWeapon,
  type CharacterArtifact,
  type CharacterCompanion,
  type EquipmentStepSelection,
  type EquipmentStepData,
} from './CharacterEquipmentStep'

type CharacterCreatorProps = {
  language: Language
  onCancel: () => void
  onStepChange?: (step: number) => void
}

/*
 * CHARACTER DRAFT
 *
 * Stores all selections until the
 * character is explicitly saved.
 */

type CharacterDraft = {
  characterClass: CharacterClass | null
  name: string

  ancestry: CharacterAncestry | null
  background: CharacterBackground | null

  weapon: CharacterWeapon | null
  artifact: CharacterArtifact | null
  companion: CharacterCompanion | null
}

export function CharacterCreator({
  language,
  onCancel,
  onStepChange,
}: CharacterCreatorProps) {
  /*
   * CURRENT STEP
   */

  const [step, setStep] = useState(1)

  /*
   * CHARACTER DRAFT
   */

  const [draft, setDraft] = useState<CharacterDraft>({
    characterClass: null,
    name: '',

    ancestry: null,
    background: null,

    weapon: null,
    artifact: null,
    companion: null,
  })

  /*
   * STEP NAVIGATION
   */

  function goToStep(nextStep: number) {
    setStep(nextStep)
    onStepChange?.(nextStep)
  }

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
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(2)
        }}
      />
    )
  }

  /*
   * STEP 02 — ORIGINS
   */

  if (step === 2) {
    return (
      <CharacterOriginsStep
        language={language}
        initialAncestry={draft.ancestry}
        initialBackground={draft.background}
        onBack={(data: OriginsStepSelection) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(1)
        }}
        onNext={(data: OriginsStepData) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(3)
        }}
      />
    )
  }

  /*
   * STEP 03 — EQUIPMENT
   */

  if (step === 3) {
    return (
      <CharacterEquipmentStep
        language={language}
        initialWeapon={draft.weapon}
        initialArtifact={draft.artifact}
        initialCompanion={draft.companion}
        onBack={(data: EquipmentStepSelection) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(2)
        }}
        onNext={(data: EquipmentStepData) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(4)
        }}
      />
    )
  }

  /*
   * STEP 04 — ESSENCE AND REVIEW
   *
   * Temporary screen until the final
   * creation step is implemented.
   */

  return (
    <div className="character-creator-next">
      <h3>
        {language === 'pt'
          ? 'ESSÊNCIA E REVISÃO'
          : 'ESSENCE AND REVIEW'}
      </h3>

      <p>
        {language === 'pt'
          ? 'A última etapa do criador será implementada em seguida.'
          : 'The final character creation step will be implemented next.'}
      </p>

      <button
        type="button"
        onClick={() => goToStep(3)}
      >
        {language === 'pt' ? 'VOLTAR' : 'BACK'}
      </button>
    </div>
  )
}