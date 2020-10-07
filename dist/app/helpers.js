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
exports.calculateScores = exports.generateTemplatePaths = exports.generateOriginalZipPaths = exports.generateAnonymizedZipPaths = exports.generateOriginalPaths = exports.generateAnonymizedPaths = exports.saveFile = exports.checkFileExistence = exports.isOsuUrl = exports.isUrl = exports.convertToArray = exports.convertToIntOrThrow = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function convertToIntOrThrow(input) {
    const parsedInput = parseInt(input, 10);
    if (isNaN(parsedInput)) {
        throw new Error('Not a number');
    }
    return parsedInput;
}
exports.convertToIntOrThrow = convertToIntOrThrow;
function convertToArray(input) {
    if (Array.isArray(input)) {
        return input;
    }
    return [input];
}
exports.convertToArray = convertToArray;
function isUrl(input) {
    if (typeof input !== 'string') {
        return false;
    }
    const pattern = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return pattern.test(input.trim());
}
exports.isUrl = isUrl;
function isOsuUrl(input) {
    if (!isUrl(input)) {
        return false;
    }
    const url = new URL(input);
    return url.host === 'osu.ppy.sh';
}
exports.isOsuUrl = isOsuUrl;
function checkFileExistence(path) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_1.default.promises.access(path, fs_1.default.constants.F_OK | fs_1.default.constants.R_OK);
    });
}
exports.checkFileExistence = checkFileExistence;
function saveFile(inputPath, outputDir, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_1.default.promises.mkdir(outputDir, { recursive: true });
        yield fs_1.default.promises.copyFile(inputPath, outputPath);
        yield checkFileExistence(outputPath);
    });
}
exports.saveFile = saveFile;
function generateZipPaths(baseDir, category) {
    const finalDir = path_1.default.join(baseDir, category.id.toString());
    const finalPath = path_1.default.join(finalDir, `${category.id}.zip`);
    const outputFilename = `${category.name}.zip`;
    return {
        finalDir,
        finalPath,
        outputFilename,
    };
}
function generatePaths(baseDir, song, user, anonymisedAs) {
    const finalDir = path_1.default.join(baseDir, song.id.toString());
    let finalPath = path_1.default.join(finalDir, user.id.toString());
    let outputFilename = `${user.username} - ${song.title}.osz`;
    if (anonymisedAs) {
        finalPath = path_1.default.join(finalDir, anonymisedAs);
        outputFilename = `${anonymisedAs}.osz`;
    }
    return {
        finalDir,
        finalPath,
        outputFilename,
    };
}
function generateAnonymizedPaths(song, user, anonymisedAs) {
    const baseDir = path_1.default.join(__dirname, '../osz/anom/');
    return generatePaths(baseDir, song, user, anonymisedAs);
}
exports.generateAnonymizedPaths = generateAnonymizedPaths;
function generateOriginalPaths(song, user) {
    const baseDir = path_1.default.join(__dirname, '../osz/originals/');
    return generatePaths(baseDir, song, user);
}
exports.generateOriginalPaths = generateOriginalPaths;
function generateAnonymizedZipPaths(category) {
    const baseDir = path_1.default.join(__dirname, '../osz/zips/anom/');
    return generateZipPaths(baseDir, category);
}
exports.generateAnonymizedZipPaths = generateAnonymizedZipPaths;
function generateOriginalZipPaths(category) {
    const baseDir = path_1.default.join(__dirname, '../osz/zips/originals/');
    return generateZipPaths(baseDir, category);
}
exports.generateOriginalZipPaths = generateOriginalZipPaths;
function generateTemplatePaths(song) {
    const finalDir = path_1.default.join(__dirname, `../osz/originals/${song.id}`);
    const finalPath = path_1.default.join(finalDir, 'template.osz');
    const outputFilename = `${song.title} - template.osz`;
    return {
        finalDir,
        finalPath,
        outputFilename,
    };
}
exports.generateTemplatePaths = generateTemplatePaths;
function calculateScores(submissions) {
    var _a, _b, _c, _d;
    const usersScores = [];
    const judgesCorrel = [];
    if (!submissions.length) {
        return {
            usersScores,
            judgesCorrel,
        };
    }
    const judges = (_b = (_a = submissions === null || submissions === void 0 ? void 0 : submissions[0]) === null || _a === void 0 ? void 0 : _a.judging) === null || _b === void 0 ? void 0 : _b.map(j => j.judge);
    for (const submission of submissions) {
        const userScore = {
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
                }
                else {
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
            for (const teamScore of usersScores) {
                judgeSum += ((_c = teamScore.judgingSum.find(j => j.judgeId === judgeId)) === null || _c === void 0 ? void 0 : _c.sum) || 0;
            }
            judgeAvg = judgeSum / usersScores.length;
            for (const teamScore of usersScores) {
                const judgingSum = teamScore.judgingSum.find(j => j.judgeId === judgeId);
                if (judgingSum) {
                    judgeSd += Math.pow(judgingSum.sum - judgeAvg, 2);
                }
            }
            judgeSd = Math.sqrt(judgeSd / usersScores.length);
            for (let i = 0; i < usersScores.length; i++) {
                const j = usersScores[i].judgingSum.findIndex(j => j.judgeId === judgeId);
                if (j !== -1) {
                    const stdScore = (usersScores[i].judgingSum[j].sum - judgeAvg) / judgeSd;
                    usersScores[i].standardizedFinalScore += stdScore;
                    usersScores[i].judgingSum[j].standardized = stdScore;
                    judgeStdSum += stdScore || 0;
                }
            }
            judgesCorrel.push({
                id: judgeId,
                rawAvg: judgeAvg,
                avg: judgeStdSum / usersScores.length,
                sd: judgeSd,
                correl: 0,
            });
        }
        const totalStdAvg = usersScores.reduce((acc, s) => acc + s.standardizedFinalScore, 0) / usersScores.length;
        for (const judgeId of judgesIds) {
            const i = judgesCorrel.findIndex(j => j.id === judgeId);
            const judgeAvg = ((_d = judgesCorrel === null || judgesCorrel === void 0 ? void 0 : judgesCorrel[i]) === null || _d === void 0 ? void 0 : _d.avg) || 0;
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
exports.calculateScores = calculateScores;
