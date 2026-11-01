import { Injectable, Logger } from "@nestjs/common";
import { Context, type ContextOf, Once } from "necord";

@Injectable()
export class DiscordListener {
    private readonly logger = new Logger(DiscordListener.name);

    @Once("clientReady")
    public onReady(@Context() [client]: ContextOf<"clientReady">) {
        this.logger.log(`Logged is as: ${client.user.tag} on ${client.guilds.cache.size} Servers.`);
    }
}