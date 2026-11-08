import type { SupportedLocale } from '../../i18n/locales.js';
import { de } from './de.js';
import { en, type ErrorFilterTranslations } from './en.js';

export const errorFilterTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, ErrorFilterTranslations>;
