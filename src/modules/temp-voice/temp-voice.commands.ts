import { Injectable } from '@nestjs/common';
import {
  ChannelType,
  type GuildBasedChannel,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  ChannelOption,
  Context,
  createCommandGroupDecorator,
  IntegerOption,
  Options,
  type SlashCommandContext,
  StringOption,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { tempVoiceTranslations } from './i18n/index.js';
import { tempVoiceModule } from './temp-voice.definition.js';

type Interaction = SlashCommandContext[0];

export const TempVoiceCommandsDecorator = createCommandGroupDecorator({
  name: 'tempvoice',
  description: 'Configure temporary voice channels',
  descriptionLocalizations: { de: 'Temporäre Voice-Channels einstellen' },
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

export class TempVoiceChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Voice channel to join to create a channel (empty = off)',
    description_localizations: {
      de: 'Voice-Channel, der einen Channel erstellt (leer = aus)',
    },
    required: false,
    channel_types: [ChannelType.GuildVoice],
  })
  channel?: GuildBasedChannel;
}

export class TempVoiceCategoryDto {
  @ChannelOption({
    name: 'category',
    description: 'Category for new channels (empty = same as join channel)',
    description_localizations: {
      de: 'Kategorie für neue Channels (leer = wie Beitreten-Channel)',
    },
    required: false,
    channel_types: [ChannelType.GuildCategory],
  })
  category?: GuildBasedChannel;
}

export class TempVoiceNameDto {
  @StringOption({
    name: 'template',
    description: 'Name of new channels, {user} = member name',
    description_localizations: {
      de: 'Name neuer Channels, {user} = Name des Mitglieds',
    },
    required: true,
    min_length: 1,
    max_length: 100,
  })
  template: string;
}

export class TempVoiceLimitDto {
  @IntegerOption({
    name: 'users',
    description: 'Maximum number of users (0 = no limit)',
    description_localizations: {
      de: 'Maximale Anzahl Nutzer (0 = kein Limit)',
    },
    required: true,
    min_value: 0,
    max_value: 99,
  })
  users: number;
}

export class TempVoiceDeleteAfterDto {
  @IntegerOption({
    name: 'minutes',
    description: 'Minutes an empty channel is kept (0 = delete right away)',
    description_localizations: {
      de: 'Minuten, die ein leerer Channel bleibt (0 = sofort löschen)',
    },
    required: true,
    min_value: 0,
    max_value: 60,
  })
  minutes: number;
}

@Injectable()
@TempVoiceCommandsDecorator()
export class TempVoiceCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return tempVoiceTranslations[resolveLocale(interaction.locale)].admin;
  }

  /** Every answer of /tempvoice is only visible to the admin. */
  private reply(interaction: Interaction, content: string) {
    return interaction.reply({
      content,
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'show',
    description: 'Show the current settings',
    descriptionLocalizations: { de: 'Zeige die aktuellen Einstellungen' },
  })
  public async onShow(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction).show;
    const s = await this.settings.getSettings(
      interaction.guildId!,
      tempVoiceModule,
    );

    const lines = [
      `**${t.title}**`,
      `${t.creatorChannel}: ${s.creatorChannelId ? `<#${s.creatorChannelId}>` : t.notSet}`,
      `${t.category}: ${s.categoryId ? `<#${s.categoryId}>` : t.sameAsCreator}`,
      `${t.nameTemplate}: \`${s.nameTemplate}\``,
      `${t.userLimit}: ${s.userLimit === 0 ? t.noLimit : s.userLimit}`,
      `${t.deleteAfter}: ${t.minutes({ minutes: s.deleteAfterMinutes })}`,
    ];

    return this.reply(interaction, lines.join('\n'));
  }

  @Subcommand({
    name: 'channel',
    description: 'Set or remove the join-to-create channel',
    descriptionLocalizations: {
      de: 'Beitreten-zum-Erstellen-Channel setzen oder entfernen',
    },
  })
  public async onChannel(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel }: TempVoiceChannelDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, tempVoiceModule, {
      creatorChannelId: channel?.id,
    });

    if (!channel) {
      return this.reply(interaction, t.channelRemoved);
    }

    // Warn early instead of failing silently on the first join
    const canWork = interaction.guild?.members.me?.permissions.has([
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.MoveMembers,
    ]);

    const message = t.channelSet({ channel: `<#${channel.id}>` });
    return this.reply(
      interaction,
      canWork ? message : `${message}\n${t.missingPermissions}`,
    );
  }

  @Subcommand({
    name: 'category',
    description: 'Set or remove the category for new channels',
    descriptionLocalizations: {
      de: 'Kategorie für neue Channels setzen oder entfernen',
    },
  })
  public async onCategory(
    @Context() [interaction]: SlashCommandContext,
    @Options() { category }: TempVoiceCategoryDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, tempVoiceModule, {
      categoryId: category?.id,
    });

    return this.reply(
      interaction,
      category
        ? t.categorySet({ category: `<#${category.id}>` })
        : t.categoryRemoved,
    );
  }

  @Subcommand({
    name: 'name',
    description: 'Set the name of new channels',
    descriptionLocalizations: { de: 'Namen neuer Channels festlegen' },
  })
  public async onName(
    @Context() [interaction]: SlashCommandContext,
    @Options() { template }: TempVoiceNameDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, tempVoiceModule, {
      nameTemplate: template,
    });

    // Same replacement as in TempVoiceService.createChannel
    const name = interaction.inCachedGuild()
      ? interaction.member.displayName
      : interaction.user.displayName;
    const example = template.replaceAll('{user}', () => name).slice(0, 100);

    return this.reply(interaction, t.nameSet({ example }));
  }

  @Subcommand({
    name: 'limit',
    description: 'Set the user limit of new channels',
    descriptionLocalizations: { de: 'Nutzerlimit neuer Channels festlegen' },
  })
  public async onLimit(
    @Context() [interaction]: SlashCommandContext,
    @Options() { users }: TempVoiceLimitDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, tempVoiceModule, {
      userLimit: users,
    });

    return this.reply(interaction, t.limitSet({ limit: users }));
  }

  @Subcommand({
    name: 'delete-after',
    description: 'Set how long an empty channel is kept',
    descriptionLocalizations: {
      de: 'Festlegen, wie lange ein leerer Channel bleibt',
    },
  })
  public async onDeleteAfter(
    @Context() [interaction]: SlashCommandContext,
    @Options() { minutes }: TempVoiceDeleteAfterDto,
  ) {
    const t = this.translate(interaction);
    await this.settings.updateSettings(interaction.guildId!, tempVoiceModule, {
      deleteAfterMinutes: minutes,
    });

    return this.reply(interaction, t.deleteAfterSet({ minutes }));
  }
}
