-- CreateEnum
CREATE TYPE "SelfRoleMode" AS ENUM ('BUTTONS', 'SELECT');

-- CreateTable
CREATE TABLE "self_role_panels" (
    "id" SERIAL NOT NULL,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "message_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mode" "SelfRoleMode" NOT NULL DEFAULT 'BUTTONS',
    "max_roles" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "self_role_panels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "self_role_options" (
    "id" SERIAL NOT NULL,
    "panel_id" INTEGER NOT NULL,
    "role_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "emoji" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "self_role_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "self_role_panels_guild_id_idx" ON "self_role_panels"("guild_id");

-- CreateIndex
CREATE UNIQUE INDEX "self_role_options_panel_id_role_id_key" ON "self_role_options"("panel_id", "role_id");

-- AddForeignKey
ALTER TABLE "self_role_panels" ADD CONSTRAINT "self_role_panels_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "self_role_options" ADD CONSTRAINT "self_role_options_panel_id_fkey" FOREIGN KEY ("panel_id") REFERENCES "self_role_panels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
