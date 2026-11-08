import type {
  CaseType,
  SelfRoleMode,
} from '../../../generated/prisma/enums.js';
import type {
  SyncRolesResult,
  ToggleRoleResult,
} from '../../../modules/self-roles/self-roles.service.js';
import type { OwnedChannelError } from '../../../modules/temp-voice/temp-voice.service.js';

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
      messageText:
        'Placeholders: {user} {username} {server} {memberCount}. Empty = default',
      role: 'The role to add or remove',
      goodbyeEnabled: 'Send a message when someone leaves',
      goodbyeText:
        'Placeholders: {username} {server} {memberCount}. Empty = default',
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

  // Temp voice module
  tempVoice: {
    commands: {
      // /tempvoice
      tempvoice: {
        group: 'Configure temporary voice channels',
        show: 'Show the current settings',
        channel: 'Set or remove the join-to-create channel',
        category: 'Set or remove the category for new channels',
        name: 'Set the name of new channels',
        limit: 'Set the user limit of new channels',
        deleteAfter: 'Set how long an empty channel is kept',
      },
      // /voice
      voice: {
        group: 'Manage your temporary voice channel',
        name: 'Rename your channel',
        limit: 'Set the user limit of your channel',
        lock: 'Lock your channel so nobody else can join',
        unlock: 'Open your channel again',
      },
    },
    // /tempvoice limit and /voice limit share "users"
    options: {
      channel: 'Voice channel to join to create a channel (empty = off)',
      category: 'Category for new channels (empty = same as join channel)',
      template: 'Name of new channels, {user} = member name',
      users: 'Maximum number of users (0 = no limit)',
      minutes: 'Minutes an empty channel is kept (0 = delete right away)',
      name: 'New name of your channel',
    },

    // /tempvoice (admin, user language)
    admin: {
      show: {
        title: 'Temporary voice channels',
        creatorChannel: 'Join to create',
        category: 'Category',
        sameAsCreator: 'same as the join channel',
        nameTemplate: 'Channel name',
        userLimit: 'User limit',
        noLimit: 'no limit',
        deleteAfter: 'Delete when empty after',
        minutes: (params: { minutes: number }) =>
          params.minutes === 0 ? 'right away' : `${params.minutes} min`,
        notSet: 'not set',
      },
      channelSet: (params: { channel: string }) =>
        `✅ Members who join ${params.channel} now get their own voice channel.`,
      channelRemoved:
        '✅ Join channel removed. No new temporary channels will be created.',
      missingPermissions:
        '⚠️ I am missing the **Manage Channels** or **Move Members** permission. Without them I cannot create channels or move members.',
      categorySet: (params: { category: string }) =>
        `✅ New channels will be created in ${params.category}.`,
      categoryRemoved:
        '✅ New channels will be created in the same category as the join channel.',
      nameSet: (params: { example: string }) =>
        `✅ Channel name updated. Example: **${params.example}**`,
      limitSet: (params: { limit: number }) =>
        params.limit === 0
          ? '✅ New channels have no user limit.'
          : `✅ New channels are limited to ${params.limit} users.`,
      deleteAfterSet: (params: { minutes: number }) =>
        params.minutes === 0
          ? '✅ Empty channels are deleted right away (within a minute).'
          : `✅ Empty channels are deleted after ${params.minutes} minute(s).`,
    },

    // /voice (channel owner, user language)
    owner: {
      // Why /voice can't be used, one text per result of getOwnedChannel
      errors: {
        not_in_voice: '❌ Join your temporary voice channel first.',
        not_temp: '❌ This is not a temporary voice channel.',
        not_owner: '❌ Only the owner of this channel can change it.',
      } satisfies Record<OwnedChannelError, string>,
      renamed: (params: { name: string }) =>
        `✅ Channel renamed to **${params.name}**.`,
      limitSet: (params: { limit: number }) =>
        params.limit === 0
          ? '✅ Your channel has no user limit now.'
          : `✅ Your channel is limited to ${params.limit} users now.`,
      locked: '🔒 Your channel is locked. Nobody else can join.',
      unlocked: '🔓 Your channel is open again.',
      failed:
        "❌ I couldn't change your channel. I might be missing the Manage Channels permission.",
    },
  },

  // Self roles module
  selfRoles: {
    commands: {
      group: 'Manage self role panels',
      create: 'Create a new self role panel',
      addRole: 'Add a role to a panel',
      removeRole: 'Remove a role from a panel',
      publish: 'Post a panel or update the posted message',
      list: 'Show all panels of this server',
      delete: 'Delete a panel and its posted message',
    },
    // The choices of the "mode" option use admin.list.modes below
    options: {
      panel: 'ID of the panel (see /self-role list)',
      channel: 'Channel where the panel will be posted',
      title: 'Title of the panel',
      description: 'Text below the title',
      mode: 'Buttons or a select menu (default: buttons)',
      addRole: 'The role to add',
      removeRole: 'The role to remove',
      label: 'Text on the button (default: role name)',
      emoji: 'Emoji next to the text, e.g. 🎮',
    },

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
    // Answers to a click on a panel button, one per result of toggleRole
    clicks: {
      added: (params) => `✅ You now have the role ${params.role}.`,
      removed: (params) => `✅ The role ${params.role} was removed.`,
      disabled: () => 'Self roles are currently disabled on this server.',
      not_found: () => 'This role is no longer part of the panel.',
      role_missing: () => 'This role no longer exists.',
      forbidden: () => 'This role cannot be assigned through a panel.',
      failed: () => "I couldn't update your roles. Please tell a server admin.",
    } satisfies Record<ToggleRoleResult, (params: { role: string }) => string>,

    // Changes in a select menu panel (member, user language)
    sync: {
      updated: '✅ Your roles were updated.',
      disabled: 'Self roles are currently disabled on this server.',
      not_found: 'This panel no longer exists.',
      failed: "I couldn't update your roles. Please tell a server admin.",
    } satisfies Record<SyncRolesResult, string>,
  },

  // Moderation module
  moderation: {
    commands: {
      group: 'Moderation commands',
      warn: 'Warn a member',
      cases: 'Show the cases of a user',
      timeout: 'Timeout a member',
      kick: 'Kick a member',
      ban: 'Ban a user',
      unban: 'Unban a user',
    },
    // One group per subcommand, because "user" and "reason" differ per command
    options: {
      warn: {
        user: 'The member to warn',
        reason: 'The reason for the warning',
      },
      cases: {
        user: 'The user to show the cases of',
      },
      timeout: {
        user: 'The member to timeout',
        minutes: 'Duration of the timeout in minutes',
        reason: 'The reason for the timeout',
      },
      kick: {
        user: 'The member to kick',
        reason: 'The reason for the kick',
      },
      ban: {
        user: 'The user to ban (also works for non-members)',
        reason: 'The reason for the ban',
        deleteDays: 'Delete messages from the last X days',
      },
      unban: {
        user: 'The user to unban (paste the user ID)',
        reason: 'The reason for the unban',
      },
    },

    moduleDisabled: 'Moderation is disabled on this server.',
    memberNotFound: 'This user is not a member of this server.',
    cannotWarnSelfOrBot: "You can't warn yourself or a bot.",

    targetErrors: {
      self: "You can't moderate yourself.",
      owner: "You can't moderate the server owner.",
      hierarchy: 'You can only moderate members below your highest role.',
      botCannot:
        "I can't do that. Check my permissions and make sure my role is above this member.",
      noPermission: "You don't have permission to do that.",
    },

    caseTypes: {
      WARN: 'Warning',
      TIMEOUT: 'Timeout',
      KICK: 'Kick',
      BAN: 'Ban',
      UNBAN: 'Unban',
    } satisfies Record<CaseType, string>,

    warned: (params: { user: string; caseNumber: number }) =>
      `⚠️ **${params.user}** was warned. (Case #${params.caseNumber})`,
    timedOut: (params: { user: string; minutes: number; caseNumber: number }) =>
      `🔇 **${params.user}** was timed out for ${params.minutes} minute(s). (Case #${params.caseNumber})`,
    kicked: (params: { user: string; caseNumber: number }) =>
      `👢 **${params.user}** was kicked. (Case #${params.caseNumber})`,
    banned: (params: { user: string; caseNumber: number }) =>
      `🔨 **${params.user}** was banned. (Case #${params.caseNumber})`,
    unbanned: (params: { user: string; caseNumber: number }) =>
      `✅ **${params.user}** was unbanned. (Case #${params.caseNumber})`,
    notBanned: (params: { user: string }) =>
      `**${params.user}** is not banned.`,

    noCases: (params: { user: string }) => `No cases for **${params.user}**.`,
    casesTitle: (params: { user: string }) => `**Cases for ${params.user}:**`,
    by: 'by',
    noReason: 'no reason',
  },

  // XP module
  xp: {
    commands: {
      rank: 'Show your level and rank',
      leaderboard: 'Show the top 10 members',
      // /xp (admin)
      settings: {
        group: 'Configure the XP and level system',
        show: 'Show the current XP settings',
        messageXp: 'Set the XP per message',
        cooldown: 'Set the cooldown between XP for messages',
        voiceXp: 'Set the XP per minute in voice channels',
        ignoreChannel: 'Ignore a channel for XP, or stop ignoring it',
        levelup: 'Enable or disable level-up messages',
        roleAdd: 'Give a role when members reach a level',
        roleRemove: 'Remove the role for a level',
        leaderboardChannel:
          'Set or remove the channel for the daily leaderboard',
        leaderboardTime: 'Set the time of the daily leaderboard',
      },
    },
    // /xp message-xp and /xp voice-xp share "amount"
    options: {
      rankUser: 'Show the rank of another member',
      amount: 'Amount of XP (0 = off)',
      seconds: 'Seconds before a message gives XP again (0-3600)',
      ignoreChannel: 'Channel to ignore or stop ignoring',
      levelupEnabled: 'Send a message when someone levels up',
      levelupChannel: 'Where to send it (empty = same channel as the message)',
      roleAddLevel: 'Level at which the role is given',
      roleAddRole: 'The role to give',
      roleRemoveLevel: 'Level whose role should be removed',
      leaderboardChannel:
        'Channel for the daily leaderboard (empty = turn off)',
      leaderboardTime: 'Time in the server time zone, e.g. 18:00',
    },

    // Level-up message (public, server language)
    levelUp: (params: { user: string; level: number }) =>
      `🎉 ${params.user} reached **level ${params.level}**!`,

    // General
    moduleDisabled: 'The XP module is disabled on this server.',

    // /rank
    noXp: (params: { user: string }) => `**${params.user}** has no XP yet.`,
    rankTitle: (params: { user: string }) => `📊 **${params.user}**`,
    rankLevel: (params: { level: number; rank: number }) =>
      `Level ${params.level} • Rank #${params.rank}`,
    rankProgress: (params: { bar: string; current: string; needed: string }) =>
      `${params.bar} ${params.current} / ${params.needed} XP`,
    rankStats: (params: { messages: string; minutes: string }) =>
      `💬 ${params.messages} messages • 🎙️ ${params.minutes} minutes in voice`,

    // /leaderboard
    leaderboardTitle: '🏆 **Leaderboard**',
    leaderboardEmpty: 'Nobody has earned XP on this server yet.',
    // Small grey line below the automatic leaderboard (server language)
    leaderboardUpdated: (params: { time: string }) =>
      `-# Updated ${params.time}`,
    leaderboardLine: (params: {
      position: number;
      user: string;
      level: number;
      xp: string;
    }) =>
      `**${params.position}.** ${params.user} • Level ${params.level} • ${params.xp} XP`,
    // /xp (admin settings)
    admin: {
      show: {
        messageXp: 'XP per message',
        cooldown: 'Message cooldown',
        voiceXp: 'XP per voice minute',
        ignoredChannels: 'Ignored channels',
        levelUpMessages: 'Level-up messages',
        levelRoles: 'Level roles',
        none: 'none',
        off: 'off',
        enabled: 'enabled',
        disabled: 'disabled',
        sameChannel: 'in the same channel',
        dailyLeaderboard: 'Daily leaderboard',
        dailyAt: (params: {
          channel: string;
          time: string;
          timezone: string;
        }) => `${params.channel} at ${params.time} (${params.timezone})`,
      },
      messageXpSet: (params: { amount: number }) =>
        params.amount === 0
          ? '✅ Members no longer get XP for messages.'
          : `✅ Members now get **${params.amount} XP** per message.`,
      cooldownSet: (params: { seconds: number }) =>
        `✅ Message cooldown set to **${params.seconds} second(s)**.`,
      voiceXpSet: (params: { amount: number }) =>
        params.amount === 0
          ? '✅ Members no longer get XP in voice channels.'
          : `✅ Members now get **${params.amount} XP** per minute in voice.`,
      channelIgnored: (params: { channel: string }) =>
        `✅ ${params.channel} is now ignored. Activity there gives no XP.`,
      channelUnignored: (params: { channel: string }) =>
        `✅ ${params.channel} is no longer ignored.`,
      levelUpEnabledSame:
        '✅ Level-up messages are enabled and sent in the channel where the member wrote.',
      levelUpEnabledIn: (params: { channel: string }) =>
        `✅ Level-up messages are enabled and sent in ${params.channel}.`,
      levelUpDisabled: '✅ Level-up messages are disabled.',
      roleNotEditable: (params: { role: string }) =>
        `I can't assign ${params.role}. Make sure I have the **Manage Roles** permission and my role is above it in the role list.`,
      roleSet: (params: { level: number; role: string }) =>
        `✅ Members now get ${params.role} at **level ${params.level}**.`,
      roleRemoved: (params: { level: number }) =>
        `✅ The level role for **level ${params.level}** was removed.`,
      roleNotFound: (params: { level: number }) =>
        `There is no level role for **level ${params.level}**.`,
      leaderboardChannelSet: (params: {
        channel: string;
        time: string;
        timezone: string;
      }) =>
        `✅ The leaderboard will be updated in ${params.channel} every day at **${params.time}** (${params.timezone}).\n` +
        'Change the time with `/xp leaderboard-time` and the time zone with `/timezone`.',
      leaderboardChannelRemoved: '✅ The daily leaderboard is turned off.',
      leaderboardMissingPermissions:
        "⚠️ I can't send messages in that channel. Give me **View Channel** and **Send Messages** there.",
      leaderboardTimeSet: (params: { time: string; timezone: string }) =>
        `✅ The leaderboard will be updated every day at **${params.time}** (${params.timezone}).`,
      leaderboardTimeInvalid: (params: { time: string }) =>
        `❌ **${params.time}** is not a valid time. Use the format HH:MM, e.g. 18:00 or 09:30.`,
    },
  },
};

export type Translations = typeof en;
