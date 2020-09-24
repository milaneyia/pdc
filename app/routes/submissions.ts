import Router from '@koa/router';
import koaBody from 'koa-body';
import { convertToIntOrThrow, generateOriginalPaths, saveFile } from '../helpers';
import { authenticate } from '../middlewares/authentication';
import { Contest } from '../models/Contest';
import { Submission } from '../models/Submission';
import { findSubmission, downloadOriginal } from '../middlewares/downloadSubmission';
import { Log, LOG_TYPE } from '../models/Log';
import { User } from '../models/User';
import { ParameterizedContext } from 'koa';

const submissionsRouter = new Router();

submissionsRouter.prefix('/api/submissions');

submissionsRouter.get('/', async (ctx: ParameterizedContext) => {
    const user = await User.findByOsuId(ctx.session.osuId);

    const [submissions, contest] = await Promise.all([
        Submission.find({
            where: { user },
            relations: ['song'],
        }),
        Contest.findForSubmissions(),
    ]);

    ctx.body = {
        contest,
        submissions,
        user,
    };
});

submissionsRouter.post('/save', authenticate, koaBody({
    multipart: true,
    formidable: {
        multiples: false,
        maxFileSize: 20 * 1024 * 1024, // 20mb
    },
}), async (ctx) => {
    const songId = convertToIntOrThrow(ctx.request.body.songId);
    const contest = await Contest.findForSubmissions();
    const user: User = ctx.state.user;

    if (!contest) throw new Error('No contest in progress');

    const song = contest.songs.find(s => s.id === songId);

    if (!song) throw new Error('Song not found');

    const oszFile = ctx.request.files?.oszFile;

    if (!oszFile?.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }

    const paths = generateOriginalPaths(song, user);
    await saveFile(oszFile.path, paths.finalDir, paths.finalPath);

    let submission = await Submission.findOne({
        user,
        song,
    });

    if (!submission) {
        submission = new Submission();
        submission.user = user;
        submission.song = song;
    }

    await submission.save();

    ctx.body = {
        success: 'ok',
    };

    await Log.createAndSave(`${user.username} uploaded a submission for ${song.title} under ${paths.finalPath}`, LOG_TYPE.User, submission.id);
});

submissionsRouter.get('/:id/download', authenticate, findSubmission, async (ctx, next) => {
    const submission: Submission = ctx.state.submission;
    const user: User = ctx.state.user;

    if (submission.userId !== user.id) {
        return ctx.body = {
            error: 'Unauthorized',
        };
    }

    return await next();
}, downloadOriginal);

export default submissionsRouter;
