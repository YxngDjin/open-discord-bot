import type { SupportedLocale } from '../../core/i18n/locales.js';
import { xpTranslations } from './i18n/index.js';
import { levelFromXp } from './xp.formula.js';

export const renderLeaderboard = (
  entries: { userId: string; xp: number }[],
  locale: SupportedLocale,
): string => {
  const t = xpTranslations[locale];

  const lines = entries.map((entry, index) =>
    t.leaderboardLine({
      position: index + 1,
      user: `<@${entry.userId}>`,
      level: levelFromXp(entry.xp),
      xp: entry.xp.toLocaleString(locale),
    }),
  );

  return `${t.leaderboardTitle}\n${lines.join('\n')}`;
};
