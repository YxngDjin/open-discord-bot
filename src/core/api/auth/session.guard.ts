import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Request } from 'express';

export type SessionUser = { id: string };
export type AuthenticatedRequest = Request & { user: SessionUser };

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies.session;

    if (typeof token !== 'string') {
      throw new UnauthorizedException();
    }

    const session = await this.auth.findSession(token);
    if (!session) {
      throw new UnauthorizedException();
    }
    request.user = { id: session.userId };

    return true;
  }
}
