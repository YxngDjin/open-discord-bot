import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard.js';
import { GuildAccessGuard } from './guild-access.guard.js';
import {
  GuildModulesService,
  type ModuleDetail,
  type ModuleSummary,
} from './guild-modules.service.js';
import * as z from 'zod';

// Shape of the PATCH body (checked at runtime, not just by TypeScript)
const setEnabledSchema = z.object({ enabled: z.boolean() });

@Controller('guilds/:guildId/modules')
@UseGuards(SessionGuard, GuildAccessGuard)
export class GuildModulesController {
  constructor(private readonly guildModules: GuildModulesService) {}

  @Get()
  list(@Param('guildId') guildId: string): Promise<ModuleSummary[]> {
    return this.guildModules.list(guildId);
  }

  @Get(':key')
  get(
    @Param('guildId') guildId: string,
    @Param('key') key: string,
  ): Promise<ModuleDetail> {
    return this.guildModules.get(guildId, key);
  }

  @Patch(':key')
  setEnabled(
    @Param('guildId') guildId: string,
    @Param('key') key: string,
    @Body() body: unknown,
  ): Promise<ModuleDetail> {
    const result = setEnabledSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }
    return this.guildModules.setEnabled(guildId, key, result.data.enabled);
  }

  @Put(':key/settings')
  updateSettings(
    @Param('guildId') guildId: string,
    @Param('key') key: string,
    @Body() body: unknown,
  ): Promise<ModuleDetail> {
    return this.guildModules.replaceSettings(guildId, key, body);
  }
}
