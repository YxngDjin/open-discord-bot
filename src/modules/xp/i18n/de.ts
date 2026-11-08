import type { XpTranslations } from './en.js';

export const de = {
  // Level-up message (public, server language)
  levelUp: (params: { user: string; level: number }) =>
    `🎉 ${params.user} hat **Level ${params.level}** erreicht!`,

  // General
  moduleDisabled: 'Das XP-Modul ist auf diesem Server deaktiviert.',

  // /rank
  noXp: (params: { user: string }) => `**${params.user}** hat noch keine XP.`,
  rankTitle: (params: { user: string }) => `📊 **${params.user}**`,
  rankLevel: (params: { level: number; rank: number }) =>
    `Level ${params.level} • Platz #${params.rank}`,
  rankProgress: (params: { bar: string; current: string; needed: string }) =>
    `${params.bar} ${params.current} / ${params.needed} XP`,
  rankStats: (params: { messages: string; minutes: string }) =>
    `💬 ${params.messages} Nachrichten • 🎙️ ${params.minutes} Minuten Voice`,

  // /leaderboard
  leaderboardTitle: '🏆 **Bestenliste**',
  leaderboardEmpty: 'Auf diesem Server hat noch niemand XP gesammelt.',
  // Small grey line below the automatic leaderboard (server language)
  leaderboardUpdated: (params: { time: string }) =>
    `-# Aktualisiert ${params.time}`,
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
      messageXp: 'XP pro Nachricht',
      cooldown: 'Cooldown für Nachrichten',
      voiceXp: 'XP pro Voice-Minute',
      ignoredChannels: 'Ignorierte Channels',
      levelUpMessages: 'Level-Up-Nachrichten',
      levelRoles: 'Level-Rollen',
      none: 'keine',
      off: 'aus',
      enabled: 'aktiviert',
      disabled: 'deaktiviert',
      sameChannel: 'im selben Channel',
      dailyLeaderboard: 'Tägliche Bestenliste',
      dailyAt: (params: { channel: string; time: string; timezone: string }) =>
        `${params.channel} um ${params.time} (${params.timezone})`,
    },
    messageXpSet: (params: { amount: number }) =>
      params.amount === 0
        ? '✅ Mitglieder bekommen keine XP mehr für Nachrichten.'
        : `✅ Mitglieder bekommen jetzt **${params.amount} XP** pro Nachricht.`,
    cooldownSet: (params: { seconds: number }) =>
      `✅ Cooldown für Nachrichten auf **${params.seconds} Sekunde(n)** gesetzt.`,
    voiceXpSet: (params: { amount: number }) =>
      params.amount === 0
        ? '✅ Mitglieder bekommen keine XP mehr in Voice-Channels.'
        : `✅ Mitglieder bekommen jetzt **${params.amount} XP** pro Minute in Voice.`,
    channelIgnored: (params: { channel: string }) =>
      `✅ ${params.channel} wird jetzt ignoriert. Aktivität dort bringt keine XP.`,
    channelUnignored: (params: { channel: string }) =>
      `✅ ${params.channel} wird nicht mehr ignoriert.`,
    levelUpEnabledSame:
      '✅ Level-Up-Nachrichten sind aktiviert und erscheinen im Channel, in dem das Mitglied geschrieben hat.',
    levelUpEnabledIn: (params: { channel: string }) =>
      `✅ Level-Up-Nachrichten sind aktiviert und erscheinen in ${params.channel}.`,
    levelUpDisabled: '✅ Level-Up-Nachrichten sind deaktiviert.',
    roleNotEditable: (params: { role: string }) =>
      `Ich kann ${params.role} nicht vergeben. Stell sicher, dass ich die Berechtigung **Rollen verwalten** habe und meine Rolle in der Rollenliste darüber steht.`,
    roleSet: (params: { level: number; role: string }) =>
      `✅ Mitglieder bekommen ab **Level ${params.level}** die Rolle ${params.role}.`,
    roleRemoved: (params: { level: number }) =>
      `✅ Die Level-Rolle für **Level ${params.level}** wurde entfernt.`,
    roleNotFound: (params: { level: number }) =>
      `Für **Level ${params.level}** gibt es keine Level-Rolle.`,
    leaderboardChannelSet: (params: {
      channel: string;
      time: string;
      timezone: string;
    }) =>
      `✅ Die Bestenliste wird jeden Tag um **${params.time}** (${params.timezone}) in ${params.channel} aktualisiert.\n` +
      'Die Uhrzeit änderst du mit `/xp leaderboard-time`, die Zeitzone mit `/timezone`.',
    leaderboardChannelRemoved: '✅ Die tägliche Bestenliste ist ausgeschaltet.',
    leaderboardMissingPermissions:
      '⚠️ Ich kann in diesem Channel keine Nachrichten senden. Gib mir dort **Kanal ansehen** und **Nachrichten senden**.',
    leaderboardTimeSet: (params: { time: string; timezone: string }) =>
      `✅ Die Bestenliste wird jeden Tag um **${params.time}** (${params.timezone}) aktualisiert.`,
    leaderboardTimeInvalid: (params: { time: string }) =>
      `❌ **${params.time}** ist keine gültige Uhrzeit. Nutze das Format HH:MM, z. B. 18:00 oder 09:30.`,
  },
} satisfies XpTranslations;
