export const en = {
  // /language (admin, user language)
  language: {
    current: (params: { language: string }) =>
      `The server language is **${params.language}**.`,
    changed: (params: { language: string }) =>
      `The server language has been changed to **${params.language}**.`,
  },

  // /timezone (admin, user language)
  timezone: {
    current: (params: { timezone: string; time: string }) =>
      `🕒 The server time zone is **${params.timezone}**. It is ${params.time} there.`,
    changed: (params: { timezone: string; time: string }) =>
      `✅ Time zone set to **${params.timezone}**. It is ${params.time} there.`,
    invalid: (params: { timezone: string }) =>
      `❌ **${params.timezone}** is not a valid time zone. Pick one from the suggestions.`,
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
};

export type Translations = typeof en;
