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
const downloadSubmission_1 = require("../middlewares/downloadSubmission");
const Contest_1 = require("../models/Contest");
const Song_1 = require("../models/Song");
const Vote_1 = require("../models/Vote");
const votingRouter = new router_1.default();
votingRouter.prefix('/api/voting');
votingRouter.get('/', authentication_1.simpleAuthenticate, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = ctx.state.user;
    let contest = yield Contest_1.Contest.findForVoting((_a = ctx.state.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!contest || (user === null || user === void 0 ? void 0 : user.isStaff))
        contest = yield Contest_1.Contest.findForVotingResults(user === null || user === void 0 ? void 0 : user.isStaff);
    if (!contest)
        return ctx.body = { error: 'Voting is not in progress' };
    ctx.body = {
        contest,
        user,
    };
}));
votingRouter.post('/save', authentication_1.authenticate, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const user = ctx.state.user;
    const contest = yield Contest_1.Contest.findForVoting((_b = ctx.state.user) === null || _b === void 0 ? void 0 : _b.id);
    if (!contest)
        return ctx.body = { error: 'Voting is not in progress' };
    const points = helpers_1.convertToIntOrThrow(ctx.request.body.points);
    if (points < 1 || points > 3)
        throw new Error('Not valid points');
    const songId = helpers_1.convertToIntOrThrow(ctx.request.body.songId);
    const songs = contest.songs;
    const inputSong = songs.find(s => s.id === songId);
    if (!inputSong)
        throw new Error('Song not found');
    const relatedSongs = songs.filter(s => s.isFa === inputSong.isFa);
    let isCancelingVote = false;
    for (const song of relatedSongs) {
        for (const vote of song.votes) {
            if (song.id === inputSong.id && vote.points === points)
                isCancelingVote = true;
            if (song.id === inputSong.id || vote.points === points)
                yield vote.remove();
        }
    }
    if (!isCancelingVote) {
        const vote = new Vote_1.Vote();
        vote.points = points;
        vote.song = inputSong;
        vote.user = user;
        yield vote.save();
    }
    ctx.body = {
        success: 'Saved',
    };
}));
votingRouter.get('/:songId/downloadTemplate', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = helpers_1.convertToIntOrThrow(ctx.params.songId);
    ctx.state.song = yield Song_1.Song.findOneOrFail({ id });
    yield next();
}), downloadSubmission_1.downloadTemplate);
exports.default = votingRouter;
