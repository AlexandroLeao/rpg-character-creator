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

type CharacterCreatorProps = {
  language: Language
  onCancel: () => void
  onStepChange?: (step: number) => void
}

/*
 * ADVENTURE FILES
 * CHARACTER CREATOR
 *
 * Approved six-stage structure:
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
 *
 * Stores selections until the character
 * is explicitly saved.
 *
 * Journey fields will be introduced
 * when Step 05 is implemented.
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
   *
   * Character class and name.
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
   *
   * Ancestry and background.
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
   *
   * Weapon and artifact.
   *
   * Companion will be selected
   * in Step 05 — Journey.
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
   *
   * Personality and aura.
   *
   * Preserve partial selections
   * when returning to Equipment.
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
   *
   * Temporary screen.
   *
   * Companion and Motivation will
   * be implemented in this step.
   */

  return (
    <div className="character-creator-next">
      <h3>
        {language === 'pt'
          ? 'JORNADA'
          : 'JOURNEY'}
      </h3>

      <p>
        {language === 'pt'
          ? 'A próxima etapa do criador será implementada em seguida.'
          : 'The next character creation step will be implemented next.'}
      </p>

      <button
        type="button"
        onClick={() => goToStep(4)}
      >
        {language === 'pt' ? 'VOLTAR' : 'BACK'}
      </button>
    </div>
  )
}