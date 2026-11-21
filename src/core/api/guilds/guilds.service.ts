import { Injectable } from '@nestjs/common';
import {
  Client,
  PermissionFlagsBits,
  type Guild,
  ChannelType,
  type NonThreadGuildBasedChannel,
} from 'discord.js';

export type GuildSummary = { id: string; name: string; iconUrl: string | null };
export type ChannelSummary = {
  id: string;
  name: string;
  type: 'text' | 'announcement' | 'voice' | 'category';
};

export type RoleSummary = {
  id: string;
  name: string;
  color: string;
  assignable: boolean;
};

const CHANNEL_TYPES: Partial<Record<ChannelType, ChannelSummary['type']>> = {
  [ChannelType.GuildText]: 'text',
  [ChannelType.GuildAnnouncement]: 'announcement',
  [ChannelType.GuildVoice]: 'voice',
  [ChannelType.GuildCategory]: 'category',
};

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

  listChannels(guildId: string) {
    const guild = this.client.guilds.cache.get(guildId)!; // Wird vom Guard geprüft!

    return [...guild.channels.cache.values()]
      .filter(
        (channel): channel is NonThreadGuildBasedChannel =>
          !channel.isThread() && channel.type in CHANNEL_TYPES,
      )
      .sort((a, b) => a.position - b.position)
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: CHANNEL_TYPES[channel.type]!,
      }));
  }

  listRoles(guildId: string): RoleSummary[] {
    const guild = this.client.guilds.cache.get(guildId)!;
    return [...guild.roles.cache.values()]
      .filter((role) => role.id !== guild.id && !role.managed)
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        id: role.id,
        name: role.name,
        color: role.hexColor,
        assignable: role.editable,
      }));
  }
}
