import type { Language } from './authTranslations'

/*
 * ADVENTURE FILES
 * MOTIVATION TRANSLATIONS
 *
 * Motivation is introduced in Step 05 — Journey.
 *
 * These identifiers remain stable regardless
 * of the selected interface language.
 *
 * API and database integration will follow
 * when character saving is implemented.
 */

export const motivationIds = [
  'protection',
  'freedom',
  'justice',
  'redemption',
  'glory',
  'knowledge',
  'revenge',
  'adventure',
] as const

export type CharacterMotivation =
  (typeof motivationIds)[number]

const motivationLabels: Record<
  Language,
  Record<CharacterMotivation, string>
> = {
  pt: {
    protection: 'Proteção',
    freedom: 'Liberdade',
    justice: 'Justiça',
    redemption: 'Redenção',
    glory: 'Glória',
    knowledge: 'Conhecimento',
    revenge: 'Vingança',
    adventure: 'Aventura',
  },

  en: {
    protection: 'Protection',
    freedom: 'Freedom',
    justice: 'Justice',
    redemption: 'Redemption',
    glory: 'Glory',
    knowledge: 'Knowledge',
    revenge: 'Revenge',
    adventure: 'Adventure',
  },
}

export function translateMotivationOption(
  language: Language,
  motivation: CharacterMotivation,
): string {
  return motivationLabels[language][motivation]
}