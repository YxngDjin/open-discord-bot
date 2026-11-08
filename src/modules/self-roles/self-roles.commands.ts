import { Injectable } from '@nestjs/common';
import {
  Colors,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  Context,
  createCommandGroupDecorator,
  Options,
  type SlashCommandContext,
  Subcommand,
} from 'necord';
import { resolveLocale } from '../../core/i18n/locales.js';
import { MAX_OPTIONS, SelfRolesService } from './self-roles.service.js';
import { AddRoleDto, CreateDto, PanelDto, RemoveRoleDto } from './dto/dto.js';
import { describeCommand } from '../../core/i18n/localize.js';
import { translations } from '../../core/i18n/translations/index.js';

type Interaction = SlashCommandContext[0];

/** Embed descriptions may be at most 4096 characters long. */
const EMBED_DESCRIPTION_LIMIT = 4096;

export const SelfRolesCommandsDecorator = createCommandGroupDecorator({
  name: 'self-role',
  ...describeCommand((t) => t.selfRoles.commands.group),
  contexts: [InteractionContextType.Guild],
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
});

@Injectable()
@SelfRolesCommandsDecorator()
export class SelfRolesCommands {
  constructor(private readonly selfRolesService: SelfRolesService) {}

  private translate(interaction: Interaction) {
    return translations[resolveLocale(interaction.locale)].selfRoles.admin;
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
    ...describeCommand((t) => t.selfRoles.commands.create),
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
    ...describeCommand((t) => t.selfRoles.commands.addRole),
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
    ...describeCommand((t) => t.selfRoles.commands.removeRole),
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
    ...describeCommand((t) => t.selfRoles.commands.publish),
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
    ...describeCommand((t) => t.selfRoles.commands.list),
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
    ...describeCommand((t) => t.selfRoles.commands.delete),
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
