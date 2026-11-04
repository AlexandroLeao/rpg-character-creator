import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import './CharacterOriginsStep.css'

/*
 * ADVENTURE FILES
 * STEP 02 / 04 — ORIGINS
 *
 * Approved customization options.
 * Values match the backend catalog.
 */

const ancestries = [
  'human',
  'elf',
  'dwarf',
  'orc',
  'fae',
  'construct',
] as const

const backgrounds = [
  'noble',
  'scholar',
  'wanderer',
  'guardian',
  'artisan',
  'outlaw',
] as const

export type CharacterAncestry =
  (typeof ancestries)[number]

export type CharacterBackground =
  (typeof backgrounds)[number]

/*
 * COMPLETE STEP DATA
 */

export type OriginsStepData = {
  ancestry: CharacterAncestry
  background: CharacterBackground
}

/*
 * PARTIAL STEP DATA
 *
 * Allows the user to return to step 01
 * without losing unfinished selections.
 */

export type OriginsStepSelection = {
  ancestry: CharacterAncestry | null
  background: CharacterBackground | null
}

type CharacterOriginsStepProps = {
  language: Language

  onBack: (data: OriginsStepSelection) => void

  onNext: (data: OriginsStepData) => void

  initialAncestry?: CharacterAncestry | null

  initialBackground?: CharacterBackground | null
}

export function CharacterOriginsStep({
  language,
  onBack,
  onNext,
  initialAncestry = null,
  initialBackground = null,
}: CharacterOriginsStepProps) {
  /*
   * SELECTED OPTIONS
   */

  const [selectedAncestry, setSelectedAncestry] =
    useState<CharacterAncestry | null>(
      initialAncestry,
    )

  const [selectedBackground, setSelectedBackground] =
    useState<CharacterBackground | null>(
      initialBackground,
    )

  /*
   * VALIDATION
   */

  const canContinue =
    selectedAncestry !== null &&
    selectedBackground !== null

  /*
   * RETURN TO STEP 01
   *
   * Preserve both selections, including
   * partially completed selections.
   */

  function handleBack() {
    onBack({
      ancestry: selectedAncestry,
      background: selectedBackground,
    })
  }

  /*
   * CONTINUE TO STEP 03
   */

  function handleContinue() {
    if (
      selectedAncestry === null ||
      selectedBackground === null
    ) {
      return
    }

    onNext({
      ancestry: selectedAncestry,
      background: selectedBackground,
    })
  }

  /*
   * TRANSLATIONS
   */

  const copy =
    language === 'pt'
      ? {
          ancestry: 'ANCESTRALIDADE',
          background: 'ORIGEM',
          back: 'VOLTAR',
          continue: 'CONTINUAR',
        }
      : {
          ancestry: 'ANCESTRY',
          background: 'BACKGROUND',
          back: 'BACK',
          continue: 'CONTINUE',
        }

  /*
   * RENDER
   */

  return (
    <section
      className="character-origins-step"
      aria-label={
        language === 'pt'
          ? 'Escolha suas origens'
          : 'Choose your origins'
      }
    >
      <div className="character-origins-step__groups">
        {/*
         * ANCESTRY
         */}

        <fieldset className="character-origins-step__group">
          <legend className="character-origins-step__title">
            {copy.ancestry}
          </legend>

          <div className="character-origins-step__choices">
            {ancestries.map((ancestry) => (
              <button
                key={ancestry}
                type="button"
                className={
                  selectedAncestry === ancestry
                    ? 'character-origins-step__choice is-selected'
                    : 'character-origins-step__choice'
                }
                aria-pressed={
                  selectedAncestry === ancestry
                }
                onClick={() =>
                  setSelectedAncestry(ancestry)
                }
              >
                {translateCharacterOption(
                  language,
                  'ancestry',
                  ancestry,
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/*
         * BACKGROUND
         */}

        <fieldset className="character-origins-step__group">
          <legend className="character-origins-step__title">
            {copy.background}
          </legend>

          <div className="character-origins-step__choices">
            {backgrounds.map((background) => (
              <button
                key={background}
                type="button"
                className={
                  selectedBackground === background
                    ? 'character-origins-step__choice is-selected'
                    : 'character-origins-step__choice'
                }
                aria-pressed={
                  selectedBackground === background
                }
                onClick={() =>
                  setSelectedBackground(background)
                }
              >
                {translateCharacterOption(
                  language,
                  'background',
                  background,
                )}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/*
       * NAVIGATION BUTTONS
       */}

      <div className="character-origins-step__actions">
        <button
          type="button"
          className="character-origins-step__back"
          onClick={handleBack}
        >
          {copy.back}
        </button>

        <button
          type="button"
          className="character-origins-step__continue"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  )
}