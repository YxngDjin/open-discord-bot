import { ChannelType, Role, type GuildBasedChannel } from 'discord.js';
import {
  BooleanOption,
  ChannelOption,
  IntegerOption,
  RoleOption,
  StringOption,
} from 'necord';

export class WelcomeChannelDto {
  @ChannelOption({
    name: 'channel',
    description: 'Channel for welcome messages (leave empty to remove)',
    description_localizations: {
      de: 'Channel für Begrüßungen (leer lassen zum Entfernen)',
    },
    required: false,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel?: GuildBasedChannel;
}

export class WelcomeMessageDto {
  @StringOption({
    name: 'text',
    description:
      'Placeholders: {user} {username} {server} {memberCount}. Empty = default',
    description_localizations: {
      de: 'Platzhalter: {user} {username} {server} {memberCount}. Leer = Standard',
    },
    required: false,
    max_length: 2000,
  })
  text?: string;
}

export class WelcomeRoleDto {
  @RoleOption({
    name: 'role',
    description: 'The role to add or remove',
    description_localizations: {
      de: 'Die Rolle, die hinzugefügt oder entfernt werden soll',
    },
    required: true,
  })
  role: Role;
}

export class WelcomeGoodbyeDto {
  @BooleanOption({
    name: 'enabled',
    description: 'Send a message when someone leaves',
    description_localizations: {
      de: 'Nachricht senden, wenn jemand den Server verlässt',
    },
    required: true,
  })
  enabled: boolean;

  @StringOption({
    name: 'text',
    description:
      'Placeholders: {username} {server} {memberCount}. Empty = default',
    description_localizations: {
      de: 'Platzhalter: {username} {server} {memberCount}. Leer = Standard',
    },
    required: false,
    max_length: 2000,
  })
  text?: string;
}

export class WelcomeDelayDto {
  @IntegerOption({
    name: 'seconds',
    description: 'Seconds to wait before giving auto roles (0-3600)',
    description_localizations: {
      de: 'Sekunden bis zur Vergabe der Auto-Rollen (0-3600)',
    },
    required: true,
    min_value: 0,
    max_value: 3600,
  })
  seconds: number;
}
