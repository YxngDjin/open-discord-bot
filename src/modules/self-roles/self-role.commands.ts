import { Injectable } from '@nestjs/common';
import {
  ChannelType,
  Colors,
  EmbedBuilder,
  type GuildBasedChannel,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  type Role,
} from 'discord.js';
import {
  ChannelOption,
  Context,
  createCommandGroupDecorator,
  IntegerOption,
  Options,
  RoleOption,
  type SlashCommandContext,
  StringOption,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import type { SelfRoleMode } from '../../generated/prisma/enums.js';
import { selfRolesTranslations } from './i18n/index.js';
import { MAX_OPTIONS, SelfRolesService } from './self-role.service.js';

type Interaction = SlashCommandContext[0];

/** Embed descriptions may be at most 4096 characters long. */
const EMBED_DESCRIPTION_LIMIT = 4096;

export const SelfRoleCommandsDecorator = createCommandGroupDecorator({
  name: 'self-role',
  description: 'Manage self role panels',
  descriptionLocalizations: { de: 'Selbstrollen-Panels verwalten' },
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
});

/** The panel option is the same in every subcommand except create. */
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

@Injectable()
@SelfRoleCommandsDecorator()
export class SelfRoleCommands {
  constructor(private readonly selfRoleService: SelfRolesService) {}

  private translate(interaction: Interaction) {
    return selfRolesTranslations[resolveLocale(interaction.locale)].admin;
  }

  /** Every answer of /self-role is only visible to the admin. */
  private reply(interaction: Interaction, content: string) {
    return interaction.reply({
      content,
      flags: MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  }

  @Subcommand({
    name: 'create',
    description: 'Create a new self role panel',
    descriptionLocalizations: { de: 'Ein neues Selbstrollen-Panel erstellen' },
  })
  async onCreate(
    @Context() [interaction]: SlashCommandContext,
    @Options() { channel, title, description, mode }: CreateDto,
  ) {
    const t = this.translate(interaction);
    const panel = await this.selfRoleService.createPanel(
      interaction.guildId!,
      channel.id,
      title,
      description,
      mode,
    );

    return this.reply(
      interaction,
      t.created({ panel: panel.id, channel: `<#${channel.id}>` }),
    );
  }

  @Subcommand({
    name: 'add-role',
    description: 'Add a role to a panel',
    descriptionLocalizations: { de: 'Eine Rolle zu einem Panel hinzufügen' },
  })
  async onAddRole(
    @Context() [interaction]: SlashCommandContext,
    @Options() { panel, role, label, emoji }: AddRoleDto,
  ) {
    const t = this.translate(interaction);
    const guildId = interaction.guildId!;
    const mention = `<@&${role.id}>`;

    if (role.id === guildId) {
      return this.reply(interaction, t.roleEveryone);
    }

    if (!role.editable) {
      return this.reply(interaction, t.roleNotEditable({ role: mention }));
    }

    if (role.permissions.has(PermissionFlagsBits.Administrator)) {
      return this.reply(interaction, t.roleAdmin({ role: mention }));
    }

    const result = await this.selfRoleService.addOption(
      guildId,
      panel,
      role.id,
      label || role.name,
      emoji,
    );

    const messages: Record<typeof result, string> = {
      ok: t.roleAdded({ role: mention, panel }),
      exists: t.roleExists({ role: mention, panel }),
      full: t.panelFull({ panel, max: MAX_OPTIONS }),
      not_found: t.panelNotFound({ panel }),
    };

    return this.reply(interaction, messages[result]);
  }

  @Subcommand({
    name: 'remove-role',
    description: 'Remove a role from a panel',
    descriptionLocalizations: { de: 'Eine Rolle aus einem Panel entfernen' },
  })
  async onRemoveRole(
    @Context() [interaction]: SlashCommandContext,
    @Options() { panel, role }: RemoveRoleDto,
  ) {
    const t = this.translate(interaction);
    const mention = `<@&${role.id}>`;
    const removed = await this.selfRoleService.removeOption(
      interaction.guildId!,
      panel,
      role.id,
    );

    return this.reply(
      interaction,
      removed
        ? t.roleRemoved({ role: mention, panel })
        : t.roleNotInPanel({ role: mention, panel }),
    );
  }

  @Subcommand({
    name: 'publish',
    description: 'Post a panel or update the posted message',
    descriptionLocalizations: {
      de: 'Ein Panel posten oder die gepostete Nachricht aktualisieren',
    },
  })
  async onPublish(
    @Context() [interaction]: SlashCommandContext,
    @Options() { panel }: PanelDto,
  ) {
    const t = this.translate(interaction);
    const result = await this.selfRoleService.publishPanel(
      interaction.guildId!,
      panel,
    );

    const messages: Record<typeof result, string> = {
      ok: t.published({ panel }),
      not_found: t.panelNotFound({ panel }),
      channel_missing: t.channelMissing({ panel }),
      no_permission: t.publishFailed({ panel }),
    };

    return this.reply(interaction, messages[result]);
  }

  @Subcommand({
    name: 'list',
    description: 'Show all panels of this server',
    descriptionLocalizations: { de: 'Alle Panels dieses Servers anzeigen' },
  })
  async onList(@Context() [interaction]: SlashCommandContext) {
    const t = this.translate(interaction).list;
    const panels = await this.selfRoleService.listPanels(interaction.guildId!);

    if (panels.length === 0) {
      return this.reply(interaction, t.empty);
    }

    const lines = panels.map((panel) =>
      t.line({
        panel: panel.id,
        title: panel.title,
        channel: `<#${panel.channelId}>`,
        roles: panel.options.length,
        mode: t.modes[panel.mode],
        published: panel.messageId !== null,
      }),
    );

    const embed = new EmbedBuilder()
      .setTitle(t.title)
      .setDescription(lines.join('\n').slice(0, EMBED_DESCRIPTION_LIMIT))
      .setColor(Colors.Blurple);

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }

  @Subcommand({
    name: 'delete',
    description: 'Delete a panel and its posted message',
    descriptionLocalizations: {
      de: 'Ein Panel und seine gepostete Nachricht löschen',
    },
  })
  async onDelete(
    @Context() [interaction]: SlashCommandContext,
    @Options() { panel }: PanelDto,
  ) {
    const t = this.translate(interaction);
    const deleted = await this.selfRoleService.deletePanel(
      interaction.guildId!,
      panel,
    );

    return this.reply(
      interaction,
      deleted ? t.deleted({ panel }) : t.panelNotFound({ panel }),
    );
  }
}
