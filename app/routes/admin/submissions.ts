import JSZip from 'jszip';
import fs from 'fs';
import Router from '@koa/router';
import koaBody from 'koa-body';
import { Next, ParameterizedContext } from 'koa';
import { convertToIntOrThrow, checkFileExistence, saveFile, generateAnonymizedPaths, Paths, generateOriginalPaths, generateAnonymizedZipPaths, generateOriginalZipPaths } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { findSubmission, downloadOriginal, downloadAnonymous, downloadOriginalZip, downloadAnonymousZip } from '../../middlewares/downloadSubmission';
import { Submission } from '../../models/Submission';
import { Category } from '../../models/Category';

const submissionsAdminRouter = new Router();

submissionsAdminRouter.prefix('/api/admin/submissions');
submissionsAdminRouter.use(authenticate);
submissionsAdminRouter.use(isStaff);

submissionsAdminRouter.get('/', async (ctx) => {
    const categories = await Category.createQueryBuilder('category')
        .leftJoinAndSelect('category.songs', 'songs')
        .leftJoinAndSelect('songs.submissions', 'submissions')
        .leftJoinAndSelect('submissions.user', 'user')
        .where('songs.wasChosen = true')
        .getMany();

    ctx.body = {
        categories,
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
            'user',
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

submissionsAdminRouter.post('/:categoryId/generateZip', async (ctx) => {
    const anomType = ctx.request.body.type === 'anom';
    const categoryId = convertToIntOrThrow(ctx.params.categoryId);
    const category = await Category.findOneOrFail({
        where: {
            id: categoryId,
        },
        relations: [
            'songs',
            'songs.submissions',
            'songs.submissions.user',
        ],
    });

    const zip = new JSZip();

    for (const song of category.songs) {
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
    }

    let paths: Paths;

    if (anomType) {
        paths = generateAnonymizedZipPaths(category);
    } else {
        paths = generateOriginalZipPaths(category);
    }

    await fs.promises.mkdir(paths.finalDir, { recursive: true });
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    await fs.promises.writeFile(paths.finalPath, content);
    await checkFileExistence(paths.finalPath);

    ctx.body = {
        success: 'Ok',
    };
});

async function findCategory (ctx: ParameterizedContext, next: Next) {
    const id = convertToIntOrThrow(ctx.params.categoryId);
    const category = await Category.findOneOrFail({
        id,
    });
    ctx.state.category = category;

    return await next();
}

submissionsAdminRouter.get('/:categoryId/downloadZip', findCategory, downloadOriginalZip);

submissionsAdminRouter.get('/:categoryId/downloadAnomZip', findCategory, downloadAnonymousZip);

export default submissionsAdminRouter;
