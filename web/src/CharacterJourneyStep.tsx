import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import {
  motivationIds,
  translateMotivationOption,
  type CharacterMotivation,
} from './lib/motivationTranslations'

import './CharacterJourneyStep.css'

/*
 * ADVENTURE FILES
 * STEP 05 / 06 — JOURNEY
 *
 * Companion: 8 options
 * Motivation: 8 options
 *
 * Both categories require an explicit selection.
 *
 * Only Companion includes "none".
 */

/*
 * COMPANIONS
 */

const companions = [
  'none',
  'wolf',
  'owl',
  'cat',
  'fox',
  'raven',
  'turtle',
  'dragon',
] as const

/*
 * TYPES
 */

export type CharacterCompanion =
  (typeof companions)[number]

export type { CharacterMotivation }

/*
 * COMPLETE STEP DATA
 */

export type JourneyStepData = {
  companion: CharacterCompanion
  motivation: CharacterMotivation
}

/*
 * PARTIAL STEP DATA
 *
 * Preserves unfinished selections
 * when returning to Essence.
 */

export type JourneyStepSelection = {
  companion: CharacterCompanion | null
  motivation: CharacterMotivation | null
}

/*
 * COMPONENT PROPS
 */

type CharacterJourneyStepProps = {
  language: Language

  onBack: (data: JourneyStepSelection) => void

  onNext: (data: JourneyStepData) => void

  initialCompanion?: CharacterCompanion | null

  initialMotivation?: CharacterMotivation | null
}

/*
 * COMPONENT
 */

export function CharacterJourneyStep({
  language,
  onBack,
  onNext,
  initialCompanion = null,
  initialMotivation = null,
}: CharacterJourneyStepProps) {
  /*
   * SELECTED COMPANION
   */

  const [selectedCompanion, setSelectedCompanion] =
    useState<CharacterCompanion | null>(
      initialCompanion,
    )

  /*
   * SELECTED MOTIVATION
   */

  const [selectedMotivation, setSelectedMotivation] =
    useState<CharacterMotivation | null>(
      initialMotivation,
    )

  /*
   * VALIDATION
   *
   * An explicit selection is required
   * in both categories.
   *
   * "none" is a valid companion choice.
   */

  const canContinue =
    selectedCompanion !== null &&
    selectedMotivation !== null

  /*
   * RETURN TO ESSENCE
   */

  function handleBack() {
    onBack({
      companion: selectedCompanion,
      motivation: selectedMotivation,
    })
  }

  /*
   * CONTINUE TO FINAL REVIEW
   */

  function handleContinue() {
    if (
      selectedCompanion === null ||
      selectedMotivation === null
    ) {
      return
    }

    onNext({
      companion: selectedCompanion,
      motivation: selectedMotivation,
    })
  }

  /*
   * TRANSLATIONS
   */

  const copy =
    language === 'pt'
      ? {
          companion: 'COMPANHEIRO',
          motivation: 'MOTIVAÇÃO',
          back: 'VOLTAR',
          continue: 'CONTINUAR',
        }
      : {
          companion: 'COMPANION',
          motivation: 'MOTIVATION',
          back: 'BACK',
          continue: 'CONTINUE',
        }

  /*
   * RENDER
   */

  return (
    <section
      className="character-journey-step"
      aria-label={
        language === 'pt'
          ? 'Escolha seu companheiro e motivação'
          : 'Choose your companion and motivation'
      }
    >
      <div className="character-journey-step__groups">
        {/*
         * COMPANION
         */}

        <fieldset className="character-journey-step__group">
          <legend className="character-journey-step__title">
            {copy.companion}
          </legend>

          <div className="character-journey-step__choices">
            {companions.map((companion) => (
              <button
                key={companion}
                type="button"
                className={
                  selectedCompanion === companion
                    ? 'character-journey-step__choice is-selected'
                    : 'character-journey-step__choice'
                }
                aria-pressed={
                  selectedCompanion === companion
                }
                onClick={() =>
                  setSelectedCompanion(companion)
                }
              >
                {translateCharacterOption(
                  language,
                  'companion',
                  companion,
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/*
         * MOTIVATION
         */}

        <fieldset className="character-journey-step__group">
          <legend className="character-journey-step__title">
            {copy.motivation}
          </legend>

          <div className="character-journey-step__choices">
            {motivationIds.map((motivation) => (
              <button
                key={motivation}
                type="button"
                className={
                  selectedMotivation === motivation
                    ? 'character-journey-step__choice is-selected'
                    : 'character-journey-step__choice'
                }
                aria-pressed={
                  selectedMotivation === motivation
                }
                onClick={() =>
                  setSelectedMotivation(motivation)
                }
              >
                {translateMotivationOption(
                  language,
                  motivation,
                )}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/*
       * NAVIGATION
       */}

      <div className="character-journey-step__actions">
        <button
          type="button"
          className="character-journey-step__back"
          onClick={handleBack}
        >
          {copy.back}
        </button>

        <button
          type="button"
          className="character-journey-step__continue"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  )
}