import type { WelcomeModuleTranslations } from './en.js';

export const de = {
  defaultWelcome:
    'Willkommen auf **{server}**, {user}! 🎉 Du bist Mitglied #{memberCount}.',
  defaultGoodbye: '**{username}** hat den Server verlassen.',

  show: {
    channel: 'Channel',
    message: 'Nachricht',
    autoRoles: 'Auto-Rollen',
    autoRoleDelay: 'Verzögerung Auto-Rollen',
    goodbye: 'Abschied',
    notSet: 'nicht gesetzt',
    defaultText: 'Standard',
    none: 'keine',
    enabled: 'aktiviert',
    disabled: 'deaktiviert',
  },

  channelSet: (params: { channel: string }) =>
    `✅ Willkommens-Channel auf ${params.channel} gesetzt.`,
  channelRemoved: '✅ Willkommens-Channel entfernt.',

  messageSet: (params: { text: string }) =>
    `✅ Willkommensnachricht gesetzt auf:\n${params.text}`,
  messageReset: '✅ Willkommensnachricht auf Standard zurückgesetzt.',

  autoRoleAlreadyAdded: (params: { role: string }) =>
    `${params.role} ist bereits eine Auto-Rolle.`,
  autoRoleNotEditable: (params: { role: string }) =>
    `Ich kann ${params.role} nicht vergeben. Stell sicher, dass ich die Berechtigung **Rollen verwalten** habe und meine Rolle in der Rollenliste darüber steht.`,
  autoRoleAdded: (params: { role: string }) =>
    `✅ ${params.role} wird ab jetzt an neue Mitglieder vergeben.`,
  autoRoleNotFound: (params: { role: string }) =>
    `${params.role} ist keine Auto-Rolle.`,
  autoRoleRemoved: (params: { role: string }) =>
    `✅ ${params.role} wird nicht mehr an neue Mitglieder vergeben.`,
  autoRoleDelaySet: (params: { seconds: number }) =>
    `✅ Auto-Rollen werden nach ${params.seconds} Sekunde(n) vergeben.`,

  goodbyeEnabledDefault: '✅ Abschiedsnachrichten mit Standardtext aktiviert.',
  goodbyeEnabledCustom: '✅ Abschiedsnachrichten mit eigenem Text aktiviert.',
  goodbyeDisabled: '✅ Abschiedsnachrichten deaktiviert.',
} satisfies WelcomeModuleTranslations;
