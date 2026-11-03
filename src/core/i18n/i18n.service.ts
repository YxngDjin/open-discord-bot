import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import {
  DEFAULT_LOCALE,
  resolveLocale,
  type SupportedLocale,
} from './locales.js';

@Injectable()
export class I18nService {
  constructor(private readonly prisma: PrismaService) {}

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
