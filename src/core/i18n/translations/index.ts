import type { SupportedLocale } from '../locales.js';
import { de } from './de.js';
import { en, type LanguageCommandTranslations } from './en.js';

export const languageCommandsTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, LanguageCommandTranslations>;
