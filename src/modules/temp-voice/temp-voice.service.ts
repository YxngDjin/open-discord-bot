import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import {
  ChannelType,
  Client,
  type VoiceBasedChannel,
  type GuildMember,
  type VoiceState,
} from 'discord.js';
import {
  tempVoiceModule,
  type TempVoiceSettings,
} from './temp-voice.definition.js';
import { Interval } from '@nestjs/schedule';

/** Why a member can't manage the voice channel they are in. */
export type OwnedChannelError = 'not_in_voice' | 'not_temp' | 'not_owner';

@Injectable()
export class TempVoiceService {
  private readonly logger = new Logger(TempVoiceService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleSettings: ModuleSettingsService,
    private readonly client: Client,
  ) {}

  async handleJoin(state: VoiceState) {
    const member = state.member;
    if (!member) return;
    const isEnabled = await this.moduleSettings.isEnabled(
      member.guild.id,
      tempVoiceModule.key,
    );
    if (!isEnabled) return;
    const channelId = state.channelId;
    if (!channelId) return;

    const settings = await this.moduleSettings.getSettings(
      member.guild.id,
      tempVoiceModule,
    );
    if (state.channelId === settings.creatorChannelId) {
      await this.createChannel(member, settings);
    } else {
      await this.prisma.tempVoiceChannel.updateMany({
        where: {
          channelId,
        },
        data: {
          emptySince: null,
        },
      });
    }
  }

  async handleLeave(state: VoiceState) {
    const channel = state.channel;
    if (!channel) return;

    const humansCount = channel.members.filter(
      (member) => !member.user.bot,
    ).size;
    if (humansCount > 0) return;

    await this.prisma.tempVoiceChannel.updateMany({
      where: {
        channelId: channel.id,
      },
      data: {
        emptySince: new Date(),
      },
    });
  }

  private async createChannel(
    member: GuildMember,
    settings: TempVoiceSettings,
  ) {
    const name = settings.nameTemplate
      .replaceAll('{user}', () => member.displayName)
      .slice(0, 100);
    const parent = settings.categoryId ?? member.voice.channel?.parentId;

    try {
      const channel = await member.guild.channels.create({
        name,
        type: ChannelType.GuildVoice,
        parent,
        userLimit: settings.userLimit,
      });

      await this.prisma.tempVoiceChannel.create({
        data: {
          channelId: channel.id,
          guildId: member.guild.id,
          ownerId: member.id,
          emptySince: new Date(),
        },
      });

      await member.voice.setChannel(channel).catch(() => null);
    } catch (error) {
      return this.logger.warn(
        `Could not create channel in guild ${member.guild.id}: ${String(error)}`,
      );
    }
  }

  @Interval(60_000)
  async cleanup() {
    if (!this.client.isReady()) return;

    const entries = await this.prisma.tempVoiceChannel.findMany();

    for (const entry of entries) {
      const channel = this.client.channels.cache.get(entry.channelId);

      if (!channel?.isVoiceBased()) {
        await this.prisma.tempVoiceChannel.deleteMany({
          where: { channelId: entry.channelId },
        });
        continue;
      }

      const humans = channel.members.filter((member) => !member.user.bot).size;

      if (humans > 0) {
        if (entry.emptySince) {
          await this.setEmptySince(entry.channelId, null);
        }
        continue;
      }

      if (!entry.emptySince) {
        await this.setEmptySince(entry.channelId, new Date());
        continue;
      }

      const settings = await this.moduleSettings.getSettings(
        entry.guildId,
        tempVoiceModule,
      );
      const emptyFor = Date.now() - entry.emptySince.getTime();
      if (emptyFor < settings.deleteAfterMinutes * 60_000) continue;

      try {
        await channel.delete();
        await this.prisma.tempVoiceChannel.deleteMany({
          where: { channelId: entry.channelId },
        });
      } catch (error) {
        this.logger.warn(
          `Could not delete temp channel ${entry.channelId}: ${String(error)}`,
        );
      }
    }
  }

  private async setEmptySince(channelId: string, emptySince: Date | null) {
    await this.prisma.tempVoiceChannel.updateMany({
      where: { channelId },
      data: { emptySince },
    });
  }

  async getOwnedChannel(
    member: GuildMember,
  ): Promise<VoiceBasedChannel | OwnedChannelError> {
    const channel = member.voice.channel;
    if (!channel) return 'not_in_voice';

    const entry = await this.prisma.tempVoiceChannel.findUnique({
      where: { channelId: channel.id },
    });

    if (!entry) return 'not_temp';

    if (entry.ownerId !== member.id) return 'not_owner';

    return channel;
  }
}
