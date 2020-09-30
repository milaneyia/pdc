import { StoreOptions } from 'vuex';
import { User, Criteria, Contest } from './interfaces';
import { UserScore, JudgeCorrel } from '../app/helpers';

export interface MainState {
    toast: { message: string; type: string };
    initialized: boolean;
    user: User | null;
    isLoading: boolean;
    criterias: Criteria[];
    judges: User[];
    contest: Contest | null;
    usersScores: UserScore[];
    judgesCorrel: JudgeCorrel[];
}

const store: StoreOptions<MainState> = {
    state: {
        toast: {
            message: '',
            type: 'info',
        },
        // Initial
        initialized: false,
        user: null,
        isLoading: false,

        contest: null,

        // Contest
        criterias: [],
        judges: [],
        usersScores: [],
        judgesCorrel: [],
    },
    mutations: {
        addToast (state, payload): void {
            state.toast.message = payload.message;
            state.toast.type = payload.type;
            $('.toast').toast('show');
        },
        setData (state, payload): void {
            state.user = payload.user;
            state.contest = payload.contest;
            state.initialized = true;
        },
        updateUser (state, payload): void {
            state.user = payload;
        },
        updateLoadingState (state): void {
            state.isLoading = !state.isLoading;
        },
        updateContest (state, payload): void {
            state.criterias = payload.criterias || [];
            state.judges = payload.judges || [];
            state.contest = payload.contest;
            state.usersScores = payload.usersScores;
            state.judgesCorrel = payload.judgesCorrel;
        },
        sortByCriteria (state, payload): void {
            state.usersScores.sort((a, b) => {
                const criteriaA = a.criteriaSum.find(c => c.criteriaId === payload.criteriaId);
                const criteriaB = b.criteriaSum.find(c => c.criteriaId === payload.criteriaId);
                let sumA = 0;
                let sumB = 0;

                if (criteriaA) sumA = criteriaA.sum;
                if (criteriaB) sumB = criteriaB.sum;

                if (payload.sortDesc) {
                    return sumB - sumA;
                }

                return sumA - sumB;
            });
        },
        sortByJudge (state, payload): void {
            state.usersScores.sort((a, b) => {
                const judgeA = a.judgingSum.find(c => c.judgeId === payload.judgeId);
                const judgeB = b.judgingSum.find(c => c.judgeId === payload.judgeId);
                let sumA = 0;
                let sumB = 0;

                if (judgeA) sumA = judgeA.sum;
                if (judgeB) sumB = judgeB.sum;

                if (payload.sortDesc) {
                    return sumB - sumA;
                }

                return sumA - sumB;
            });
        },
        sortByRawScore (state, payload): void {
            state.usersScores.sort((a, b) => {
                if (payload.sortDesc) {
                    return b.rawFinalScore - a.rawFinalScore;
                }

                return a.rawFinalScore - b.rawFinalScore;
            });
        },
        sortByStdScore (state, payload): void {
            state.usersScores.sort((a, b) => {
                if (payload.sortDesc) {
                    return b.standardizedFinalScore - a.standardizedFinalScore;
                }

                return a.standardizedFinalScore - b.standardizedFinalScore;
            });
        },
    },
    getters: {
        submissionsLength (state): number | undefined {
            return state.contest?.songs?.[0]?.submissions?.length;
        },
        isVotingTime (state): boolean | null {
            return state.contest && new Date(state.contest.votingStartedAt) < new Date();
        },
        isSubmissionTime (state): boolean | null {
            return state.contest && new Date(state.contest.submissionsStartedAt) < new Date();
        },
        isResultsTime (state): boolean | null {
            return state.contest && new Date(state.contest.resultsAt) < new Date();
        },
    },
};

export default store;
