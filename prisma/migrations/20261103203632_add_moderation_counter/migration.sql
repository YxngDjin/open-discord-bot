-- CreateTable
CREATE TABLE "moderation_counters" (
    "guild_id" TEXT NOT NULL,
    "last_case_number" INTEGER NOT NULL,

    CONSTRAINT "moderation_counters_pkey" PRIMARY KEY ("guild_id")
);

-- AddForeignKey
ALTER TABLE "moderation_counters" ADD CONSTRAINT "moderation_counters_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
