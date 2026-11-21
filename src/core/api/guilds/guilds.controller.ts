import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SessionGuard, type SessionUser } from '../auth/session.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import {
  type ChannelSummary,
  GuildsService,
  GuildSummary,
  RoleSummary,
} from './guilds.service.js';
import { GuildAccessGuard } from './guild-access.guard.js';

@Controller('guilds')
export class GuildsController {
  constructor(private readonly guilds: GuildsService) {}

  @Get()
  @UseGuards(SessionGuard)
  list(@CurrentUser() user: SessionUser): Promise<GuildSummary[]> {
    return this.guilds.listManageable(user.id);
  }

  @Get(':guildId')
  @UseGuards(SessionGuard, GuildAccessGuard)
  get(@Param('guildId') guildId: string) {
    return this.guilds.getSummary(guildId);
  }

  @Get(':guildId/channels')
  @UseGuards(SessionGuard, GuildAccessGuard)
  channels(@Param('guildId') guildId: string): ChannelSummary[] {
    return this.guilds.listChannels(guildId);
  }

  @Get(':guildId/roles')
  @UseGuards(SessionGuard, GuildAccessGuard)
  roles(@Param('guildId') guildId: string): RoleSummary[] {
    return this.guilds.listRoles(guildId);
  }
}
