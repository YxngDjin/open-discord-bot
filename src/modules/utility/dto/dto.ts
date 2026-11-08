import { User } from 'discord.js';
import { IntegerOption, UserOption } from 'necord';
import { describeOption } from '../../../core/i18n/localize.js';

export class UserInfoDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.utility.options.user),
    required: false,
  })
  user?: User;
}

export class ClearDto {
  @IntegerOption({
    name: 'amount',
    ...describeOption((t) => t.utility.options.amount),
    required: true,
    min_value: 1,
    max_value: 100,
  })
  amount: number;
}
