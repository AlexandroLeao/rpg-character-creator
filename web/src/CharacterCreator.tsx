import { useRef, useState } from 'react'

import type { Language } from './lib/authTranslations'
import { motivationIds } from './lib/motivationTranslations'

import {
  CharacterApiError,
  saveMyCharacter,
  type Character,
  type CharacterSaveInput,
} from './lib/characterApi'

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

type CharacterCreatorProps = {
  language: Language
  onCancel: () => void

  onStepChange?: (step: number) => void

  accessToken?: string

  onSaved?: (character: Character) => void

  /*
   * Optional saved character.
   *
   * When provided, the creator starts
   * with the existing selections.
   */

  initialCharacter?: Character
}

/* ==========================================
   CHARACTER DRAFT
   ========================================== */

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

/* ==========================================
   CURRENT CATALOG FOR EDITING
   ========================================== */

const editableOptions = {
  characterClass: [
    'warrior',
    'paladin',
    'mage',
    'rogue',
    'ranger',
    'druid',
    'cleric',
    'bard',
  ],

  ancestry: [
    'human',
    'elf',
    'dwarf',
    'orc',
    'fae',
    'construct',
  ],

  background: [
    'noble',
    'scholar',
    'wanderer',
    'guardian',
    'artisan',
    'outlaw',
  ],

  weapon: [
    'sword',
    'bow',
    'staff',
    'dagger',
    'axe',
    'spear',
    'hammer',
    'wand',
  ],

  artifact: [
    'arcane-seal',
    'ancient-ring',
    'moon-crystal',
    'runic-compass',
    'shadow-crown',
    'phoenix-feather',
    'chaos-orb',
    'sun-relic',
  ],

  personality: [
    'brave',
    'curious',
    'loyal',
    'cunning',
    'kind',
    'stoic',
    'rebellious',
    'mysterious',
  ],

  aura: [
    'fire',
    'ice',
    'nature',
    'shadow',
    'light',
    'storm',
    'arcane',
    'void',
  ],

  companion: [
    'none',
    'wolf',
    'owl',
    'cat',
    'fox',
    'raven',
    'turtle',
    'dragon',
  ],
} as const

/* ==========================================
   RESTORE VALID SELECTION
   ========================================== */

function restoreSelection<T extends string>(
  savedValue: string | null,
  options: readonly T[],
): T | null {
  return options.find(
    (option) => option === savedValue,
  ) ?? null
}

/* ==========================================
   CREATE INITIAL DRAFT
   ========================================== */

/*
 * New characters start with empty choices.
 *
 * Editing restores the saved selections.
 *
 * Legacy values that no longer belong to
 * the current catalog become null, requiring
 * a valid selection before saving again.
 */

function createInitialDraft(
  character?: Character,
): CharacterDraft {
  if (!character) {
    return {
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
    }
  }

  return {
    characterClass: restoreSelection(
      character.characterClass,
      editableOptions.characterClass,
    ),

    name: character.name,

    ancestry: restoreSelection(
      character.ancestry,
      editableOptions.ancestry,
    ),

    background: restoreSelection(
      character.background,
      editableOptions.background,
    ),

    weapon: restoreSelection(
      character.weapon,
      editableOptions.weapon,
    ),

    artifact: restoreSelection(
      character.artifact,
      editableOptions.artifact,
    ),

    personality: restoreSelection(
      character.personality,
      editableOptions.personality,
    ),

    aura: restoreSelection(
      character.aura,
      editableOptions.aura,
    ),

    companion: restoreSelection(
      character.companion,
      editableOptions.companion,
    ),

    motivation: restoreSelection(
      character.motivation,
      motivationIds,
    ),
  }
}

/* ==========================================
   COMPLETE CHARACTER VALIDATION
   ========================================== */

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

/* ==========================================
   SAVE ERROR TRANSLATIONS
   ========================================== */

