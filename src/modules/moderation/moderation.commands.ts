import { Injectable } from '@nestjs/common';
import {
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  type User,
} from 'discord.js';
import {
  Context,
  createCommandGroupDecorator,
  IntegerOption,
  Options,
  type SlashCommandContext,
  StringOption,
  Subcommand,
  UserOption,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { moderationTranslations } from './i18n/index.js';
import { ModerationService } from './moderation.service.js';

type Interaction = SlashCommandContext[0];

export class WarnDto {
  @UserOption({
    name: 'user',
    description: 'The member to warn',
    description_localizations: { de: 'Mitglied, das verwarnt werden soll' },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the warning',
    description_localizations: { de: 'Grund der Verwarnung' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class CasesDto {
  @UserOption({
    name: 'user',
    description: 'The user to show the cases of',
    description_localizations: {
      de: 'Nutzer, dessen Fälle angezeigt werden sollen',
    },
    required: true,
  })
  user: User;
}

export class TimeoutDto {
  @UserOption({
    name: 'user',
    description: 'The member to timeout',
    description_localizations: {
      de: 'Mitglied, das stummgeschaltet werden soll',
    },
    required: true,
  })
  user: User;

  @IntegerOption({
    name: 'minutes',
    description: 'Duration of the timeout in minutes',
    description_localizations: { de: 'Dauer des Timeouts in Minuten' },
    min_value: 1,
    max_value: 40320,
    required: true,
  })
  minutes: number;

  @StringOption({
    name: 'reason',
    description: 'The reason for the timeout',
    description_localizations: { de: 'Grund des Timeouts' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class KickDto {
  @UserOption({
    name: 'user',
    description: 'The member to kick',
    description_localizations: { de: 'Mitglied, das gekickt werden soll' },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the kick',
    description_localizations: { de: 'Grund des Kicks' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class BanDto {
  @UserOption({
    name: 'user',
    description: 'The user to ban (also works for non-members)',
    description_localizations: {
      de: 'Nutzer, der gebannt werden soll (auch Nicht-Mitglieder)',
    },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the ban',
    description_localizations: { de: 'Grund des Banns' },
    required: false,
    max_length: 512,
  })
  reason?: string;

  @IntegerOption({
    name: 'delete_days',
    description: 'Delete messages from the last X days',
    description_localizations: { de: 'Nachrichten der letzten X Tage löschen' },
    min_value: 0,
    max_value: 7,
    required: false,
  })
  delete_days?: number;
}

export class UnbanDto {
  @UserOption({
    name: 'user',
    description: 'The user to unban (paste the user ID)',
    description_localizations: {
      de: 'Nutzer, der entbannt werden soll (User-ID einfügen)',
    },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the unban',
    description_localizations: { de: 'Grund der Entbannung' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

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
