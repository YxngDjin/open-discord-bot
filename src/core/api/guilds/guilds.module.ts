import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { GuildsController } from './guilds.controller.js';
import { GuildsService } from './guilds.service.js';
import { GuildAccessGuard } from './guild-access.guard.js';
import { GuildModulesController } from './guild-modules.controller.js';
import { GuildModulesService } from './guild-modules.service.js';
import { ModuleRegistryModule } from '../../module-registry/module-registry.module.js';

@Module({
  imports: [AuthModule, ModuleRegistryModule],
  controllers: [GuildsController, GuildModulesController],
  providers: [GuildsService, GuildAccessGuard, GuildModulesService],
  exports: [GuildsService],
})
export class GuildsModule {}
