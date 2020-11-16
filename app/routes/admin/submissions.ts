import JSZip from 'jszip';
import fs from 'fs';
import Router from '@koa/router';
import { Next, ParameterizedContext } from 'koa';
import { convertToIntOrThrow, checkFileExistence, Paths, generateOriginalPaths, generateOriginalZipPaths } from '../../helpers';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { findSubmission, downloadOriginal, downloadOriginalZip } from '../../middlewares/downloadSubmission';
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

submissionsAdminRouter.post('/:id/save', async (ctx) => {
    const anonymisedAs = ctx.request.body.anonymisedAs?.trim();

    if (!anonymisedAs) {
        return ctx.body = {
            error: `Type the entry's name`,
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

    submission.anonymisedAs = anonymisedAs;
    await submission.save();

    ctx.body = {
        success: 'ok',
    };
});

submissionsAdminRouter.get('/:id/download', findSubmission, downloadOriginal);

submissionsAdminRouter.post('/:categoryId/generateZip', async (ctx) => {
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
            const paths: Paths = generateOriginalPaths(song, submission.user);
            await checkFileExistence(paths.finalPath);
            zip.file(paths.outputFilename, fs.createReadStream(paths.finalPath));
        }
    }

    const paths: Paths = generateOriginalZipPaths(category);
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

export default submissionsAdminRouter;
