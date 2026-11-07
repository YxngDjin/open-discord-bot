import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { selfRolesModule } from './self-roles.definition.js';
import { SelfRoleCommands } from './self-role.commands.js';
import { SelfRolesService } from './self-role.service.js';
import { SelfRolesComponent } from './self-role.components.js';

@Module({
  providers: [SelfRoleCommands, SelfRolesService, SelfRolesComponent],
})
export class SelfRolesModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}

  onModuleInit() {
    this.moduleRegistry.registerModule(selfRolesModule);
  }
}
