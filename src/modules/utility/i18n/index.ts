import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type UtilityTranslations } from './en.js';

export const utilityTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, UtilityTranslations>;
