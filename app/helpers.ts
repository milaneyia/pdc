import fs from 'fs';
import path from 'path';
import { Category } from './models/Category';
import { Song } from './models/Song';
import { Submission } from './models/Submission';
import { User } from './models/User';

export function convertToIntOrThrow(input: string): number {
    const parsedInput = parseInt(input, 10);

    if (isNaN(parsedInput)) {
        throw new Error('Not a number');
    }

    return parsedInput;
}

export function convertToArray<T>(input: any): T[] {
    if (Array.isArray(input)) {
        return input;
    }

    return [input];
}

export function isUrl(input: string): boolean {
    if (typeof input !== 'string') {
        return false;
    }

    const pattern = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

    return pattern.test(input.trim());
}

export function isOsuUrl(input: string): boolean {
    if (!isUrl(input)) {
        return false;
    }

    const url = new URL(input);

    return url.host === 'osu.ppy.sh';
}

export async function checkFileExistence(path: string): Promise<void> {
    await fs.promises.access(path, fs.constants.F_OK | fs.constants.R_OK);
}

export async function saveFile(inputPath: string, outputDir: string, outputPath: string): Promise<void> {
    await fs.promises.mkdir(outputDir, { recursive: true });
    await fs.promises.copyFile(inputPath, outputPath);
    await checkFileExistence(outputPath);
}

export interface Paths {
    finalDir: string;
    finalPath: string;
    outputFilename: string;
}

function generateZipPaths(baseDir: string, category: Category): Paths {
    const finalDir = path.join(baseDir, category.id.toString());
    const finalPath = path.join(finalDir, `${category.id}.zip`);
    const outputFilename = `${category.name}.zip`;

    return {
        finalDir,
        finalPath,
        outputFilename,
    };
}

function generatePaths(baseDir: string, song: Song, user: User, anonymisedAs?: string): Paths {
    const finalDir = path.join(baseDir, song.id.toString());
    let finalPath = path.join(finalDir, user.id.toString());
    let outputFilename = `${user.username} - ${song.title}.osz`;

    if (anonymisedAs) {
        finalPath = path.join(finalDir, anonymisedAs);
        outputFilename = `${anonymisedAs}.osz`;
    }

    return {
        finalDir,
        finalPath,
        outputFilename,
    };
}

export function generateAnonymizedPaths(song: Song, user: User, anonymisedAs: string): Paths {
    const baseDir = path.join(__dirname, '../osz/anom/');

    return generatePaths(baseDir, song, user, anonymisedAs);
}

export function generateOriginalPaths(song: Song, user: User): Paths {
    const baseDir = path.join(__dirname, '../osz/originals/');

    return generatePaths(baseDir, song, user);
}

export function generateAnonymizedZipPaths(category: Category): Paths {
    const baseDir = path.join(__dirname, '../osz/zips/anom/');

    return generateZipPaths(baseDir, category);
}

export function generateOriginalZipPaths(category: Category): Paths {
    const baseDir = path.join(__dirname, '../osz/zips/originals/');

    return generateZipPaths(baseDir, category);
}

export function generateTemplatePaths(song: Song): Paths {
    const finalDir = path.join(__dirname, `../osz/originals/${song.id}`);
    const finalPath = path.join(finalDir, 'template.osz');
    const outputFilename = `${song.title} - template.osz`;

    return {
        finalDir,
        finalPath,
        outputFilename,
    };
}

export interface UserScore {
    user: User;
    criteriaSum: {
        criteriaId: number;
        sum: number;
    }[];
    judgingSum: {
        judgeId: number;
        sum: number;
        standardized: number;
    }[];
    rawFinalScore: number;
    standardizedFinalScore: number;
}

export interface JudgeCorrel {
    id: number;
    rawAvg: number;
    avg: number;
    sd: number;
    correl: number;
}

export interface Results {
    id: number;
    usersScores: UserScore[];
    judgesCorrel: JudgeCorrel[];
}

