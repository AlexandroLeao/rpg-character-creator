import { useState } from 'react'

import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import {
  CharacterPreview,
  type CharacterClass,
} from './CharacterPreview'

import './CharacterClassStep.css'

/*
 * AVAILABLE CHARACTER CLASSES
 */

const classes: CharacterClass[] = [
  'warrior',
  'paladin',
  'mage',
  'rogue',
  'ranger',
  'druid',
  'cleric',
  'bard',
]

type ClassStepData = {
  characterClass: CharacterClass
  name: string
}

type CharacterClassStepProps = {
  language: Language
  onBack: () => void
  onNext: (data: ClassStepData) => void
  initialClass?: CharacterClass | null
  initialName?: string
}

export function CharacterClassStep({
  language,
  onBack,
  onNext,
  initialClass = null,
  initialName = '',
}: CharacterClassStepProps) {
  /*
   * CHARACTER CLASS
   */

  const [selectedClass, setSelectedClass] =
    useState<CharacterClass | null>(initialClass)

  /*
   * CHARACTER NAME
   */

  const [name, setName] = useState(initialName.toLocaleUpperCase(language === 'pt' ? 'pt-BR' : 'en-US'))

  const trimmedName = name.trim()

  /*
   * FORM VALIDATION
   */

  const canContinue =
    selectedClass !== null &&
    trimmedName.length >= 2 &&
    trimmedName.length <= 32

  /*
   * CONTINUE TO NEXT STEP
   */

  function handleContinue() {
    if (!selectedClass || !canContinue) {
      return
    }

    onNext({
      characterClass: selectedClass,
      name: trimmedName,
    })
  }

  /*
   * RENDER
   */

  return (
    <section className="character-class-step">
      {/* CHARACTER ARTWORK */}

      <div className="character-class-step__visual">
        <CharacterPreview
          characterClass={selectedClass}
          language={language}
        />
      </div>

      {/* CHARACTER CREATION CONTROLS */}

      <div className="character-class-step__controls">
        {/* CLASS SELECTION TITLE */}

        <div className="character-class-step__header">
          <h2>
            {language === 'pt'
              ? 'ESCOLHA SUA CLASSE'
              : 'SELECT YOUR CLASS'}
          </h2>
        </div>

        {/* AVAILABLE CLASSES */}

        <div
          className="character-class-step__choices"
          role="group"
          aria-label={
            language === 'pt'
              ? 'Classes disponíveis'
              : 'Available classes'
          }
        >
          {classes.map((characterClass) => (
            <button
              key={characterClass}
              type="button"
              className={
                selectedClass === characterClass
                  ? 'character-class-step__choice is-selected'
                  : 'character-class-step__choice'
              }
              aria-pressed={
                selectedClass === characterClass
              }
              onClick={() =>
                setSelectedClass(characterClass)
              }
            >
              {translateCharacterOption(
                language,
                'characterClass',
                characterClass,
              )}
            </button>
          ))}
        </div>

        {/* CHARACTER NAME */}

        <div className="character-class-step__name">
          <label htmlFor="character-name">
            {language === 'pt'
              ? 'NOME DO PERSONAGEM'
              : 'CHARACTER NAME'}
          </label>

          <input
            id="character-name"
            type="text"
            value={name}
            minLength={2}
            maxLength={32}
            autoComplete="off"
            onChange={(event) =>
              setName(event.target.value.toLocaleUpperCase(language === 'pt' ? 'pt-BR' : 'en-US'))
            }
          />
        </div>

        {/* NAVIGATION BUTTONS */}

        <div className="character-class-step__actions">
          <button
            type="button"
            className="character-class-step__back"
            onClick={onBack}
          >
            {language === 'pt' ? 'VOLTAR' : 'BACK'}
          </button>

          <button
            type="button"
            className="character-class-step__continue"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            {language === 'pt'
              ? 'CONTINUAR'
              : 'CONTINUE'}
          </button>
        </div>
      </div>
    </section>
  )
}