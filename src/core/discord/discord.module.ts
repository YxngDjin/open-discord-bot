import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NecordModule } from 'necord';
import type { Env } from '../config/env.js';
import { IntentsBitField } from 'discord.js';
import { DiscordListener } from './discord.listener.js';

@Module({
  imports: [
    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const devGuildId = config.get('DEV_GUILD_ID', { infer: true });

        return {
          token: config.get('DISCORD_TOKEN'),
          intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
          ],
          development: devGuildId ? [devGuildId] : false,
        };
      },
    }),
  ],
  providers: [DiscordListener],
})
export class DiscordModule {}
