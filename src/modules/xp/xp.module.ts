import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { xpModule } from './xp.definition.js';
import { XpService } from './xp.service.js';
import { XpListener } from './xp.listener.js';
import { XpCommands } from './xp.commands.js';
import { XpSettingsCommands } from './xp-settings.commands.js';

@Module({
  providers: [XpService, XpListener, XpCommands, XpSettingsCommands],
})
export class XpModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}
  onModuleInit() {
    this.moduleRegistry.registerModule(xpModule);
  }
}
