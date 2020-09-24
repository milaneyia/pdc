import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Log, LOG_TYPE } from '../../models/Log';
import { Not } from 'typeorm';

const logsRouter = new Router();

logsRouter.prefix('/api/admin/logs');
logsRouter.use(authenticate);
logsRouter.use(isStaff);

logsRouter.get('/', async (ctx) => {
    const logs = await Log.find({
        where: {
            type: Not(LOG_TYPE.Error),
        },
        skip: ctx.query.s || 0,
        take: 50,
        order: {
            createdAt: 'DESC',
        },
    });

    if (!logs.length) {
        return ctx.body = {
            error: 'No more logs',
        };
    }

    ctx.body = {
        logs,
    };
});

export default logsRouter;
