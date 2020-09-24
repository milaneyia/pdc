import Router from '@koa/router';
import { ParameterizedContext } from 'koa';
import { Criteria } from '../models/judging/Criteria';
import { Contest } from '../models/Contest';
import { User } from '../models/User';
import { findSubmission, downloadOriginalZip, downloadOriginal } from '../middlewares/downloadSubmission';
import { Submission } from '../models/Submission';
import { calculateScores, convertToIntOrThrow, JudgeCorrel, UserScore } from '../helpers';
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
    const judges = contest?.songs?.[0]?.submissions?.[0]?.judging?.map(j => j.judge);
    const results: { id: number; usersScores: UserScore[]; judgesCorrel: JudgeCorrel[] }[] = [];

    if (contest) {
        for (const song of contest.songs) {
            const { usersScores, judgesCorrel } = calculateScores(song);
            results.push({
                id: song.id,
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

resultsRouter.get('/downloadZip/:id/:songId', async (ctx: ParameterizedContext, next) => {
    const id = convertToIntOrThrow(ctx.params.id);
    const songId = convertToIntOrThrow(ctx.params.songId);
    const contest = await Contest.findOneOrFail({
        where: { id },
        relations: ['songs'],
    });
    const song = contest.songs.find(s => s.id === songId);

    if (new Date(contest.resultsAt) > new Date() || !song) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    ctx.state.song = song;

    return await next();
}, downloadOriginalZip);

export default resultsRouter;
