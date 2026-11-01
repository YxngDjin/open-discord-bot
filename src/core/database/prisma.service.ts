import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../config/env.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    constructor(config: ConfigService<Env, true>) {
        super({
            adapter: new PrismaPg({ connectionString: config.get("DATABASE_URL", { infer: true}) }),
        });
    }

    async onModuleInit() {
        try {
            await this.$queryRaw`SELECT 1`;
            this.logger.log("Connected to database");
        } catch (error) {
            this.logger.error("Failed to connect to database. Check DATABASE_URL in .env");
            throw new Error("Database connection failed", {cause: error});
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log("Disconnected from database");
    }
}