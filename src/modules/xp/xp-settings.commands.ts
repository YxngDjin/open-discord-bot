import { Injectable } from '@nestjs/common';
import {
  ChannelType,
  type GuildBasedChannel,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  type Role,
} from 'discord.js';
import {
  BooleanOption,
  ChannelOption,
  Context,
  createCommandGroupDecorator,
  IntegerOption,
  Options,
  RoleOption,
  type SlashCommandContext,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { xpTranslations } from './i18n/index.js';
import { xpModule } from './xp.definition.js';

type Interaction = SlashCommandContext[0];

export const XpSettingsCommandsDecorator = createCommandGroupDecorator({
  name: 'xp',
  description: 'Configure the XP and level system',
  descriptionLocalizations: { de: 'XP- und Level-System einstellen' },
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

export class XpAmountDto {
  @IntegerOption({
    name: 'amount',
    description: 'Amount of XP (0 = off)',
    description_localizations: { de: 'Menge an XP (0 = aus)' },
    required: true,
    min_value: 0,
    max_value: 100,
  })
  amount: number;
}

export class XpCooldownDto {
  @IntegerOption({
    name: 'seconds',
    description: 'Seconds before a message gives XP again (0-3600)',
    description_localizations: {
      de: 'Sekunden, bis eine Nachricht wieder XP bringt (0-3600)',
    },
    required: true,
    min_value: 0,
    max_value: 3600,
  })
  seconds: number;
}

export class XpIgnoreChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Channel to ignore or stop ignoring',
    description_localizations: {
      de: 'Channel, der ignoriert bzw. nicht mehr ignoriert werden soll',
    },
    required: true,
    channel_types: [
      ChannelType.GuildText,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
    ],
  })
  channel: GuildBasedChannel;
}

export class XpLevelUpDto {
  @BooleanOption({
    name: 'enabled',
    description: 'Send a message when someone levels up',
    description_localizations: {
      de: 'Nachricht senden, wenn jemand ein Level aufsteigt',
    },
    required: true,
  })
  enabled: boolean;

  @ChannelOption({
    name: 'channel',
    description: 'Where to send it (empty = same channel as the message)',
    description_localizations: {
      de: 'Wohin (leer = derselbe Channel wie die Nachricht)',
    },
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class XpRoleAddDto {
  @IntegerOption({
    name: 'level',
    description: 'Level at which the role is given',
    description_localizations: { de: 'Level, ab dem die Rolle vergeben wird' },
    required: true,
    min_value: 1,
    max_value: 1000,
  })
  level: number;

  @RoleOption({
    name: 'role',
    description: 'The role to give',
    description_localizations: { de: 'Die Rolle, die vergeben werden soll' },
    required: true,
  })
  role: Role;
}

export class XpRoleRemoveDto {
  @IntegerOption({
    name: 'level',
    description: 'Level whose role should be removed',
    description_localizations: {
      de: 'Level, dessen Rolle entfernt werden soll',
    },
    required: true,
    min_value: 1,
    max_value: 1000,
  })
  level: number;
}

@Injectable()
@XpSettingsCommandsDecorator()
export class XpSettingsCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return xpTranslations[resolveLocale(interaction.locale)].admin;
  }

  @Subcommand({
    name: 'show',
    description: 'Show the current XP settings',
    descriptionLocalizations: { de: 'Zeige die aktuellen XP-Einstellungen' },
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

    const lines = [
      `${t.messageXp}: ${s.messageXp === 0 ? t.off : s.messageXp}`,
      `${t.cooldown}: ${s.messageCooldownSeconds}s`,
      `${t.voiceXp}: ${s.voiceXpPerMinute === 0 ? t.off : s.voiceXpPerMinute}`,
      `${t.ignoredChannels}: ${ignored}`,
      `${t.levelUpMessages}: ${levelUp}`,
      `${t.levelRoles}: ${roles}`,
    ];

    return interaction.reply({
      content: lines.join('\n'),
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'message-xp',
    description: 'Set the XP per message',
    descriptionLocalizations: { de: 'Setze die XP pro Nachricht' },
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
    description: 'Set the cooldown between XP for messages',
    descriptionLocalizations: {
      de: 'Setze den Cooldown zwischen XP für Nachrichten',
    },
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
    description: 'Set the XP per minute in voice channels',
    descriptionLocalizations: {
      de: 'Setze die XP pro Minute in Voice-Channels',
    },
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
    description: 'Ignore a channel for XP, or stop ignoring it',
    descriptionLocalizations: {
      de: 'Channel für XP ignorieren oder nicht mehr ignorieren',
    },
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
    description: 'Enable or disable level-up messages',
    descriptionLocalizations: {
      de: 'Level-Up-Nachrichten aktivieren oder deaktivieren',
    },
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
    description: 'Give a role when members reach a level',
    descriptionLocalizations: {
      de: 'Rolle vergeben, wenn Mitglieder ein Level erreichen',
    },
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
    description: 'Remove the role for a level',
    descriptionLocalizations: { de: 'Rolle für ein Level entfernen' },
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
}
