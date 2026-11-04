export const en = {
  // Level-up message (public, server language)
  levelUp: (params: { user: string; level: number }) =>
    `🎉 ${params.user} reached **level ${params.level}**!`,

  // General
  moduleDisabled: 'The XP module is disabled on this server.',

  // /rank
  noXp: (params: { user: string }) => `**${params.user}** has no XP yet.`,
  rankTitle: (params: { user: string }) => `📊 **${params.user}**`,
  rankLevel: (params: { level: number; rank: number }) =>
    `Level ${params.level} • Rank #${params.rank}`,
  rankProgress: (params: { bar: string; current: string; needed: string }) =>
    `${params.bar} ${params.current} / ${params.needed} XP`,
  rankStats: (params: { messages: string; minutes: string }) =>
    `💬 ${params.messages} messages • 🎙️ ${params.minutes} minutes in voice`,

  // /leaderboard
  leaderboardTitle: '🏆 **Leaderboard**',
  leaderboardEmpty: 'Nobody has earned XP on this server yet.',
  leaderboardLine: (params: {
    position: number;
    user: string;
    level: number;
    xp: string;
  }) =>
    `**${params.position}.** ${params.user} • Level ${params.level} • ${params.xp} XP`,
  // /xp (admin settings)
  admin: {
    show: {
      messageXp: 'XP per message',
      cooldown: 'Message cooldown',
      voiceXp: 'XP per voice minute',
      ignoredChannels: 'Ignored channels',
      levelUpMessages: 'Level-up messages',
      levelRoles: 'Level roles',
      none: 'none',
      off: 'off',
      enabled: 'enabled',
      disabled: 'disabled',
      sameChannel: 'in the same channel',
    },
    messageXpSet: (params: { amount: number }) =>
      params.amount === 0
        ? '✅ Members no longer get XP for messages.'
        : `✅ Members now get **${params.amount} XP** per message.`,
    cooldownSet: (params: { seconds: number }) =>
      `✅ Message cooldown set to **${params.seconds} second(s)**.`,
    voiceXpSet: (params: { amount: number }) =>
      params.amount === 0
        ? '✅ Members no longer get XP in voice channels.'
        : `✅ Members now get **${params.amount} XP** per minute in voice.`,
    channelIgnored: (params: { channel: string }) =>
      `✅ ${params.channel} is now ignored. Activity there gives no XP.`,
    channelUnignored: (params: { channel: string }) =>
      `✅ ${params.channel} is no longer ignored.`,
    levelUpEnabledSame:
      '✅ Level-up messages are enabled and sent in the channel where the member wrote.',
    levelUpEnabledIn: (params: { channel: string }) =>
      `✅ Level-up messages are enabled and sent in ${params.channel}.`,
    levelUpDisabled: '✅ Level-up messages are disabled.',
    roleNotEditable: (params: { role: string }) =>
      `I can't assign ${params.role}. Make sure I have the **Manage Roles** permission and my role is above it in the role list.`,
    roleSet: (params: { level: number; role: string }) =>
      `✅ Members now get ${params.role} at **level ${params.level}**.`,
    roleRemoved: (params: { level: number }) =>
      `✅ The level role for **level ${params.level}** was removed.`,
    roleNotFound: (params: { level: number }) =>
      `There is no level role for **level ${params.level}**.`,
  },
};

export type XpTranslations = typeof en;
