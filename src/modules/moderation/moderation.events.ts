import type { CaseType } from '../../generated/prisma/enums.js';

export const MODERATION_CASE_CREATED = 'moderation.case.created';

export type ModerationCaseCreatedEvent = {
  guildId: string;
  caseNumber: number;
  type: CaseType;
  targetId: string;
  moderatorId: string;
  reason?: string;
  durationSeconds?: number;
};
