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
 * The visible heading is omitted to keep
 * the review compact.
 *
 * An accessible heading is preserved
 * for screen-reader users.
 *
 * The artwork and selected information
 * share equal-width desktop columns.
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
}: CharacterReviewStepProps) {
  /*
   * TRANSLATIONS
   */

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
          saveUnavailable:
            'Saving will be available after server integration.',
        }

  /*
   * CHARACTER INFORMATION
   *
   * Name
   * Class
   * Ancestry + Background
   * Weapon + Artifact
   * Personality + Aura
   * Companion + Motivation
   */

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

  return (
    <section
      className="character-review-step"
      aria-labelledby="character-review-step-title"
    >
      {/*
       * ACCESSIBLE TITLE
       *
       * Hidden visually, but available
       * to screen readers and heading navigation.
       */}

      <h2
        id="character-review-step-title"
        className="character-review-step__sr-only"
      >
        {copy.title}
      </h2>

      {/* CLASS ARTWORK */}

      <div className="character-review-step__visual">
        <CharacterPreview
          characterClass={data.characterClass}
          language={language}
        />
      </div>

      {/* SELECTED INFORMATION */}

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
              <dt
                className={
                  isPrimaryField
                    ? 'character-review-step__sr-only'
                    : 'character-review-step__label'
                }
              >
                {field.label}
              </dt>

              <dd className="character-review-step__value">
                {field.value}
              </dd>
            </div>
          )
        })}
      </dl>

      {/* NAVIGATION */}

      <div className="character-review-step__actions">
        <button
          type="button"
          className="character-review-step__back"
          onClick={onBack}
        >
          {copy.back}
        </button>

        <button
          type="button"
          className="character-review-step__save"
          disabled
          aria-describedby="character-review-save-note"
          title={copy.saveUnavailable}
        >
          {copy.save}
        </button>
      </div>

      <span
        id="character-review-save-note"
        className="character-review-step__sr-only"
      >
        {copy.saveUnavailable}
      </span>
    </section>
  )
}