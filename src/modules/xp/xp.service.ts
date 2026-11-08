import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import {
  Client,
  type GuildMember,
  type GuildTextBasedChannel,
  type Message,
} from 'discord.js';
import { I18nService } from '../../core/i18n/i18n.service.js';
import { xpModule, type XpSettings } from './xp.definition.js';
import { levelFromXp, progressInLevel } from './xp.formula.js';
import { Interval } from '@nestjs/schedule';
import { translations } from '../../core/i18n/translations/index.js';

@Injectable()
export class XpService {
  private readonly logger = new Logger(XpService.name);
  private readonly cooldowns = new Map<string, number>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleSettings: ModuleSettingsService,
    private readonly client: Client,
    private readonly i18n: I18nService,
  ) {}

  async handleMessage(message: Message<true>) {
    const guildId = message.guildId;
    const userId = message.author.id;
    const key = `${guildId}:${userId}`;

    const cooldownUntil = this.cooldowns.get(key) ?? 0;
    if (cooldownUntil > Date.now()) return;

    if (!(await this.moduleSettings.isEnabled(guildId, xpModule.key))) return;

    const settings = await this.moduleSettings.getSettings(guildId, xpModule);
    if (settings.ignoredChannelIds.includes(message.channelId)) return;

    this.cooldowns.set(
      key,
      Date.now() + settings.messageCooldownSeconds * 1000,
    );

    const { oldLevel, newLevel } = await this.addXp(
      guildId,
      userId,
      settings.messageXp,
      'message',
    );
    if (newLevel > oldLevel && message.member) {
      await this.handleLevelUp(
        message.member,
        newLevel,
        settings,
        message.channel,
      );
    }
  }

  private async addXp(
    guildId: string,
    userId: string,
    amount: number,
    source: 'message' | 'voice',
  ) {
    const counter = source === 'message' ? 'messageCount' : 'voiceMinutes';

    const entry = await this.prisma.memberXp.upsert({
      where: { guildId_userId: { guildId, userId } },
      create: { guildId, userId, xp: amount, [counter]: 1 },
      update: {
        xp: { increment: amount },
        [counter]: { increment: 1 },
      },
    });

    const oldLevel = levelFromXp(entry.xp - amount);
    const newLevel = levelFromXp(entry.xp);
    return {
      oldLevel,
      newLevel,
    };
  }

  @Interval(60_000)
  async awardVoiceXp() {
    for (const guild of this.client.guilds.cache.values()) {
      try {
        if (!(await this.moduleSettings.isEnabled(guild.id, xpModule.key)))
          continue;

        const settings = await this.moduleSettings.getSettings(
          guild.id,
          xpModule,
        );
        if (settings.voiceXpPerMinute === 0) continue;

        const voiceChannels = guild.channels.cache.filter((channel) =>
          channel.isVoiceBased(),
        );

        for (const channel of voiceChannels.values()) {
          if (channel.id === guild.afkChannelId) continue;
          if (settings.ignoredChannelIds.includes(channel.id)) continue;

          const humans = channel.members.filter(
            (member) => !member.user.bot && !member.voice.deaf,
          );

          if (humans.size < 2) continue;

          for (const member of humans.values()) {
            const { oldLevel, newLevel } = await this.addXp(
              guild.id,
              member.id,
              settings.voiceXpPerMinute,
              'voice',
            );
            if (newLevel > oldLevel) {
              await this.handleLevelUp(member, newLevel, settings);
            }
          }
        }
      } catch (error) {
        this.logger.warn(
          `Voice XP failed for guild ${guild.id}: ${String(error)}`,
        );
      }
    }
  }

  private async handleLevelUp(
    member: GuildMember,
    newLevel: number,
    settings: XpSettings,
    fallbackChannel?: GuildTextBasedChannel,
  ) {
    if (settings.levelUpMessages) {
      try {
        const channel = settings.levelUpChannelId
          ? member.guild.channels.cache.get(settings.levelUpChannelId)
          : fallbackChannel;

        if (channel?.isTextBased()) {
          const locale = await this.i18n.getGuildLocale(member.guild.id);
          const t = translations[locale].xp;

          await channel.send({
            content: t.levelUp({ user: member.toString(), level: newLevel }),
            allowedMentions: { users: [member.id] },
          });
        }
      } catch (error) {
        this.logger.warn(
          `Could not send level-up message in guild ${member.guild.id}: ${String(error)}`,
        );
      }
    }

    try {
      const roleIds = settings.levelRoles
        .filter((entry) => entry.level <= newLevel)
        .map((entry) => entry.roleId)
        .filter((roleId) => !member.roles.cache.has(roleId));

      if (roleIds.length > 0) {
        await member.roles.add(roleIds);
      }
    } catch (error) {
      this.logger.warn(
        `Could not assign level roles in guild ${member.guild.id}: ${String(error)}`,
      );
    }
  }

  async getRank(guildId: string, userId: string) {
    const entry = await this.prisma.memberXp.findUnique({
      where: { guildId_userId: { guildId, userId } },
    });

    if (!entry) return null;

    const higher = await this.prisma.memberXp.count({
      where: { guildId, xp: { gt: entry.xp } },
    });

    return {
      entry,
      rank: higher + 1,
      progress: progressInLevel(entry.xp),
    };
  }

  async getLeaderboard(guildId: string) {
    const entry = await this.prisma.memberXp.findMany({
      where: { guildId },
      orderBy: { xp: 'desc' },
      take: 10,
    });

    return entry;
  }
}
