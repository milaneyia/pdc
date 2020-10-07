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
const jszip_1 = __importDefault(require("jszip"));
const fs_1 = __importDefault(require("fs"));
const router_1 = __importDefault(require("@koa/router"));
const koa_body_1 = __importDefault(require("koa-body"));
const helpers_1 = require("../../helpers");
const authentication_1 = require("../../middlewares/authentication");
const downloadSubmission_1 = require("../../middlewares/downloadSubmission");
const Submission_1 = require("../../models/Submission");
const Category_1 = require("../../models/Category");
const submissionsAdminRouter = new router_1.default();
submissionsAdminRouter.prefix('/api/admin/submissions');
submissionsAdminRouter.use(authentication_1.authenticate);
submissionsAdminRouter.use(authentication_1.isStaff);
submissionsAdminRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.Category.createQueryBuilder('category')
        .leftJoinAndSelect('category.songs', 'songs')
        .leftJoinAndSelect('songs.submissions', 'submissions')
        .leftJoinAndSelect('submissions.user', 'user')
        .where('songs.wasChosen = true')
        .getMany();
    ctx.body = {
        categories,
    };
}));
submissionsAdminRouter.post('/:id/save', koa_body_1.default({
    multipart: true,
    formidable: {
        multiples: false,
    },
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const anonymisedAs = (_a = ctx.request.body.anonymisedAs) === null || _a === void 0 ? void 0 : _a.trim();
    if (!anonymisedAs) {
        return ctx.body = {
            error: `Type the entry's name`,
        };
    }
    const oszFile = (_b = ctx.request.files) === null || _b === void 0 ? void 0 : _b.oszFile;
    if (!oszFile || !oszFile.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }
    const submissionId = helpers_1.convertToIntOrThrow(ctx.params.id);
    const submission = yield Submission_1.Submission.findOneOrFail({
        where: {
            id: submissionId,
        },
        relations: [
            'song',
            'user',
        ],
    });
    const paths = helpers_1.generateAnonymizedPaths(submission.song, submission.user, anonymisedAs);
    yield helpers_1.saveFile(oszFile.path, paths.finalDir, paths.finalPath);
    submission.anonymisedAs = anonymisedAs;
    yield submission.save();
    ctx.body = {
        success: 'ok',
    };
}));
submissionsAdminRouter.get('/:id/download', downloadSubmission_1.findSubmission, downloadSubmission_1.downloadOriginal);
submissionsAdminRouter.get('/:id/downloadAnom', downloadSubmission_1.findSubmission, downloadSubmission_1.downloadAnonymous);
submissionsAdminRouter.post('/:categoryId/generateZip', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const anomType = ctx.request.body.type === 'anom';
    const categoryId = helpers_1.convertToIntOrThrow(ctx.params.categoryId);
    const category = yield Category_1.Category.findOneOrFail({
        where: {
            id: categoryId,
        },
        relations: [
            'songs',
            'songs.submissions',
            'songs.submissions.user',
        ],
    });
    const zip = new jszip_1.default();
    for (const song of category.songs) {
        for (const submission of song.submissions) {
            let paths;
            if (anomType) {
                if (!submission.anonymisedAs)
                    continue;
                paths = helpers_1.generateAnonymizedPaths(song, submission.user, submission.anonymisedAs);
            }
            else {
                paths = helpers_1.generateOriginalPaths(song, submission.user);
            }
            yield helpers_1.checkFileExistence(paths.finalPath);
            zip.file(paths.outputFilename, fs_1.default.createReadStream(paths.finalPath));
        }
    }
    let paths;
    if (anomType) {
        paths = helpers_1.generateAnonymizedZipPaths(category);
    }
    else {
        paths = helpers_1.generateOriginalZipPaths(category);
    }
    yield fs_1.default.promises.mkdir(paths.finalDir, { recursive: true });
    const content = yield zip.generateAsync({ type: 'nodebuffer' });
    yield fs_1.default.promises.writeFile(paths.finalPath, content);
    yield helpers_1.checkFileExistence(paths.finalPath);
    ctx.body = {
        success: 'Ok',
    };
}));
function findCategory(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = helpers_1.convertToIntOrThrow(ctx.params.categoryId);
        const category = yield Category_1.Category.findOneOrFail({
            id,
        });
        ctx.state.category = category;
        return yield next();
    });
}
submissionsAdminRouter.get('/:categoryId/downloadZip', findCategory, downloadSubmission_1.downloadOriginalZip);
submissionsAdminRouter.get('/:categoryId/downloadAnomZip', findCategory, downloadSubmission_1.downloadAnonymousZip);
exports.default = submissionsAdminRouter;
