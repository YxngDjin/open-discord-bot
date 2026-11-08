import { Injectable, UseInterceptors } from '@nestjs/common';
import {
  type AutocompleteInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import {
  AutocompleteInterceptor,
  Context,
  Options,
  SlashCommand,
  type SlashCommandContext,
  StringOption,
} from 'necord';
import { I18nService } from './i18n.service.js';
import { resolveLocale } from './locales.js';
import { isValidTimezone, TIMEZONES } from './timezone.js';
import { translations } from './translations/index.js';
import { describeCommand, describeOption } from './localize.js';

/** Discord shows at most 25 suggestions. */
const MAX_SUGGESTIONS = 25;

/** Current time in a time zone, e.g. "21:17". */
const timeIn = (timezone: string) =>
  new Date().toLocaleTimeString('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  });

@Injectable()
export class TimezoneAutocompleteInterceptor extends AutocompleteInterceptor {
  transformOptions(interaction: AutocompleteInteraction) {
    // What the admin has typed so far, e.g. "berl"
    const typed = interaction.options.getFocused().toLowerCase();

    const suggestions = TIMEZONES.filter((timezone) =>
      timezone.toLowerCase().includes(typed),
    ).slice(0, MAX_SUGGESTIONS);

    return interaction.respond(
      suggestions.map((timezone) => ({ name: timezone, value: timezone })),
    );
  }
}

export class TimezoneDto {
  @StringOption({
    name: 'timezone',
    ...describeOption((t) => t.timezone.options.timezone),
    required: false,
    // No choices: there are over 400 time zones, Discord allows only 25.
    // The suggestions come from TimezoneAutocompleteInterceptor instead.
    autocomplete: true,
  })
  timezone?: string;
}

@Injectable()
export class TimezoneCommands {
  constructor(private readonly i18n: I18nService) {}

  @UseInterceptors(TimezoneAutocompleteInterceptor)
  @SlashCommand({
    name: 'timezone',
    ...describeCommand((t) => t.timezone.commands.timezone),
    defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
    contexts: [InteractionContextType.Guild],
  })
  public async onTimezone(
    @Context() [interaction]: SlashCommandContext,
    @Options() { timezone }: TimezoneDto,
  ) {
    const t = translations[resolveLocale(interaction.locale)].timezone;
    const guildId = interaction.guildId!;

    // No option: show the current time zone
    if (!timezone) {
      const current = await this.i18n.getGuildTimezone(guildId);
      return interaction.reply({
        content: t.current({
          timezone: current,
          time: timeIn(current),
        }),
        flags: MessageFlags.Ephemeral,
      });
    }

    // Autocomplete only suggests. Admins can still type anything.
    if (!isValidTimezone(timezone)) {
      return interaction.reply({
        content: t.invalid({ timezone }),
        flags: MessageFlags.Ephemeral,
        allowedMentions: { parse: [] },
      });
    }

    await this.i18n.setGuildTimezone(guildId, timezone);
    return interaction.reply({
      content: t.changed({ timezone, time: timeIn(timezone) }),
      flags: MessageFlags.Ephemeral,
    });
  }
}
