import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './core/config/env.js';
import { DiscordModule } from './core/discord/discord.module.js';
import { UtilityModule } from './modules/utility/utillity.module.js';
import { DatabaseModule } from './core/database/database.module.js';
import { GuildModule } from './core/guilds/guild.module.js';
import { ModuleRegistryModule } from './core/module-registry/module-registry.module.js';
import { WelcomeModule } from './modules/welcome/welcome.module.js';
import { I18nModule } from './core/i18n/i18n.module.js';
import { ModerationModule } from './modules/moderation/moderation.module.js';
import { XpModule } from './modules/xp/xp.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModlogModule } from './modules/modlog/modlog.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    DiscordModule,
    UtilityModule,
    GuildModule,
    ModuleRegistryModule,
    WelcomeModule,
    I18nModule,
    ModerationModule,
    XpModule,
    ModlogModule,
  ],
})
export class AppModule {}
