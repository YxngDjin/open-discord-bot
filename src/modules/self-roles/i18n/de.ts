import type { SelfRolesTranslations } from './en.js';

export const de = {
  // /self-role (admin, user language)
  admin: {
    created: (params: { panel: number; channel: string }) =>
      `✅ Panel #${params.panel} für ${params.channel} erstellt.\n` +
      'Als Nächstes: Rollen mit `/self-role add-role` hinzufügen, dann mit `/self-role publish` posten.',
    panelNotFound: (params: { panel: number }) =>
      `❌ Panel #${params.panel} nicht gefunden. Siehe \`/self-role list\`.`,

    roleEveryone: '❌ Die @everyone-Rolle kann keine Selbstrolle sein.',
    roleNotEditable: (params: { role: string }) =>
      `❌ Ich kann ${params.role} nicht vergeben. Schiebe meine Bot-Rolle in den Servereinstellungen darüber.`,
    roleAdmin: (params: { role: string }) =>
      `❌ ${params.role} hat Administrator-Rechte und kann keine Selbstrolle sein.`,
    roleExists: (params: { role: string; panel: number }) =>
      `❌ ${params.role} ist bereits in Panel #${params.panel}.`,
    panelFull: (params: { panel: number; max: number }) =>
      `❌ Panel #${params.panel} hat bereits die maximale Anzahl von ${params.max} Rollen.`,
    roleAdded: (params: { role: string; panel: number }) =>
      `✅ ${params.role} zu Panel #${params.panel} hinzugefügt.`,

    roleNotInPanel: (params: { role: string; panel: number }) =>
      `❌ ${params.role} ist nicht in Panel #${params.panel}, oder das Panel existiert nicht.`,
    roleRemoved: (params: { role: string; panel: number }) =>
      `✅ ${params.role} aus Panel #${params.panel} entfernt.`,

    channelMissing: (params: { panel: number }) =>
      `❌ Der Channel von Panel #${params.panel} existiert nicht mehr.`,
    publishFailed: (params: { panel: number }) =>
      `❌ Ich konnte Panel #${params.panel} nicht posten. Prüfe, ob ich in dem Channel Nachrichten und Embeds senden darf und ob alle Emojis gültig sind.`,
    published: (params: { panel: number }) =>
      `✅ Panel #${params.panel} ist gepostet und aktuell.`,

    // Second line after add-role / remove-role
    refreshed: '🔄 Das gepostete Panel wurde aktualisiert.',
    publishHint:
      'Das Panel ist noch nicht gepostet. Poste es mit `/self-role publish`, wenn du fertig bist.',

    deleted: (params: { panel: number }) =>
      `✅ Panel #${params.panel} gelöscht.`,

    list: {
      title: 'Selbstrollen-Panels',
      empty:
        'Es gibt noch keine Panels. Erstelle eins mit `/self-role create`.',
      modes: {
        BUTTONS: 'Buttons',
        SELECT: 'Auswahlmenü',
      },
      line: (params: {
        panel: number;
        title: string;
        channel: string;
        roles: number;
        mode: string;
        published: boolean;
      }) =>
        `**#${params.panel}** ${params.title} • ${params.channel} • ` +
        `${params.roles} Rolle(n) • ${params.mode} • ` +
        (params.published ? 'gepostet' : 'noch nicht gepostet'),
    },
  },

  // Clicks on a panel (member, user language)
  clicks: {
    added: (params) => `✅ Du hast jetzt die Rolle ${params.role}.`,
    removed: (params) => `✅ Die Rolle ${params.role} wurde entfernt.`,
    disabled: () => 'Selbstrollen sind auf diesem Server gerade deaktiviert.',
    not_found: () => 'Diese Rolle gehört nicht mehr zum Panel.',
    role_missing: () => 'Diese Rolle existiert nicht mehr.',
    forbidden: () => 'Diese Rolle kann nicht über ein Panel vergeben werden.',
    failed: () =>
      'Ich konnte deine Rollen nicht ändern. Bitte sag einem Server-Admin Bescheid.',
  },

  // Changes in a select menu panel (member, user language)
  sync: {
    updated: '✅ Deine Rollen wurden aktualisiert.',
    disabled: 'Selbstrollen sind auf diesem Server gerade deaktiviert.',
    not_found: 'Dieses Panel existiert nicht mehr.',
    failed:
      'Ich konnte deine Rollen nicht ändern. Bitte sag einem Server-Admin Bescheid.',
  },
} satisfies SelfRolesTranslations;
