export const en = {
  levelUp: (params: { user: string; level: number }) =>
    `🎉 ${params.user} reached **level ${params.level}**!`,
};

export type XpTranslations = typeof en;
