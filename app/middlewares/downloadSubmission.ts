import { ParameterizedContext, Next } from 'koa';
import fs from 'fs';
import { convertToIntOrThrow, checkFileExistence, generateOriginalPaths, generateAnonymizedPaths, generateAnonymizedZipPaths, generateOriginalZipPaths, generateTemplatePaths } from '../helpers';
import { Submission } from '../models/Submission';
import { Song } from '../models/Song';
import { Category } from '../models/Category';

export async function findSubmission(ctx: ParameterizedContext, next: Next): Promise<any> {
    const id = convertToIntOrThrow(ctx.params.id);
    const submission = await Submission.findOneOrFail({
        where: { id },
        relations: [
            'user',
            'song',
            'song.contest',
        ],
    });

    ctx.state.submission = submission;

    return await next();
}

async function downloadFile(ctx: ParameterizedContext, path: string, filename: string) {
    await checkFileExistence(path);

    ctx.attachment(filename);
    ctx.type = 'application/octet-stream';
    ctx.body = fs.createReadStream(path);
}

export async function downloadAnonymous(ctx: ParameterizedContext): Promise<any> {
    const submission: Submission = ctx.state.submission;
    if (!submission.anonymisedAs) throw new Error('Not yet created');
    const paths = generateAnonymizedPaths(submission.song, submission.user, submission.anonymisedAs);
    await downloadFile(ctx, paths.finalPath, paths.outputFilename);
}

export async function downloadOriginal(ctx: ParameterizedContext): Promise<any> {
    const submission: Submission = ctx.state.submission;
    const paths = generateOriginalPaths(submission.song, submission.user);
    await downloadFile(ctx, paths.finalPath, paths.outputFilename);
}

export async function downloadAnonymousZip(ctx: ParameterizedContext): Promise<any> {
    const category: Category = ctx.state.category;
    const paths = generateAnonymizedZipPaths(category);
    await downloadFile(ctx, paths.finalPath, paths.outputFilename);
}

export async function downloadOriginalZip(ctx: ParameterizedContext): Promise<any> {
    const category: Category = ctx.state.category;
    const paths = generateOriginalZipPaths(category);
    await downloadFile(ctx, paths.finalPath, paths.outputFilename);
}

export async function downloadTemplate(ctx: ParameterizedContext): Promise<any> {
    const song: Song = ctx.state.song;
    const paths = generateTemplatePaths(song);
    await downloadFile(ctx, paths.finalPath, paths.outputFilename);
}
