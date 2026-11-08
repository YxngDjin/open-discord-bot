-- AlterTable
ALTER TABLE "guilds" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- CreateTable
CREATE TABLE "leaderboard_messages" (
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "last_posted_on" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboard_messages_pkey" PRIMARY KEY ("guild_id")
);

-- AddForeignKey
ALTER TABLE "leaderboard_messages" ADD CONSTRAINT "leaderboard_messages_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
