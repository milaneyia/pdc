export interface User {
    id: number;
    username: string;
    roleId: number;

    isBasicUser: boolean;
    isStaff: boolean;
    isJudge: boolean;
    isRestricted: boolean;
}

export interface Contest {
    id: number;
    title: string;
    votingStartedAt: Date;
    votingEndedAt: Date;
    submissionsStartedAt: Date;
    submissionsEndedAt: Date;
    judgingStartedAt: Date;
    judgingEndedAt: Date;
    resultsAt: Date;
    songs: Song[];
}

export interface Song {
    id: number;
    artist: string;
    title: string;
    previewLink: string;
    isFa: boolean;
    wasChosen: boolean;
    contestId: number;
    contest: Contest;
    submissions: Submission[];
    votes: Vote[];
    categoryId: number;
    category: Category;

    totalPoints: number;
}

export interface Category {
    id: number;
    name: string;
    songs: Song[];
}

export interface Vote {
    id: number;
    points: number;
}

export interface Submission {
    id: number;
    anonymisedAs: string;
    anonymisedLink: string;
    user: User;
    songId: number;
    song: Song;
    judging: Judging[];
}

export interface JudgingToCriteria {
    score: number;
    comment: string;
    criteriaId: number;
}

export interface Judging {
    id: number;
    submissionId: number;
    judgeId: number;
    judge: User;
    judgingToCriterias: JudgingToCriteria[];
}

export interface Criteria {
    id: number;
    name: string;
    maxScore: number;
}
