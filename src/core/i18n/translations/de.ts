import type { Translations } from './en.js';

export const de = {
  // /language (admin, user language)
  language: {
    commands: {
      language: 'Zeige oder ändere die Server-Sprache',
    },
    options: {
      language: 'Die neue Server-Sprache',
    },
    current: (params: { language: string }) =>
      `Die Server-Sprache ist **${params.language}**.`,
    changed: (params: { language: string }) =>
      `Die Server-Sprache wurde auf **${params.language}** geändert.`,
  },

  // /timezone (admin, user language)
  timezone: {
    commands: {
      timezone: 'Zeige oder ändere die Zeitzone des Servers',
    },
    options: {
      timezone: 'Die Zeitzone des Servers, z. B. Europe/Berlin',
    },
    current: (params: { timezone: string; time: string }) =>
      `🕒 Die Zeitzone des Servers ist **${params.timezone}**. Dort ist es gerade ${params.time}.`,
    changed: (params: { timezone: string; time: string }) =>
      `✅ Zeitzone auf **${params.timezone}** gesetzt. Dort ist es gerade ${params.time}.`,
    invalid: (params: { timezone: string }) =>
      `❌ **${params.timezone}** ist keine gültige Zeitzone. Wähle eine aus den Vorschlägen.`,
  },

  // /module (admin, user language)
  module: {
    commands: {
      module: 'Verwalte die Module des Bots auf diesem Server',
      list: 'Zeige alle Module und ob sie aktiviert sind',
      enable: 'Aktiviere ein Modul auf diesem Server',
      disable: 'Deaktiviere ein Modul auf diesem Server',
    },
    options: {
      module: 'Das Modul, das aktiviert oder deaktiviert werden soll',
    },
    noModules: 'Keine Module verfügbar.',
    enabled: (params: { module: string }) =>
      `✅ Modul **${params.module}** aktiviert.`,
    disabled: (params: { module: string }) =>
      `❌ Modul **${params.module}** deaktiviert.`,
    missingModule: (params: { module: string }) =>
      `Modul **${params.module}** existiert nicht.`,
  },

  // Error message of the global exception filter (ephemeral, user language)
  errors: {
    generic:
      'Da ist etwas schiefgelaufen. Bitte versuche es später noch einmal.',
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

  // Welcome module
  welcome: {
    commands: {
      welcome: 'Verwalte das Willkommen-Modul',
      show: 'Zeige die aktuellen Willkommen-Einstellungen',
      channel: 'Setze oder entferne den Willkommens-Channel',
      message: 'Setze die Willkommensnachricht oder setze sie zurück',
      autoroleAdd: 'Füge eine Rolle hinzu, die neue Mitglieder automatisch bekommen',
      autoroleRemove: 'Entferne eine automatische Rolle',
      autoroleDelay: 'Setze die Verzögerung, bevor Auto-Rollen vergeben werden',
      goodbye: 'Aktiviere oder deaktiviere Abschiedsnachrichten',
    },
    options: {
      channel: 'Channel für Begrüßungen (leer lassen zum Entfernen)',
      messageText: 'Platzhalter: {user} {username} {server} {memberCount}. Leer = Standard',
      role: 'Die Rolle, die hinzugefügt oder entfernt werden soll',
      goodbyeEnabled: 'Nachricht senden, wenn jemand den Server verlässt',
      goodbyeText: 'Platzhalter: {username} {server} {memberCount}. Leer = Standard',
      seconds: 'Sekunden bis zur Vergabe der Auto-Rollen (0-3600)',
    },

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
  },

  // Modlog module
  modlog: {
    commands: {
      modlog: 'Mod-Log einstellen',
      show: 'Zeige die aktuellen Mod-Log-Einstellungen',
      channel: 'Log-Channel setzen oder entfernen',
      toggle: 'Logging eines Ereignisses an- oder ausschalten',
    },
    // The choices of the "event" option use admin.events below
    options: {
      channel: 'Log-Channel (leer lassen zum Entfernen)',
      event: 'Was geloggt werden soll',
      enabled: 'Dieses Ereignis loggen',
    },

    // Moderation cases (log channel, server language)
    caseTypes: {
      WARN: 'Verwarnung',
      TIMEOUT: 'Timeout',
      KICK: 'Kick',
      BAN: 'Bann',
      UNBAN: 'Entbannung',
    },

    caseTitle: (params: { caseNumber: number; type: string }) =>
      `Fall #${params.caseNumber} • ${params.type}`,

    fields: {
      user: 'Nutzer',
      moderator: 'Moderator',
      reason: 'Grund',
      duration: 'Dauer',
      accountCreated: 'Konto erstellt',
      joinedServer: 'Server beigetreten',
      memberCount: 'Mitglieder',
    },
    noReason: 'Kein Grund angegeben',
    unknown: 'unbekannt',
    minutes: (params: { minutes: number }) => `${params.minutes} Minute(n)`,

    // Joins and leaves (log channel, server language)
    memberJoined: '📥 Mitglied beigetreten',
    memberLeft: '📤 Mitglied hat den Server verlassen',

    // /modlog (admin, user language)
    admin: {
      show: {
        channel: 'Log-Channel',
        moderation: 'Moderationsfälle',
        joins: 'Beitritte',
        leaves: 'Austritte',
        notSet: 'nicht gesetzt',
        enabled: 'aktiviert',
        disabled: 'deaktiviert',
      },
      channelSet: (params: { channel: string }) =>
        `✅ Log-Channel auf ${params.channel} gesetzt.`,
      channelRemoved: '✅ Log-Channel entfernt. Es wird nichts mehr geloggt.',
      events: {
        moderation: 'Moderationsfälle',
        joins: 'Beitritte',
        leaves: 'Austritte',
      },
      toggled: (params: { event: string; enabled: boolean }) =>
        `✅ ${params.event} werden ${params.enabled ? 'jetzt' : 'nicht mehr'} geloggt.`,
    },
  },

  // Temp voice module
  tempVoice: {
    commands: {
      // /tempvoice
      tempvoice: {
        group: 'Temporäre Voice-Channels einstellen',
        show: 'Zeige die aktuellen Einstellungen',
        channel: 'Beitreten-zum-Erstellen-Channel setzen oder entfernen',
        category: 'Kategorie für neue Channels setzen oder entfernen',
        name: 'Namen neuer Channels festlegen',
        limit: 'Nutzerlimit neuer Channels festlegen',
        deleteAfter: 'Festlegen, wie lange ein leerer Channel bleibt',
      },
      // /voice
      voice: {
        group: 'Deinen temporären Voice-Channel verwalten',
        name: 'Deinen Channel umbenennen',
        limit: 'Nutzerlimit deines Channels festlegen',
        lock: 'Channel abschließen, damit niemand sonst beitreten kann',
        unlock: 'Deinen Channel wieder öffnen',
      },
    },
    // /tempvoice limit and /voice limit share "users"
    options: {
      channel: 'Voice-Channel, der einen Channel erstellt (leer = aus)',
      category: 'Kategorie für neue Channels (leer = wie Beitreten-Channel)',
      template: 'Name neuer Channels, {user} = Name des Mitglieds',
      users: 'Maximale Anzahl Nutzer (0 = kein Limit)',
      minutes: 'Minuten, die ein leerer Channel bleibt (0 = sofort löschen)',
      name: 'Neuer Name deines Channels',
    },

    // /tempvoice (admin, user language)
    admin: {
      show: {
        title: 'Temporäre Voice-Channels',
        creatorChannel: 'Beitreten zum Erstellen',
        category: 'Kategorie',
        sameAsCreator: 'wie der Beitreten-Channel',
        nameTemplate: 'Channel-Name',
        userLimit: 'Nutzerlimit',
        noLimit: 'kein Limit',
        deleteAfter: 'Löschen, wenn leer, nach',
        minutes: (params: { minutes: number }) =>
          params.minutes === 0 ? 'sofort' : `${params.minutes} Min.`,
        notSet: 'nicht gesetzt',
      },
      channelSet: (params: { channel: string }) =>
        `✅ Wer ${params.channel} betritt, bekommt jetzt einen eigenen Voice-Channel.`,
      channelRemoved:
        '✅ Beitreten-Channel entfernt. Es werden keine neuen temporären Channels mehr erstellt.',
      missingPermissions:
        '⚠️ Mir fehlt das Recht **Kanäle verwalten** oder **Mitglieder verschieben**. Ohne sie kann ich keine Channels erstellen oder Mitglieder verschieben.',
      categorySet: (params: { category: string }) =>
        `✅ Neue Channels werden in ${params.category} erstellt.`,
      categoryRemoved:
        '✅ Neue Channels werden in derselben Kategorie wie der Beitreten-Channel erstellt.',
      nameSet: (params: { example: string }) =>
        `✅ Channel-Name geändert. Beispiel: **${params.example}**`,
      limitSet: (params: { limit: number }) =>
        params.limit === 0
          ? '✅ Neue Channels haben kein Nutzerlimit.'
          : `✅ Neue Channels sind auf ${params.limit} Nutzer begrenzt.`,
      deleteAfterSet: (params: { minutes: number }) =>
        params.minutes === 0
          ? '✅ Leere Channels werden sofort gelöscht (innerhalb einer Minute).'
          : `✅ Leere Channels werden nach ${params.minutes} Minute(n) gelöscht.`,
    },

    // /voice (channel owner, user language)
    owner: {
      errors: {
        not_in_voice: '❌ Betritt zuerst deinen temporären Voice-Channel.',
        not_temp: '❌ Das ist kein temporärer Voice-Channel.',
        not_owner: '❌ Nur der Besitzer dieses Channels kann ihn ändern.',
      },
      renamed: (params: { name: string }) =>
        `✅ Channel in **${params.name}** umbenannt.`,
      limitSet: (params: { limit: number }) =>
        params.limit === 0
          ? '✅ Dein Channel hat jetzt kein Nutzerlimit.'
          : `✅ Dein Channel ist jetzt auf ${params.limit} Nutzer begrenzt.`,
      locked: '🔒 Dein Channel ist abgeschlossen. Niemand sonst kann beitreten.',
      unlocked: '🔓 Dein Channel ist wieder offen.',
      failed:
        '❌ Ich konnte deinen Channel nicht ändern. Mir fehlt vielleicht das Recht „Kanäle verwalten“.',
    },
  },
} satisfies Translations;
