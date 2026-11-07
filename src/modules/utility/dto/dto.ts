import { User } from 'discord.js';
import { IntegerOption, UserOption } from 'necord';

export class UserInfoDto {
  @UserOption({
    name: 'user',
    description: 'The user to show (default: you)',
    description_localizations: {
      de: 'Der Nutzer, der angezeigt wird (Standard: du)',
    },
    required: false,
  })
  user?: User;
}

export class ClearDto {
  @IntegerOption({
    name: 'amount',
    description: 'Number of messages to delete (1-100)',
    description_localizations: {
      de: 'Anzahl der Nachrichten, die gelöscht werden (1-100)',
    },
    required: true,
    min_value: 1,
    max_value: 100,
  })
  amount: number;
}
