import {
  ChannelType,
  type GuildBasedChannel,
  type Role,
  type User,
} from 'discord.js';
import {
  BooleanOption,
  ChannelOption,
  IntegerOption,
  RoleOption,
  StringOption,
  UserOption,
} from 'necord';
import { describeOption } from '../../../core/i18n/localize.js';

export class RankDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.xp.options.rankUser),
    required: false,
  })
  user?: User;
}

export class XpAmountDto {
  @IntegerOption({
    name: 'amount',
    ...describeOption((t) => t.xp.options.amount),
    required: true,
    min_value: 0,
    max_value: 100,
  })
  amount: number;
}

export class XpCooldownDto {
  @IntegerOption({
    name: 'seconds',
    ...describeOption((t) => t.xp.options.seconds),
    required: true,
    min_value: 0,
    max_value: 3600,
  })
  seconds: number;
}

export class XpIgnoreChannelDto {
  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.xp.options.ignoreChannel),
    required: true,
    channel_types: [
      ChannelType.GuildText,
      ChannelType.GuildAnnouncement,
      ChannelType.GuildVoice,
      ChannelType.GuildStageVoice,
    ],
  })
  channel: GuildBasedChannel;
}

export class XpLevelUpDto {
  @BooleanOption({
    name: 'enabled',
    ...describeOption((t) => t.xp.options.levelupEnabled),
    required: true,
  })
  enabled: boolean;

  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.xp.options.levelupChannel),
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class XpRoleAddDto {
  @IntegerOption({
    name: 'level',
    ...describeOption((t) => t.xp.options.roleAddLevel),
    required: true,
    min_value: 1,
    max_value: 1000,
  })
  level: number;

  @RoleOption({
    name: 'role',
    ...describeOption((t) => t.xp.options.roleAddRole),
    required: true,
  })
  role: Role;
}

export class XpRoleRemoveDto {
  @IntegerOption({
    name: 'level',
    ...describeOption((t) => t.xp.options.roleRemoveLevel),
    required: true,
    min_value: 1,
    max_value: 1000,
  })
  level: number;
}

export class XpLeaderboardChannelDto {
  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.xp.options.leaderboardChannel),
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class XpLeaderboardTimeDto {
  @StringOption({
    name: 'time',
    ...describeOption((t) => t.xp.options.leaderboardTime),
    required: true,
    min_length: 5,
    max_length: 5,
  })
  time: string;
}
