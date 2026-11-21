import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard.js';
import { GuildAccessGuard } from './guild-access.guard.js';
import { GuildModulesService, moduleDetail } from './guild-modules.service.js';
import * as z from 'zod';

const setEnabledSchema = z.object({ enabled: z.boolean() }); // oben in der Datei

@Controller('guilds/:guildId/modules')
@UseGuards(SessionGuard, GuildAccessGuard)
export class GuildModulesController {
  constructor(private readonly guildModules: GuildModulesService) {}

  @Get()
  list(@Param('guildId') guildId: string) {
    return this.guildModules.list(guildId);
  }

  @Get(':key')
  get(@Param('guildId') guildId: string, @Param('key') key: string) {
    return this.guildModules.get(guildId, key);
  }

  @Patch(':key')
  setEnabled(
    @Param('guildId') guildId: string,
    @Param('key') key: string,
    @Body() body: unknown,
  ): Promise<moduleDetail> {
    const result = setEnabledSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }
    return this.guildModules.setEnabled(guildId, key, result.data.enabled);
  }
}
