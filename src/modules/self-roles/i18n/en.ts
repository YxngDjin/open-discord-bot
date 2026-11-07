import type { SelfRoleMode } from '../../../generated/prisma/enums.js';
import type {
  SyncRolesResult,
  ToggleRoleResult,
} from '../self-roles.service.js';

/** Answers to a click on a panel button, one per result of toggleRole. */
const clicks: Record<ToggleRoleResult, (params: { role: string }) => string> = {
  added: (params) => `✅ You now have the role ${params.role}.`,
  removed: (params) => `✅ The role ${params.role} was removed.`,
  disabled: () => 'Self roles are currently disabled on this server.',
  not_found: () => 'This role is no longer part of the panel.',
  role_missing: () => 'This role no longer exists.',
  forbidden: () => 'This role cannot be assigned through a panel.',
  failed: () => "I couldn't update your roles. Please tell a server admin.",
};

export const en = {
  // /self-role (admin, user language)
  admin: {
    created: (params: { panel: number; channel: string }) =>
      `✅ Panel #${params.panel} created for ${params.channel}.\n` +
      'Next: add roles with `/self-role add-role`, then post it with `/self-role publish`.',
    panelNotFound: (params: { panel: number }) =>
      `❌ Panel #${params.panel} not found. See \`/self-role list\`.`,

    roleEveryone: "❌ The @everyone role can't be a self role.",
    roleNotEditable: (params: { role: string }) =>
      `❌ I can't assign ${params.role}. Move my bot role above it in the server settings.`,
    roleAdmin: (params: { role: string }) =>
      `❌ ${params.role} has administrator permissions and can't be a self role.`,
    roleExists: (params: { role: string; panel: number }) =>
      `❌ ${params.role} is already in panel #${params.panel}.`,
    panelFull: (params: { panel: number; max: number }) =>
      `❌ Panel #${params.panel} already has the maximum of ${params.max} roles.`,
    roleAdded: (params: { role: string; panel: number }) =>
      `✅ ${params.role} added to panel #${params.panel}.`,

    roleNotInPanel: (params: { role: string; panel: number }) =>
      `❌ ${params.role} is not in panel #${params.panel}, or the panel doesn't exist.`,
    roleRemoved: (params: { role: string; panel: number }) =>
      `✅ ${params.role} removed from panel #${params.panel}.`,

    channelMissing: (params: { panel: number }) =>
      `❌ The channel of panel #${params.panel} no longer exists.`,
    publishFailed: (params: { panel: number }) =>
      `❌ I couldn't post panel #${params.panel}. Check that I can send messages and embeds in that channel, and that all emojis are valid.`,
    published: (params: { panel: number }) =>
      `✅ Panel #${params.panel} is posted and up to date.`,

    // Second line after add-role / remove-role
    refreshed: '🔄 The posted panel was updated.',
    publishHint:
      'The panel is not posted yet. Post it with `/self-role publish` when you are done.',

    deleted: (params: { panel: number }) =>
      `✅ Panel #${params.panel} deleted.`,

    list: {
      title: 'Self role panels',
      empty: 'There are no panels yet. Create one with `/self-role create`.',
      modes: {
        BUTTONS: 'Buttons',
        SELECT: 'Select menu',
      } satisfies Record<SelfRoleMode, string>,
      line: (params: {
        panel: number;
        title: string;
        channel: string;
        roles: number;
        mode: string;
        published: boolean;
      }) =>
        `**#${params.panel}** ${params.title} • ${params.channel} • ` +
        `${params.roles} role(s) • ${params.mode} • ` +
        (params.published ? 'posted' : 'not posted yet'),
    },
  },

  // Clicks on a panel (member, user language)
  clicks,

  // Changes in a select menu panel (member, user language)
  sync: {
    updated: '✅ Your roles were updated.',
    disabled: 'Self roles are currently disabled on this server.',
    not_found: 'This panel no longer exists.',
    failed: "I couldn't update your roles. Please tell a server admin.",
  } satisfies Record<SyncRolesResult, string>,
};

export type SelfRolesTranslations = typeof en;
