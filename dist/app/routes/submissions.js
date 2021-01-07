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
const helpers_1 = require("../helpers");
const authentication_1 = require("../middlewares/authentication");
const Contest_1 = require("../models/Contest");
const Submission_1 = require("../models/Submission");
const downloadSubmission_1 = require("../middlewares/downloadSubmission");
const Log_1 = require("../models/Log");
const User_1 = require("../models/User");
const submissionsRouter = new router_1.default();
submissionsRouter.prefix('/api/submissions');
submissionsRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findByOsuId(ctx.session.osuId);
    const [submissions, contest] = yield Promise.all([
        Submission_1.Submission.findUserSubmissions(user === null || user === void 0 ? void 0 : user.id),
        Contest_1.Contest.findForSubmissions(),
    ]);
    ctx.body = {
        contest,
        submissions,
        user,
    };
}));
submissionsRouter.post('/save', authentication_1.authenticate, koa_body_1.default({
    multipart: true,
    formidable: {
        multiples: false,
        maxFileSize: 20 * 1024 * 1024,
    },
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const songId = helpers_1.convertToIntOrThrow(ctx.request.body.songId);
    const contest = yield Contest_1.Contest.findForSubmissions();
    const user = ctx.state.user;
    if (!contest)
        throw new Error('No contest in progress');
    const song = contest.songs.find(s => s.id === songId);
    if (!song)
        throw new Error('Song not found');
    const oszFile = (_a = ctx.request.files) === null || _a === void 0 ? void 0 : _a.oszFile;
    if (!(oszFile === null || oszFile === void 0 ? void 0 : oszFile.name.endsWith('.zip'))) {
        return ctx.body = {
            error: 'Select an .zip file',
        };
    }
    const submissions = yield Submission_1.Submission.findUserSubmissions(user.id);
    let submission = submissions.find(s => s.songId === song.id);
    if (!submission) {
        const sameCategory = submissions.filter(s => s.song.categoryId === song.categoryId);
        if (sameCategory.length) {
            return ctx.body = {
                error: 'You can only submit 1 song per category',
            };
        }
    }
    const paths = helpers_1.generateOriginalPaths(song, user);
    yield helpers_1.saveFile(oszFile.path, paths.finalDir, paths.finalPath);
    if (!submission) {
        submission = new Submission_1.Submission();
        submission.user = user;
        submission.song = song;
    }
    yield submission.save();
    ctx.body = {
        success: 'ok',
    };
    yield Log_1.Log.createAndSave(`${user.username} uploaded a submission for ${song.title} under ${paths.finalPath}`, Log_1.LOG_TYPE.User, submission.id);
}));
submissionsRouter.get('/:id/download', authentication_1.authenticate, downloadSubmission_1.findSubmission, (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const submission = ctx.state.submission;
    const user = ctx.state.user;
    if (submission.userId !== user.id) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }
    return yield next();
}), downloadSubmission_1.downloadOriginal);
exports.default = submissionsRouter;
