import { ChannelType, type GuildBasedChannel, type Role } from 'discord.js';
import { ChannelOption, IntegerOption, RoleOption, StringOption } from 'necord';
import type { SelfRoleMode } from '../../../generated/prisma/enums.js';
import { describeName, describeOption } from '../../../core/i18n/localize.js';

const panelOption = {
  name: 'panel',
  ...describeOption((t) => t.selfRoles.options.panel),
  required: true,
  min_value: 1,
};

export class CreateDto {
  @ChannelOption({
    name: 'channel',
    ...describeOption((t) => t.selfRoles.options.channel),
    required: true,
    channel_types: [ChannelType.GuildText, ChannelType.GuildAnnouncement],
  })
  channel: GuildBasedChannel;

  @StringOption({
    name: 'title',
    ...describeOption((t) => t.selfRoles.options.title),
    required: true,
    max_length: 256,
  })
  title: string;

  @StringOption({
    name: 'description',
    ...describeOption((t) => t.selfRoles.options.description),
    required: false,
    max_length: 1000,
  })
  description?: string;

  @StringOption({
    name: 'mode',
    ...describeOption((t) => t.selfRoles.options.mode),
    required: false,
    choices: [
      {
        ...describeName((t) => t.selfRoles.admin.list.modes.BUTTONS),
        value: 'BUTTONS',
      },
      {
        ...describeName((t) => t.selfRoles.admin.list.modes.SELECT),
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
    ...describeOption((t) => t.selfRoles.options.addRole),
    required: true,
  })
  role: Role;

  @StringOption({
    name: 'label',
    ...describeOption((t) => t.selfRoles.options.label),
    required: false,
    max_length: 80,
  })
  label?: string;

  @StringOption({
    name: 'emoji',
    ...describeOption((t) => t.selfRoles.options.emoji),
    required: false,
  })
  emoji?: string;
}

export class RemoveRoleDto {
  @IntegerOption(panelOption)
  panel: number;

  @RoleOption({
    name: 'role',
    ...describeOption((t) => t.selfRoles.options.removeRole),
    required: true,
  })
  role: Role;
}
