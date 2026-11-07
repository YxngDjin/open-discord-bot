export const en = {
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
};

export type UtilityTranslations = typeof en;
