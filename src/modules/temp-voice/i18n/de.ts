import type { TempVoiceTranslations } from './en.js';

export const de = {
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
} satisfies TempVoiceTranslations;
