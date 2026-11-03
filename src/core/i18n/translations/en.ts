export const en = {
  current: (params: { language: string }) =>
    `The server language is **${params.language}**.`,
  changed: (params: { language: string }) =>
    `The server language has been changed to **${params.language}**.`,
};

export type LanguageCommandTranslations = typeof en;
