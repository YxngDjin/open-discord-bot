import type { CaseType } from '../../../generated/prisma/enums.js';

export const en = {
  moduleDisabled: 'Moderation is disabled on this server.',
  memberNotFound: 'This user is not a member of this server.',
  cannotWarnSelfOrBot: "You can't warn yourself or a bot.",

  targetErrors: {
    self: "You can't moderate yourself.",
    owner: "You can't moderate the server owner.",
    hierarchy: 'You can only moderate members below your highest role.',
    botCannot:
      "I can't do that. Check my permissions and make sure my role is above this member.",
    noPermission: "You don't have permission to do that.",
  },

  caseTypes: {
    WARN: 'Warning',
    TIMEOUT: 'Timeout',
    KICK: 'Kick',
    BAN: 'Ban',
    UNBAN: 'Unban',
  } satisfies Record<CaseType, string>,

  warned: (params: { user: string; caseNumber: number }) =>
    `⚠️ **${params.user}** was warned. (Case #${params.caseNumber})`,
  timedOut: (params: { user: string; minutes: number; caseNumber: number }) =>
    `🔇 **${params.user}** was timed out for ${params.minutes} minute(s). (Case #${params.caseNumber})`,
  kicked: (params: { user: string; caseNumber: number }) =>
    `👢 **${params.user}** was kicked. (Case #${params.caseNumber})`,
  banned: (params: { user: string; caseNumber: number }) =>
    `🔨 **${params.user}** was banned. (Case #${params.caseNumber})`,
  unbanned: (params: { user: string; caseNumber: number }) =>
    `✅ **${params.user}** was unbanned. (Case #${params.caseNumber})`,
  notBanned: (params: { user: string }) => `**${params.user}** is not banned.`,

  noCases: (params: { user: string }) => `No cases for **${params.user}**.`,
  casesTitle: (params: { user: string }) => `**Cases for ${params.user}:**`,
  by: 'by',
  noReason: 'no reason',
};

export type ModerationTranslations = typeof en;
