import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class GuildService {
    constructor(private readonly prisma: PrismaService) {}

    async ensureGuild(guildId: string) {
        await this.prisma.guild.upsert({
            where: { id: guildId },
            update: {leftAt: null},
            create: { id: guildId },
        })
    }

    async markGuildLeft(guildId: string) {
        await this.prisma.guild.updateMany({
            where: { id: guildId },
            data: { leftAt: new Date() },
        });
    }

    async syncGuilds(activeGuildIds: string[]) {
        await Promise.all(
            activeGuildIds.map((guildId) => this.ensureGuild(guildId))
        );

        const { count } = await this.prisma.guild.updateMany({
            where: {
                leftAt: null,
                id: { notIn: activeGuildIds },
            },
            data: { leftAt: new Date() },
        });

        return count;
    }
}