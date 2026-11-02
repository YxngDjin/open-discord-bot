import { Global, Module } from '@nestjs/common';
import { ModuleRegistryService } from './module-registry.service.js';
import { ModuleCommands } from './module.commands.js';
import { ModuleSettingsService } from './module-settings.service.js';

@Global()
@Module({
  providers: [ModuleRegistryService, ModuleSettingsService, ModuleCommands],
  exports: [ModuleRegistryService],
})
export class ModuleRegistryModule {}
