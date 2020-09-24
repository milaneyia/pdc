import { Next, ParameterizedContext } from 'koa';
import { User } from '../models/User';
import { refreshToken, isRequestError } from './osuApi';

function sendResponse(ctx: ParameterizedContext) {
    if (ctx.request.type === 'application/json') {
        return ctx.body = { error: 'Unauthorized' };
    } else {
        return ctx.render('error');
    }
}

export async function simpleAuthenticate(ctx: ParameterizedContext, next: Next): Promise<any> {
    const user = await User.findByOsuId(ctx.session.osuId);
    ctx.state.user = user;

    return await next();
}

export async function authenticate(ctx: ParameterizedContext, next: Next): Promise<any> {
    const user = await User.findByOsuId(ctx.session.osuId);

    if (user && !user.isRestricted) {
        ctx.state.user = user;

        if (Date.now() > ctx.session.expiresIn) {
            const response = await refreshToken(ctx.session.refreshToken);

            if (isRequestError(response)) {
                ctx.session = null;

                return ctx.body = { error: 'Re-login..' };
            }

            ctx.session.expireIn = Date.now() + (response.expires_in * 1000);
            ctx.session.accessToken = response.access_token;
            ctx.session.refreshToken = response.refresh_token;
        }

        return await next();
    } else {
        return sendResponse(ctx);
    }
}

export async function isStaff(ctx: ParameterizedContext, next: Next): Promise<any> {
    if (ctx.state.user.isStaff) {
        return await next();
    } else {
        return sendResponse(ctx);
    }
}

export async function isJudge(ctx: ParameterizedContext, next: Next): Promise<any> {
    if (ctx.state.user.isJudge) {
        return await next();
    } else {
        return sendResponse(ctx);
    }
}

export async function isBasicUser(ctx: ParameterizedContext, next: Next): Promise<any> {
    if (ctx.state.user.isBasicUser) {
        return await next();
    } else {
        return sendResponse(ctx);
    }
}
