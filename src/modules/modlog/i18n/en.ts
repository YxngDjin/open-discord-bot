import type { CaseType } from '../../../generated/prisma/enums.js';

export const en = {
  // Moderation cases (log channel, server language)
  caseTypes: {
    WARN: 'Warning',
    TIMEOUT: 'Timeout',
    KICK: 'Kick',
    BAN: 'Ban',
    UNBAN: 'Unban',
  } satisfies Record<CaseType, string>,

  caseTitle: (params: { caseNumber: number; type: string }) =>
    `Case #${params.caseNumber} • ${params.type}`,

  fields: {
    user: 'User',
    moderator: 'Moderator',
    reason: 'Reason',
    duration: 'Duration',
    accountCreated: 'Account created',
    joinedServer: 'Joined server',
    memberCount: 'Members',
  },
  noReason: 'No reason given',
  unknown: 'unknown',
  minutes: (params: { minutes: number }) => `${params.minutes} minute(s)`,

  // Joins and leaves (log channel, server language)
  memberJoined: '📥 Member joined',
  memberLeft: '📤 Member left',

  // /modlog (admin, user language)
  admin: {
    show: {
      channel: 'Log channel',
      moderation: 'Moderation cases',
      joins: 'Joins',
      leaves: 'Leaves',
      notSet: 'not set',
      enabled: 'enabled',
      disabled: 'disabled',
    },
    channelSet: (params: { channel: string }) =>
      `✅ Log channel set to ${params.channel}.`,
    channelRemoved: '✅ Log channel removed. Nothing will be logged.',
    events: {
      moderation: 'Moderation cases',
      joins: 'Joins',
      leaves: 'Leaves',
    },
    toggled: (params: { event: string; enabled: boolean }) =>
      `✅ ${params.event} will ${params.enabled ? 'now' : 'no longer'} be logged.`,
  },
};

export type ModlogTranslations = typeof en;
