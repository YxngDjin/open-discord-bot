import { Injectable } from '@nestjs/common';
import { Client, PermissionFlagsBits, type Guild } from 'discord.js';

export type GuildSummary = { id: string; name: string; iconUrl: string | null };

@Injectable()
export class GuildsService {
  constructor(private readonly client: Client) {}

  async canManage(guild: Guild, userId: string): Promise<boolean> {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return false;
    return member.permissions.has(PermissionFlagsBits.ManageGuild);
  }

  async listManageable(userId: string): Promise<GuildSummary[]> {
    const manageable: GuildSummary[] = [];

    for (const guild of this.client.guilds.cache.values()) {
      if (!(await this.canManage(guild, userId))) continue;
      manageable.push(this.toSummary(guild));
    }

    return manageable;
  }
    toSummary(guild: Guild): GuildSummary {
        return { id: guild.id, name: guild.name, iconUrl: guild.iconURL() };
    }

  getSummary(guildId: string): GuildSummary {
        const guild = this.client.guilds.cache.get(guildId)!;
        return this.toSummary(guild);
    }
}
