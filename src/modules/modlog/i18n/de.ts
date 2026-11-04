import type { ModlogTranslations } from './en.js';

export const de = {
  // Moderation cases (log channel, server language)
  caseTypes: {
    WARN: 'Verwarnung',
    TIMEOUT: 'Timeout',
    KICK: 'Kick',
    BAN: 'Bann',
    UNBAN: 'Entbannung',
  },

  caseTitle: (params: { caseNumber: number; type: string }) =>
    `Fall #${params.caseNumber} • ${params.type}`,

  fields: {
    user: 'Nutzer',
    moderator: 'Moderator',
    reason: 'Grund',
    duration: 'Dauer',
    accountCreated: 'Konto erstellt',
    joinedServer: 'Server beigetreten',
    memberCount: 'Mitglieder',
  },
  noReason: 'Kein Grund angegeben',
  unknown: 'unbekannt',
  minutes: (params: { minutes: number }) => `${params.minutes} Minute(n)`,

  // Joins and leaves (log channel, server language)
  memberJoined: '📥 Mitglied beigetreten',
  memberLeft: '📤 Mitglied hat den Server verlassen',

  // /modlog (admin, user language)
  admin: {
    show: {
      channel: 'Log-Channel',
      moderation: 'Moderationsfälle',
      joins: 'Beitritte',
      leaves: 'Austritte',
      notSet: 'nicht gesetzt',
      enabled: 'aktiviert',
      disabled: 'deaktiviert',
    },
    channelSet: (params: { channel: string }) =>
      `✅ Log-Channel auf ${params.channel} gesetzt.`,
    channelRemoved: '✅ Log-Channel entfernt. Es wird nichts mehr geloggt.',
    events: {
      moderation: 'Moderationsfälle',
      joins: 'Beitritte',
      leaves: 'Austritte',
    },
    toggled: (params: { event: string; enabled: boolean }) =>
      `✅ ${params.event} werden ${params.enabled ? 'jetzt' : 'nicht mehr'} geloggt.`,
  },
} satisfies ModlogTranslations;
