import { Global, Module } from '@nestjs/common';
import { I18nService } from './i18n.service.js';
import { LanguageCommands } from './language.commands.js';

@Global()
@Module({
  providers: [I18nService, LanguageCommands],
  exports: [I18nService],
})
export class I18nModule {}
