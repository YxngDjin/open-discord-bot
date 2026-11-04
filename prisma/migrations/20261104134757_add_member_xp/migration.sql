-- CreateTable
CREATE TABLE "member_xp" (
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "voice_minutes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_xp_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateIndex
CREATE INDEX "member_xp_guild_id_xp_idx" ON "member_xp"("guild_id", "xp" DESC);

-- AddForeignKey
ALTER TABLE "member_xp" ADD CONSTRAINT "member_xp_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
