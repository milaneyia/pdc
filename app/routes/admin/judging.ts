import Router from '@koa/router';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Song } from '../../models/Song';

const judgingAdminRouter = new Router();

judgingAdminRouter.prefix('/api/admin/judging');
judgingAdminRouter.use(authenticate);
judgingAdminRouter.use(isStaff);

judgingAdminRouter.get('/', async (ctx) => {
    const songs = await Song.find({
        where: {
            wasChosen: true,
        },
        relations: [
            'submissions',
            'submissions.judging',
            'submissions.judging.judge',
            'submissions.judging.judgingToCriterias',
            'submissions.judging.judgingToCriterias.criteria',
        ],
    });

    ctx.body = {
        songs,
    };
});

export default judgingAdminRouter;