function getSaveErrorMessage(
  language: Language,
  error: unknown,
): string {
  if (error instanceof CharacterApiError) {
    if (
      error.kind === 'unauthorized' ||
      error.kind === 'forbidden'
    ) {
      return language === 'pt'
        ? 'Sua sessão não pôde ser validada. Entre novamente.'
        : 'Your session could not be verified. Please sign in again.'
    }

    if (error.kind === 'invalidRequest') {
      return language === 'pt'
        ? 'Alguma informação do personagem é inválida. Revise suas escolhas.'
        : 'Some character information is invalid. Review your choices.'
    }

    if (error.kind === 'conflict') {
      return language === 'pt'
        ? 'O personagem foi alterado. Tente salvar novamente.'
        : 'The character has changed. Please try saving again.'
    }

    if (error.kind === 'invalidResponse') {
      return language === 'pt'
        ? 'Não foi possível confirmar o salvamento. Verifique seu personagem antes de tentar novamente.'
        : 'Unable to confirm saving. Check your character before trying again.'
    }
  }

  return language === 'pt'
    ? 'Não foi possível salvar o personagem. Verifique sua conexão e tente novamente.'
    : 'Unable to save your character. Check your connection and try again.'
}

/* ==========================================
   CHARACTER CREATOR
   ========================================== */

export function CharacterCreator({
  language,
  onCancel,
  onStepChange,
  accessToken,
  onSaved,
  initialCharacter,
}: CharacterCreatorProps) {
  /* ========================================
     CURRENT STEP
     ======================================== */

  const [step, setStep] = useState(1)

  /* ========================================
     CHARACTER DRAFT
     ======================================== */

  const [draft, setDraft] = useState<CharacterDraft>(
    () => createInitialDraft(initialCharacter),
  )

  /* ========================================
     SAVE STATE
     ======================================== */

  const [saving, setSaving] = useState(false)

  const [saveError, setSaveError] =
    useState<string | null>(null)

  /*
   * Prevent duplicate save requests,
   * even if two clicks happen before
   * React updates the button state.
   */

  const saveInProgress = useRef(false)

  /* ========================================
     STEP NAVIGATION
     ======================================== */

  function goToStep(nextStep: number) {
    setSaveError(null)
    setStep(nextStep)
    onStepChange?.(nextStep)
  }

  /* ========================================
     SAVE CHARACTER
     ======================================== */

  async function handleSave() {
    if (
      !accessToken ||
      !onSaved ||
      !isCompleteDraft(draft) ||
      saveInProgress.current
    ) {
      return
    }

    saveInProgress.current = true

    setSaving(true)
    setSaveError(null)

    const input: CharacterSaveInput = {
      name: draft.name.trim(),
      characterClass: draft.characterClass,

      ancestry: draft.ancestry,
      background: draft.background,

      weapon: draft.weapon,
      artifact: draft.artifact,

      personality: draft.personality,
      aura: draft.aura,

      companion: draft.companion,
      motivation: draft.motivation,
    }

    try {
      const savedCharacter = await saveMyCharacter(
        accessToken,
        input,
      )

      /*
       * Update the dashboard only after
       * the server confirms persistence.
       */

      onSaved(savedCharacter)
    } catch (error: unknown) {
      setSaveError(
        getSaveErrorMessage(language, error),
      )
    } finally {
      saveInProgress.current = false
      setSaving(false)
    }
  }

  /* ========================================
     STEP 01 — IDENTITY
     ======================================== */

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

  /* ========================================
     STEP 02 — ORIGINS
     ======================================== */

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

  /* ========================================
     STEP 03 — EQUIPMENT
     ======================================== */

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

          goToStep(3 + 1)
        }}
      />
    )
  }

  /* ========================================
     STEP 04 — ESSENCE
     ======================================== */

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

  /* ========================================
     STEP 05 — JOURNEY
     ======================================== */

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

  /* ========================================
     STEP 06 — FINAL REVIEW
     ======================================== */

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
    <>
      <CharacterReviewStep
        language={language}
        data={draft}
        onBack={() => goToStep(5)}
        onSave={
          accessToken && onSaved
            ? handleSave
            : undefined
        }
        saving={saving}
      />

      {saveError && (
        <p role="alert">
          {saveError}
        </p>
      )}
    </>
  )
}