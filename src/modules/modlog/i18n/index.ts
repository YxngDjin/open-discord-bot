import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type ModlogTranslations } from './en.js';

export const modlogTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, ModlogTranslations>;
