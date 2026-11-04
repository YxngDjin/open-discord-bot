import { Injectable } from '@nestjs/common';
import {
  ChannelType,
  type GuildBasedChannel,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  BooleanOption,
  ChannelOption,
  Context,
  createCommandGroupDecorator,
  Options,
  type SlashCommandContext,
  StringOption,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { modlogTranslations } from './i18n/index.js';
import { modlogModule } from './modlog.definition.js';

type Interaction = SlashCommandContext[0];

/** Maps the choice values of /modlog toggle to the setting they switch. */
const toggles = {
  moderation: 'logModeration',
  joins: 'logJoins',
  leaves: 'logLeaves',
} as const;

type ToggleEvent = keyof typeof toggles;

export const ModlogCommandsDecorator = createCommandGroupDecorator({
  name: 'modlog',
  description: 'Configure the mod log',
  descriptionLocalizations: { de: 'Mod-Log einstellen' },
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

export class ModlogChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Log channel (leave empty to remove)',
    description_localizations: {
      de: 'Log-Channel (leer lassen zum Entfernen)',
    },
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class ModlogToggleDto {
  @StringOption({
    name: 'event',
    description: 'What should be logged',
    description_localizations: { de: 'Was geloggt werden soll' },
    required: true,
    choices: [
      {
        name: 'Moderation cases',
        name_localizations: { de: 'Moderationsfälle' },
        value: 'moderation',
      },
      {
        name: 'Joins',
        name_localizations: { de: 'Beitritte' },
        value: 'joins',
      },
      {
        name: 'Leaves',
        name_localizations: { de: 'Austritte' },
        value: 'leaves',
      },
    ],
  })
  event: ToggleEvent;

  @BooleanOption({
    name: 'enabled',
    description: 'Log this event',
    description_localizations: { de: 'Dieses Ereignis loggen' },
    required: true,
  })
  enabled: boolean;
}

@Injectable()
@ModlogCommandsDecorator()
export class ModlogCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return modlogTranslations[resolveLocale(interaction.locale)].admin;
  }

  @Subcommand({
    name: 'show',
    description: 'Show the current mod log settings',
    descriptionLocalizations: {
      de: 'Zeige die aktuellen Mod-Log-Einstellungen',
    },
  })
  public async onShow(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction).show;
    const s = await this.settings.getSettings(
      interaction.guildId!,
      modlogModule,
    );
    const state = (value: boolean) => (value ? t.enabled : t.disabled);

    const lines = [
      `${t.channel}: ${s.channelId ? `<#${s.channelId}>` : t.notSet}`,
      `${t.moderation}: ${state(s.logModeration)}`,
      `${t.joins}: ${state(s.logJoins)}`,
      `${t.leaves}: ${state(s.logLeaves)}`,
    ];

    return interaction.reply({
      content: lines.join('\n'),
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'channel',
    description: 'Set or remove the log channel',
    descriptionLocalizations: { de: 'Log-Channel setzen oder entfernen' },
  })
  public async onChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: ModlogChannelDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, modlogModule, {
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
    name: 'toggle',
    description: 'Turn logging of an event on or off',
    descriptionLocalizations: {
      de: 'Logging eines Ereignisses an- oder ausschalten',
    },
  })
  public async onToggle(
    @Context() [interaction]: SlashCommandContext,
    @Options() { event, enabled }: ModlogToggleDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, modlogModule, {
      [toggles[event]]: enabled,
    });

    return interaction.reply({
      content: t.toggled({ event: t.events[event], enabled }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
