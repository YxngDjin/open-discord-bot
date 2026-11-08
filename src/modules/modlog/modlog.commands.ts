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
import { modlogModule } from './modlog.definition.js';
import { ModlogChannelDto, ModlogToggleDto, toggles } from './dto/dto.js';
import { describeCommand } from '../../core/i18n/localize.js';
import { translations } from '../../core/i18n/translations/index.js';

type Interaction = SlashCommandContext[0];

/** Maps the choice values of /modlog toggle to the setting they switch. */

export const ModlogCommandsDecorator = createCommandGroupDecorator({
  name: 'modlog',
  ...describeCommand((t) => t.modlog.commands.modlog),
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

@Injectable()
@ModlogCommandsDecorator()
export class ModlogCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return translations[resolveLocale(interaction.locale)].modlog.admin;
  }

  @Subcommand({
    name: 'show',
    ...describeCommand((t) => t.modlog.commands.show),
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
    ...describeCommand((t) => t.modlog.commands.channel),
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
    ...describeCommand((t) => t.modlog.commands.toggle),
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
