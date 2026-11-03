import type { SupportedLocale } from '../../i18n/locales.js';
import { de } from './de.js';
import { en, type ModuleCommandsTranslations } from './en.js';

export const moduleCommandsTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, ModuleCommandsTranslations>;
