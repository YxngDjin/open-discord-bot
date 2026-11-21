import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'discord.js';
import type { Env } from '../../config/env.js';
import * as z from 'zod';
import { PrismaService } from '../../database/prisma.service.js';
import { generateToken, hashToken } from './session-token.js';
import type { CookieOptions } from 'express';
import { Interval } from '@nestjs/schedule';

const tokenResponseSchema = z.object({
  access_token: z.string(),
});

const userResponseSchema = z.object({
  id: z.string(),
});

const SESSION_CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // every hour
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly config: ConfigService<Env, true>,
    private readonly client: Client,
    private readonly prisma: PrismaService,
  ) {}

  private redirectUri(): string {
    const dashboardUrl = this.config.get('DASHBOARD_URL', { infer: true })!;
    return new URL('/api/auth/callback', dashboardUrl).toString();
  }

  getLoginUrl(state: string): string {
    const url = new URL('https://discord.com/oauth2/authorize');
    url.searchParams.set('client_id', this.client.application!.id);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', this.redirectUri());
    url.searchParams.set('scope', 'identify');
    url.searchParams.set('state', state);
    return url.toString();
  }

  async exchangeCode(code: string): Promise<string> {
    const response = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: this.client.application!.id,
        client_secret: this.config.get('DISCORD_CLIENT_SECRET', {
          infer: true,
        })!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri(),
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException();
    }
    const data = tokenResponseSchema.parse(await response.json());
    return data.access_token;
  }

  async fetchUserId(accessToken: string): Promise<string> {
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException();
    }

    const data = userResponseSchema.parse(await response.json());
    return data.id;
  }

  async createSession(userId: string): Promise<string> {
    const token = generateToken();
    await this.prisma.session.create({
      data: {
        userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS),
      },
    });
    return token;
  }

  async findSession(token: string) {
    const session = await this.prisma.session.findUnique({
      where: {
        tokenHash: hashToken(token),
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token),
      },
    });
  }

  cookieOptions(maxAge: number): CookieOptions {
    const dashboardURL = this.config.get('DASHBOARD_URL', { infer: true })!;

    return {
      maxAge,
      httpOnly: true,
      sameSite: 'lax',
      secure: dashboardURL.startsWith('https://'),
      path: '/',
    };
  }

  async getProfile(userId: string) {
    const user = await this.client.users.fetch(userId);
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.displayAvatarURL(),
    };
  }

  @Interval(SESSION_CLEANUP_INTERVAL_MS)
  async deleteExpiredSessions() {
    const { count } = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    if (count > 0) {
      this.logger.debug(`Deleted ${count} expired session(s)`);
    }
  }
}
