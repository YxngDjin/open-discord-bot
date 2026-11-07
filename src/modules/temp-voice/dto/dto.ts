import { ChannelType, type GuildBasedChannel } from 'discord.js';
import { ChannelOption, IntegerOption, StringOption } from 'necord';

export class TempVoiceChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Voice channel to join to create a channel (empty = off)',
    description_localizations: {
      de: 'Voice-Channel, der einen Channel erstellt (leer = aus)',
    },
    required: false,
    channel_types: [ChannelType.GuildVoice],
  })
  channel?: GuildBasedChannel;
}

export class TempVoiceCategoryDto {
  @ChannelOption({
    name: 'category',
    description: 'Category for new channels (empty = same as join channel)',
    description_localizations: {
      de: 'Kategorie für neue Channels (leer = wie Beitreten-Channel)',
    },
    required: false,
    channel_types: [ChannelType.GuildCategory],
  })
  category?: GuildBasedChannel;
}

export class TempVoiceNameDto {
  @StringOption({
    name: 'template',
    description: 'Name of new channels, {user} = member name',
    description_localizations: {
      de: 'Name neuer Channels, {user} = Name des Mitglieds',
    },
    required: true,
    min_length: 1,
    max_length: 100,
  })
  template: string;
}

export class TempVoiceLimitDto {
  @IntegerOption({
    name: 'users',
    description: 'Maximum number of users (0 = no limit)',
    description_localizations: {
      de: 'Maximale Anzahl Nutzer (0 = kein Limit)',
    },
    required: true,
    min_value: 0,
    max_value: 99,
  })
  users: number;
}

export class TempVoiceDeleteAfterDto {
  @IntegerOption({
    name: 'minutes',
    description: 'Minutes an empty channel is kept (0 = delete right away)',
    description_localizations: {
      de: 'Minuten, die ein leerer Channel bleibt (0 = sofort löschen)',
    },
    required: true,
    min_value: 0,
    max_value: 60,
  })
  minutes: number;
}

export class VoiceNameDto {
  @StringOption({
    name: 'name',
    description: 'New name of your channel',
    description_localizations: { de: 'Neuer Name deines Channels' },
    required: true,
    min_length: 1,
    max_length: 100,
  })
  name: string;
}

export class VoiceLimitDto {
  @IntegerOption({
    name: 'users',
    description: 'Maximum number of users (0 = no limit)',
    description_localizations: {
      de: 'Maximale Anzahl Nutzer (0 = kein Limit)',
    },
    required: true,
    min_value: 0,
    max_value: 99,
  })
  users: number;
}
