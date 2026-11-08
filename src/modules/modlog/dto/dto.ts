import { ChannelType, type GuildBasedChannel } from 'discord.js';
import { BooleanOption, ChannelOption, StringOption } from 'necord';
import { describeName, describeOption } from '../../../core/i18n/localize.js';

export const toggles = {
  moderation: 'logModeration',
  joins: 'logJoins',
  leaves: 'logLeaves',
} as const;

export type ToggleEvent = keyof typeof toggles;

export class ModlogChannelDto {
  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.modlog.options.channel),
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class ModlogToggleDto {
  @StringOption({
    name: 'event',
    ...describeOption((t) => t.modlog.options.event),
    required: true,
    choices: [
      {
        ...describeName((t) => t.modlog.admin.events.moderation),
        value: 'moderation',
      },
      {
        ...describeName((t) => t.modlog.admin.events.joins),
        value: 'joins',
      },
      {
        ...describeName((t) => t.modlog.admin.events.leaves),
        value: 'leaves',
      },
    ],
  })
  event: ToggleEvent;

  @BooleanOption({
    name: 'enabled',
    ...describeOption((t) => t.modlog.options.enabled),
    required: true,
  })
  enabled: boolean;
}
