import type { Language } from './authTranslations'

export const characterFieldKeys = [
  'characterClass',
  'ancestry',
  'background',
  'weapon',
  'artifact',
  'personality',
  'aura',
  'companion',
] as const

export type CharacterField =
  (typeof characterFieldKeys)[number]

export const characterTranslations = {
  en: {
    title: 'My Character',
    loading: 'Loading character...',
    empty: 'You have not created a character yet.',
    upcoming: 'Soon, you will be able to begin your adventure!',
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
    loadError: 'Não foi possível carregar seu personagem.',
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
    },
  },
} as const

const portugueseOptionLabels: Record<
  CharacterField,
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
    none: 'Nenhum',
    'emerald-amulet': 'Amuleto de Esmeralda',
    'ancient-ring': 'Anel Antigo',
    'moon-crystal': 'Cristal Lunar',
    'runic-compass': 'Bússola Rúnica',
    'forgotten-tome': 'Tomo Esquecido',
    'phoenix-feather': 'Pena de Fênix',
    'timeworn-key': 'Chave Desgastada pelo Tempo',
    'sun-relic': 'Relíquia Solar',
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
    dragonling: 'Filhote de Dragão',
  },
}

export function translateCharacterOption(
  language: Language,
  field: CharacterField,
  slug: string,
): string {
  if (language === 'pt') {
    return portugueseOptionLabels[field][slug] ?? slug
  }

  return slug
    .split('-')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}