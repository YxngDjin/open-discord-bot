import { ChannelType, type GuildBasedChannel } from 'discord.js';
import { ChannelOption, IntegerOption, StringOption } from 'necord';
import { describeOption } from '../../../core/i18n/localize.js';

export class TempVoiceChannelDto {
  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.tempVoice.options.channel),
    required: false,
    channel_types: [ChannelType.GuildVoice],
  })
  channel?: GuildBasedChannel;
}

export class TempVoiceCategoryDto {
  @ChannelOption({
    name: 'category',
    ...describeOption((t) => t.tempVoice.options.category),
    required: false,
    channel_types: [ChannelType.GuildCategory],
  })
  category?: GuildBasedChannel;
}

export class TempVoiceNameDto {
  @StringOption({
    name: 'template',
    ...describeOption((t) => t.tempVoice.options.template),
    required: true,
    min_length: 1,
    max_length: 100,
  })
  template: string;
}

export class TempVoiceLimitDto {
  @IntegerOption({
    name: 'users',
    ...describeOption((t) => t.tempVoice.options.users),
    required: true,
    min_value: 0,
    max_value: 99,
  })
  users: number;
}

export class TempVoiceDeleteAfterDto {
  @IntegerOption({
    name: 'minutes',
    ...describeOption((t) => t.tempVoice.options.minutes),
    required: true,
    min_value: 0,
    max_value: 60,
  })
  minutes: number;
}

export class VoiceNameDto {
  @StringOption({
    name: 'name',
    ...describeOption((t) => t.tempVoice.options.name),
    required: true,
    min_length: 1,
    max_length: 100,
  })
  name: string;
}

export class VoiceLimitDto {
  @IntegerOption({
    name: 'users',
    ...describeOption((t) => t.tempVoice.options.users),
    required: true,
    min_value: 0,
    max_value: 99,
  })
  users: number;
}
