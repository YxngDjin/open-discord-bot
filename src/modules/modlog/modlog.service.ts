import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Client,
  EmbedBuilder,
  type GuildMember,
  type GuildTextBasedChannel,
  type PartialGuildMember,
} from 'discord.js';
import { I18nService } from '../../core/i18n/i18n.service.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import type { ModerationCaseCreatedEvent } from '../moderation/moderation.events.js';
import { modlogTranslations } from './i18n/index.js';
import type { ModlogTranslations } from './i18n/en.js';
import { modlogModule, type ModlogSettings } from './modlog.definition.js';

const caseColors = {
  WARN: 0xfee75c, // yellow
  TIMEOUT: 0xf0b232, // orange
  KICK: 0xe67e22, // dark orange
  BAN: 0xed4245, // red
  UNBAN: 0x57f287, // green
};

const JOIN_COLOR = 0x57f287; // green
const LEAVE_COLOR = 0x95a5a6; // grey

type LogToggle = 'logModeration' | 'logJoins' | 'logLeaves';

const toTimestamp = (date: Date) =>
  `<t:${Math.floor(date.getTime() / 1000)}:R>`;

@Injectable()
export class ModlogService {
  private readonly logger = new Logger(ModlogService.name);

  constructor(
    private readonly client: Client,
    private readonly moduleSettings: ModuleSettingsService,
    private readonly i18n: I18nService,
  ) {}

  @OnEvent('moderation.case.created')
  async onCaseCreated(event: ModerationCaseCreatedEvent) {
    const target = await this.getLogTarget(event.guildId, 'logModeration');
    if (!target) return;
    const { channel, t } = target;

    const embed = new EmbedBuilder()
      .setTitle(
        t.caseTitle({
          caseNumber: event.caseNumber,
          type: t.caseTypes[event.type],
        }),
      )
      .setColor(caseColors[event.type])
      .addFields(
        {
          name: t.fields.user,
          value: `<@${event.targetId}> (${event.targetId})`,
          inline: true,
        },
        {
          name: t.fields.moderator,
          value: `<@${event.moderatorId}>`,
          inline: true,
        },
        { name: t.fields.reason, value: event.reason ?? t.noReason },
      )
      .setTimestamp();

    if (event.durationSeconds) {
      embed.addFields({
        name: t.fields.duration,
        value: t.minutes({ minutes: Math.round(event.durationSeconds / 60) }),
        inline: true,
      });
    }

    await this.send(channel, embed, event.guildId);
  }

  async logJoin(member: GuildMember) {
    const target = await this.getLogTarget(member.guild.id, 'logJoins');
    if (!target) return;
    const { channel, t } = target;

    const embed = new EmbedBuilder()
      .setTitle(t.memberJoined)
      .setColor(JOIN_COLOR)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: t.fields.user, value: `<@${member.id}> (${member.id})` },
        {
          name: t.fields.accountCreated,
          value: toTimestamp(member.user.createdAt),
          inline: true,
        },
        {
          name: t.fields.memberCount,
          value: String(member.guild.memberCount),
          inline: true,
        },
      )
      .setTimestamp();

    await this.send(channel, embed, member.guild.id);
  }

  async logLeave(member: GuildMember | PartialGuildMember) {
    const target = await this.getLogTarget(member.guild.id, 'logLeaves');
    if (!target) return;
    const { channel, t } = target;

    const embed = new EmbedBuilder()
      .setTitle(t.memberLeft)
      .setColor(LEAVE_COLOR)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        {
          name: t.fields.user,
          value: `${member.user.username} (${member.id})`,
        },
        {
          name: t.fields.joinedServer,
          value: member.joinedAt ? toTimestamp(member.joinedAt) : t.unknown,
          inline: true,
        },
        {
          name: t.fields.memberCount,
          value: String(member.guild.memberCount),
          inline: true,
        },
      )
      .setTimestamp();

    await this.send(channel, embed, member.guild.id);
  }

  /**
   * Checks whether the module is enabled, a log channel is set and the given
   * toggle is on. Returns the channel and the translations in the server
   * language, or null if nothing should be logged.
   */
  private async getLogTarget(
    guildId: string,
    toggle: LogToggle,
  ): Promise<{ channel: GuildTextBasedChannel; t: ModlogTranslations } | null> {
    if (!(await this.moduleSettings.isEnabled(guildId, modlogModule.key)))
      return null;

    const settings: ModlogSettings = await this.moduleSettings.getSettings(
      guildId,
      modlogModule,
    );
    if (!settings.channelId || !settings[toggle]) return null;

    const channel = this.client.guilds.cache
      .get(guildId)
      ?.channels.cache.get(settings.channelId);
    if (!channel?.isTextBased()) {
      this.logger.warn(
        `Log channel ${settings.channelId} not found or not a text channel (guild ${guildId})`,
      );
      return null;
    }

    const t = modlogTranslations[await this.i18n.getGuildLocale(guildId)];
    return { channel, t };
  }

  private async send(
    channel: GuildTextBasedChannel,
    embed: EmbedBuilder,
    guildId: string,
  ) {
    try {
      await channel.send({ embeds: [embed], allowedMentions: { parse: [] } });
    } catch (error) {
      this.logger.warn(
        `Could not send mod log in guild ${guildId}: ${String(error)}`,
      );
    }
  }
}
