import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { ModlogCommands } from './modlog.commands.js';
import { modlogModule } from './modlog.definition.js';
import { ModlogListener } from './modlog.listener.js';
import { ModlogService } from './modlog.service.js';

@Module({
  providers: [ModlogService, ModlogListener, ModlogCommands],
})
export class ModlogModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}

  onModuleInit() {
    this.moduleRegistry.registerModule(modlogModule);
  }
}
