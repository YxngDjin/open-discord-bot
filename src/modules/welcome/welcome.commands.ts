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
import { welcomeModule } from './welcome.definition.js';
import {
  WelcomeChannelDto,
  WelcomeDelayDto,
  WelcomeGoodbyeDto,
  WelcomeMessageDto,
  WelcomeRoleDto,
} from './dto/dto.js';
import { describeCommand } from '../../core/i18n/localize.js';
import { translations } from '../../core/i18n/translations/index.js';

export const WelcomeCommandsDecorator = createCommandGroupDecorator({
  name: 'welcome',
  ...describeCommand((t) => t.welcome.commands.welcome),
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

type Interaction = SlashCommandContext[0];

@Injectable()
@WelcomeCommandsDecorator()
export class WelcomeCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return translations[resolveLocale(interaction.locale)].welcome;
  }

  @Subcommand({
    name: 'show',
    ...describeCommand((t) => t.welcome.commands.show),
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
    ...describeCommand((t) => t.welcome.commands.channel),
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
    ...describeCommand((t) => t.welcome.commands.message),
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
    ...describeCommand((t) => t.welcome.commands.autoroleAdd),
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
    ...describeCommand((t) => t.welcome.commands.autoroleRemove),
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
    ...describeCommand((t) => t.welcome.commands.autoroleDelay),
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
    ...describeCommand((t) => t.welcome.commands.goodbye),
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
