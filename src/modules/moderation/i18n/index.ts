import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type ModerationTranslations } from './en.js';

export const moderationTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, ModerationTranslations>;
