import { Injectable, Logger } from '@nestjs/common';
import {
  InteractionContextType,
  MessageFlags,
  type VoiceBasedChannel,
} from 'discord.js';
import {
  Context,
  createCommandGroupDecorator,
  IntegerOption,
  Options,
  type SlashCommandContext,
  StringOption,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { tempVoiceTranslations } from './i18n/index.js';
import { TempVoiceService } from './temp-voice.service.js';

type Interaction = SlashCommandContext[0];

// No defaultMemberPermissions: everyone may use /voice, but only for a
// channel they own. getOwnedChannel checks that.
export const VoiceCommandsDecorator = createCommandGroupDecorator({
  name: 'voice',
  description: 'Manage your temporary voice channel',
  descriptionLocalizations: { de: 'Deinen temporären Voice-Channel verwalten' },
  contexts: [InteractionContextType.Guild],
});

export class VoiceNameDto {
  @StringOption({
    name: 'name',
    description: 'New name of your channel',
    description_localizations: { de: 'Neuer Name deines Channels' },
    required: true,
    min_length: 1,
    max_length: 100,
  })
  name: string;
}

export class VoiceLimitDto {
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

@Injectable()
@VoiceCommandsDecorator()
export class TempVoiceOwnerCommands {
  private readonly logger = new Logger(TempVoiceOwnerCommands.name);

  constructor(private readonly tempVoiceService: TempVoiceService) {}

  /**
   * Shared flow of every /voice subcommand:
   * defer → check ownership → run the change → answer.
   *
   * Deferring first matters: Discord allows only 2 renames per channel every
   * 10 minutes. discord.js then waits until it is allowed again, which can
   * take longer than the 3 seconds Discord gives for an answer.
   */
  private async withOwnedChannel(
    interaction: Interaction,
    change: (channel: VoiceBasedChannel) => Promise<string>,
  ) {
    if (!interaction.inCachedGuild()) return;

    const t = tempVoiceTranslations[resolveLocale(interaction.locale)].owner;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const result = await this.tempVoiceService.getOwnedChannel(
      interaction.member,
    );

    // A string is one of the reasons why the member may not change the channel
    if (typeof result === 'string') {
      return interaction.editReply(t.errors[result]);
    }

    try {
      const content = await change(result);
      return interaction.editReply({ content, allowedMentions: { parse: [] } });
    } catch (error) {
      this.logger.warn(
        `Could not change temp channel ${result.id}: ${String(error)}`,
      );
      return interaction.editReply(t.failed);
    }
  }

  private translate(interaction: Interaction) {
    return tempVoiceTranslations[resolveLocale(interaction.locale)].owner;
  }

  @Subcommand({
    name: 'name',
    description: 'Rename your channel',
    descriptionLocalizations: { de: 'Deinen Channel umbenennen' },
  })
  public async onName(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: VoiceNameDto,
  ) {
    const t = this.translate(interaction);
    return this.withOwnedChannel(interaction, async (channel) => {
      await channel.setName(name);
      return t.renamed({ name });
    });
  }

  @Subcommand({
    name: 'limit',
    description: 'Set the user limit of your channel',
    descriptionLocalizations: { de: 'Nutzerlimit deines Channels festlegen' },
  })
  public async onLimit(
    @Context() [interaction]: SlashCommandContext,
    @Options() { users }: VoiceLimitDto,
  ) {
    const t = this.translate(interaction);
    return this.withOwnedChannel(interaction, async (channel) => {
      await channel.setUserLimit(users);
      return t.limitSet({ limit: users });
    });
  }

  @Subcommand({
    name: 'lock',
    description: 'Lock your channel so nobody else can join',
    descriptionLocalizations: {
      de: 'Channel abschließen, damit niemand sonst beitreten kann',
    },
  })
  public async onLock(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction);
    return this.withOwnedChannel(interaction, async (channel) => {
      // Deny Connect for everyone, but keep it for the owner so they can
      // rejoin. Members already inside stay inside.
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        Connect: false,
      });
      await channel.permissionOverwrites.edit(interaction.user.id, {
        Connect: true,
      });
      return t.locked;
    });
  }

  @Subcommand({
    name: 'unlock',
    description: 'Open your channel again',
    descriptionLocalizations: { de: 'Deinen Channel wieder öffnen' },
  })
  public async onUnlock(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction);
    return this.withOwnedChannel(interaction, async (channel) => {
      // null removes the deny, so the category's permissions apply again
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        Connect: null,
      });
      return t.unlocked;
    });
  }
}
