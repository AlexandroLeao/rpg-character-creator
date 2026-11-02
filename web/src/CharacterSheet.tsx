
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

import {
  CharacterExportPanel,
} from './CharacterExportPanel'

import './CharacterSheet.css'

/*
 * ADVENTURE FILES
 * SAVED CHARACTER SHEET
 *
 * The saved character is the source of truth.
 * All character choices use localized text.
 * The sheet also provides PNG export options.
 *
 * The page title is displayed by App.
 * The character sheet does not repeat it.
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
  showExport?: boolean
}

export function CharacterSheet({
  character,
  language,
  showExport = true,
}: CharacterSheetProps) {
  const copy = characterTranslations[language]

  /*
   * Unknown or legacy class identifiers
   * retain their saved labels.
   *
   * Artwork falls back to the existing
   * group illustration when necessary.
   */

  const illustratedClass =
    illustratedClasses.has(character.characterClass)
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
      {/* Accessible heading for the saved sheet */}

      <h2 className="character-sheet__sr-only">
        {copy.title}
      </h2>

      {/* ====================================
          CHARACTER IDENTITY AND ARTWORK
          ==================================== */}

      <div className="character-sheet__hero">
        <div className="character-sheet__artwork">
          <CharacterPreview
            characterClass={illustratedClass}
            language={language}
          />
        </div>

        <div className="character-sheet__details">
          <div className="character-sheet__identity">
          {/* CHARACTER NAME */}

          <div className="character-sheet__name-details">
            <span className="character-sheet__label">
              {language === 'pt'
                ? 'Nome:'
                : 'Name:'}
            </span>

            <h2
              id="character-sheet-name"
              className="character-sheet__name"
            >
              {character.name}
            </h2>
          </div>

          {/* CHARACTER CLASS */}

          <div className="character-sheet__class-details">
            <span className="character-sheet__label">
              {copy.fields.characterClass}
            </span>

            <p className="character-sheet__class-name">
              {className}
            </p>
          </div>
          </div>

      {/* ====================================
          CHARACTER CUSTOMIZATION
          ==================================== */}

      <div className="character-sheet__sections">
        {sections.map((section) => (
          <section
            key={section.key}
            className="character-sheet__section"
            aria-labelledby={
              'character-sheet-' + section.key
            }
          >
            {/* SECTION TITLE */}

            <div className="character-sheet__section-heading">
              <h3
                id={
                  'character-sheet-' + section.key
                }
              >
                {section[language]}
              </h3>
            </div>

            {/* SECTION FIELDS */}

            <dl className="character-sheet__fields">
              {section.fields.map((field) => (
                <div
                  key={field}
                  className="character-sheet__field"
                >
                  <dt>
                    {copy.fields[field]}
                  </dt>

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
        </div>
      </div>

      {/* ====================================
          CHARACTER EXPORT
          ==================================== */}

      {showExport && (
        <CharacterExportPanel
          character={character}
          language={language}
        />
      )}
    </article>
  )
}
