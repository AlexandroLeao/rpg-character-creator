
import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import { translateMotivationOption } from './lib/motivationTranslations'

import {
  CharacterPreview,
  type CharacterClass,
} from './CharacterPreview'

import type {
  CharacterAncestry,
  CharacterBackground,
} from './CharacterOriginsStep'

import type {
  CharacterWeapon,
  CharacterArtifact,
} from './CharacterEquipmentStep'

import type {
  CharacterPersonality,
  CharacterAura,
} from './CharacterEssenceStep'

import type {
  CharacterCompanion,
  CharacterMotivation,
} from './CharacterJourneyStep'

import './CharacterReviewStep.css'

/*
 * ADVENTURE FILES
 * STEP 06 / 06 — FINAL REVIEW
 *
 * All field labels are visible and left-aligned.
 * Selected values remain centered.
 *
 * Saving is enabled only when an onSave
 * callback is provided by the creator.
 */

export type CharacterReviewData = {
  characterClass: CharacterClass
  name: string

  ancestry: CharacterAncestry
  background: CharacterBackground

  weapon: CharacterWeapon
  artifact: CharacterArtifact

  personality: CharacterPersonality
  aura: CharacterAura

  companion: CharacterCompanion
  motivation: CharacterMotivation
}

type CharacterReviewStepProps = {
  language: Language
  data: CharacterReviewData

  onBack: () => void
  onSave?: () => void | Promise<void>
  saving?: boolean
}

type ReviewField = {
  key: keyof CharacterReviewData
  label: string
  value: string
}

export function CharacterReviewStep({
  language,
  data,
  onBack,
  onSave,
  saving = false,
}: CharacterReviewStepProps) {
  /* ========================================
     TRANSLATIONS
     ======================================== */

  const copy =
    language === 'pt'
      ? {
          title: 'REVISÃO FINAL',
          name: 'Nome',
          characterClass: 'Classe',
          ancestry: 'Ancestralidade',
          background: 'Origem',
          weapon: 'Arma',
          artifact: 'Artefato',
          personality: 'Personalidade',
          aura: 'Aura',
          companion: 'Companheiro',
          motivation: 'Motivação',
          back: 'VOLTAR',
          save: 'SALVAR',
          saving: 'SALVANDO...',
          saveUnavailable:
            'O salvamento estará disponível após a integração com o servidor.',
        }
      : {
          title: 'FINAL REVIEW',
          name: 'Name',
          characterClass: 'Class',
          ancestry: 'Ancestry',
          background: 'Background',
          weapon: 'Weapon',
          artifact: 'Artifact',
          personality: 'Personality',
          aura: 'Aura',
          companion: 'Companion',
          motivation: 'Motivation',
          back: 'BACK',
          save: 'SAVE',
          saving: 'SAVING...',
          saveUnavailable:
            'Saving will be available after server integration.',
        }

  /* ========================================
     CHARACTER INFORMATION
     ======================================== */

  const fields: ReviewField[] = [
    {
      key: 'name',
      label: copy.name,
      value: data.name,
    },
    {
      key: 'characterClass',
      label: copy.characterClass,
      value: translateCharacterOption(
        language,
        'characterClass',
        data.characterClass,
      ),
    },
    {
      key: 'ancestry',
      label: copy.ancestry,
      value: translateCharacterOption(
        language,
        'ancestry',
        data.ancestry,
      ),
    },
    {
      key: 'background',
      label: copy.background,
      value: translateCharacterOption(
        language,
        'background',
        data.background,
      ),
    },
    {
      key: 'weapon',
      label: copy.weapon,
      value: translateCharacterOption(
        language,
        'weapon',
        data.weapon,
      ),
    },
    {
      key: 'artifact',
      label: copy.artifact,
      value: translateCharacterOption(
        language,
        'artifact',
        data.artifact,
      ),
    },
    {
      key: 'personality',
      label: copy.personality,
      value: translateCharacterOption(
        language,
        'personality',
        data.personality,
      ),
    },
    {
      key: 'aura',
      label: copy.aura,
      value: translateCharacterOption(
        language,
        'aura',
        data.aura,
      ),
    },
    {
      key: 'companion',
      label: copy.companion,
      value: translateCharacterOption(
        language,
        'companion',
        data.companion,
      ),
    },
    {
      key: 'motivation',
      label: copy.motivation,
      value: translateMotivationOption(
        language,
        data.motivation,
      ),
    },
  ]

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      className="character-review-step"
      aria-labelledby="character-review-step-title"
    >
      {/* Accessible page title */}

      <h2
        id="character-review-step-title"
        className="character-review-step__sr-only"
      >
        {copy.title}
      </h2>

      {/* ===================================
          CLASS ARTWORK
          =================================== */}

      <div className="character-review-step__visual">
        <CharacterPreview
          characterClass={data.characterClass}
          language={language}
        />
      </div>

      {/* ===================================
          SELECTED INFORMATION
          =================================== */}

      <dl className="character-review-step__values">
        {fields.map((field, index) => {
          const isPrimaryField = index < 2

          return (
            <div
              key={field.key}
              className={
                isPrimaryField
                  ? 'character-review-step__entry character-review-step__entry--wide'
                  : 'character-review-step__entry'
              }
            >
              <dt className="character-review-step__label">
                {field.label}
              </dt>

              <dd className="character-review-step__value">
                {field.value}
              </dd>
            </div>
          )
        })}
      </dl>

      {/* ===================================
          NAVIGATION
          =================================== */}

      <div className="character-review-step__actions">
        <button
          type="button"
          className="character-review-step__back"
          onClick={onBack}
          disabled={saving}
        >
          {copy.back}
        </button>

        <button
          type="button"
          className="character-review-step__save"
          onClick={onSave}
          disabled={!onSave || saving}
          aria-busy={saving}
          aria-describedby={
            onSave
              ? undefined
              : 'character-review-save-note'
          }
          title={
            onSave
              ? undefined
              : copy.saveUnavailable
          }
        >
          {saving
            ? copy.saving
            : copy.save}
        </button>
      </div>

      {/* ===================================
          ACCESSIBLE SAVE INFORMATION
          =================================== */}

      {!onSave && (
        <span
          id="character-review-save-note"
          className="character-review-step__sr-only"
        >
          {copy.saveUnavailable}
        </span>
      )}
    </section>
  )
}
