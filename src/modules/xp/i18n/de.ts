import type { XpTranslations } from './en.js';

export const de = {
  levelUp: (params: { user: string; level: number }) =>
    `🎉 ${params.user} hat **Level ${params.level}** erreicht!`,
} satisfies XpTranslations;
