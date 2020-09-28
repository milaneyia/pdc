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
const Criteria_1 = require("../models/judging/Criteria");
const Contest_1 = require("../models/Contest");
const User_1 = require("../models/User");
const downloadSubmission_1 = require("../middlewares/downloadSubmission");
const helpers_1 = require("../helpers");
const Role_1 = require("../models/Role");
const resultsRouter = new router_1.default();
resultsRouter.prefix('/api/results');
resultsRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    let user;
    if (ctx.session.osuId) {
        user = yield User_1.User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: Role_1.ROLE.Staff,
            },
        });
    }
    const [contest, criterias] = yield Promise.all([
        Contest_1.Contest.findForResults(user === undefined),
        Criteria_1.Criteria.find({}),
    ]);
    const judges = (_e = (_d = (_c = (_b = (_a = contest === null || contest === void 0 ? void 0 : contest.songs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.submissions) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.judging) === null || _e === void 0 ? void 0 : _e.map(j => j.judge);
    const results = [];
    if (contest) {
        for (const song of contest.songs) {
            const { usersScores, judgesCorrel } = helpers_1.calculateScores(song);
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
}));
resultsRouter.get('/download/:id', downloadSubmission_1.findSubmission, (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = ctx.state.submission;
    let user;
    if (ctx.session.osuId) {
        user = yield User_1.User.findOne({
            where: {
                osuId: ctx.session.osuId,
                roleId: Role_1.ROLE.Staff,
            },
        });
    }
    if (new Date(submission.song.contest.resultsAt) > new Date() && !user) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }
    return yield next();
}), downloadSubmission_1.downloadOriginal);
resultsRouter.get('/downloadZip/:id/:songId', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = helpers_1.convertToIntOrThrow(ctx.params.id);
    const songId = helpers_1.convertToIntOrThrow(ctx.params.songId);
    const contest = yield Contest_1.Contest.findOneOrFail({
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
    return yield next();
}), downloadSubmission_1.downloadOriginalZip);
exports.default = resultsRouter;
