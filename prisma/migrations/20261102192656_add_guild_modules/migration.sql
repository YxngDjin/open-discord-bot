-- CreateTable
CREATE TABLE "guild_modules" (
    "guild_id" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guild_modules_pkey" PRIMARY KEY ("guild_id","module")
);

-- AddForeignKey
ALTER TABLE "guild_modules" ADD CONSTRAINT "guild_modules_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
