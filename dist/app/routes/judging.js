"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const helpers_1 = require("../helpers");
const authentication_1 = require("../middlewares/authentication");
const Judging_1 = require("../models/judging/Judging");
const Contest_1 = require("../models/Contest");
const Submission_1 = require("../models/Submission");
const Criteria_1 = require("../models/judging/Criteria");
const JudgingToCriteria_1 = require("../models/judging/JudgingToCriteria");
const judgingRouter = new router_1.default();
judgingRouter.prefix('/api/judging');
judgingRouter.use(authentication_1.authenticate);
judgingRouter.use(authentication_1.isJudge);
judgingRouter.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const contest = yield Contest_1.Contest.findForJudging();
    let lastContest;
    if (!contest) {
        lastContest = yield Contest_1.Contest.findLastJudgingContest();
        if (!lastContest) {
            return ctx.body = { error: 'There is currently no round to judge' };
        }
    }
    ctx.state.contest = contest;
    ctx.state.lastContest = lastContest;
    yield next();
}));
judgingRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let contest = ctx.state.contest || ctx.state.lastContest;
    if (contest) {
        contest = yield Contest_1.Contest.createQueryBuilder('contest')
            .leftJoin('contest.categories', 'categories')
            .leftJoin('categories.songs', 'songs', 'songs.wasChosen = true')
            .leftJoin('songs.submissions', 'submissions', 'submissions.anonymisedAs IS NOT NULL')
            .select([
            'contest.id',
            'contest.judgingStartedAt',
            'contest.judgingEndedAt',
            'categories.id',
            'categories.name',
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
    const [criterias, judgingDone] = yield Promise.all([
        Criteria_1.Criteria.find({}),
        Judging_1.Judging.find({
            where: { judgeId: ctx.state.user.id },
            relations: ['judgingToCriterias'],
        }),
    ]);
    return ctx.body = {
        contest,
        criterias,
        judgingDone,
    };
}));
judgingRouter.post('/save', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contest = ctx.state.contest;
    if (!contest)
        return ctx.body = { error: 'Too late' };
    const submissionId = helpers_1.convertToIntOrThrow(ctx.request.body.submissionId);
    const criteriaId = helpers_1.convertToIntOrThrow(ctx.request.body.criteriaId);
    const score = helpers_1.convertToIntOrThrow(ctx.request.body.score);
    const comment = ctx.request.body.comment && ctx.request.body.comment.trim();
    const [criteria, submission] = yield Promise.all([
        Criteria_1.Criteria.findOneOrFail({ id: criteriaId }),
        Submission_1.Submission.findOneOrFail({
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
    let judging = yield Judging_1.Judging.findOne({
        judgeId: ctx.state.user.id,
        submissionId: submission.id,
    });
    let judgingToCriteria;
    if (judging) {
        judgingToCriteria = yield JudgingToCriteria_1.JudgingToCriteria.findOne({
            criteria,
            judgingId: judging.id,
        });
    }
    else {
        judging = new Judging_1.Judging();
        judging.judgeId = ctx.state.user.id;
        judging.submissionId = submission.id;
        yield judging.save();
    }
    if (!judgingToCriteria) {
        judgingToCriteria = new JudgingToCriteria_1.JudgingToCriteria();
        judgingToCriteria.criteria = criteria;
        judgingToCriteria.judgingId = judging.id;
    }
    judgingToCriteria.score = score;
    judgingToCriteria.comment = comment;
    yield judgingToCriteria.save();
    const judgingDone = yield Judging_1.Judging.find({
        where: { judgeId: ctx.state.user.id },
        relations: ['judgingToCriterias'],
    });
    return ctx.body = {
        judgingDone,
        success: 'Saved!',
    };
}));
exports.default = judgingRouter;
