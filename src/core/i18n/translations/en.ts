export const en = {
  current: (params: { language: string }) =>
    `The server language is **${params.language}**.`,
  changed: (params: { language: string }) =>
    `The server language has been changed to **${params.language}**.`,

  // /timezone (admin, user language)
  timezoneCurrent: (params: { timezone: string; time: string }) =>
    `🕒 The server time zone is **${params.timezone}**. It is ${params.time} there.`,
  timezoneChanged: (params: { timezone: string; time: string }) =>
    `✅ Time zone set to **${params.timezone}**. It is ${params.time} there.`,
  timezoneInvalid: (params: { timezone: string }) =>
    `❌ **${params.timezone}** is not a valid time zone. Pick one from the suggestions.`,
};

export type LanguageCommandTranslations = typeof en;
