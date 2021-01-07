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
const koa_body_1 = __importDefault(require("koa-body"));
const authentication_1 = require("../../middlewares/authentication");
const Contest_1 = require("../../models/Contest");
const Song_1 = require("../../models/Song");
const helpers_1 = require("../../helpers");
const downloadSubmission_1 = require("../../middlewares/downloadSubmission");
const contestsAdminRouter = new router_1.default();
contestsAdminRouter.prefix('/api/admin/contests');
contestsAdminRouter.use(authentication_1.authenticate);
contestsAdminRouter.use(authentication_1.isStaff);
contestsAdminRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contest = yield Contest_1.Contest.findOne({
        relations: [
            'songs',
        ],
    });
    ctx.body = {
        contest,
    };
}));
contestsAdminRouter.post('/update', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const data = ctx.request.body.contest;
    const contest = yield Contest_1.Contest.findOneOrFail();
    contest.votingStartedAt = data.votingStartedAt;
    contest.votingEndedAt = data.votingEndedAt;
    contest.submissionsStartedAt = data.submissionsStartedAt;
    contest.submissionsEndedAt = data.submissionsEndedAt;
    contest.judgingStartedAt = data.judgingStartedAt;
    contest.judgingEndedAt = data.judgingEndedAt;
    contest.resultsAt = data.resultsAt;
    yield contest.save();
    ctx.body = {
        success: 'ok',
        contest,
    };
}));
contestsAdminRouter.post('/store', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let contest = yield Contest_1.Contest.findOne();
    if (!contest) {
        contest = new Contest_1.Contest();
        contest.votingStartedAt = new Date();
        contest.votingEndedAt = new Date();
        contest.submissionsStartedAt = new Date();
        contest.submissionsEndedAt = new Date();
        contest.judgingStartedAt = new Date();
        contest.judgingEndedAt = new Date();
        contest.resultsAt = new Date();
        yield contest.save();
    }
    ctx.body = {
        contest,
    };
}));
contestsAdminRouter.post('/storeSong', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const contest = yield Contest_1.Contest.findOneOrFail();
    const data = ctx.request.body.song;
    const song = new Song_1.Song();
    song.contestId = contest.id;
    song.artist = data.artist;
    song.title = data.title;
    song.previewLink = data.previewLink;
    song.isFa = data.isFa;
    yield song.save();
    ctx.body = {
        success: 'ok',
    };
}));
function updateSong(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const song = yield Song_1.Song.findOneOrFail({ id });
        song.artist = data.artist;
        song.title = data.title;
        song.previewLink = data.previewLink;
        song.isFa = data.isFa;
        song.wasChosen = data.wasChosen;
        yield song.save();
        return song;
    });
}
contestsAdminRouter.post('/songs/:id/uploadOsz', koa_body_1.default({
    multipart: true,
    formidable: {
        multiples: false,
    },
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const oszFile = (_a = ctx.request.files) === null || _a === void 0 ? void 0 : _a.oszFile;
    if (oszFile && !oszFile.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }
    const song = yield updateSong(ctx.request.body.song, ctx.params.id);
    if (oszFile) {
        const paths = helpers_1.generateTemplatePaths(song);
        yield helpers_1.saveFile(oszFile.path, paths.finalDir, paths.finalPath);
    }
    ctx.body = {
        success: 'ok',
    };
}));
contestsAdminRouter.post('/songs/:id/update', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield updateSong(ctx.request.body.song, ctx.params.id);
    ctx.body = {
        success: 'ok',
    };
}));
contestsAdminRouter.post('/songs/:id/remove', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield Song_1.Song.findOneOrFail({ id: ctx.params.id });
    yield song.remove();
    ctx.body = {
        success: 'ok',
    };
}));
contestsAdminRouter.get('/songs/:id/download', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.state.song = yield Song_1.Song.findOneOrFail({ id: ctx.params.id });
    yield next();
}), downloadSubmission_1.downloadTemplate);
exports.default = contestsAdminRouter;
