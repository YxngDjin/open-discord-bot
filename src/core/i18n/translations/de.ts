import type { Translations } from './en.js';

export const de = {
  // /language (admin, user language)
  language: {
    current: (params: { language: string }) =>
      `Die Server-Sprache ist **${params.language}**.`,
    changed: (params: { language: string }) =>
      `Die Server-Sprache wurde auf **${params.language}** geändert.`,
  },

  // /timezone (admin, user language)
  timezone: {
    current: (params: { timezone: string; time: string }) =>
      `🕒 Die Zeitzone des Servers ist **${params.timezone}**. Dort ist es gerade ${params.time}.`,
    changed: (params: { timezone: string; time: string }) =>
      `✅ Zeitzone auf **${params.timezone}** gesetzt. Dort ist es gerade ${params.time}.`,
    invalid: (params: { timezone: string }) =>
      `❌ **${params.timezone}** ist keine gültige Zeitzone. Wähle eine aus den Vorschlägen.`,
  },

  // Utility module
  utility: {
    // Command descriptions (shown in Discord's command list)
    commands: {
      ping: 'Zeige die Latenz des Bots',
      serverinfo: 'Informationen über diesen Server anzeigen',
      userinfo: 'Informationen über ein Mitglied anzeigen',
      clear: 'Die letzten Nachrichten in diesem Channel löschen',
      help: 'Alle Befehle anzeigen',
    },

    // Option descriptions
    options: {
      user: 'Der Nutzer, der angezeigt wird (Standard: du)',
      amount: 'Anzahl der Nachrichten, die gelöscht werden (1-100)',
    },

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
  },
} satisfies Translations;
