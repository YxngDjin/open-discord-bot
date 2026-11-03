import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { welcomeModule } from './welcome.definition.js';
import { WelcomeService } from './welcome.service.js';
import { WelcomeListener } from './welcome.listener.js';
import { ModuleSettingsService } from '../../core/module-registry/module-settings.service.js';
import { WelcomeCommands } from './welcome.commands.js';

@Module({
  providers: [
    WelcomeService,
    WelcomeListener,
    ModuleSettingsService,
    WelcomeCommands,
  ],
})
export class WelcomeModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}

  onModuleInit() {
    this.moduleRegistry.registerModule(welcomeModule);
  }
}
