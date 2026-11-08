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
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { welcomeModuleTranslations } from './i18n/index.js';
import { welcomeModule } from './welcome.definition.js';
import {
  WelcomeChannelDto,
  WelcomeDelayDto,
  WelcomeGoodbyeDto,
  WelcomeMessageDto,
  WelcomeRoleDto,
} from './dto/dto.js';

export const WelcomeCommandsDecorator = createCommandGroupDecorator({
  name: 'welcome',
  description: 'Manage the welcome module',
  descriptionLocalizations: {
    de: 'Verwalte das Willkommen-Modul',
  },
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

type Interaction = SlashCommandContext[0];

@Injectable()
@WelcomeCommandsDecorator()
export class WelcomeCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return welcomeModuleTranslations[resolveLocale(interaction.locale)];
  }

  @Subcommand({
    name: 'show',
    description: 'Show the current welcome settings',
    descriptionLocalizations: {
      de: 'Zeige die aktuellen Willkommen-Einstellungen',
    },
  })
  public async onShow(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction);
    const s = await this.settings.getSettings(
      interaction.guildId!,
      welcomeModule,
    );

    const roles =
      s.autoRoleIds.length > 0
        ? s.autoRoleIds.map((id) => `<@&${id}>`).join(', ')
        : t.show.none;

    const lines = [
      `${t.show.channel}: ${s.channelId ? `<#${s.channelId}>` : t.show.notSet}`,
      `${t.show.message}: ${s.message ?? t.show.defaultText}`,
      `${t.show.autoRoles}: ${roles}`,
      `${t.show.autoRoleDelay}: ${s.autoRoleDelaySeconds}s`,
      `${t.show.goodbye}: ${s.goodbyeEnabled ? t.show.enabled : t.show.disabled}`,
    ];

    return interaction.reply({
      content: lines.join('\n'),
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'channel',
    description: 'Set or remove the welcome channel',
    descriptionLocalizations: {
      de: 'Setze oder entferne den Willkommens-Channel',
    },
  })
  public async onChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: WelcomeChannelDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, welcomeModule, {
      channelId: channel?.id,
    });

    return interaction.reply({
      content: channel
        ? t.channelSet({ channel: `<#${channel.id}>` })
        : t.channelRemoved,
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'message',
    description: 'Set or reset the welcome message',
    descriptionLocalizations: {
      de: 'Setze die Willkommensnachricht oder setze sie zurück',
    },
  })
  public async onMessage(
    @Context() [interaction]: SlashCommandContext,
    @Options() { text }: WelcomeMessageDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, welcomeModule, {
      message: text,
    });

    return interaction.reply({
      content: text ? t.messageSet({ text }) : t.messageReset,
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'autorole-add',
    description: 'Add a role that new members get automatically',
    descriptionLocalizations: {
      de: 'Füge eine Rolle hinzu, die neue Mitglieder automatisch bekommen',
    },
  })
  public async onAutoRoleAdd(
    @Context() [interaction]: SlashCommandContext,
    @Options() { role }: WelcomeRoleDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const s = await this.settings.getSettings(guildId, welcomeModule);
    const mention = `<@&${role.id}>`;

    if (s.autoRoleIds.includes(role.id)) {
      return interaction.reply({
        content: t.autoRoleAlreadyAdded({ role: mention }),
        flags: MessageFlags.Ephemeral,
        allowedMentions: { parse: [] },
      });
    }

    if (!role.editable) {
      return interaction.reply({
        content: t.autoRoleNotEditable({ role: mention }),
        flags: MessageFlags.Ephemeral,
        allowedMentions: { parse: [] },
      });
    }

    await this.settings.updateSettings(guildId, welcomeModule, {
      autoRoleIds: [...s.autoRoleIds, role.id],
    });

    return interaction.reply({
      content: t.autoRoleAdded({ role: mention }),
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'autorole-remove',
    description: 'Remove an automatic role',
    descriptionLocalizations: { de: 'Entferne eine automatische Rolle' },
  })
  public async onAutoRoleRemove(
    @Context() [interaction]: SlashCommandContext,
    @Options() { role }: WelcomeRoleDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const s = await this.settings.getSettings(guildId, welcomeModule);
    const mention = `<@&${role.id}>`;

    if (!s.autoRoleIds.includes(role.id)) {
      return interaction.reply({
        content: t.autoRoleNotFound({ role: mention }),
        flags: MessageFlags.Ephemeral,
        allowedMentions: { parse: [] },
      });
    }

    await this.settings.updateSettings(guildId, welcomeModule, {
      autoRoleIds: s.autoRoleIds.filter((id) => id !== role.id),
    });

    return interaction.reply({
      content: t.autoRoleRemoved({ role: mention }),
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'autorole-delay',
    description: 'Set the delay before auto roles are given',
    descriptionLocalizations: {
      de: 'Setze die Verzögerung, bevor Auto-Rollen vergeben werden',
    },
  })
  public async onAutoRoleDelay(
    @Context() [interaction]: SlashCommandContext,
    @Options() { seconds }: WelcomeDelayDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, welcomeModule, {
      autoRoleDelaySeconds: seconds,
    });

    return interaction.reply({
      content: t.autoRoleDelaySet({ seconds }),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'goodbye',
    description: 'Enable or disable goodbye messages',
    descriptionLocalizations: {
      de: 'Aktiviere oder deaktiviere Abschiedsnachrichten',
    },
  })
  public async onGoodbye(
    @Context() [interaction]: SlashCommandContext,
    @Options() { enabled, text }: WelcomeGoodbyeDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, welcomeModule, {
      goodbyeEnabled: enabled,
      goodbyeMessage: text,
    });

    const content = !enabled
      ? t.goodbyeDisabled
      : text
        ? t.goodbyeEnabledCustom
        : t.goodbyeEnabledDefault;

    return interaction.reply({
      content,
      flags: MessageFlags.Ephemeral,
    });
  }
}
