import Router from '@koa/router';
import { convertToIntOrThrow } from '../helpers';
import { authenticate, simpleAuthenticate } from '../middlewares/authentication';
import { downloadTemplate } from '../middlewares/downloadSubmission';
import { Contest } from '../models/Contest';
import { Song } from '../models/Song';
import { User } from '../models/User';
import { Vote } from '../models/Vote';

const votingRouter = new Router();

votingRouter.prefix('/api/voting');

votingRouter.get('/', simpleAuthenticate, async (ctx) => {
    const user: User | undefined = ctx.state.user;
    let contest = await Contest.findForVoting(ctx.state.user?.id);
    if (!contest || user?.isStaff) contest = await Contest.findForVotingResults();
    if (!contest) return ctx.body = { error: 'Voting is not in progress' };

    ctx.body = {
        contest,
        user,
    };
});

votingRouter.post('/save', authenticate, async (ctx) => {
    const user: User = ctx.state.user;

    const contest = await Contest.findForVoting(ctx.state.user?.id);
    if (!contest) return ctx.body = { error: 'Voting is not in progress' };

    const points = convertToIntOrThrow(ctx.request.body.points);
    if (points < 1 || points > 3) throw new Error('Not valid points');

    const songId = convertToIntOrThrow(ctx.request.body.songId);
    const songs: Song[] = ctx.state.contest.songs;
    const inputSong = songs.find(s => s.id === songId);

    if (!inputSong) throw new Error('Song not found');

    // Cuz it's 3 votes for FA songs AND 3 for the rest of songs
    const relatedSongs = songs.filter(s => s.isFa === inputSong.isFa);
    let isCancelingVote = false;

    // Remove vote if:
    // Is using the same points in another song
    // Is changing the vote points in the same song
    for (const song of relatedSongs) {
        for (const vote of song.votes) {
            if (song.id === inputSong.id && vote.points === points) isCancelingVote = true;
            if (song.id === inputSong.id || vote.points === points) await vote.remove();
        }
    }

    if (!isCancelingVote) {
        const vote = new Vote();
        vote.points = points;
        vote.song = inputSong;
        vote.user = user;
        await vote.save();
    }

    ctx.body = {
        success: 'Saved',
    };
});

votingRouter.get('/:songId/downloadTemplate', async (ctx, next) => {
    const id = convertToIntOrThrow(ctx.params.songId);
    ctx.state.song = await Song.findOneOrFail({ id });
    await next();
}, downloadTemplate);

export default votingRouter;
