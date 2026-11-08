import { type User } from 'discord.js';
import { IntegerOption, StringOption, UserOption } from 'necord';
import { describeOption } from '../../../core/i18n/localize.js';

export class WarnDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.moderation.options.warn.user),
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    ...describeOption((t) => t.moderation.options.warn.reason),
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class CasesDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.moderation.options.cases.user),
    required: true,
  })
  user: User;
}

export class TimeoutDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.moderation.options.timeout.user),
    required: true,
  })
  user: User;

  @IntegerOption({
    name: 'minutes',
    ...describeOption((t) => t.moderation.options.timeout.minutes),
    min_value: 1,
    max_value: 40320,
    required: true,
  })
  minutes: number;

  @StringOption({
    name: 'reason',
    ...describeOption((t) => t.moderation.options.timeout.reason),
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class KickDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.moderation.options.kick.user),
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    ...describeOption((t) => t.moderation.options.kick.reason),
    required: false,
    max_length: 512,
  })
  reason?: string;
}

export class BanDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.moderation.options.ban.user),
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    ...describeOption((t) => t.moderation.options.ban.reason),
    required: false,
    max_length: 512,
  })
  reason?: string;

  @IntegerOption({
    name: 'delete_days',
    ...describeOption((t) => t.moderation.options.ban.deleteDays),
    min_value: 0,
    max_value: 7,
    required: false,
  })
  delete_days?: number;
}

export class UnbanDto {
  @UserOption({
    name: 'user',
    ...describeOption((t) => t.moderation.options.unban.user),
    required: true,
  })
  user: User;

  @StringOption({
    name: 'reason',
    ...describeOption((t) => t.moderation.options.unban.reason),
    required: false,
    max_length: 512,
  })
  reason?: string;
}
