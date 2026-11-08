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
import { tempVoiceModule } from './temp-voice.definition.js';
import {
  TempVoiceCategoryDto,
  TempVoiceChannelDto,
  TempVoiceDeleteAfterDto,
  TempVoiceLimitDto,
  TempVoiceNameDto,
} from './dto/dto.js';
import { describeCommand } from '../../core/i18n/localize.js';
import { translations } from '../../core/i18n/translations/index.js';

type Interaction = SlashCommandContext[0];

export const TempVoiceCommandsDecorator = createCommandGroupDecorator({
  name: 'tempvoice',
  ...describeCommand((t) => t.tempVoice.commands.tempvoice.group),
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  contexts: [InteractionContextType.Guild],
});

@Injectable()
@TempVoiceCommandsDecorator()
export class TempVoiceCommands {
  constructor(private readonly settings: ModuleSettingsService) {}

  private translate(interaction: Interaction) {
    return translations[resolveLocale(interaction.locale)].tempVoice.admin;
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
    ...describeCommand((t) => t.tempVoice.commands.tempvoice.show),
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
    ...describeCommand((t) => t.tempVoice.commands.tempvoice.channel),
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
    ...describeCommand((t) => t.tempVoice.commands.tempvoice.category),
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
    ...describeCommand((t) => t.tempVoice.commands.tempvoice.name),
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
    ...describeCommand((t) => t.tempVoice.commands.tempvoice.limit),
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
    ...describeCommand((t) => t.tempVoice.commands.tempvoice.deleteAfter),
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
