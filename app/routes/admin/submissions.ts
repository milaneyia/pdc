import JSZip from 'jszip';
import fs from 'fs';
import Router from '@koa/router';
import koaBody from 'koa-body';
import { convertToIntOrThrow, checkFileExistence, saveFile, generateAnonymizedPaths, Paths, generateOriginalPaths, generateAnonymizedZipPaths, generateOriginalZipPaths } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Submission } from '../../models/Submission';
import { findSubmission, downloadOriginal, downloadAnonymous, downloadOriginalZip, downloadAnonymousZip } from '../../middlewares/downloadSubmission';
import { Song } from '../../models/Song';
import { Next, ParameterizedContext } from 'koa';

const submissionsAdminRouter = new Router();

submissionsAdminRouter.prefix('/api/admin/submissions');
submissionsAdminRouter.use(authenticate);
submissionsAdminRouter.use(isStaff);

submissionsAdminRouter.get('/', async (ctx) => {
    const songs = await Song.find({
        relations: [
            'submissions',
            'submissions.user',
        ],
    });

    ctx.body = {
        songs,
    };
});

submissionsAdminRouter.post('/:id/save', koaBody({
    multipart: true,
    formidable: {
        multiples: false,
    },
}), async (ctx) => {
    const anonymisedAs = ctx.request.body.anonymisedAs?.trim();

    if (!anonymisedAs) {
        return ctx.body = {
            error: `Type the entry's name`,
        };
    }

    const oszFile = ctx.request.files?.oszFile;

    if (!oszFile || !oszFile.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }

    const submissionId = convertToIntOrThrow(ctx.params.id);
    const submission = await Submission.findOneOrFail({
        where: {
            id: submissionId,
        },
        relations: [
            'song',
        ],
    });

    const paths = generateAnonymizedPaths(submission.song, submission.user, anonymisedAs);
    await saveFile(oszFile.path, paths.finalDir, paths.finalPath);

    submission.anonymisedAs = anonymisedAs;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

submissionsAdminRouter.get('/:id/download', findSubmission, downloadOriginal);

submissionsAdminRouter.get('/:id/downloadAnom', findSubmission, downloadAnonymous);

submissionsAdminRouter.post('/:id/generateZip', async (ctx) => {
    const anomType = ctx.request.body.type === 'anom';
    const songId = convertToIntOrThrow(ctx.params.id);
    const song = await Song.findOneOrFail({
        where: {
            id: songId,
        },
        relations: [
            'submissions',
            'submissions.user',
        ],
    });

    const zip = new JSZip();

    for (const submission of song.submissions) {
        let paths: Paths;

        if (anomType) {
            if (!submission.anonymisedAs) continue;

            paths = generateAnonymizedPaths(song, submission.user, submission.anonymisedAs);
        } else {
            paths = generateOriginalPaths(song, submission.user);
        }

        await checkFileExistence(paths.finalPath);
        zip.file(paths.outputFilename, fs.createReadStream(paths.finalPath));
    }

    let paths: Paths;

    if (anomType) {
        paths = generateAnonymizedZipPaths(song);
    } else {
        paths = generateOriginalZipPaths(song);
    }

    await fs.promises.mkdir(paths.finalDir, { recursive: true });
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    await fs.promises.writeFile(paths.finalPath, content);
    await checkFileExistence(paths.finalPath);

    ctx.body = {
        success: 'Ok',
    };
});

async function findSong (ctx: ParameterizedContext, next: Next) {
    const id = convertToIntOrThrow(ctx.params.songId);
    const song = await Song.findOneOrFail({
        id,
    });
    ctx.state.song = song;

    return await next();
}

submissionsAdminRouter.get('/:songId/downloadZip', findSong, downloadOriginalZip);

submissionsAdminRouter.get('/:songId/downloadAnomZip', findSong, downloadAnonymousZip);

export default submissionsAdminRouter;
