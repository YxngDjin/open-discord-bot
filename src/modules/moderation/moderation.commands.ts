import { Injectable } from '@nestjs/common';
import {
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  type User,
} from 'discord.js';
import {
  Context,
  IntegerOption,
  Options,
  SlashCommand,
  type SlashCommandContext,
  StringOption,
  UserOption,
} from 'necord';
import { ModerationService } from './moderation.service.js';

export class TimeoutDto {
  @UserOption({
    name: 'user',
    description: 'The member to timeout',
    description_localizations: {
      de: 'Mitglied, der timeout bekommen soll',
    },
    required: true,
  })
  user: User;
  @IntegerOption({
    name: 'minutes',
    description: 'Minutes to timeout',
    description_localizations: {
      de: 'Minuten bis zum Timeout',
    },
    min_value: 1,
    max_value: 40320,
    required: true,
  })
  minutes: number;

  @StringOption({
    name: 'reason',
    description: 'The reason for the timeout',
    description_localizations: {
      de: 'Grund des Timeouts',
    },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class CasesDto {
  @UserOption({
    name: 'user',
    description: 'The member to get the cases of',
    description_localizations: {
      de: 'Mitglied, dessen Warnungen gezeigt werden sollen',
    },
    required: true,
  })
  user: User;
}

export class WarnDto {
  @UserOption({
    name: 'user',
    description: 'The member to warn',
    description_localizations: {
      de: 'Mitglied, der gewarnt werden soll',
    },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the warning',
    description_localizations: {
      de: 'Grund der Warnung',
    },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

@Injectable()
export class ModerationCommands {
  constructor(private readonly moderation: ModerationService) {}

  @SlashCommand({
    name: 'warn',
    description: 'Warn a member',
    descriptionLocalizations: {
      de: 'Mitglied warnen',
    },
    defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
    contexts: [InteractionContextType.Guild],
  })
  public async onWarn(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason }: WarnDto,
  ) {
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: 'Moderation is disabled on this server',
        flags: MessageFlags.Ephemeral,
      });
    }

    if (user.id === interaction.user.id || user.bot) {
      return interaction.reply({
        content: "You can't warn yourself or a bot.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const warnCase = await this.moderation.createCase({
      type: 'WARN',
      guildId,
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason,
    });

    return interaction.reply({
      content: `⚠️ **${user.username}** was warned. (Case #${warnCase.caseNumber})`,
    });
  }

  @SlashCommand({
    name: 'cases',
    description: 'Get the cases of a member',
    defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
    contexts: [InteractionContextType.Guild],
    descriptionLocalizations: { de: 'Warnungen eines Mitglieds anzeigen' },
  })
  public async listCases(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user }: CasesDto,
  ) {
    const guildId = interaction.guildId!;
    const cases = await this.moderation.listCases(guildId, user.id);
    if (cases.length === 0) {
      return interaction.reply({
        content: 'No cases found',
        flags: MessageFlags.Ephemeral,
      });
    }

    const lines = cases.map((c) => {
      const timestamp = Math.floor(c.createdAt.getTime() / 1000);
      return `**#${c.caseNumber}** ${c.type} • <t:${timestamp}:R> • by <@${c.moderatorId}> • ${c.reason ?? 'no reason'}`;
    });

    return interaction.reply({
      content: `**Cases for ${user.username}:**\n${lines.join('\n')}`,
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @SlashCommand({
    name: 'timeout',
    description: 'Timeout a member',
    defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
    contexts: [InteractionContextType.Guild],
    descriptionLocalizations: { de: 'Mitglied timeouten' },
  })
  public async onTimeout(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, minutes, reason }: TimeoutDto,
  ) {
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: 'Moderation is disabled on this server',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!interaction.inCachedGuild()) return;

    const target = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);
    if (!target) {
      return interaction.reply({
        content: 'Member not found',
        flags: MessageFlags.Ephemeral,
      });
    }

    const error = this.moderation.checkTarget(
      interaction.member,
      target,
      'timeout',
    );
    const targetErrors = {
      self: "You can't moderate yourself.",
      owner: "You can't moderate the server owner.",
      hierarchy: 'You can only moderate members below your highest role.',
      botCannot:
        "I can't do that. Check my permissions and make sure my role is above this member.",
    };

    if (error) {
      return interaction.reply({
        content: `You cannot timeout this member: ${targetErrors[error]}`,
        flags: MessageFlags.Ephemeral,
      });
    }

    await target.timeout(minutes * 60 * 1000, reason);

    const modCase = await this.moderation.createCase({
      type: 'TIMEOUT',
      guildId,
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason,
      durationSeconds: minutes * 60,
    });

    return interaction.reply({
      content: `⚠️ **${target.user.username}** was timed out for ${minutes} minute(s). (Case #${modCase.caseNumber})`,
    });
  }
}
