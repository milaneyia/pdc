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
exports.downloadTemplate = exports.downloadOriginalZip = exports.downloadAnonymousZip = exports.downloadOriginal = exports.downloadAnonymous = exports.findSubmission = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../helpers");
const Submission_1 = require("../models/Submission");
function findSubmission(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = helpers_1.convertToIntOrThrow(ctx.params.id);
        const submission = yield Submission_1.Submission.findOneOrFail({
            where: { id },
            relations: [
                'user',
                'song',
                'song.contest',
            ],
        });
        ctx.state.submission = submission;
        return yield next();
    });
}
exports.findSubmission = findSubmission;
function downloadFile(ctx, path, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        yield helpers_1.checkFileExistence(path);
        ctx.attachment(filename);
        ctx.type = 'application/octet-stream';
        ctx.body = fs_1.default.createReadStream(path);
    });
}
function downloadAnonymous(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const submission = ctx.state.submission;
        if (!submission.anonymisedAs)
            throw new Error('Not yet created');
        const paths = helpers_1.generateAnonymizedPaths(submission.song, submission.user, submission.anonymisedAs);
        yield downloadFile(ctx, paths.finalPath, paths.outputFilename);
    });
}
exports.downloadAnonymous = downloadAnonymous;
function downloadOriginal(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const submission = ctx.state.submission;
        const paths = helpers_1.generateOriginalPaths(submission.song, submission.user);
        yield downloadFile(ctx, paths.finalPath, paths.outputFilename);
    });
}
exports.downloadOriginal = downloadOriginal;
function downloadAnonymousZip(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = ctx.state.category;
        const paths = helpers_1.generateAnonymizedZipPaths(category);
        yield downloadFile(ctx, paths.finalPath, paths.outputFilename);
    });
}
exports.downloadAnonymousZip = downloadAnonymousZip;
function downloadOriginalZip(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = ctx.state.category;
        const paths = helpers_1.generateOriginalZipPaths(category);
        yield downloadFile(ctx, paths.finalPath, paths.outputFilename);
    });
}
exports.downloadOriginalZip = downloadOriginalZip;
function downloadTemplate(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const song = ctx.state.song;
        const paths = helpers_1.generateTemplatePaths(song);
        yield downloadFile(ctx, paths.finalPath, paths.outputFilename);
    });
}
exports.downloadTemplate = downloadTemplate;
