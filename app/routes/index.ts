import Router from '@koa/router';
import { ParameterizedContext } from 'koa';
import * as osuApi from '../middlewares/osuApi';
import { ROLE } from '../models/Role';
import { Contest } from '../models/Contest';
import { User } from '../models/User';

const indexRouter = new Router();

indexRouter.get('/api/', async (ctx: ParameterizedContext) => {
    const contest = await Contest.findForResults();
    const osuId = ctx.session.osuId;
    let user;

    if (osuId) {
        user = await User.findByOsuId(osuId);
    }

    ctx.body = {
        contest,
        user,
        lang: ctx.session.lang,
    };
});

indexRouter.get('/login', (ctx: ParameterizedContext) => {
    const state = osuApi.generateState();
    ctx.cookies.set('_state', state);
    ctx.session.redirectTo = ctx.request.header.referer;

    return ctx.redirect(osuApi.generateAuthorizeUrl(state));
});

indexRouter.get('/logout', (ctx: ParameterizedContext) => {
    ctx.session = null;

    return ctx.redirect('/');
});

indexRouter.get('/callback', async (ctx: ParameterizedContext) => {
    if (!ctx.query.code || ctx.query.error) {
        return ctx.render('error');
    }

    const decodedState = osuApi.decodeState(ctx.query.state);
    const savedState = ctx.cookies.get('_state');
    ctx.cookies.set('_state', undefined);

    if (decodedState !== savedState) {
        return ctx.render('error');
    }

    const response = await osuApi.getToken(ctx.query.code);

    if (osuApi.isRequestError(response)) {
        return ctx.render('error');
    } else {
        const userResponse = await osuApi.getUserInfo(response.access_token);

        if (osuApi.isRequestError(userResponse)) {
            ctx.session = null;

            return ctx.render('error');
        }

        ctx.session.expiresIn = Date.now() + (response.expires_in * 1000);
        ctx.session.accessToken = response.access_token;
        ctx.session.refreshToken = response.refresh_token;
        ctx.session.osuId = userResponse.id;
        ctx.session.username = userResponse.username;

        let user = await User.findOne({ where: { osuId: userResponse.id } });

        if (!user) {
            user = await User.create({
                osuId: userResponse.id,
                roleId: ROLE.BasicUser,
                username: userResponse.username,
            }).save();
        }

        if  (user) {
            const redirectUrl = ctx.session.redirectTo || '/';
            ctx.session.redirectTo = null;

            return ctx.redirect(redirectUrl);
        }

        ctx.session = null;

        return ctx.render('error');
    }
});

export default indexRouter;
