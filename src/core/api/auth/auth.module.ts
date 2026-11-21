import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SessionGuard } from './session.guard.js';

@Module({
  providers: [AuthService, SessionGuard],
  controllers: [AuthController],
  exports: [SessionGuard, AuthService],
})
export class AuthModule {}
