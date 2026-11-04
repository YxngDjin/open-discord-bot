import type { ModerationTranslations } from './en.js';

export const de = {
  moduleDisabled: 'Moderation ist auf diesem Server deaktiviert.',
  memberNotFound: 'Dieser Nutzer ist kein Mitglied dieses Servers.',
  cannotWarnSelfOrBot: 'Du kannst dich selbst oder einen Bot nicht verwarnen.',

  targetErrors: {
    self: 'Du kannst dich nicht selbst moderieren.',
    owner: 'Du kannst den Server-Besitzer nicht moderieren.',
    hierarchy:
      'Du kannst nur Mitglieder unterhalb deiner höchsten Rolle moderieren.',
    botCannot:
      'Das kann ich nicht. Prüfe meine Berechtigungen und ob meine Rolle über diesem Mitglied steht.',
    noPermission: 'Dazu hast du keine Berechtigung.',
  },

  caseTypes: {
    WARN: 'Verwarnung',
    TIMEOUT: 'Timeout',
    KICK: 'Kick',
    BAN: 'Bann',
    UNBAN: 'Entbannung',
  },

  warned: (params: { user: string; caseNumber: number }) =>
    `⚠️ **${params.user}** wurde verwarnt. (Fall #${params.caseNumber})`,
  timedOut: (params: { user: string; minutes: number; caseNumber: number }) =>
    `🔇 **${params.user}** wurde für ${params.minutes} Minute(n) stummgeschaltet. (Fall #${params.caseNumber})`,
  kicked: (params: { user: string; caseNumber: number }) =>
    `👢 **${params.user}** wurde gekickt. (Fall #${params.caseNumber})`,
  banned: (params: { user: string; caseNumber: number }) =>
    `🔨 **${params.user}** wurde gebannt. (Fall #${params.caseNumber})`,
  unbanned: (params: { user: string; caseNumber: number }) =>
    `✅ **${params.user}** wurde entbannt. (Fall #${params.caseNumber})`,
  notBanned: (params: { user: string }) =>
    `**${params.user}** ist nicht gebannt.`,

  noCases: (params: { user: string }) => `Keine Fälle für **${params.user}**.`,
  casesTitle: (params: { user: string }) => `**Fälle von ${params.user}:**`,
  by: 'von',
  noReason: 'kein Grund',
} satisfies ModerationTranslations;
