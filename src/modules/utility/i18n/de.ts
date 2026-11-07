import type { UtilityTranslations } from './en.js';

export const de = {
  // /serverinfo (public, server language)
  serverinfo: {
    owner: 'Besitzer',
    members: 'Mitglieder',
    channels: 'Channels',
    roles: 'Rollen',
    boosts: 'Boosts',
    created: 'Erstellt',
  },

  // /userinfo (public, server language)
  userinfo: {
    username: 'Benutzername',
    id: 'ID',
    roles: 'Rollen',
    created: 'Konto erstellt',
    joined: 'Server beigetreten',
    none: 'keine',
    unknown: 'unbekannt',
    notMember: '❌ Dieser Nutzer ist kein Mitglied dieses Servers.',
  },

  // /clear (ephemeral, user language)
  clear: {
    wrongChannel:
      '❌ In diesem Channel können keine Nachrichten gelöscht werden.',
    deleted: (params: { count: number }) =>
      `🧹 ${params.count} Nachricht(en) gelöscht. Nachrichten, die älter als 14 Tage sind, werden übersprungen.`,
    failed:
      '❌ Ich konnte hier keine Nachrichten löschen. Ich brauche die Rechte „Nachrichten verwalten“ und „Nachrichtenverlauf lesen“.',
  },

  // /help (ephemeral, user language)
  help: {
    title: 'Befehle',
    general: 'Allgemein',
    footer:
      'Es werden nur Befehle angezeigt, die du benutzen kannst. Klick auf einen Befehl, um ihn zu verwenden.',
  },
} satisfies UtilityTranslations;
