-- CreateTable
CREATE TABLE "temp_voice_channels" (
    "channel_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temp_voice_channels_pkey" PRIMARY KEY ("channel_id")
);

-- CreateIndex
CREATE INDEX "temp_voice_channels_guild_id_idx" ON "temp_voice_channels"("guild_id");

-- AddForeignKey
ALTER TABLE "temp_voice_channels" ADD CONSTRAINT "temp_voice_channels_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
