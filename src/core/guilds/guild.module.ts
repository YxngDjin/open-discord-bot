import { Module } from "@nestjs/common";
import { GuildService } from "./guild.service.js";
import { GuildListener } from "./guild.listener.js";

@Module({
    providers: [GuildService, GuildListener],
    exports: [GuildService],
})

export class GuildModule {}