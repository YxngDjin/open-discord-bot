import { Injectable, Logger } from '@nestjs/common';
import { GuildService } from './guild.service.js';
import { Context, type ContextOf, On, Once } from 'necord';

@Injectable()
export class GuildListener {
  private readonly logger = new Logger(GuildListener.name);

  constructor(private readonly guildService: GuildService) {}

  @Once('clientReady')
  public async onReady(@Context() [client]: ContextOf<'clientReady'>) {
    const guilds = client.guilds.cache.map((guild) => {
      return {
        id: guild.id,
        preferredLocale: guild.preferredLocale,
      };
    });
    const leftCount = await this.guildService.syncGuilds(guilds);

    this.logger.log(
      `Synced ${guilds.length} guild(s), ${leftCount} marked as left.`,
    );
  }

  @On('guildCreate')
  public async onGuildCreate(@Context() [guild]: ContextOf<'guildCreate'>) {
    await this.guildService.ensureGuild(guild.id, guild.preferredLocale);
    this.logger.log(`Joined ${guild.name} (${guild.id})`);
  }

  @On('guildDelete')
  public async onGuildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    if (!guild.available) {
      this.logger.warn(
        `Guild ${guild.name} is unavailable (Discord outage?), not marking as left.`,
      );
      return;
    }
    await this.guildService.markGuildLeft(guild.id);
    this.logger.log(`Left ${guild.name} (${guild.id})`);
  }
}
