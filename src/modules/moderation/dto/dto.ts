import { type User } from 'discord.js';
import { IntegerOption, StringOption, UserOption } from 'necord';

export class WarnDto {
  @UserOption({
    name: 'user',
    description: 'The member to warn',
    description_localizations: { de: 'Mitglied, das verwarnt werden soll' },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the warning',
    description_localizations: { de: 'Grund der Verwarnung' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class CasesDto {
  @UserOption({
    name: 'user',
    description: 'The user to show the cases of',
    description_localizations: {
      de: 'Nutzer, dessen Fälle angezeigt werden sollen',
    },
    required: true,
  })
  user: User;
}

export class TimeoutDto {
  @UserOption({
    name: 'user',
    description: 'The member to timeout',
    description_localizations: {
      de: 'Mitglied, das stummgeschaltet werden soll',
    },
    required: true,
  })
  user: User;

  @IntegerOption({
    name: 'minutes',
    description: 'Duration of the timeout in minutes',
    description_localizations: { de: 'Dauer des Timeouts in Minuten' },
    min_value: 1,
    max_value: 40320,
    required: true,
  })
  minutes: number;

  @StringOption({
    name: 'reason',
    description: 'The reason for the timeout',
    description_localizations: { de: 'Grund des Timeouts' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class KickDto {
  @UserOption({
    name: 'user',
    description: 'The member to kick',
    description_localizations: { de: 'Mitglied, das gekickt werden soll' },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the kick',
    description_localizations: { de: 'Grund des Kicks' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class BanDto {
  @UserOption({
    name: 'user',
    description: 'The user to ban (also works for non-members)',
    description_localizations: {
      de: 'Nutzer, der gebannt werden soll (auch Nicht-Mitglieder)',
    },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the ban',
    description_localizations: { de: 'Grund des Banns' },
    required: false,
    max_length: 512,
  })
  reason?: string;

  @IntegerOption({
    name: 'delete_days',
    description: 'Delete messages from the last X days',
    description_localizations: { de: 'Nachrichten der letzten X Tage löschen' },
    min_value: 0,
    max_value: 7,
    required: false,
  })
  delete_days?: number;
}

export class UnbanDto {
  @UserOption({
    name: 'user',
    description: 'The user to unban (paste the user ID)',
    description_localizations: {
      de: 'Nutzer, der entbannt werden soll (User-ID einfügen)',
    },
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    description: 'The reason for the unban',
    description_localizations: { de: 'Grund der Entbannung' },
    required: false,
    max_length: 512,
  })
  reason?: string;
}
