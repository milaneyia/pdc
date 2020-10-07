import { StoreOptions } from 'vuex';
import { User, Criteria, Contest, Category } from './interfaces';
import { Results } from '../app/helpers';

export interface MainState {
    toast: { message: string; type: string };
    initialized: boolean;
    user: User | null;
    isLoading: boolean;
    criterias: Criteria[];
    judges: User[];
    contest: Contest | null;
    results: Results[];
    selectedCategoryId: number;
    sortBy: 'stdScore' | 'rawScore' | 'criteria' | 'judge';
    sortDesc: boolean;
    sortById: number | null;
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
        results: [],
        selectedCategoryId: 1,
        sortBy: 'stdScore',
        sortDesc: true,
        sortById: null,
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
            state.results = payload.results;
        },
        updateSelectedCategoryId (state, categoryId): void {
            state.selectedCategoryId = categoryId;
        },
        updateSort (state, payload): void {
            if (state.sortBy === payload.sortBy && (!payload.sortById || state.sortById === payload.sortById)) {
                state.sortDesc = !state.sortDesc;
            } else {
                state.sortBy = payload.sortBy;
                state.sortDesc = true;
            }

            state.sortById = payload.sortById || null;
        },
    },
    getters: {
        isVotingTime (state): boolean | null {
            return state.contest && new Date(state.contest.votingStartedAt) < new Date();
        },
        isSubmissionTime (state): boolean | null {
            return state.contest && new Date(state.contest.submissionsStartedAt) < new Date();
        },
        isResultsTime (state): boolean | null {
            return state.contest && new Date(state.contest.resultsAt) < new Date();
        },
        selectedCategory (state): Category | undefined {
            return state.contest?.categories.find(c => c.id === state.selectedCategoryId);
        },
        selectedCategoryResults (state): Results | null {
            const result = state.results.find(r => r.id === state.selectedCategoryId);

            if (!result) return null;

            if (state.sortBy === 'stdScore') {
                result.usersScores.sort((a, b) => {
                    if (state.sortDesc) {
                        return b.standardizedFinalScore - a.standardizedFinalScore;
                    }

                    return a.standardizedFinalScore - b.standardizedFinalScore;
                });
            } else if (state.sortBy === 'rawScore') {
                result.usersScores.sort((a, b) => {
                    if (state.sortDesc) {
                        return b.rawFinalScore - a.rawFinalScore;
                    }

                    return a.rawFinalScore - b.rawFinalScore;
                });
            } else {
                result.usersScores.sort((a, b) => {
                    let sumA = 0;
                    let sumB = 0;

                    if (state.sortBy === 'criteria') {
                        const criteriaA = a.criteriaSum.find(c => c.criteriaId === state.sortById);
                        const criteriaB = b.criteriaSum.find(c => c.criteriaId === state.sortById);

                        if (criteriaA) sumA = criteriaA.sum;
                        if (criteriaB) sumB = criteriaB.sum;
                    }

                    if (state.sortBy === 'judge') {
                        const judgeA = a.judgingSum.find(c => c.judgeId === state.sortById);
                        const judgeB = b.judgingSum.find(c => c.judgeId === state.sortById);

                        if (judgeA) sumA = judgeA.sum;
                        if (judgeB) sumB = judgeB.sum;
                    }


                    if (state.sortDesc) {
                        return sumB - sumA;
                    }

                    return sumA - sumB;
                });
            }

            return result;
        },
    },
};

export default store;
