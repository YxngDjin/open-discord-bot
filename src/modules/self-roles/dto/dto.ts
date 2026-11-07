import { ChannelType, type GuildBasedChannel, type Role } from 'discord.js';
import { ChannelOption, IntegerOption, RoleOption, StringOption } from 'necord';
import type { SelfRoleMode } from '../../../generated/prisma/enums.js';

const panelOption = {
  name: 'panel',
  description: 'ID of the panel (see /self-role list)',
  description_localizations: { de: 'ID des Panels (siehe /self-role list)' },
  required: true,
  min_value: 1,
};

export class CreateDto {
  @ChannelOption({
    name: 'channel',
    description: 'Channel where the panel will be posted',
    description_localizations: {
      de: 'Channel, in dem das Panel gepostet wird',
    },
    required: true,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel: GuildBasedChannel;

  @StringOption({
    name: 'title',
    description: 'Title of the panel',
    description_localizations: { de: 'Titel des Panels' },
    required: true,
    max_length: 256,
  })
  title: string;

  @StringOption({
    name: 'description',
    description: 'Text below the title',
    description_localizations: { de: 'Text unter dem Titel' },
    required: false,
    max_length: 1000,
  })
  description?: string;

  @StringOption({
    name: 'mode',
    description: 'Buttons or a select menu (default: buttons)',
    description_localizations: {
      de: 'Buttons oder ein Auswahlmenü (Standard: Buttons)',
    },
    required: false,
    choices: [
      {
        name: 'Buttons',
        name_localizations: { de: 'Buttons' },
        value: 'BUTTONS',
      },
      {
        name: 'Select menu',
        name_localizations: { de: 'Auswahlmenü' },
        value: 'SELECT',
      },
    ],
  })
  mode?: SelfRoleMode;
}

/** For subcommands that only need a panel: publish and delete. */
export class PanelDto {
  @IntegerOption(panelOption)
  panel: number;
}

export class AddRoleDto {
  @IntegerOption(panelOption)
  panel: number;

  @RoleOption({
    name: 'role',
    description: 'The role to add',
    description_localizations: { de: 'Die Rolle, die hinzugefügt wird' },
    required: true,
  })
  role: Role;

  @StringOption({
    name: 'label',
    description: 'Text on the button (default: role name)',
    description_localizations: {
      de: 'Text auf dem Button (Standard: Rollenname)',
    },
    required: false,
    max_length: 80,
  })
  label?: string;

  @StringOption({
    name: 'emoji',
    description: 'Emoji next to the text, e.g. 🎮',
    description_localizations: { de: 'Emoji neben dem Text, z. B. 🎮' },
    required: false,
  })
  emoji?: string;
}

export class RemoveRoleDto {
  @IntegerOption(panelOption)
  panel: number;

  @RoleOption({
    name: 'role',
    description: 'The role to remove',
    description_localizations: { de: 'Die Rolle, die entfernt wird' },
    required: true,
  })
  role: Role;
}
