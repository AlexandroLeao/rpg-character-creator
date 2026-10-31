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
  type EquipmentStepSelection,
  type EquipmentStepData,
} from './CharacterEquipmentStep'

import {
  CharacterEssenceStep,
  type CharacterPersonality,
  type CharacterAura,
  type EssenceStepSelection,
  type EssenceStepData,
} from './CharacterEssenceStep'

import {
  CharacterJourneyStep,
  type CharacterCompanion,
  type CharacterMotivation,
  type JourneyStepSelection,
  type JourneyStepData,
} from './CharacterJourneyStep'

import {
  CharacterReviewStep,
  type CharacterReviewData,
} from './CharacterReviewStep'

type CharacterCreatorProps = {
  language: Language
  onCancel: () => void
  onStepChange?: (step: number) => void
}

/*
 * ADVENTURE FILES
 * CHARACTER CREATOR
 *
 * 01 — Identity
 * 02 — Origins
 * 03 — Equipment
 * 04 — Essence
 * 05 — Journey
 * 06 — Final Review
 */

/*
 * CHARACTER DRAFT
 */

type CharacterDraft = {
  characterClass: CharacterClass | null
  name: string

  ancestry: CharacterAncestry | null
  background: CharacterBackground | null

  weapon: CharacterWeapon | null
  artifact: CharacterArtifact | null

  personality: CharacterPersonality | null
  aura: CharacterAura | null

  companion: CharacterCompanion | null
  motivation: CharacterMotivation | null
}

/*
 * COMPLETE CHARACTER VALIDATION
 *
 * The Final Review requires all ten fields.
 *
 * "none" remains a valid companion selection,
 * but null is never a valid completed selection.
 */

function isCompleteDraft(
  draft: CharacterDraft,
): draft is CharacterReviewData {
  const trimmedName = draft.name.trim()

  return (
    draft.characterClass !== null &&
    trimmedName.length >= 2 &&
    trimmedName.length <= 32 &&
    draft.ancestry !== null &&
    draft.background !== null &&
    draft.weapon !== null &&
    draft.artifact !== null &&
    draft.personality !== null &&
    draft.aura !== null &&
    draft.companion !== null &&
    draft.motivation !== null
  )
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

    personality: null,
    aura: null,

    companion: null,
    motivation: null,
  })

  /*
   * STEP NAVIGATION
   */

  function goToStep(nextStep: number) {
    setStep(nextStep)
    onStepChange?.(nextStep)
  }

  /*
   * STEP 01 — IDENTITY
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
   * STEP 04 — ESSENCE
   */

  if (step === 4) {
    return (
      <CharacterEssenceStep
        language={language}
        initialPersonality={draft.personality}
        initialAura={draft.aura}
        onBack={(data: EssenceStepSelection) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(3)
        }}
        onNext={(data: EssenceStepData) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(5)
        }}
      />
    )
  }

  /*
   * STEP 05 — JOURNEY
   */

  if (step === 5) {
    return (
      <CharacterJourneyStep
        language={language}
        initialCompanion={draft.companion}
        initialMotivation={draft.motivation}
        onBack={(data: JourneyStepSelection) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(4)
        }}
        onNext={(data: JourneyStepData) => {
          setDraft((current) => ({
            ...current,
            ...data,
          }))

          goToStep(6)
        }}
      />
    )
  }

  /*
   * STEP 06 — FINAL REVIEW
   *
   * The review is displayed only when
   * all required fields are complete.
   */

  if (!isCompleteDraft(draft)) {
    return (
      <div className="character-creator-next">
        <p role="alert">
          {language === 'pt'
            ? 'Existem informações pendentes. Volte para revisar suas escolhas.'
            : 'Some information is missing. Go back to review your selections.'}
        </p>

        <button
          type="button"
          onClick={() => goToStep(5)}
        >
          {language === 'pt' ? 'VOLTAR' : 'BACK'}
        </button>
      </div>
    )
  }

  return (
    <CharacterReviewStep
      language={language}
      data={draft}
      onBack={() => goToStep(5)}
    />
  )
}