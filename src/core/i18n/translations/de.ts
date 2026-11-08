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
      moreRoles: (params: { count: number }) => `+${params.count} weitere`,
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
      autoroleAdd:
        'Füge eine Rolle hinzu, die neue Mitglieder automatisch bekommen',
      autoroleRemove: 'Entferne eine automatische Rolle',
      autoroleDelay: 'Setze die Verzögerung, bevor Auto-Rollen vergeben werden',
      goodbye: 'Aktiviere oder deaktiviere Abschiedsnachrichten',
    },
    options: {
      channel: 'Channel für Begrüßungen (leer lassen zum Entfernen)',
      messageText:
        'Platzhalter: {user} {username} {server} {memberCount}. Leer = Standard',
      role: 'Die Rolle, die hinzugefügt oder entfernt werden soll',
      goodbyeEnabled: 'Nachricht senden, wenn jemand den Server verlässt',
      goodbyeText:
        'Platzhalter: {username} {server} {memberCount}. Leer = Standard',
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

    goodbyeEnabledDefault:
      '✅ Abschiedsnachrichten mit Standardtext aktiviert.',
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
      locked:
        '🔒 Dein Channel ist abgeschlossen. Niemand sonst kann beitreten.',
      unlocked: '🔓 Dein Channel ist wieder offen.',
      failed:
        '❌ Ich konnte deinen Channel nicht ändern. Mir fehlt vielleicht das Recht „Kanäle verwalten“.',
    },
  },

  // Self roles module
  selfRoles: {
    commands: {
      group: 'Selbstrollen-Panels verwalten',
      create: 'Ein neues Selbstrollen-Panel erstellen',
      addRole: 'Eine Rolle zu einem Panel hinzufügen',
      removeRole: 'Eine Rolle aus einem Panel entfernen',
      publish: 'Ein Panel posten oder die gepostete Nachricht aktualisieren',
      list: 'Alle Panels dieses Servers anzeigen',
      delete: 'Ein Panel und seine gepostete Nachricht löschen',
    },
    // The choices of the "mode" option use admin.list.modes below
    options: {
      panel: 'ID des Panels (siehe /self-role list)',
      channel: 'Channel, in dem das Panel gepostet wird',
      title: 'Titel des Panels',
      description: 'Text unter dem Titel',
      mode: 'Buttons oder ein Auswahlmenü (Standard: Buttons)',
      addRole: 'Die Rolle, die hinzugefügt wird',
      removeRole: 'Die Rolle, die entfernt wird',
      label: 'Text auf dem Button (Standard: Rollenname)',
      emoji: 'Emoji neben dem Text, z. B. 🎮',
    },

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
  },

  // Moderation module
  moderation: {
    commands: {
      group: 'Moderationsbefehle',
      warn: 'Mitglied verwarnen',
      cases: 'Fälle eines Nutzers anzeigen',
      timeout: 'Mitglied stummschalten',
      kick: 'Mitglied kicken',
      ban: 'Nutzer bannen',
      unban: 'Nutzer entbannen',
    },
    // One group per subcommand, because "user" and "reason" differ per command
    options: {
      warn: {
        user: 'Mitglied, das verwarnt werden soll',
        reason: 'Grund der Verwarnung',
      },
      cases: {
        user: 'Nutzer, dessen Fälle angezeigt werden sollen',
      },
      timeout: {
        user: 'Mitglied, das stummgeschaltet werden soll',
        minutes: 'Dauer des Timeouts in Minuten',
        reason: 'Grund des Timeouts',
      },
      kick: {
        user: 'Mitglied, das gekickt werden soll',
        reason: 'Grund des Kicks',
      },
      ban: {
        user: 'Nutzer, der gebannt werden soll (auch Nicht-Mitglieder)',
        reason: 'Grund des Banns',
        deleteDays: 'Nachrichten der letzten X Tage löschen',
      },
      unban: {
        user: 'Nutzer, der entbannt werden soll (User-ID einfügen)',
        reason: 'Grund der Entbannung',
      },
    },

    moduleDisabled: 'Moderation ist auf diesem Server deaktiviert.',
    memberNotFound: 'Dieser Nutzer ist kein Mitglied dieses Servers.',
    cannotWarnSelfOrBot:
      'Du kannst dich selbst oder einen Bot nicht verwarnen.',

    targetErrors: {
      self: 'Du kannst dich nicht selbst moderieren.',
      owner: 'Du kannst den Server-Besitzer nicht moderieren.',
      hierarchy:
        'Du kannst nur Mitglieder unterhalb deiner höchsten Rolle moderieren.',
      botCannot:
        'Das kann ich nicht. Prüfe meine Berechtigungen und ob meine Rolle über diesem Mitglied steht.',
      noPermission: 'Dazu hast du keine Berechtigung.',
    },

    caseTypes: {
      WARN: 'Verwarnung',
      TIMEOUT: 'Timeout',
      KICK: 'Kick',
      BAN: 'Bann',
      UNBAN: 'Entbannung',
    },

    warned: (params: { user: string; caseNumber: number }) =>
      `⚠️ **${params.user}** wurde verwarnt. (Fall #${params.caseNumber})`,
    timedOut: (params: { user: string; minutes: number; caseNumber: number }) =>
      `🔇 **${params.user}** wurde für ${params.minutes} Minute(n) stummgeschaltet. (Fall #${params.caseNumber})`,
    kicked: (params: { user: string; caseNumber: number }) =>
      `👢 **${params.user}** wurde gekickt. (Fall #${params.caseNumber})`,
    banned: (params: { user: string; caseNumber: number }) =>
      `🔨 **${params.user}** wurde gebannt. (Fall #${params.caseNumber})`,
    unbanned: (params: { user: string; caseNumber: number }) =>
      `✅ **${params.user}** wurde entbannt. (Fall #${params.caseNumber})`,
    notBanned: (params: { user: string }) =>
      `**${params.user}** ist nicht gebannt.`,

    noCases: (params: { user: string }) =>
      `Keine Fälle für **${params.user}**.`,
    casesTitle: (params: { user: string }) => `**Fälle von ${params.user}:**`,
    by: 'von',
    noReason: 'kein Grund',
  },

  // XP module
  xp: {
    commands: {
      rank: 'Zeige dein Level und deinen Rang',
      leaderboard: 'Zeige die Top 10 Mitglieder',
      // /xp (admin)
      settings: {
        group: 'XP- und Level-System einstellen',
        show: 'Zeige die aktuellen XP-Einstellungen',
        messageXp: 'Setze die XP pro Nachricht',
        cooldown: 'Setze den Cooldown zwischen XP für Nachrichten',
        voiceXp: 'Setze die XP pro Minute in Voice-Channels',
        ignoreChannel: 'Channel für XP ignorieren oder nicht mehr ignorieren',
        levelup: 'Level-Up-Nachrichten aktivieren oder deaktivieren',
        roleAdd: 'Rolle vergeben, wenn Mitglieder ein Level erreichen',
        roleRemove: 'Rolle für ein Level entfernen',
        leaderboardChannel:
          'Channel für die tägliche Bestenliste setzen oder entfernen',
        leaderboardTime: 'Uhrzeit der täglichen Bestenliste festlegen',
      },
    },
    // /xp message-xp and /xp voice-xp share "amount"
    options: {
      rankUser: 'Rang eines anderen Mitglieds anzeigen',
      amount: 'Menge an XP (0 = aus)',
      seconds: 'Sekunden, bis eine Nachricht wieder XP bringt (0-3600)',
      ignoreChannel:
        'Channel, der ignoriert bzw. nicht mehr ignoriert werden soll',
      levelupEnabled: 'Nachricht senden, wenn jemand ein Level aufsteigt',
      levelupChannel: 'Wohin (leer = derselbe Channel wie die Nachricht)',
      roleAddLevel: 'Level, ab dem die Rolle vergeben wird',
      roleAddRole: 'Die Rolle, die vergeben werden soll',
      roleRemoveLevel: 'Level, dessen Rolle entfernt werden soll',
      leaderboardChannel:
        'Channel für die tägliche Bestenliste (leer = ausschalten)',
      leaderboardTime: 'Uhrzeit in der Zeitzone des Servers, z. B. 18:00',
    },

    // Level-up message (public, server language)
    levelUp: (params: { user: string; level: number }) =>
      `🎉 ${params.user} hat **Level ${params.level}** erreicht!`,

    // General
    moduleDisabled: 'Das XP-Modul ist auf diesem Server deaktiviert.',

    // /rank
    noXp: (params: { user: string }) => `**${params.user}** hat noch keine XP.`,
    rankTitle: (params: { user: string }) => `📊 **${params.user}**`,
    rankLevel: (params: { level: number; rank: number }) =>
      `Level ${params.level} • Platz #${params.rank}`,
    rankProgress: (params: { bar: string; current: string; needed: string }) =>
      `${params.bar} ${params.current} / ${params.needed} XP`,
    rankStats: (params: { messages: string; minutes: string }) =>
      `💬 ${params.messages} Nachrichten • 🎙️ ${params.minutes} Minuten Voice`,

    // /leaderboard
    leaderboardTitle: '🏆 **Bestenliste**',
    leaderboardEmpty: 'Auf diesem Server hat noch niemand XP gesammelt.',
    // Small grey line below the automatic leaderboard (server language)
    leaderboardUpdated: (params: { time: string }) =>
      `-# Aktualisiert ${params.time}`,
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
        messageXp: 'XP pro Nachricht',
        cooldown: 'Cooldown für Nachrichten',
        voiceXp: 'XP pro Voice-Minute',
        ignoredChannels: 'Ignorierte Channels',
        levelUpMessages: 'Level-Up-Nachrichten',
        levelRoles: 'Level-Rollen',
        none: 'keine',
        off: 'aus',
        enabled: 'aktiviert',
        disabled: 'deaktiviert',
        sameChannel: 'im selben Channel',
        dailyLeaderboard: 'Tägliche Bestenliste',
        dailyAt: (params: {
          channel: string;
          time: string;
          timezone: string;
        }) => `${params.channel} um ${params.time} (${params.timezone})`,
      },
      messageXpSet: (params: { amount: number }) =>
        params.amount === 0
          ? '✅ Mitglieder bekommen keine XP mehr für Nachrichten.'
          : `✅ Mitglieder bekommen jetzt **${params.amount} XP** pro Nachricht.`,
      cooldownSet: (params: { seconds: number }) =>
        `✅ Cooldown für Nachrichten auf **${params.seconds} Sekunde(n)** gesetzt.`,
      voiceXpSet: (params: { amount: number }) =>
        params.amount === 0
          ? '✅ Mitglieder bekommen keine XP mehr in Voice-Channels.'
          : `✅ Mitglieder bekommen jetzt **${params.amount} XP** pro Minute in Voice.`,
      channelIgnored: (params: { channel: string }) =>
        `✅ ${params.channel} wird jetzt ignoriert. Aktivität dort bringt keine XP.`,
      channelUnignored: (params: { channel: string }) =>
        `✅ ${params.channel} wird nicht mehr ignoriert.`,
      levelUpEnabledSame:
        '✅ Level-Up-Nachrichten sind aktiviert und erscheinen im Channel, in dem das Mitglied geschrieben hat.',
      levelUpEnabledIn: (params: { channel: string }) =>
        `✅ Level-Up-Nachrichten sind aktiviert und erscheinen in ${params.channel}.`,
      levelUpDisabled: '✅ Level-Up-Nachrichten sind deaktiviert.',
      roleNotEditable: (params: { role: string }) =>
        `Ich kann ${params.role} nicht vergeben. Stell sicher, dass ich die Berechtigung **Rollen verwalten** habe und meine Rolle in der Rollenliste darüber steht.`,
      roleSet: (params: { level: number; role: string }) =>
        `✅ Mitglieder bekommen ab **Level ${params.level}** die Rolle ${params.role}.`,
      roleRemoved: (params: { level: number }) =>
        `✅ Die Level-Rolle für **Level ${params.level}** wurde entfernt.`,
      roleNotFound: (params: { level: number }) =>
        `Für **Level ${params.level}** gibt es keine Level-Rolle.`,
      leaderboardChannelSet: (params: {
        channel: string;
        time: string;
        timezone: string;
      }) =>
        `✅ Die Bestenliste wird jeden Tag um **${params.time}** (${params.timezone}) in ${params.channel} aktualisiert.\n` +
        'Die Uhrzeit änderst du mit `/xp leaderboard-time`, die Zeitzone mit `/timezone`.',
      leaderboardChannelRemoved:
        '✅ Die tägliche Bestenliste ist ausgeschaltet.',
      leaderboardMissingPermissions:
        '⚠️ Ich kann in diesem Channel keine Nachrichten senden. Gib mir dort **Kanal ansehen** und **Nachrichten senden**.',
      leaderboardTimeSet: (params: { time: string; timezone: string }) =>
        `✅ Die Bestenliste wird jeden Tag um **${params.time}** (${params.timezone}) aktualisiert.`,
      leaderboardTimeInvalid: (params: { time: string }) =>
        `❌ **${params.time}** ist keine gültige Uhrzeit. Nutze das Format HH:MM, z. B. 18:00 oder 09:30.`,
    },
  },
} satisfies Translations;
