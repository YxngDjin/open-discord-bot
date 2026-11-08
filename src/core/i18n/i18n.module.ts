import { Global, Module } from '@nestjs/common';
import { I18nService } from './i18n.service.js';
import { LanguageCommands } from './language.commands.js';
import { TimezoneCommands } from './timezone.commands.js';

@Global()
@Module({
  providers: [I18nService, LanguageCommands, TimezoneCommands],
  exports: [I18nService],
})
export class I18nModule {}
