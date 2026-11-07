import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service.js';
import type { SelfRoleMode } from '../../generated/prisma/enums.js';
import {
  Client,
  type GuildMember,
  PermissionFlagsBits,
  type Role,
} from 'discord.js';
import { renderPanel } from './self-roles.render.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { selfRolesModule } from './self-roles.definition.js';

/** Discord allows at most 25 buttons (5 rows × 5) or 25 select menu entries. */
export const MAX_OPTIONS = 25;

export type ToggleRoleResult =
  | 'disabled'
  | 'not_found'
  | 'role_missing'
  | 'forbidden'
  | 'failed'
  | 'added'
  | 'removed';

export type SyncRolesResult = 'disabled' | 'not_found' | 'failed' | 'updated';

export type PublishPanelResult =
  'ok' | 'not_found' | 'channel_missing' | 'no_permission';

@Injectable()
export class SelfRolesService {
  private readonly logger = new Logger(SelfRolesService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleSettings: ModuleSettingsService,
    private readonly client: Client,
  ) {}

  async createPanel(
    guildId: string,
    channelId: string,
    title: string,
    description?: string,
    mode?: SelfRoleMode,
  ) {
    return await this.prisma.selfRolePanel.create({
      data: {
        guildId,
        channelId,
        title,
        description,
        mode,
      },
    });
  }

  async getPanel(guildId: string, panelId: number) {
    return await this.prisma.selfRolePanel.findFirst({
      where: {
        id: panelId,
        guildId,
      },
      include: {
        options: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async listPanels(guildId: string) {
    return await this.prisma.selfRolePanel.findMany({
      where: { guildId },
      include: {
        options: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async deletePanel(guildId: string, panelId: number) {
    const panel = await this.getPanel(guildId, panelId);
    if (!panel) return false;

    // Remove the posted message too, otherwise its buttons stay in the channel
    // and only answer with "not found". If the message is already gone or the
    // bot lacks permissions, the panel is still deleted from the database.
    if (panel.messageId) {
      const channel = await this.client.channels
        .fetch(panel.channelId)
        .catch(() => null);
      if (channel?.isSendable()) {
        await channel.messages.delete(panel.messageId).catch(() => null);
      }
    }

    const result = await this.prisma.selfRolePanel.deleteMany({
      where: {
        id: panelId,
        guildId,
      },
    });

    return result.count > 0;
  }

  async setMessageId(panelId: number, messageId: string) {
    return await this.prisma.selfRolePanel.update({
      where: { id: panelId },
      data: { messageId },
    });
  }

  async addOption(
    guildId: string,
    panelId: number,
    roleId: string,
    label: string,
    emoji?: string,
  ): Promise<'ok' | 'exists' | 'full' | 'not_found'> {
    const panel = await this.getPanel(guildId, panelId);
    if (!panel) return 'not_found';

    if (panel.options.length >= MAX_OPTIONS) return 'full';

    if (panel.options.some((option) => option.roleId === roleId))
      return 'exists';

    await this.prisma.selfRoleOption.create({
      data: {
        panelId,
        roleId,
        label,
        emoji,
        position: panel.options.length,
      },
    });

    return 'ok';
  }

  async removeOption(
    guildId: string,
    panelId: number,
    roleId: string,
  ): Promise<boolean> {
    const result = await this.prisma.selfRoleOption.deleteMany({
      where: {
        panelId,
        roleId,
        panel: { guildId },
      },
    });

    if (result.count > 0) {
      return true;
    } else {
      return false;
    }
  }

  async publishPanel(
    guildId: string,
    panelId: number,
  ): Promise<PublishPanelResult> {
    const panel = await this.getPanel(guildId, panelId);
    if (!panel) return 'not_found';

    const channel = await this.client.channels
      .fetch(panel.channelId)
      .catch(() => null);

    if (!channel?.isSendable()) return 'channel_missing';

    const payload = renderPanel(panel);

    try {
      if (panel.messageId) {
        const message = await channel.messages
          .fetch(panel.messageId)
          .catch(() => null);
        if (message) {
          await message.edit(payload);
          return 'ok';
        }
      }
      const message = await channel.send(payload);
      await this.setMessageId(panelId, message.id);
      return 'ok';
    } catch (error) {
      this.logger.error(error);
      return 'no_permission';
    }
  }

  /**
   * Updates the posted message after the roles of a panel changed.
   * Panels that were never posted stay unposted, so admins can finish setting
   * them up before members see them.
   */
  async refreshPanel(
    guildId: string,
    panelId: number,
  ): Promise<PublishPanelResult | 'not_published'> {
    const panel = await this.getPanel(guildId, panelId);
    if (!panel) return 'not_found';
    if (!panel.messageId) return 'not_published';

    return this.publishPanel(guildId, panelId);
  }

  async toggleRole(
    member: GuildMember,
    panelId: number,
    roleId: string,
  ): Promise<ToggleRoleResult> {
    const isEnabled = await this.moduleSettings.isEnabled(
      member.guild.id,
      selfRolesModule.key,
    );
    if (!isEnabled) return 'disabled';

    const panel = await this.getPanel(member.guild.id, panelId);
    if (!panel || !panel.options.some((option) => option.roleId === roleId))
      return 'not_found';

    const role = member.guild.roles.cache.get(roleId);
    if (!role) return 'role_missing';

    // A role may get dangerous permissions after it was added to the panel,
    // so check again on every click.
    if (role.permissions.has(PermissionFlagsBits.Administrator)) {
      return 'forbidden';
    }

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(role);
        return 'removed';
      } else {
        await member.roles.add(role);
        return 'added';
      }
    } catch (error) {
      this.logger.warn(error);
      return 'failed';
    }
  }

  async syncRoles(
    member: GuildMember,
    panelId: number,
    selected: string[],
  ): Promise<SyncRolesResult> {
    const isEnabled = await this.moduleSettings.isEnabled(
      member.guild.id,
      selfRolesModule.key,
    );
    if (!isEnabled) return 'disabled';

    const panel = await this.getPanel(member.guild.id, panelId);
    if (!panel) return 'not_found';

    const panelRoles = panel.options
      .map((option) => member.guild.roles.cache.get(option.roleId))
      .filter(
        (role): role is Role =>
          role !== undefined &&
          !role.permissions.has(PermissionFlagsBits.Administrator),
      );
    const toAdd = panelRoles.filter(
      (role) => selected.includes(role.id) && !member.roles.cache.has(role.id),
    );

    const toRemove = panelRoles.filter(
      (role) => !selected.includes(role.id) && member.roles.cache.has(role.id),
    );

    try {
      if (toAdd.length > 0) await member.roles.add(toAdd);
      if (toRemove.length > 0) await member.roles.remove(toRemove);
      return 'updated';
    } catch (error) {
      this.logger.warn(error);
      return 'failed';
    }
  }
}
