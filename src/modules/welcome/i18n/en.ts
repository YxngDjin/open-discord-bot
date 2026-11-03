export const en = {
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
};

export type WelcomeModuleTranslations = typeof en;
