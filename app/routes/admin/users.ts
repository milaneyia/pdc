import Router from '@koa/router';
import { convertToIntOrThrow } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { User } from '../../models/User';
import { ROLE, Role } from '../../models/Role';
import { Log, LOG_TYPE } from '../../models/Log';
import { Not, Like } from 'typeorm';

const usersAdminRouter = new Router();

usersAdminRouter.prefix('/api/admin/users');
usersAdminRouter.use(authenticate);
usersAdminRouter.use(isStaff);

usersAdminRouter.get('/roles', async (ctx) => {
    const roles = await Role.find({
        id: Not(ROLE.Staff),
    });

    ctx.body = {
        roles,
    };
});

usersAdminRouter.get('/query', async (ctx) => {
    const query = ctx.query.u;
    const users = await User.find({
        where: [
            { username: Like(`%${query}%`) },
            { osuId: query },
        ],
    });

    ctx.body = {
        users,
    };
});

usersAdminRouter.post('/:id/updateRole', async (ctx) => {
    const roleId = convertToIntOrThrow(ctx.request.body.roleId);

    if (roleId === ROLE.Staff) {
        return ctx.body = {
            error: 'Not a valid role',
        };
    }

    const [user, role] = await Promise.all([
        User.findOneOrFail({
            id: ctx.params.id,
            roleId: Not(ROLE.Staff),
        }),
        Role.findOneOrFail({
            id: roleId,
        }),
    ]);

    user.roleId = role.id;
    await user.save();

    ctx.body = {
        success: 'Updated',
    };

    Log.createAndSave(`${ctx.state.user.username} changed ${user.username} role to ${role.name}`, LOG_TYPE.Admin, user.id);
});

export default usersAdminRouter;
