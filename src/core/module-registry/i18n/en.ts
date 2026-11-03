export const en = {
  noModules: 'No modules available.',
  enabled: (params: { module: string }) =>
    `✅ Module **${params.module}** enabled.`,
  disabled: (params: { module: string }) =>
    `❌ Module **${params.module}** disabled.`,
  missingModule: (params: { module: string }) =>
    `Module **${params.module}** does not exist.`,
};

export type ModuleCommandsTranslations = typeof en;
