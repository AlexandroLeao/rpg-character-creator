import type { Language } from './lib/authTranslations'
import type { Character } from './lib/characterApi'

import {
  characterTranslations,
  translateCharacterOption,
} from './lib/characterTranslations'

import {
  CharacterPreview,
  type CharacterClass,
} from './CharacterPreview'

import './CharacterSheet.css'

/*
 * ADVENTURE FILES
 * SAVED CHARACTER SHEET
 *
 * The saved record is the source of truth.
 * Every choice without dedicated artwork
 * is presented as localized text.
 */

const illustratedClasses = new Set<string>([
  'warrior',
  'paladin',
  'mage',
  'rogue',
  'ranger',
  'druid',
  'cleric',
  'bard',
])

const sections = [
  {
    key: 'origins',
    pt: 'ORIGENS',
    en: 'ORIGINS',
    fields: ['ancestry', 'background'],
  },
  {
    key: 'equipment',
    pt: 'EQUIPAMENTO',
    en: 'EQUIPMENT',
    fields: ['weapon', 'artifact'],
  },
  {
    key: 'essence',
    pt: 'ESSÊNCIA',
    en: 'ESSENCE',
    fields: ['personality', 'aura'],
  },
  {
    key: 'journey',
    pt: 'JORNADA',
    en: 'JOURNEY',
    fields: ['companion', 'motivation'],
  },
] as const

type CharacterSheetProps = {
  character: Character
  language: Language
}

export function CharacterSheet({
  character,
  language,
}: CharacterSheetProps) {
  const copy = characterTranslations[language]

  /*
   * Older or unexpected class identifiers
   * retain their saved label, while artwork
   * safely falls back to the group illustration.
   */

  const illustratedClass = illustratedClasses.has(
    character.characterClass,
  )
    ? character.characterClass as CharacterClass
    : null

  const className = translateCharacterOption(
    language,
    'characterClass',
    character.characterClass,
  )

  return (
    <article
      className="character-sheet"
      aria-labelledby="character-sheet-name"
    >
      <h2 className="character-sheet__sr-only">
        {copy.title}
      </h2>

      <div className="character-sheet__hero">
        <div className="character-sheet__artwork">
          <CharacterPreview
            characterClass={illustratedClass}
            language={language}
          />
        </div>

        <div className="character-sheet__identity">
          <span className="character-sheet__eyebrow">
            {language === 'pt'
              ? 'FICHA DE PERSONAGEM'
              : 'CHARACTER SHEET'}
          </span>

          <h2
            id="character-sheet-name"
            className="character-sheet__name"
          >
            {character.name}
          </h2>

          <div className="character-sheet__class-details">
            <span className="character-sheet__label">
              {copy.fields.characterClass}
            </span>

            <p className="character-sheet__class-name">
              {className}
            </p>
          </div>

          <span className="character-sheet__saved">
            {language === 'pt'
              ? 'PERSONAGEM SALVO'
              : 'CHARACTER SAVED'}
          </span>
        </div>
      </div>

      <div className="character-sheet__sections">
        {sections.map((section, index) => (
          <section
            key={section.key}
            className="character-sheet__section"
            aria-labelledby={
              'character-sheet-' + section.key
            }
          >
            <div className="character-sheet__section-heading">
              <span
                className="character-sheet__section-number"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 id={'character-sheet-' + section.key}>
                {section[language]}
              </h3>
            </div>

            <dl className="character-sheet__fields">
              {section.fields.map((field) => (
                <div
                  key={field}
                  className="character-sheet__field"
                >
                  <dt>{copy.fields[field]}</dt>
                  <dd>
                    {translateCharacterOption(
                      language,
                      field,
                      character[field],
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </article>
  )
}
