import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { moderationModule } from './moderation.definition.js';
import { ModerationService } from './moderation.service.js';
import { ModerationCommands } from './moderation.commands.js';

@Module({
  providers: [ModerationService, ModerationCommands],
})
export class ModerationModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}
  onModuleInit() {
    this.moduleRegistry.registerModule(moderationModule);
  }
}
