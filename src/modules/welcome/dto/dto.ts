import { ChannelType, Role, type GuildBasedChannel } from 'discord.js';
import {
  BooleanOption,
  ChannelOption,
  IntegerOption,
  RoleOption,
  StringOption,
} from 'necord';
import { describeOption } from '../../../core/i18n/localize.js';

export class WelcomeChannelDto {
  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.welcome.options.channel),
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class WelcomeMessageDto {
  @StringOption({
    name: 'text',
    ...describeOption((t) => t.welcome.options.messageText),
    required: false,
    max_length: 2000,
  })
  text?: string;
}

export class WelcomeRoleDto {
  @RoleOption({
    name: 'role',
    ...describeOption((t) => t.welcome.options.role),
    required: true,
  })
  role: Role;
}

export class WelcomeGoodbyeDto {
  @BooleanOption({
    name: 'enabled',
    ...describeOption((t) => t.welcome.options.goodbyeEnabled),
    required: true,
  })
  enabled: boolean;

  @StringOption({
    name: 'text',
    ...describeOption((t) => t.welcome.options.goodbyeText),
    required: false,
    max_length: 2000,
  })
  text?: string;
}

export class WelcomeDelayDto {
  @IntegerOption({
    name: 'seconds',
    ...describeOption((t) => t.welcome.options.seconds),
    required: true,
    min_value: 0,
    max_value: 3600,
  })
  seconds: number;
}
