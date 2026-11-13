import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { GuildsController } from "./guilds.controller.js";
import { GuildsService } from "./guilds.service.js";
import { GuildAccessGuard } from "./guild-access.guard.js";

@Module({
    imports: [AuthModule],
    controllers: [GuildsController],
    providers: [GuildsService, GuildAccessGuard],
    exports: [GuildsService],
})
export class GuildsModule {}