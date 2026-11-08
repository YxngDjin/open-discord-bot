import type { SupportedLocale } from '../locales.js';
import { de } from './de.js';
import { en, type Translations } from './en.js';

export type { Translations };

/** All texts of the bot, one entry per language. */
export const translations = {
  en,
  de,
} satisfies Record<SupportedLocale, Translations>;
