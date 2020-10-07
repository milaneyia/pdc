import Router from '@koa/router';
import { ParameterizedContext } from 'koa';
import { Criteria } from '../models/judging/Criteria';
import { Contest } from '../models/Contest';
import { User } from '../models/User';
import { findSubmission, downloadOriginalZip, downloadOriginal } from '../middlewares/downloadSubmission';
import { Submission } from '../models/Submission';
import { calculateScores, convertToIntOrThrow, Results } from '../helpers';
import { ROLE } from '../models/Role';

const resultsRouter = new Router();

resultsRouter.prefix('/api/results');

resultsRouter.get('/', async (ctx: ParameterizedContext) => {
    let user: User | undefined;

    if (ctx.session.osuId) {
        user = await User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: ROLE.Staff,
            },
        });
    }

    const [contest, criterias] = await Promise.all([
        Contest.findForResults(user === undefined),
        Criteria.find({}),
    ]);
    const judges = contest?.categories?.[0]?.songs?.[0]?.submissions?.[0]?.judging?.map(j => j.judge);
    const results: Results[] = [];

    if (contest) {
        for (const category of contest.categories) {
            const submissions: Submission[] = [];

            for (const song of category.songs) {
                submissions.push(...song.submissions);
            }

            const { usersScores, judgesCorrel } = calculateScores(submissions);
            results.push({
                id: category.id,
                usersScores,
                judgesCorrel,
            });
        }
    }

    return ctx.body = {
        criterias,
        contest,
        judges,
        results,
    };
});

resultsRouter.get('/download/:id', findSubmission, async (ctx: ParameterizedContext, next) => {
    const submission: Submission = ctx.state.submission;
    let user: User | undefined;

    if (ctx.session.osuId) {
        user = await User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: ROLE.Staff,
            },
        });
    }

    if (new Date(submission.song.contest.resultsAt) > new Date() && !user) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    return await next();
}, downloadOriginal);

resultsRouter.get('/downloadZip/:id/:categoryId', async (ctx: ParameterizedContext, next) => {
    const id = convertToIntOrThrow(ctx.params.id);
    const categoryId = convertToIntOrThrow(ctx.params.categoryId);
    const contest = await Contest.findOneOrFail({
        where: { id },
        relations: ['categories'],
    });
    const category = contest.categories.find(c => c.id === categoryId);

    if (new Date(contest.resultsAt) > new Date() || !category) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    ctx.state.category = category;

    return await next();
}, downloadOriginalZip);

export default resultsRouter;
