import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import {
  DEFAULT_LOCALE,
  resolveLocale,
  type SupportedLocale,
} from './locales.js';
import { DEFAULT_TIMEZONE } from './timezone.js';

@Injectable()
export class I18nService {
  constructor(private readonly prisma: PrismaService) {}

  async getGuildTimezone(guildId: string): Promise<string> {
    const guild = await this.prisma.guild.findUnique({
      where: { id: guildId },
    });
    return guild?.timezone ?? DEFAULT_TIMEZONE;
  }

  async setGuildTimezone(guildId: string, timezone: string) {
    await this.prisma.guild.update({
      where: { id: guildId },
      data: { timezone },
    });
  }

  async getGuildLocale(guildId: string): Promise<SupportedLocale> {
    const guild = await this.prisma.guild.findUnique({
      where: { id: guildId },
    });
    return resolveLocale(guild?.locale ?? DEFAULT_LOCALE);
  }

  async setGuildLocale(guildId: string, locale: SupportedLocale) {
    await this.prisma.guild.update({
      where: { id: guildId },
      data: { locale },
    });
  }
}
