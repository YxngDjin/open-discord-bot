import type { LanguageCommandTranslations } from './en.js';

export const de = {
  current: (params: { language: string }) =>
    `Die Server-Sprache ist **${params.language}**.`,
  changed: (params: { language: string }) =>
    `Die Server-Sprache wurde auf **${params.language}** geändert.`,
} satisfies LanguageCommandTranslations;
