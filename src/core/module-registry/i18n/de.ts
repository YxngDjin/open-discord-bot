import type { ModuleCommandsTranslations } from './en.js';

export const de = {
  noModules: 'Keine Module verfügbar.',
  enabled: (params: { module: string }) =>
    `✅ Modul **${params.module}** aktiviert.`,
  disabled: (params: { module: string }) =>
    `❌ Modul **${params.module}** deaktiviert.`,
  missingModule: (params: { module: string }) =>
    `Modul **${params.module}** existiert nicht.`,
} satisfies ModuleCommandsTranslations;
