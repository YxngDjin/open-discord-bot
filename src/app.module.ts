import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './core/config/env.js';
import { DiscordModule } from './core/discord/discord.module.js';
import { UtilityModule } from './modules/utility/utillity.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv
    }),
    DiscordModule,
    UtilityModule,
  ],
})
export class AppModule {}
