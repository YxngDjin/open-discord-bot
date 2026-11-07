import { ChannelType, type GuildBasedChannel } from 'discord.js';
import { BooleanOption, ChannelOption, StringOption } from 'necord';

export const toggles = {
  moderation: 'logModeration',
  joins: 'logJoins',
  leaves: 'logLeaves',
} as const;

export type ToggleEvent = keyof typeof toggles;

export class ModlogChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Log channel (leave empty to remove)',
    description_localizations: {
      de: 'Log-Channel (leer lassen zum Entfernen)',
    },
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class ModlogToggleDto {
  @StringOption({
    name: 'event',
    description: 'What should be logged',
    description_localizations: { de: 'Was geloggt werden soll' },
    required: true,
    choices: [
      {
        name: 'Moderation cases',
        name_localizations: { de: 'Moderationsfälle' },
        value: 'moderation',
      },
      {
        name: 'Joins',
        name_localizations: { de: 'Beitritte' },
        value: 'joins',
      },
      {
        name: 'Leaves',
        name_localizations: { de: 'Austritte' },
        value: 'leaves',
      },
    ],
  })
  event: ToggleEvent;

  @BooleanOption({
    name: 'enabled',
    description: 'Log this event',
    description_localizations: { de: 'Dieses Ereignis loggen' },
    required: true,
  })
  enabled: boolean;
}
