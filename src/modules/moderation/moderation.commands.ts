import { Injectable } from '@nestjs/common';
import {
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Context,
  createCommandGroupDecorator,
  Options,
  type SlashCommandContext,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { moderationTranslations } from './i18n/index.js';
import { ModerationService } from './moderation.service.js';
import {
  BanDto,
  CasesDto,
  KickDto,
  TimeoutDto,
  UnbanDto,
  WarnDto,
} from './dto/dto.js';

type Interaction = SlashCommandContext[0];

export const ModerationCommandsDecorator = createCommandGroupDecorator({
  name: 'mod',
  description: 'Moderation commands',
  descriptionLocalizations: { de: 'Moderationsbefehle' },
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
});

@Injectable()
@ModerationCommandsDecorator()
export class ModerationCommands {
  constructor(private readonly moderation: ModerationService) {}

  private translate(interaction: Interaction) {
    return moderationTranslations[resolveLocale(interaction.locale)];
  }

  @Subcommand({
    name: 'warn',
    description: 'Warn a member',
    descriptionLocalizations: { de: 'Mitglied verwarnen' },
  })
  public async onWarn(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason }: WarnDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (user.id === interaction.user.id || user.bot) {
      return interaction.reply({
        content: t.cannotWarnSelfOrBot,
        flags: MessageFlags.Ephemeral,
      });
    }

    const modCase = await this.moderation.createCase({
      type: 'WARN',
      guildId,
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason,
    });

    return interaction.reply({
      content: t.warned({
        user: user.username,
        caseNumber: modCase.caseNumber,
      }),
    });
  }

  @Subcommand({
    name: 'cases',
    description: 'Show the cases of a user',
    descriptionLocalizations: { de: 'Fälle eines Nutzers anzeigen' },
  })
  public async onCases(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user }: CasesDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }

    const cases = await this.moderation.listCases(guildId, user.id);
    if (cases.length === 0) {
      return interaction.reply({
        content: t.noCases({ user: user.username }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const lines = cases.map((c) => {
      const timestamp = Math.floor(c.createdAt.getTime() / 1000);
      return `**#${c.caseNumber}** ${t.caseTypes[c.type]} • <t:${timestamp}:R> • ${t.by} <@${c.moderatorId}> • ${c.reason ?? t.noReason}`;
    });

    return interaction.reply({
      content: `${t.casesTitle({ user: user.username })}\n${lines.join('\n')}`,
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'timeout',
    description: 'Timeout a member',
    descriptionLocalizations: { de: 'Mitglied stummschalten' },
  })
  public async onTimeout(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, minutes, reason }: TimeoutDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!interaction.inCachedGuild()) return;

    const target = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);
    if (!target) {
      return interaction.reply({
        content: t.memberNotFound,
        flags: MessageFlags.Ephemeral,
      });
    }

    const error = this.moderation.checkTarget(
      interaction.member,
      target,
      'timeout',
    );
    if (error) {
      return interaction.reply({
        content: t.targetErrors[error],
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
      content: t.timedOut({
        user: user.username,
        minutes,
        caseNumber: modCase.caseNumber,
      }),
    });
  }

  @Subcommand({
    name: 'kick',
    description: 'Kick a member',
    descriptionLocalizations: { de: 'Mitglied kicken' },
  })
  public async onKick(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason }: KickDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!interaction.inCachedGuild()) return;

    const target = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);
    if (!target) {
      return interaction.reply({
        content: t.memberNotFound,
        flags: MessageFlags.Ephemeral,
      });
    }

    const error = this.moderation.checkTarget(
      interaction.member,
      target,
      'kick',
    );
    if (error) {
      return interaction.reply({
        content: t.targetErrors[error],
        flags: MessageFlags.Ephemeral,
      });
    }

    await target.kick(reason);

    const modCase = await this.moderation.createCase({
      type: 'KICK',
      guildId,
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason,
    });

    return interaction.reply({
      content: t.kicked({
        user: user.username,
        caseNumber: modCase.caseNumber,
      }),
    });
  }

  @Subcommand({
    name: 'ban',
    description: 'Ban a user',
    descriptionLocalizations: { de: 'Nutzer bannen' },
  })
  public async onBan(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason, delete_days }: BanDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!interaction.inCachedGuild()) return;

    const target = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (target) {
      const error = this.moderation.checkTarget(
        interaction.member,
        target,
        'ban',
      );
      if (error) {
        return interaction.reply({
          content: t.targetErrors[error],
          flags: MessageFlags.Ephemeral,
        });
      }
    } else if (!this.moderation.hasPermission(interaction.member, 'ban')) {
      return interaction.reply({
        content: t.targetErrors.noPermission,
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.guild.members.ban(user.id, {
      reason,
      deleteMessageSeconds: (delete_days ?? 0) * 24 * 60 * 60,
    });

    const modCase = await this.moderation.createCase({
      type: 'BAN',
      guildId,
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason,
    });

    return interaction.reply({
      content: t.banned({
        user: user.username,
        caseNumber: modCase.caseNumber,
      }),
    });
  }

  @Subcommand({
    name: 'unban',
    description: 'Unban a user',
    descriptionLocalizations: { de: 'Nutzer entbannen' },
  })
  public async onUnban(
    @Context() [interaction]: SlashCommandContext,
    @Options() { user, reason }: UnbanDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    if (!(await this.moderation.isEnabled(guildId))) {
      return interaction.reply({
        content: t.moduleDisabled,
        flags: MessageFlags.Ephemeral,
      });
    }
    if (!interaction.inCachedGuild()) return;

    if (!this.moderation.hasPermission(interaction.member, 'ban')) {
      return interaction.reply({
        content: t.targetErrors.noPermission,
        flags: MessageFlags.Ephemeral,
      });
    }

    const ban = await interaction.guild.bans.fetch(user.id).catch(() => null);
    if (!ban) {
      return interaction.reply({
        content: t.notBanned({ user: user.username }),
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.guild.bans.remove(user.id, reason);

    const modCase = await this.moderation.createCase({
      type: 'UNBAN',
      guildId,
      targetId: user.id,
      moderatorId: interaction.user.id,
      reason,
    });

    return interaction.reply({
      content: t.unbanned({
        user: user.username,
        caseNumber: modCase.caseNumber,
      }),
    });
  }
}
