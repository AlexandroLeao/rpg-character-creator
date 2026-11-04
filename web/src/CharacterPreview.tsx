import type { Language } from './lib/authTranslations'

import { translateCharacterOption } from './lib/characterTranslations'

import './CharacterPreview.css'

const characterArtwork = {
  warrior: '/art/characters/warrior.png',
  paladin: '/art/characters/paladin.png',
  mage: '/art/characters/mage.png',
  rogue: '/art/characters/rogue.png',
  ranger: '/art/characters/ranger.png',
  druid: '/art/characters/druid.png',
  cleric: '/art/characters/cleric.png',
  bard: '/art/characters/bard.png',
} as const

export type CharacterClass = keyof typeof characterArtwork

type CharacterPreviewProps = {
  characterClass: CharacterClass | null
  language: Language
}

export function CharacterPreview({
  characterClass,
  language,
}: CharacterPreviewProps) {
  const imageSource = characterClass
    ? characterArtwork[characterClass]
    : '/art/characters/classes-together.png'

  const imageDescription = characterClass
    ? language === 'pt'
      ? `Dois personagens representando a classe ${translateCharacterOption(language, 'characterClass', characterClass)}`
      : `Two characters representing the ${translateCharacterOption(language, 'characterClass', characterClass)} class`
    : language === 'pt'
      ? 'Oito personagens representando as oito classes disponíveis'
      : 'Eight characters representing the eight available classes'

  return (
    <div className="character-preview">
      <img
        className="character-preview__image"
        src={imageSource}
        alt={imageDescription}
        draggable={false}
        decoding="async"
      />
    </div>
  )
}