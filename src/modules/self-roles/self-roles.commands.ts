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
import { MAX_OPTIONS, SelfRolesService } from './self-roles.service.js';
import { AddRoleDto, CreateDto, PanelDto, RemoveRoleDto } from './dto/dto.js';

type Interaction = SlashCommandContext[0];

/** Embed descriptions may be at most 4096 characters long. */
const EMBED_DESCRIPTION_LIMIT = 4096;

export const SelfRolesCommandsDecorator = createCommandGroupDecorator({
  name: 'self-role',
  description: 'Manage self role panels',
  descriptionLocalizations: { de: 'Selbstrollen-Panels verwalten' },
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
});

@Injectable()
@SelfRolesCommandsDecorator()
export class SelfRolesCommands {
  constructor(private readonly selfRolesService: SelfRolesService) {}

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

  /**
   * Updates an already posted panel after its roles changed and returns a
   * second line for the answer, so admins don't have to run publish again.
   */
  private async refreshNote(interaction: Interaction, panel: number) {
    const t = this.translate(interaction);
    const result = await this.selfRolesService.refreshPanel(
      interaction.guildId!,
      panel,
    );

    const notes: Record<typeof result, string> = {
      ok: t.refreshed,
      not_published: t.publishHint,
      not_found: t.panelNotFound({ panel }),
      channel_missing: t.channelMissing({ panel }),
      no_permission: t.publishFailed({ panel }),
    };

    return notes[result];
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
    const panel = await this.selfRolesService.createPanel(
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

    const result = await this.selfRolesService.addOption(
      guildId,
      panel,
      role.id,
      label || role.name,
      emoji,
    );

    if (result === 'ok') {
      const note = await this.refreshNote(interaction, panel);
      return this.reply(
        interaction,
        `${t.roleAdded({ role: mention, panel })}\n${note}`,
      );
    }

    const errors: Record<Exclude<typeof result, 'ok'>, string> = {
      exists: t.roleExists({ role: mention, panel }),
      full: t.panelFull({ panel, max: MAX_OPTIONS }),
      not_found: t.panelNotFound({ panel }),
    };

    return this.reply(interaction, errors[result]);
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
    const removed = await this.selfRolesService.removeOption(
      interaction.guildId!,
      panel,
      role.id,
    );

    if (!removed) {
      return this.reply(
        interaction,
        t.roleNotInPanel({ role: mention, panel }),
      );
    }

    const note = await this.refreshNote(interaction, panel);
    return this.reply(
      interaction,
      `${t.roleRemoved({ role: mention, panel })}\n${note}`,
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
    const result = await this.selfRolesService.publishPanel(
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
    const panels = await this.selfRolesService.listPanels(interaction.guildId!);

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
    const deleted = await this.selfRolesService.deletePanel(
      interaction.guildId!,
      panel,
    );

    return this.reply(
      interaction,
      deleted ? t.deleted({ panel }) : t.panelNotFound({ panel }),
    );
  }
}
