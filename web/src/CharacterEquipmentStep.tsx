import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import './CharacterEquipmentStep.css'

/*
 * ADVENTURE FILES
 * EQUIPMENT SELECTION
 *
 * Current implementation: Step 03 / 04
 * Approved target: Step 03 / 06
 *
 * Weapon: 8 options
 * Artifact: 8 options
 *
 * Companion will be selected in Journey.
 */

/*
 * WEAPONS
 */

const weapons = [
  'sword',
  'bow',
  'staff',
  'dagger',
  'axe',
  'spear',
  'hammer',
  'wand',
] as const

/*
 * ARTIFACTS
 *
 * An artifact is required.
 * The "none" option is not available.
 */

const artifacts = [
  'arcane-seal',
  'ancient-ring',
  'moon-crystal',
  'runic-compass',
  'shadow-crown',
  'phoenix-feather',
  'chaos-orb',
  'sun-relic',
] as const

/*
 * TYPES
 */

export type CharacterWeapon =
  (typeof weapons)[number]

export type CharacterArtifact =
  (typeof artifacts)[number]

/*
 * COMPLETE STEP DATA
 */

export type EquipmentStepData = {
  weapon: CharacterWeapon
  artifact: CharacterArtifact
}

/*
 * PARTIAL STEP DATA
 *
 * Preserves unfinished selections
 * when returning to Origins.
 */

export type EquipmentStepSelection = {
  weapon: CharacterWeapon | null
  artifact: CharacterArtifact | null
}

type CharacterEquipmentStepProps = {
  language: Language

  onBack: (data: EquipmentStepSelection) => void

  onNext: (data: EquipmentStepData) => void

  initialWeapon?: CharacterWeapon | null

  initialArtifact?: CharacterArtifact | null
}

export function CharacterEquipmentStep({
  language,
  onBack,
  onNext,
  initialWeapon = null,
  initialArtifact = null,
}: CharacterEquipmentStepProps) {
  /*
   * SELECTED EQUIPMENT
   */

  const [selectedWeapon, setSelectedWeapon] =
    useState<CharacterWeapon | null>(
      initialWeapon,
    )

  const [selectedArtifact, setSelectedArtifact] =
    useState<CharacterArtifact | null>(
      initialArtifact,
    )

  /*
   * VALIDATION
   *
   * Both categories require
   * an explicit selection.
   */

  const canContinue =
    selectedWeapon !== null &&
    selectedArtifact !== null

  /*
   * RETURN TO ORIGINS
   */

  function handleBack() {
    onBack({
      weapon: selectedWeapon,
      artifact: selectedArtifact,
    })
  }

  /*
   * CONTINUE TO ESSENCE
   */

  function handleContinue() {
    if (
      selectedWeapon === null ||
      selectedArtifact === null
    ) {
      return
    }

    onNext({
      weapon: selectedWeapon,
      artifact: selectedArtifact,
    })
  }

  /*
   * TRANSLATIONS
   */

  const copy =
    language === 'pt'
      ? {
          weapon: 'ARMA',
          artifact: 'ARTEFATO',
          back: 'VOLTAR',
          continue: 'CONTINUAR',
        }
      : {
          weapon: 'WEAPON',
          artifact: 'ARTIFACT',
          back: 'BACK',
          continue: 'CONTINUE',
        }

  /*
   * RENDER
   */

  return (
    <section
      className="character-equipment-step"
      aria-label={
        language === 'pt'
          ? 'Escolha seu equipamento'
          : 'Choose your equipment'
      }
    >
      <div className="character-equipment-step__groups">
        {/*
         * WEAPON
         */}

        <fieldset className="character-equipment-step__group">
          <legend className="character-equipment-step__title">
            {copy.weapon}
          </legend>

          <div className="character-equipment-step__choices">
            {weapons.map((weapon) => (
              <button
                key={weapon}
                type="button"
                className={
                  selectedWeapon === weapon
                    ? 'character-equipment-step__choice is-selected'
                    : 'character-equipment-step__choice'
                }
                aria-pressed={
                  selectedWeapon === weapon
                }
                onClick={() =>
                  setSelectedWeapon(weapon)
                }
              >
                {translateCharacterOption(
                  language,
                  'weapon',
                  weapon,
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/*
         * ARTIFACT
         */}

        <fieldset className="character-equipment-step__group">
          <legend className="character-equipment-step__title">
            {copy.artifact}
          </legend>

          <div className="character-equipment-step__choices">
            {artifacts.map((artifact) => (
              <button
                key={artifact}
                type="button"
                className={
                  selectedArtifact === artifact
                    ? 'character-equipment-step__choice is-selected'
                    : 'character-equipment-step__choice'
                }
                aria-pressed={
                  selectedArtifact === artifact
                }
                onClick={() =>
                  setSelectedArtifact(artifact)
                }
              >
                {translateCharacterOption(
                  language,
                  'artifact',
                  artifact,
                )}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/*
       * NAVIGATION
       */}

      <div className="character-equipment-step__actions">
        <button
          type="button"
          className="character-equipment-step__back"
          onClick={handleBack}
        >
          {copy.back}
        </button>

        <button
          type="button"
          className="character-equipment-step__continue"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  )
}