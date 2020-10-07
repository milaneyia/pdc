import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import session from 'koa-session';
import serve from 'koa-static';
import views from 'koa-views';
import path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import config from '../config.json';
import indexRouter from './routes';
import submissionsAdminRouter from './routes/admin/submissions';
import judgingRouter from './routes/judging';
import resultsRouter from './routes/results';
import submissionsRouter from './routes/submissions';
import usersAdminRouter from './routes/admin/users';
import logsRouter from './routes/admin/logs';
import contestsAdminRouter from './routes/admin/contests';
import votingRouter from './routes/voting';
import { Log, LOG_TYPE } from './models/Log';

const app = new Koa();
app.keys = config.keys;

// DB initialization
createConnection().then(() => {
    console.log('DB initializated');
}).catch((err) => {
    console.log(err);
});

// Middlewares
app.use(helmet());
app.use(session({
    key: 'pdc:sess',
    maxAge: 432000000, // 5 days
    renew: true,
    sameSite: 'lax',
}, app));
app.use(serve(path.join(__dirname, '../public')));
app.use(bodyparser());
app.use(views(path.join(__dirname, '../public')));

// Error handler
app.use(async (ctx, next) => {
    try {
        if (ctx.originalUrl !== '/favicon.ico') {
            console.log('\x1b[33m%s\x1b[0m', ctx.originalUrl);
        }

        await next();

        if (ctx.status === 404) {
            await ctx.render('index');
        }
    } catch (err) {
        ctx.status = err.status || 500;

        if (ctx.accepts('application/json') === 'application/json') {
            ctx.body = { error: 'Something went wrong!' };
        } else {
            await ctx.render('error');
        }

        ctx.app.emit('error', err, ctx);
    }
});

// Public routes
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());
app.use(resultsRouter.routes());
app.use(resultsRouter.allowedMethods());

// Logged user
app.use(votingRouter.routes());
app.use(votingRouter.allowedMethods());
app.use(submissionsRouter.routes());
app.use(submissionsRouter.allowedMethods());

// Judges page
app.use(judgingRouter.routes());
app.use(judgingRouter.allowedMethods());

// Admin Routes
app.use(usersAdminRouter.routes());
app.use(usersAdminRouter.allowedMethods());
app.use(contestsAdminRouter.routes());
app.use(contestsAdminRouter.allowedMethods());
app.use(submissionsAdminRouter.routes());
app.use(submissionsAdminRouter.allowedMethods());

app.use(logsRouter.routes());
app.use(logsRouter.allowedMethods());

app.on('error', (err, ctx) => {
    console.log(err);
    const text = JSON.stringify({
        osuId: ctx.session.osuId,
        username: ctx.session.username,
        stack: err.stack,
    });

    Log.createAndSave(text, LOG_TYPE.Error);
});

app.listen(3001);
