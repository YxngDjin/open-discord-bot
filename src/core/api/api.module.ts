import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { AuthModule } from './auth/auth.module.js';
import { GuildsModule } from './guilds/guilds.module.js';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    GuildsModule,
  ],
})
export class ApiModule {}
