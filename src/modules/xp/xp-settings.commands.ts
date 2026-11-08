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
import { I18nService } from '../../core/i18n/i18n.service.js';
import { resolveLocale } from '../../core/i18n/locales.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { xpModule, xpSettingsSchema } from './xp.definition.js';
import { describeCommand } from '../../core/i18n/localize.js';
import { translations } from '../../core/i18n/translations/index.js';
import {
  XpAmountDto,
  XpCooldownDto,
  XpIgnoreChannelDto,
  XpLeaderboardChannelDto,
  XpLeaderboardTimeDto,
  XpLevelUpDto,
  XpRoleAddDto,
  XpRoleRemoveDto,
} from './dto/dto.js';

type Interaction = SlashCommandContext[0];

export const XpSettingsCommandsDecorator = createCommandGroupDecorator({
  name: 'xp',
  ...describeCommand((t) => t.xp.commands.settings.group),
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

@Injectable()
@XpSettingsCommandsDecorator()
export class XpSettingsCommands {
  constructor(
    private readonly settings: ModuleSettingsService,
    private readonly i18n: I18nService,
  ) {}

  private translate(interaction: Interaction) {
    return translations[resolveLocale(interaction.locale)].xp.admin;
  }

  @Subcommand({
    name: 'show',
    ...describeCommand((t) => t.xp.commands.settings.show),
  })
  public async onShow(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction).show;
    const s = await this.settings.getSettings(interaction.guildId!, xpModule);

    const ignored =
      s.ignoredChannelIds.length > 0
        ? s.ignoredChannelIds.map((id) => `<#${id}>`).join(', ')
        : t.none;

    const levelUp = !s.levelUpMessages
      ? t.disabled
      : `${t.enabled} (${s.levelUpChannelId ? `<#${s.levelUpChannelId}>` : t.sameChannel})`;

    const roles =
      s.levelRoles.length > 0
        ? [...s.levelRoles]
            .sort((a, b) => a.level - b.level)
            .map((entry) => `Level ${entry.level} → <@&${entry.roleId}>`)
            .join(', ')
        : t.none;

    const timezone = await this.i18n.getGuildTimezone(interaction.guildId!);
    const daily = s.leaderboardChannelId
      ? t.dailyAt({
          channel: `<#${s.leaderboardChannelId}>`,
          time: s.leaderboardTime,
          timezone,
        })
      : t.off;

    const lines = [
      `${t.messageXp}: ${s.messageXp === 0 ? t.off : s.messageXp}`,
      `${t.cooldown}: ${s.messageCooldownSeconds}s`,
      `${t.voiceXp}: ${s.voiceXpPerMinute === 0 ? t.off : s.voiceXpPerMinute}`,
      `${t.ignoredChannels}: ${ignored}`,
      `${t.levelUpMessages}: ${levelUp}`,
      `${t.levelRoles}: ${roles}`,
      `${t.dailyLeaderboard}: ${daily}`,
    ];

    return interaction.reply({
      content: lines.join('\n'),
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'message-xp',
    ...describeCommand((t) => t.xp.commands.settings.messageXp),
  })
  public async onMessageXp(
    @Context() [interaction]: SlashCommandContext,
    @Options() { amount }: XpAmountDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, xpModule, {
      messageXp: amount,
    });
    return interaction.reply({
      content: t.messageXpSet({ amount }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'cooldown',
    ...describeCommand((t) => t.xp.commands.settings.cooldown),
  })
  public async onCooldown(
    @Context() [interaction]: SlashCommandContext,
    @Options() { seconds }: XpCooldownDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, xpModule, {
      messageCooldownSeconds: seconds,
    });
    return interaction.reply({
      content: t.cooldownSet({ seconds }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'voice-xp',
    ...describeCommand((t) => t.xp.commands.settings.voiceXp),
  })
  public async onVoiceXp(
    @Context() [interaction]: SlashCommandContext,
    @Options() { amount }: XpAmountDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, xpModule, {
      voiceXpPerMinute: amount,
    });
    return interaction.reply({
      content: t.voiceXpSet({ amount }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'ignore-channel',
    ...describeCommand((t) => t.xp.commands.settings.ignoreChannel),
  })
  public async onIgnoreChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: XpIgnoreChannelDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const s = await this.settings.getSettings(guildId, xpModule);
    const mention = `<#${channel.id}>`;

    const isIgnored = s.ignoredChannelIds.includes(channel.id);
    await this.settings.updateSettings(guildId, xpModule, {
      ignoredChannelIds: isIgnored
        ? s.ignoredChannelIds.filter((id) => id !== channel.id)
        : [...s.ignoredChannelIds, channel.id],
    });

    return interaction.reply({
      content: isIgnored
        ? t.channelUnignored({ channel: mention })
        : t.channelIgnored({ channel: mention }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'levelup',
    ...describeCommand((t) => t.xp.commands.settings.levelup),
  })
  public async onLevelUp(
    @Context() [interaction]: SlashCommandContext,
    @Options() { enabled, channel }: XpLevelUpDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, xpModule, {
      levelUpMessages: enabled,
      levelUpChannelId: channel?.id,
    });

    const content = !enabled
      ? t.levelUpDisabled
      : channel
        ? t.levelUpEnabledIn({ channel: `<#${channel.id}>` })
        : t.levelUpEnabledSame;

    return interaction.reply({ content, flags: MessageFlags.Ephemeral });
  }

  @Subcommand({
    name: 'role-add',
    ...describeCommand((t) => t.xp.commands.settings.roleAdd),
  })
  public async onRoleAdd(
    @Context() [interaction]: SlashCommandContext,
    @Options() { level, role }: XpRoleAddDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const mention = `<@&${role.id}>`;

    if (!role.editable) {
      return interaction.reply({
        content: t.roleNotEditable({ role: mention }),
        flags: MessageFlags.Ephemeral,
        allowedMentions: { parse: [] },
      });
    }

    const s = await this.settings.getSettings(guildId, xpModule);
    await this.settings.updateSettings(guildId, xpModule, {
      levelRoles: [
        ...s.levelRoles.filter((entry) => entry.level !== level),
        { level, roleId: role.id },
      ],
    });

    return interaction.reply({
      content: t.roleSet({ level, role: mention }),
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'role-remove',
    ...describeCommand((t) => t.xp.commands.settings.roleRemove),
  })
  public async onRoleRemove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { level }: XpRoleRemoveDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const s = await this.settings.getSettings(guildId, xpModule);

    if (!s.levelRoles.some((entry) => entry.level === level)) {
      return interaction.reply({
        content: t.roleNotFound({ level }),
        flags: MessageFlags.Ephemeral,
      });
    }

    await this.settings.updateSettings(guildId, xpModule, {
      levelRoles: s.levelRoles.filter((entry) => entry.level !== level),
    });

    return interaction.reply({
      content: t.roleRemoved({ level }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'leaderboard-channel',
    ...describeCommand((t) => t.xp.commands.settings.leaderboardChannel),
  })
  public async onLeaderboardChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: XpLeaderboardChannelDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const s = await this.settings.updateSettings(guildId, xpModule, {
      leaderboardChannelId: channel?.id,
    });

    if (!channel) {
      return interaction.reply({
        content: t.leaderboardChannelRemoved,
        flags: MessageFlags.Ephemeral,
      });
    }

    const timezone = await this.i18n.getGuildTimezone(guildId);
    const message = t.leaderboardChannelSet({
      channel: `<#${channel.id}>`,
      time: s.leaderboardTime,
      timezone,
    });

    // Warn right away instead of failing silently every day
    const me = interaction.guild?.members.me;
    const canPost =
      me &&
      channel
        .permissionsFor(me)
        ?.has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ]);

    return interaction.reply({
      content: canPost
        ? message
        : `${message}\n${t.leaderboardMissingPermissions}`,
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'leaderboard-time',
    ...describeCommand((t) => t.xp.commands.settings.leaderboardTime),
  })
  public async onLeaderboardTime(
    @Context() [interaction]: SlashCommandContext,
    @Options() { time }: XpLeaderboardTimeDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;

    // Same rule as in the settings schema (HH:MM), so both always agree
    if (!xpSettingsSchema.shape.leaderboardTime.safeParse(time).success) {
      return interaction.reply({
        content: t.leaderboardTimeInvalid({ time }),
        flags: MessageFlags.Ephemeral,
        allowedMentions: { parse: [] },
      });
    }

    await this.settings.updateSettings(guildId, xpModule, {
      leaderboardTime: time,
    });
    const timezone = await this.i18n.getGuildTimezone(guildId);

    return interaction.reply({
      content: t.leaderboardTimeSet({ time, timezone }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
