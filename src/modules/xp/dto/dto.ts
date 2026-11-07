import { User } from 'discord.js';
import { UserOption } from 'necord';

export class RankDto {
  @UserOption({
    name: 'user',
    description: 'Show the rank of another member',
    description_localizations: { de: 'Rang eines anderen Mitglieds anzeigen' },
    required: false,
  })
  user?: User;
}
