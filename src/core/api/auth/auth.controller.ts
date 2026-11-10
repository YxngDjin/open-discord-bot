import { Controller, Get, HttpCode, Post, Query, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { generateToken } from "./session-token.js";
import { AuthService, SESSION_MAX_AGE_MS } from "./auth.service.js";
import { type AuthenticatedRequest, SessionGuard, type SessionUser } from "./session.guard.js";
import { CurrentUser } from "./current-user.decorator.js";

const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes to log in at Discord


@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
    ) {}


    @Get('login')
    login(@Res() res: Response) {
        const state = generateToken();
        res.cookie('oauth_state', state, {
            ...this.auth.cookieOptions(STATE_MAX_AGE_MS),
        })
        res.redirect(this.auth.getLoginUrl(state));
    }

    @Get('callback')
    async callback(@Req() req: Request, @Res() res: Response ,@Query('code') code?: string, @Query('state') state?: string) {
        const stateCookie = req.cookies['oauth_state'];
        res.clearCookie('oauth_state', { path: '/' });

        if (!code || !state || !stateCookie || state !== stateCookie) {
            throw new UnauthorizedException('Invalid Login State');
        }

        const accessToken = await this.auth.exchangeCode(code);
        const userId = await this.auth.fetchUserId(accessToken);
        const session = await this.auth.createSession(userId);

        res.cookie('session', session, {
            ...this.auth.cookieOptions(SESSION_MAX_AGE_MS),
        });
        res.redirect('/');
    }

    @Get('me')
    @UseGuards(SessionGuard)
    async me(@CurrentUser() user: SessionUser) {
        return await this.auth.getProfile(user.id);
    }

    @Post('logout')
    @UseGuards(SessionGuard)
    @HttpCode(204)
    async logout(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
        await this.auth.deleteSession(req.cookies.session);
        res.clearCookie('session', { path: '/' });
    }
}