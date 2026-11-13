import { type CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Client } from "discord.js";
import { GuildsService } from "./guilds.service.js";
import type { AuthenticatedRequest } from "../auth/session.guard.js";

@Injectable()
export class GuildAccessGuard implements CanActivate {
    constructor(
        private readonly client: Client,
        private readonly guilds: GuildsService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const guildId = request.params.guildId;
        if (typeof guildId !== 'string') return false;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return false;
        return this.guilds.canManage(guild, request.user.id);
    }
}