export function calculateScores(submissions: Submission[]): { usersScores: UserScore[]; judgesCorrel: JudgeCorrel[] } {
    const usersScores: UserScore[] = [];
    const judgesCorrel: JudgeCorrel[] = [];

    if (!submissions.length) {
        return {
            usersScores,
            judgesCorrel,
        };
    }

    const judges = submissions?.[0]?.judging?.map(j => j.judge);

    for (const submission of submissions) {
        const userScore: UserScore = {
            user: submission.user,
            criteriaSum: [],
            judgingSum: [],
            rawFinalScore: 0,
            standardizedFinalScore: 0,
        };

        for (const judging of submission.judging) {
            let judgeSum = 0;

            for (const judgingToCriteria of judging.judgingToCriterias) {
                judgeSum += judgingToCriteria.score;
                const i = userScore.criteriaSum.findIndex(j => j.criteriaId === judgingToCriteria.criteriaId);

                if (i !== -1) {
                    userScore.criteriaSum[i].sum += judgingToCriteria.score;
                } else {
                    userScore.criteriaSum.push({
                        criteriaId: judgingToCriteria.criteriaId,
                        sum: judgingToCriteria.score,
                    });
                }
            }

            userScore.judgingSum.push({
                judgeId: judging.judgeId,
                sum: judgeSum,
                standardized: 0,
            });
        }

        userScore.rawFinalScore = userScore.criteriaSum.reduce((acc, c) => acc + c.sum, 0);
        usersScores.push(userScore);
    }

    if (usersScores.length) {
        const judgesIds = judges.map(j => j.id);

        for (const judgeId of judgesIds) {
            let judgeSum = 0;
            let judgeAvg = 0;
            let judgeSd = 0;
            let judgeStdSum = 0;

            // Get score avg for the current judge
            for (const teamScore of usersScores) {
                judgeSum += teamScore.judgingSum.find(j => j.judgeId === judgeId)?.sum || 0;
            }

            judgeAvg = judgeSum / usersScores.length;

            // Get SD for the current judge
            for (const teamScore of usersScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                if (judgingSum) {
                    judgeSd += Math.pow(judgingSum.sum - judgeAvg, 2);
                }
            }

            judgeSd = Math.sqrt(judgeSd / usersScores.length);

            // Set standard score for each entry for the current judge
            for (let i = 0; i < usersScores.length; i++) {
                const j = usersScores[i].judgingSum.findIndex(j => j.judgeId === judgeId);

                if (j !== -1) {
                    // S* = S - S(avg) / SD
                    const stdScore = (usersScores[i].judgingSum[j].sum - judgeAvg) / judgeSd;
                    usersScores[i].standardizedFinalScore += stdScore;
                    usersScores[i].judgingSum[j].standardized = stdScore;
                    judgeStdSum += stdScore || 0;
                }
            }

            // Set standard score average for the current judge
            judgesCorrel.push({
                id: judgeId,
                rawAvg: judgeAvg,
                avg: judgeStdSum / usersScores.length,
                sd: judgeSd,
                correl: 0,
            });
        }

        // Get final standard scores average
        const totalStdAvg = usersScores.reduce((acc, s) => acc + s.standardizedFinalScore, 0) / usersScores.length;

        // Set correlation coefficient per judge
        for (const judgeId of judgesIds) {
            const i = judgesCorrel.findIndex(j => j.id === judgeId);
            const judgeAvg = judgesCorrel?.[i]?.avg || 0;

            let sum1 = 0;
            let sum2 = 0;
            let sum3 = 0;

            for (const teamScore of usersScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);

                if (judgingSum) {
                    const x = (judgingSum.standardized - judgeAvg);
                    const y = (teamScore.standardizedFinalScore - totalStdAvg);
                    sum1 += x * y;
                    sum2 += Math.pow(x, 2);
                    sum3 += Math.pow(y, 2);
                }
            }

            judgesCorrel[i].correl = sum1 / (Math.sqrt(sum2 * sum3));
        }
    }

    usersScores.sort((a, b) => b.standardizedFinalScore - a.standardizedFinalScore);

    return {
        usersScores,
        judgesCorrel,
    };
}
