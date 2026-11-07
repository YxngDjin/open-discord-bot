import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type SelfRolesTranslations } from './en.js';

export const selfRolesTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, SelfRolesTranslations>;
