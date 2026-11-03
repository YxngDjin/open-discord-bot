import type { SupportedLocale } from '../../../core/i18n/locales.js';
import { de } from './de.js';
import { en, type WelcomeModuleTranslations } from './en.js';

export const welcomeModuleTranslations = {
  en,
  de,
} satisfies Record<SupportedLocale, WelcomeModuleTranslations>;
