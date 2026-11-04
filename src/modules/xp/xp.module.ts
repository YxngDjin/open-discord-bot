import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { xpModule } from './xp.definition.js';
import { XpService } from './xp.service.js';
import { XpListener } from './xp.listener.js';

@Module({
  providers: [XpService, XpListener],
})
export class XpModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}
  onModuleInit() {
    this.moduleRegistry.registerModule(xpModule);
  }
}
