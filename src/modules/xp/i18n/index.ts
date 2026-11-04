import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type XpTranslations } from './en.js';

export const xpTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, XpTranslations>;
