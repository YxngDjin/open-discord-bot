import type { LanguageCommandTranslations } from './en.js';

export const de = {
  current: (params: { language: string }) =>
    `Die Server-Sprache ist **${params.language}**.`,
  changed: (params: { language: string }) =>
    `Die Server-Sprache wurde auf **${params.language}** geändert.`,

  // /timezone (admin, user language)
  timezoneCurrent: (params: { timezone: string; time: string }) =>
    `🕒 Die Zeitzone des Servers ist **${params.timezone}**. Dort ist es gerade ${params.time}.`,
  timezoneChanged: (params: { timezone: string; time: string }) =>
    `✅ Zeitzone auf **${params.timezone}** gesetzt. Dort ist es gerade ${params.time}.`,
  timezoneInvalid: (params: { timezone: string }) =>
    `❌ **${params.timezone}** ist keine gültige Zeitzone. Wähle eine aus den Vorschlägen.`,
} satisfies LanguageCommandTranslations;
