import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import './CharacterEquipmentStep.css'

/*
 * ADVENTURE FILES
 * STEP 03 / 04 — EQUIPMENT
 *
 * Approved equipment options.
 *
 * Weapon: 8 options
 * Artifact: 8 options
 * Companion: 8 options
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
  'emerald-amulet',
  'ancient-ring',
  'moon-crystal',
  'runic-compass',
  'shadow-crown',
  'phoenix-feather',
  'chaos-orb',
  'sun-relic',
] as const

/*
 * COMPANIONS
 *
 * The "none" option remains available.
 */

const companions = [
  'none',
  'wolf',
  'owl',
  'cat',
  'fox',
  'raven',
  'turtle',
  'dragonling',
] as const

/*
 * TYPES
 */

export type CharacterWeapon =
  (typeof weapons)[number]

export type CharacterArtifact =
  (typeof artifacts)[number]

export type CharacterCompanion =
  (typeof companions)[number]

/*
 * COMPLETE STEP DATA
 */

export type EquipmentStepData = {
  weapon: CharacterWeapon
  artifact: CharacterArtifact
  companion: CharacterCompanion
}

/*
 * PARTIAL STEP DATA
 *
 * Preserves unfinished selections
 * when returning to step 02.
 */

export type EquipmentStepSelection = {
  weapon: CharacterWeapon | null
  artifact: CharacterArtifact | null
  companion: CharacterCompanion | null
}

type CharacterEquipmentStepProps = {
  language: Language

  onBack: (data: EquipmentStepSelection) => void

  onNext: (data: EquipmentStepData) => void

  initialWeapon?: CharacterWeapon | null

  initialArtifact?: CharacterArtifact | null

  initialCompanion?: CharacterCompanion | null
}

export function CharacterEquipmentStep({
  language,
  onBack,
  onNext,
  initialWeapon = null,
  initialArtifact = null,
  initialCompanion = null,
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

  const [selectedCompanion, setSelectedCompanion] =
    useState<CharacterCompanion | null>(
      initialCompanion,
    )

  /*
   * VALIDATION
   *
   * All three categories require
   * an explicit selection.
   */

  const canContinue =
    selectedWeapon !== null &&
    selectedArtifact !== null &&
    selectedCompanion !== null

  /*
   * RETURN TO STEP 02
   */

  function handleBack() {
    onBack({
      weapon: selectedWeapon,
      artifact: selectedArtifact,
      companion: selectedCompanion,
    })
  }

  /*
   * CONTINUE TO STEP 04
   */

  function handleContinue() {
    if (
      selectedWeapon === null ||
      selectedArtifact === null ||
      selectedCompanion === null
    ) {
      return
    }

    onNext({
      weapon: selectedWeapon,
      artifact: selectedArtifact,
      companion: selectedCompanion,
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
          companion: 'COMPANHEIRO',
          back: 'VOLTAR',
          continue: 'CONTINUAR',
        }
      : {
          weapon: 'WEAPON',
          artifact: 'ARTIFACT',
          companion: 'COMPANION',
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

        {/*
         * COMPANION
         */}

        <fieldset className="character-equipment-step__group">
          <legend className="character-equipment-step__title">
            {copy.companion}
          </legend>

          <div className="character-equipment-step__choices">
            {companions.map((companion) => (
              <button
                key={companion}
                type="button"
                className={
                  selectedCompanion === companion
                    ? 'character-equipment-step__choice is-selected'
                    : 'character-equipment-step__choice'
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