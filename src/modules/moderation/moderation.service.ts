import { Injectable } from '@nestjs/common';
import type { CaseType } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../core/database/prisma.service.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { moderationModule } from './moderation.definition.js';
import type { GuildMember } from 'discord.js';

export type CreateCaseInput = {
  guildId: string;
  type: CaseType;
  targetId: string;
  moderatorId: string;
  reason?: string;
  durationSeconds?: number;
};

export type ModAction = 'timeout' | 'kick' | 'ban';
export type TargetError =
  'self' | 'owner' | 'hierarchy' | 'botCannot' | 'noPermission';

@Injectable()
export class ModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleSettings: ModuleSettingsService,
  ) {}

  async createCase(input: CreateCaseInput) {
    return this.prisma.$transaction(async (tx) => {
      const counter = await tx.moderationCounter.upsert({
        where: { guildId: input.guildId },
        create: { guildId: input.guildId, lastCaseNumber: 1 },
        update: { lastCaseNumber: { increment: 1 } },
      });

      return tx.moderationCase.create({
        data: {
          ...input,
          caseNumber: counter.lastCaseNumber,
        },
      });
    });
  }

  async listCases(guildId: string, targetId: string) {
    return this.prisma.moderationCase.findMany({
      where: { guildId, targetId },
      orderBy: { caseNumber: 'desc' },
      take: 10,
    });
  }

  async isEnabled(guildId: string) {
    return this.moduleSettings.isEnabled(guildId, moderationModule.key);
  }

  hasPermission(moderator: GuildMember, action: ModAction): boolean {
    return {
      timeout: moderator.permissions.has('ModerateMembers'),
      kick: moderator.permissions.has('KickMembers'),
      ban: moderator.permissions.has('BanMembers'),
    }[action];
  }

  checkTarget(
    moderator: GuildMember,
    target: GuildMember,
    action: ModAction,
  ): TargetError | null {
    if (!this.hasPermission(moderator, action)) {
      return 'noPermission';
    }

    if (moderator.id === target.id) {
      return 'self';
    }

    if (target.id === target.guild.ownerId) {
      return 'owner';
    }

    const moderatorIsOwner = moderator.id === target.guild.ownerId;
    if (
      !moderatorIsOwner &&
      moderator.roles.highest.comparePositionTo(target.roles.highest) <= 0
    ) {
      return 'hierarchy';
    }

    const botCan = {
      timeout: target.moderatable,
      kick: target.kickable,
      ban: target.bannable,
    }[action];

    if (!botCan) {
      return 'botCannot';
    }

    return null;
  }
}
