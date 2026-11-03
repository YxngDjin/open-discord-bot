import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { resolveLocale } from '../i18n/locales.js';

export type GuildInfo = {
  id: string;
  preferredLocale: string;
};

@Injectable()
export class GuildService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureGuild(guildId: string, preferredLocale: string) {
    await this.prisma.guild.upsert({
      where: { id: guildId },
      update: { leftAt: null },
      create: { id: guildId, locale: resolveLocale(preferredLocale) },
    });
  }

  async markGuildLeft(guildId: string) {
    await this.prisma.guild.updateMany({
      where: { id: guildId },
      data: { leftAt: new Date() },
    });
  }

  async syncGuilds(guilds: GuildInfo[]) {
    await Promise.all(
      guilds.map((guild) => this.ensureGuild(guild.id, guild.preferredLocale)),
    );

    const activeIds = guilds.map((guild) => guild.id);

    const { count } = await this.prisma.guild.updateMany({
      where: {
        leftAt: null,
        id: { notIn: activeIds },
      },
      data: { leftAt: new Date() },
    });

    return count;
  }
}
