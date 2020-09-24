import Router from '@koa/router';
import { convertToIntOrThrow } from '../helpers';
import { authenticate, isJudge } from '../middlewares/authentication';
import { downloadAnonymous, downloadAnonymousZip, findSubmission } from '../middlewares/downloadSubmission';
import { Judging } from '../models/judging/Judging';
import { Contest } from '../models/Contest';
import { Submission } from '../models/Submission';
import { Criteria } from '../models/judging/Criteria';
import { JudgingToCriteria } from '../models/judging/JudgingToCriteria';
import { ParameterizedContext, Next } from 'koa';

const judgingRouter = new Router();

judgingRouter.prefix('/api/judging');
judgingRouter.use(authenticate);
judgingRouter.use(isJudge);
judgingRouter.use(async (ctx: ParameterizedContext, next: Next) => {
    const contest = await Contest.findForJudging();
    let lastContest: Contest | undefined;

    if (!contest) {
        lastContest = await Contest.findLastJudgingContest();

        if (!lastContest) {
            return ctx.body = { error: 'There is currently no round to judge' };
        }
    }

    ctx.state.contest = contest;
    ctx.state.lastContest = lastContest;
    await next();
});

judgingRouter.get('/', async (ctx) => {
    let contest: Contest | undefined = ctx.state.contest || ctx.state.lastContest;

    if (contest) {
        contest = await Contest.createQueryBuilder('contest')
            .leftJoin('contest.songs', 'songs')
            .leftJoin('songs.submissions', 'submissions')
            .select([
                'contest.id',
                'contest.judgingStartedAt',
                'contest.judgingEndedAt',
                'songs.id',
                'songs.artist',
                'songs.title',
                'submissions.id',
                'submissions.anonymisedAs',
            ])
            .where('contest.id = :contestId', { contestId: contest.id })
            .orderBy('submissions.anonymisedAs')
            .getOne();
    }

    const [criterias, judgingDone] = await Promise.all([
        Criteria.find({}),
        Judging.find({
            where: { judgeId: ctx.state.user.id },
            relations: ['judgingToCriterias'],
        }),
    ]);

    return ctx.body = {
        contest,
        criterias,
        judgingDone,
    };
});

judgingRouter.post('/save', async (ctx) => {
    const contest: Contest | undefined = ctx.state.contest;
    if (!contest) return ctx.body = { error: 'Too late' };

    const submissionId = convertToIntOrThrow(ctx.request.body.submissionId);
    const criteriaId = convertToIntOrThrow(ctx.request.body.criteriaId);
    const score = convertToIntOrThrow(ctx.request.body.score);
    const comment = ctx.request.body.comment && ctx.request.body.comment.trim();

    const [criteria, submission] = await Promise.all([
        Criteria.findOneOrFail({ id: criteriaId }),
        Submission.findOneOrFail({
            where: { id: submissionId },
            relations: ['song'],
        }),
    ]);

    if (!comment || !criteria || !submission) {
        return ctx.body = { error: 'Missing data' };
    }

    if (submission.song.contestId !== contest.id) {
        return ctx.body = { error: 'woah' };
    }

    if (score > criteria.maxScore) {
        return ctx.body = { error: 'Score is higher than expected' };
    }

    let judging = await Judging.findOne({
        judgeId: ctx.state.user.id,
        submissionId: submission.id,
    });

    let judgingToCriteria: JudgingToCriteria | undefined;

    if (judging) {
        judgingToCriteria = await JudgingToCriteria.findOne({
            criteria,
            judgingId: judging.id,
        });
    } else {
        judging = new Judging();
        judging.judgeId = ctx.state.user.id;
        judging.submissionId = submission.id;
        await judging.save();
    }

    if (!judgingToCriteria) {
        judgingToCriteria = new JudgingToCriteria();
        judgingToCriteria.criteria = criteria;
        judgingToCriteria.judgingId = judging.id;
    }

    judgingToCriteria.score = score;
    judgingToCriteria.comment = comment;
    await judgingToCriteria.save();

    const judgingDone = await Judging.find({
        where: { judgeId: ctx.state.user.id },
        relations: ['judgingToCriterias'],
    });

    return ctx.body = {
        judgingDone,
        success: 'Saved!',
    };
});

judgingRouter.get('/downloadZip/:songId', async (ctx, next) => {
    const songId = convertToIntOrThrow(ctx.params.songId);
    const song = ctx.state.contest.songs.find(s => s.id === songId);

    if (!song) {
        return ctx.body = {
            error: 'oops',
        };
    }

    ctx.state.song = song;

    return await next();
}, downloadAnonymousZip);

judgingRouter.get('/submission/:id/download', findSubmission, async (ctx, next) => {
    if (ctx.state.contest.id !== ctx.state.submission.match.roundId) {
        return ctx.body = {
            error: 'oops',
        };
    }

    return await next();
}, downloadAnonymous);

export default judgingRouter;
