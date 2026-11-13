import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { SessionGuard, type SessionUser } from "../auth/session.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { GuildsService, GuildSummary } from "./guilds.service.js";
import { GuildAccessGuard } from "./guild-access.guard.js";

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
}