import type { Language } from './authTranslations'

import {
  motivationIds,
  translateMotivationOption,
} from './motivationTranslations'

/* ==========================================
   ADVENTURE FILES
   CHARACTER TRANSLATIONS
   ========================================== */

export const characterFieldKeys = [
  'characterClass',
  'ancestry',
  'background',
  'weapon',
  'artifact',
  'personality',
  'aura',
  'companion',
  'motivation',
] as const

export type CharacterField =
  (typeof characterFieldKeys)[number]

/* ==========================================
   INTERFACE TRANSLATIONS
   ========================================== */

export const characterTranslations = {
  en: {
    title: 'My Character',
    loading: 'Loading character...',
    empty: 'You have not created a character yet.',
    upcoming:
      'Soon, you will be able to begin your adventure!',
    sessionError:
      'Your session could not be verified. Please sign in again.',
    loadError: 'Unable to load your character.',
    retry: 'Try Again',

    fields: {
      characterClass: 'Class',
      ancestry: 'Ancestry',
      background: 'Background',
      weapon: 'Weapon',
      artifact: 'Artifact',
      personality: 'Personality',
      aura: 'Aura',
      companion: 'Companion',
      motivation: 'Motivation',
    },
  },

  pt: {
    title: 'Meu personagem',
    loading: 'Carregando personagem...',
    empty: 'Você ainda não criou seu personagem.',
    upcoming:
      'Em breve, você poderá começar sua aventura!',
    sessionError:
      'Sua sessão não pôde ser validada. Entre novamente.',
    loadError:
      'Não foi possível carregar seu personagem.',
    retry: 'Tentar novamente',

    fields: {
      characterClass: 'Classe',
      ancestry: 'Ancestralidade',
      background: 'Origem',
      weapon: 'Arma',
      artifact: 'Artefato',
      personality: 'Personalidade',
      aura: 'Aura',
      companion: 'Companheiro',
      motivation: 'Motivação',
    },
  },
} as const

/* ==========================================
   PORTUGUESE OPTION LABELS
   ========================================== */

const portugueseOptionLabels: Record<
  Exclude<CharacterField, 'motivation'>,
  Record<string, string>
> = {
  characterClass: {
    warrior: 'Guerreiro',
    paladin: 'Paladino',
    mage: 'Mago',
    rogue: 'Ladino',
    ranger: 'Patrulheiro',
    druid: 'Druida',
    cleric: 'Clérigo',
    bard: 'Bardo',
  },

  ancestry: {
    human: 'Humano',
    elf: 'Elfo',
    dwarf: 'Anão',
    orc: 'Orc',
    fae: 'Feérico',
    construct: 'Construto',
  },

  background: {
    noble: 'Nobre',
    scholar: 'Estudioso',
    wanderer: 'Andarilho',
    guardian: 'Guardião',
    artisan: 'Artesão',
    outlaw: 'Fora da lei',
  },

  weapon: {
    sword: 'Espada',
    bow: 'Arco',
    staff: 'Cajado',
    dagger: 'Adaga',
    axe: 'Machado',
    spear: 'Lança',
    hammer: 'Martelo',
    wand: 'Varinha',
  },

  artifact: {
    'arcane-seal': 'Selo Arcano',
    'ancient-ring': 'Anel Antigo',
    'moon-crystal': 'Cristal Lunar',
    'runic-compass': 'Bússola Rúnica',
    'shadow-crown': 'Coroa Sombria',
    'phoenix-feather': 'Pena de Fênix',
    'chaos-orb': 'Orbe do Caos',
    'sun-relic': 'Relíquia Solar',

    /*
     * Legacy values remain available
     * for previously saved characters.
     */

    none: 'Nenhum',
    'emerald-amulet': 'Amuleto de Esmeralda',
  },

  personality: {
    brave: 'Corajoso',
    curious: 'Curioso',
    loyal: 'Leal',
    cunning: 'Astuto',
    kind: 'Gentil',
    stoic: 'Estoico',
    rebellious: 'Rebelde',
    mysterious: 'Misterioso',
  },

  aura: {
    fire: 'Fogo',
    ice: 'Gelo',
    nature: 'Natureza',
    shadow: 'Sombra',
    light: 'Luz',
    storm: 'Tempestade',
    arcane: 'Arcana',
    void: 'Vazio',
  },

  companion: {
    none: 'Nenhum',
    wolf: 'Lobo',
    owl: 'Coruja',
    cat: 'Gato',
    fox: 'Raposa',
    raven: 'Corvo',
    turtle: 'Tartaruga',
    dragon: 'Dragão',

    /*
     * Legacy companion value.
     */

    dragonling: 'Filhote de Dragão',
  },
}

/* ==========================================
   TRANSLATE CHARACTER OPTION
   ========================================== */

export function translateCharacterOption(
  language: Language,
  field: CharacterField,
  slug: string | null,
): string {
  /*
   * Characters saved before the six-stage
   * creator may not have a motivation.
   */

  if (slug == null) {
    return language === 'pt'
      ? 'Não informada'
      : 'Not provided'
  }

  /*
   * Reuse the official motivation
   * translations from Step 05.
   */

  if (field === 'motivation') {
    const motivation = motivationIds.find(
      (id) => id === slug,
    )

    return motivation
      ? translateMotivationOption(
          language,
          motivation,
        )
      : slug
  }

  /*
   * Portuguese option labels.
   */

  if (language === 'pt') {
    return portugueseOptionLabels[field][slug] ?? slug
  }

  /*
   * English labels are derived from
   * their stable identifiers.
   */

  return slug
    .split('-')
    .map((word) => {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      )
    })
    .join(' ')
}