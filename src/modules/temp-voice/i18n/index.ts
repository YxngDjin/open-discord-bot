import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type TempVoiceTranslations } from './en.js';

export const tempVoiceTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, TempVoiceTranslations>;
