import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import type { Env } from './core/config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  const dashboardEnabled = config.get('DASHBOARD_ENABLED', { infer: true });
  app.enableShutdownHooks();
  if (dashboardEnabled) {
    app.setGlobalPrefix('api');
    await app.listen(config.get('PORT', { infer: true }));
  } else {
    await app.init();
  }
}
await bootstrap();
