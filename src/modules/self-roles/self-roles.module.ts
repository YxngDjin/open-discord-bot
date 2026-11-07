import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { selfRolesModule } from './self-roles.definition.js';
import { SelfRolesCommands } from './self-roles.commands.js';
import { SelfRolesService } from './self-roles.service.js';
import { SelfRolesComponents } from './self-roles.components.js';

@Module({
  providers: [SelfRolesCommands, SelfRolesService, SelfRolesComponents],
})
export class SelfRolesModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}

  onModuleInit() {
    this.moduleRegistry.registerModule(selfRolesModule);
  }
}
