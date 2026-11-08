import type { CaseType } from '../../../generated/prisma/enums.js';

export const en = {
  // /language (admin, user language)
  language: {
    commands: {
      language: 'Show or change the server language',
    },
    options: {
      language: 'The new server language',
    },
    current: (params: { language: string }) =>
      `The server language is **${params.language}**.`,
    changed: (params: { language: string }) =>
      `The server language has been changed to **${params.language}**.`,
  },

  // /timezone (admin, user language)
  timezone: {
    commands: {
      timezone: 'Show or change the time zone of the server',
    },
    options: {
      timezone: "The server's time zone, e.g. Europe/Berlin",
    },
    current: (params: { timezone: string; time: string }) =>
      `🕒 The server time zone is **${params.timezone}**. It is ${params.time} there.`,
    changed: (params: { timezone: string; time: string }) =>
      `✅ Time zone set to **${params.timezone}**. It is ${params.time} there.`,
    invalid: (params: { timezone: string }) =>
      `❌ **${params.timezone}** is not a valid time zone. Pick one from the suggestions.`,
  },

  // /module (admin, user language)
  module: {
    commands: {
      module: "Manage the bot's modules on this server",
      list: 'Show all modules and whether they are enabled',
      enable: 'Enable a module on this server',
      disable: 'Disable a module on this server',
    },
    options: {
      module: 'The module to enable or disable',
    },
    noModules: 'No modules available.',
    enabled: (params: { module: string }) =>
      `✅ Module **${params.module}** enabled.`,
    disabled: (params: { module: string }) =>
      `❌ Module **${params.module}** disabled.`,
    missingModule: (params: { module: string }) =>
      `Module **${params.module}** does not exist.`,
  },

  // Error message of the global exception filter (ephemeral, user language)
  errors: {
    generic: 'Something went wrong. Please try again later.',
  },

  // Utility module
  utility: {
    // Command descriptions (shown in Discord's command list)
    commands: {
      ping: "Show the bot's latency",
      serverinfo: 'Show information about this server',
      userinfo: 'Show information about a member',
      clear: 'Delete the last messages in this channel',
      help: 'Show all commands',
    },

    // Option descriptions
    options: {
      user: 'The user to show (default: you)',
      amount: 'Number of messages to delete (1-100)',
    },

    // /serverinfo (public, server language)
    serverinfo: {
      owner: 'Owner',
      members: 'Members',
      channels: 'Channels',
      roles: 'Roles',
      boosts: 'Boosts',
      created: 'Created',
    },

    // /userinfo (public, server language)
    userinfo: {
      username: 'Username',
      id: 'ID',
      roles: 'Roles',
      created: 'Account created',
      joined: 'Joined server',
      none: 'none',
      unknown: 'unknown',
      notMember: '❌ This user is not a member of this server.',
    },

    // /clear (ephemeral, user language)
    clear: {
      wrongChannel: "❌ Messages can't be deleted in this channel.",
      deleted: (params: { count: number }) =>
        `🧹 Deleted ${params.count} message(s). Messages older than 14 days are skipped.`,
      failed:
        "❌ I couldn't delete messages here. I need the Manage Messages and Read Message History permissions.",
    },

    // /help (ephemeral, user language)
    help: {
      title: 'Commands',
      general: 'General',
      footer: 'Only commands you can use are shown. Click a command to use it.',
    },
  },

  // Welcome module
  welcome: {
    commands: {
      welcome: 'Manage the welcome module',
      show: 'Show the current welcome settings',
      channel: 'Set or remove the welcome channel',
      message: 'Set or reset the welcome message',
      autoroleAdd: 'Add a role that new members get automatically',
      autoroleRemove: 'Remove an automatic role',
      autoroleDelay: 'Set the delay before auto roles are given',
      goodbye: 'Enable or disable goodbye messages',
    },
    options: {
      channel: 'Channel for welcome messages (leave empty to remove)',
      messageText: 'Placeholders: {user} {username} {server} {memberCount}. Empty = default',
      role: 'The role to add or remove',
      goodbyeEnabled: 'Send a message when someone leaves',
      goodbyeText: 'Placeholders: {username} {server} {memberCount}. Empty = default',
      seconds: 'Seconds to wait before giving auto roles (0-3600)',
    },

    defaultWelcome:
      'Welcome to **{server}**, {user}! 🎉 You are member #{memberCount}.',
    defaultGoodbye: '**{username}** has left the server.',

    show: {
      channel: 'Channel',
      message: 'Message',
      autoRoles: 'Auto roles',
      autoRoleDelay: 'Auto role delay',
      goodbye: 'Goodbye',
      notSet: 'not set',
      defaultText: 'default',
      none: 'none',
      enabled: 'enabled',
      disabled: 'disabled',
    },

    channelSet: (params: { channel: string }) =>
      `✅ Welcome channel set to ${params.channel}.`,
    channelRemoved: '✅ Welcome channel removed.',

    messageSet: (params: { text: string }) =>
      `✅ Welcome message set to:\n${params.text}`,
    messageReset: '✅ Welcome message reset to default.',

    autoRoleAlreadyAdded: (params: { role: string }) =>
      `${params.role} is already an auto role.`,
    autoRoleNotEditable: (params: { role: string }) =>
      `I can't assign ${params.role}. Make sure I have the **Manage Roles** permission and my role is above it in the role list.`,
    autoRoleAdded: (params: { role: string }) =>
      `✅ ${params.role} will now be given to new members.`,
    autoRoleNotFound: (params: { role: string }) =>
      `${params.role} is not an auto role.`,
    autoRoleRemoved: (params: { role: string }) =>
      `✅ ${params.role} will no longer be given to new members.`,
    autoRoleDelaySet: (params: { seconds: number }) =>
      `✅ Auto roles will be given after ${params.seconds} second(s).`,

    goodbyeEnabledDefault: '✅ Goodbye messages enabled with the default text.',
    goodbyeEnabledCustom: '✅ Goodbye messages enabled with a custom text.',
    goodbyeDisabled: '✅ Goodbye messages disabled.',
  },

  // Modlog module
  modlog: {
    commands: {
      modlog: 'Configure the mod log',
      show: 'Show the current mod log settings',
      channel: 'Set or remove the log channel',
      toggle: 'Turn logging of an event on or off',
    },
    // The choices of the "event" option use admin.events below
    options: {
      channel: 'Log channel (leave empty to remove)',
      event: 'What should be logged',
      enabled: 'Log this event',
    },

    // Moderation cases (log channel, server language)
    caseTypes: {
      WARN: 'Warning',
      TIMEOUT: 'Timeout',
      KICK: 'Kick',
      BAN: 'Ban',
      UNBAN: 'Unban',
    } satisfies Record<CaseType, string>,

    caseTitle: (params: { caseNumber: number; type: string }) =>
      `Case #${params.caseNumber} • ${params.type}`,

    fields: {
      user: 'User',
      moderator: 'Moderator',
      reason: 'Reason',
      duration: 'Duration',
      accountCreated: 'Account created',
      joinedServer: 'Joined server',
      memberCount: 'Members',
    },
    noReason: 'No reason given',
    unknown: 'unknown',
    minutes: (params: { minutes: number }) => `${params.minutes} minute(s)`,

    // Joins and leaves (log channel, server language)
    memberJoined: '📥 Member joined',
    memberLeft: '📤 Member left',

    // /modlog (admin, user language)
    admin: {
      show: {
        channel: 'Log channel',
        moderation: 'Moderation cases',
        joins: 'Joins',
        leaves: 'Leaves',
        notSet: 'not set',
        enabled: 'enabled',
        disabled: 'disabled',
      },
      channelSet: (params: { channel: string }) =>
        `✅ Log channel set to ${params.channel}.`,
      channelRemoved: '✅ Log channel removed. Nothing will be logged.',
      events: {
        moderation: 'Moderation cases',
        joins: 'Joins',
        leaves: 'Leaves',
      },
      toggled: (params: { event: string; enabled: boolean }) =>
        `✅ ${params.event} will ${params.enabled ? 'now' : 'no longer'} be logged.`,
    },
  },
};

export type Translations = typeof en;
