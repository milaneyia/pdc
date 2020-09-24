import Router from '@koa/router';
import { Next, ParameterizedContext } from 'koa';
import { convertToIntOrThrow } from '../helpers';
import { authenticate, simpleAuthenticate } from '../middlewares/authentication';
import { Contest } from '../models/Contest';
import { Song } from '../models/Song';
import { User } from '../models/User';
import { Vote } from '../models/Vote';

const votingRouter = new Router();

votingRouter.prefix('/api/voting');

async function findContest (ctx: ParameterizedContext, next: Next) {
    const contest = await Contest.findForVoting(ctx.state.user?.id);

    if (!contest) return ctx.body = { error: 'Voting is not in progress' };

    ctx.state.contest = contest;
    await next();
}

votingRouter.get('/', simpleAuthenticate, findContest, (ctx) => {
    const user: User | undefined = ctx.state.user;
    const songs = ctx.state.contest.songs;

    ctx.body = {
        songs,
        user,
    };
});

votingRouter.post('/save', authenticate, findContest, async (ctx) => {
    const user: User = ctx.state.user;
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

export default votingRouter;
