import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Client } from 'discord.js';
import { I18nService } from '../../core/i18n/i18n.service.js';
import { localDateTime } from '../../core/i18n/timezone.js';
import { PrismaService } from '../../core/database/prisma.service.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { isLeaderboardDue } from './leaderboard.schedule.js';
import { xpModule } from './xp.definition.js';
import { XpService } from './xp.service.js';
import { renderLeaderboard } from './leaderboard.render.js';
import { translations } from '../../core/i18n/translations/index.js';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleSettings: ModuleSettingsService,
    private readonly i18n: I18nService,
    private readonly xp: XpService,
    private readonly client: Client,
  ) {}

  @Interval(60_000)
  async postDueLeaderboards() {
    if (!this.client.isReady()) return;

    const entries = await this.prisma.guildModule.findMany({
      where: { module: xpModule.key, enabled: true, guild: { leftAt: null } },
      select: { guildId: true },
    });

    for (const { guildId } of entries) {
      try {
        await this.updateIfDue(guildId);
      } catch (error) {
        this.logger.warn(
          `Could not update leaderboard in guild ${guildId}: ${String(error)}`,
        );
      }
    }
  }

  private async updateIfDue(guildId: string) {
    const settings = await this.moduleSettings.getSettings(guildId, xpModule);
    if (!settings.leaderboardChannelId) return;

    const timezone = await this.i18n.getGuildTimezone(guildId);
    const local = localDateTime(new Date(), timezone);

    const state = await this.prisma.leaderboardMessage.findUnique({
      where: { guildId },
    });

    if (
      !isLeaderboardDue(
        local,
        settings.leaderboardTime,
        state?.lastPostedOn ?? null,
      )
    ) {
      return;
    }
    await this.post(guildId, settings.leaderboardChannelId, state, local.date);
  }

  private async post(
    guildId: string,
    channelId: string,
    state: { channelId: string; messageId: string } | null,
    today: string,
  ) {
    const entries = await this.xp.getLeaderboard(guildId);
    if (entries.length === 0) return;

    const locale = await this.i18n.getGuildLocale(guildId);
    const updated = Math.floor(Date.now() / 1000);
    const content = `${renderLeaderboard(entries, locale)}\n\n${translations[locale].xp.leaderboardUpdated({ time: `<t:${updated}:R>` })}`;

    const channel = await this.client.channels
      .fetch(channelId)
      .catch(() => null);
    if (!channel?.isSendable()) {
      throw new Error(
        `Leaderboard channel ${channelId} is missing or not a text channel`,
      );
    }

    const existing =
      state?.channelId === channelId
        ? await channel.messages.fetch(state.messageId).catch(() => null)
        : null;

    const payload = { content, allowedMentions: { parse: [] } };
    const message = existing
      ? await existing.edit(payload)
      : await channel.send(payload);

    await this.prisma.leaderboardMessage.upsert({
      where: { guildId },
      create: {
        guildId,
        channelId,
        messageId: message.id,
        lastPostedOn: today,
      },
      update: { channelId, messageId: message.id, lastPostedOn: today },
    });
  }
}
