import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import './CharacterEssenceStep.css'

/*
 * ADVENTURE FILES
 * STEP 04 / 06 — ESSENCE
 *
 * Personality: 8 options
 * Aura: 8 options
 *
 * Both categories require an explicit selection.
 */

/*
 * PERSONALITIES
 */

const personalities = [
  'brave',
  'curious',
  'loyal',
  'cunning',
  'kind',
  'stoic',
  'rebellious',
  'mysterious',
] as const

/*
 * AURAS
 */

const auras = [
  'fire',
  'ice',
  'nature',
  'shadow',
  'light',
  'storm',
  'arcane',
  'void',
] as const

/*
 * TYPES
 */

export type CharacterPersonality =
  (typeof personalities)[number]

export type CharacterAura =
  (typeof auras)[number]

/*
 * COMPLETE STEP DATA
 */

export type EssenceStepData = {
  personality: CharacterPersonality
  aura: CharacterAura
}

/*
 * PARTIAL STEP DATA
 *
 * Preserves unfinished selections
 * when returning to Equipment.
 */

export type EssenceStepSelection = {
  personality: CharacterPersonality | null
  aura: CharacterAura | null
}

/*
 * COMPONENT PROPS
 */

type CharacterEssenceStepProps = {
  language: Language

  onBack: (data: EssenceStepSelection) => void

  onNext: (data: EssenceStepData) => void

  initialPersonality?: CharacterPersonality | null

  initialAura?: CharacterAura | null
}

/*
 * COMPONENT
 */

export function CharacterEssenceStep({
  language,
  onBack,
  onNext,
  initialPersonality = null,
  initialAura = null,
}: CharacterEssenceStepProps) {
  /*
   * SELECTED PERSONALITY
   */

  const [selectedPersonality, setSelectedPersonality] =
    useState<CharacterPersonality | null>(
      initialPersonality,
    )

  /*
   * SELECTED AURA
   */

  const [selectedAura, setSelectedAura] =
    useState<CharacterAura | null>(
      initialAura,
    )

  /*
   * VALIDATION
   *
   * Both categories require
   * an explicit selection.
   */

  const canContinue =
    selectedPersonality !== null &&
    selectedAura !== null

  /*
   * RETURN TO EQUIPMENT
   */

  function handleBack() {
    onBack({
      personality: selectedPersonality,
      aura: selectedAura,
    })
  }

  /*
   * CONTINUE TO JOURNEY
   */

  function handleContinue() {
    if (
      selectedPersonality === null ||
      selectedAura === null
    ) {
      return
    }

    onNext({
      personality: selectedPersonality,
      aura: selectedAura,
    })
  }

  /*
   * TRANSLATIONS
   */

  const copy =
    language === 'pt'
      ? {
          personality: 'PERSONALIDADE',
          aura: 'AURA',
          back: 'VOLTAR',
          continue: 'CONTINUAR',
        }
      : {
          personality: 'PERSONALITY',
          aura: 'AURA',
          back: 'BACK',
          continue: 'CONTINUE',
        }

  /*
   * RENDER
   */

  return (
    <section
      className="character-essence-step"
      aria-label={
        language === 'pt'
          ? 'Escolha sua personalidade e aura'
          : 'Choose your personality and aura'
      }
    >
      <div className="character-essence-step__groups">
        {/*
         * PERSONALITY
         */}

        <fieldset className="character-essence-step__group">
          <legend className="character-essence-step__title">
            {copy.personality}
          </legend>

          <div className="character-essence-step__choices">
            {personalities.map((personality) => (
              <button
                key={personality}
                type="button"
                className={
                  selectedPersonality === personality
                    ? 'character-essence-step__choice is-selected'
                    : 'character-essence-step__choice'
                }
                aria-pressed={
                  selectedPersonality === personality
                }
                onClick={() =>
                  setSelectedPersonality(personality)
                }
              >
                {translateCharacterOption(
                  language,
                  'personality',
                  personality,
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/*
         * AURA
         */}

        <fieldset className="character-essence-step__group">
          <legend className="character-essence-step__title">
            {copy.aura}
          </legend>

          <div className="character-essence-step__choices">
            {auras.map((aura) => (
              <button
                key={aura}
                type="button"
                className={
                  selectedAura === aura
                    ? 'character-essence-step__choice is-selected'
                    : 'character-essence-step__choice'
                }
                aria-pressed={
                  selectedAura === aura
                }
                onClick={() =>
                  setSelectedAura(aura)
                }
              >
                {translateCharacterOption(
                  language,
                  'aura',
                  aura,
                )}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/*
       * NAVIGATION
       */}

      <div className="character-essence-step__actions">
        <button
          type="button"
          className="character-essence-step__back"
          onClick={handleBack}
        >
          {copy.back}
        </button>

        <button
          type="button"
          className="character-essence-step__continue"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  )
}
