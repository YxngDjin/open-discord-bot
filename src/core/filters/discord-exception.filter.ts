import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { BaseInteraction, MessageFlags } from 'discord.js';
import { NecordArgumentsHost } from 'necord';
import { resolveLocale } from '../i18n/locales.js';
import { errorFilterTranslations } from './i18n/index.js';

@Catch()
export class DiscordExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DiscordExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const message =
      exception instanceof Error ? exception.stack : String(exception);
    this.logger.error(message);

    const [first] = NecordArgumentsHost.create(host).getContext<unknown[]>();

    if (!(first instanceof BaseInteraction) || !first.isRepliable()) {
      return null;
    }

    const locale = resolveLocale(first.locale);
    const content = errorFilterTranslations[locale].genericError;
    const options = { content, flags: MessageFlags.Ephemeral } as const;

    return (
      first.replied || first.deferred
        ? first.followUp(options)
        : first.reply(options)
    ).catch(() =>
      this.logger.warn('Could not send the error message to the user'),
    );
  }
}
