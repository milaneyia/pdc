import Router from '@koa/router';
import koaBody from 'koa-body';
import { authenticate, isStaff } from '../../middlewares/authentication';
import { Contest } from '../../models/Contest';
import { Song } from '../../models/Song';
import { generateTemplatePaths, saveFile } from '../../helpers';
import { downloadTemplate } from '../../middlewares/downloadSubmission';

const contestsAdminRouter = new Router();

contestsAdminRouter.prefix('/api/admin/contests');
contestsAdminRouter.use(authenticate);
contestsAdminRouter.use(isStaff);

contestsAdminRouter.get('/', async (ctx) => {
    const contest = await Contest.findOne({
        relations: [
            'songs',
        ],
    });

    ctx.body = {
        contest,
    };
});

contestsAdminRouter.post('/update', async (ctx) => {
    const data: Contest = ctx.request.body.contest;
    const contest = await Contest.findOneOrFail();
    contest.votingStartedAt = data.votingStartedAt;
    contest.votingEndedAt = data.votingEndedAt;
    contest.submissionsStartedAt = data.submissionsStartedAt;
    contest.submissionsEndedAt = data.submissionsEndedAt;
    contest.judgingStartedAt = data.judgingStartedAt;
    contest.judgingEndedAt = data.judgingEndedAt;
    contest.resultsAt = data.resultsAt;
    await contest.save();

    ctx.body = {
        success: 'ok',
        contest,
    };
});

contestsAdminRouter.post('/store', async (ctx) => {
    let contest = await Contest.findOne();

    if (!contest) {
        contest = new Contest();
        contest.votingStartedAt = new Date();
        contest.votingEndedAt = new Date();
        contest.submissionsStartedAt = new Date();
        contest.submissionsEndedAt = new Date();
        contest.judgingStartedAt = new Date();
        contest.judgingEndedAt = new Date();
        contest.resultsAt = new Date();
        await contest.save();
    }

    ctx.body = {
        contest,
    };
});

contestsAdminRouter.post('/storeSong', async (ctx) => {
    const contest = await Contest.findOneOrFail();

    const data: Song = ctx.request.body.song;
    const song = new Song();
    song.contestId = contest.id;
    song.artist = data.artist;
    song.title = data.title;
    song.previewLink = data.previewLink;
    song.isFa = data.isFa;
    await song.save();

    ctx.body = {
        success: 'ok',
    };
});

async function updateSong (data: Song, id: number): Promise<Song> {
    const song = await Song.findOneOrFail({ id });
    song.artist = data.artist;
    song.title = data.title;
    song.previewLink = data.previewLink;
    song.isFa = data.isFa;
    song.wasChosen = data.wasChosen;
    await song.save();

    return song;
}

contestsAdminRouter.post('/songs/:id/uploadOsz', koaBody({
    multipart: true,
    formidable: {
        multiples: false,
    },
}), async (ctx) => {
    const oszFile = ctx.request.files?.oszFile;

    if (oszFile && !oszFile.name.endsWith('.osz')) {
        return ctx.body = {
            error: 'Select an .osz file',
        };
    }

    const song = await updateSong(ctx.request.body.song, ctx.params.id);

    if (oszFile) {
        const paths = generateTemplatePaths(song);
        await saveFile(oszFile.path, paths.finalDir, paths.finalPath);
    }

    ctx.body = {
        success: 'ok',
    };
});

contestsAdminRouter.post('/songs/:id/update', async (ctx) => {
    await updateSong(ctx.request.body.song, ctx.params.id);

    ctx.body = {
        success: 'ok',
    };
});

contestsAdminRouter.post('/songs/:id/remove', async (ctx) => {
    const song = await Song.findOneOrFail({ id: ctx.params.id });
    await song.remove();

    ctx.body = {
        success: 'ok',
    };
});

contestsAdminRouter.get('/songs/:id/download', async (ctx, next) => {
    ctx.state.song = await Song.findOneOrFail({ id: ctx.params.id });
    await next();
}, downloadTemplate);

export default contestsAdminRouter;
