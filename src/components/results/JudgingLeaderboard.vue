<template>
    <div>
        <template v-if="selectedCategoryResults">
            <div class="row my-3">
                <div class="col-sm">
                    <a
                        href="#"
                        :class="displayMode === 'criterias' ? 'border-bottom border-secondary' : ''"
                        @click.prevent="displayMode = 'criterias'"
                    >
                        Per criteria
                    </a>
                    |
                    <a
                        href="#"
                        :class="displayMode === 'judges' ? 'border-bottom border-secondary' : ''"
                        @click.prevent="displayMode = 'judges'"
                    >
                        Per judge
                    </a>
                    |
                    <a
                        href="#"
                        :class="displayMode === 'detail' ? 'border-bottom border-secondary' : ''"
                        @click.prevent="displayMode = 'detail'"
                    >
                        Std detail
                    </a>
                </div>
            </div>
            <div class="row">
                <div class="col-sm">
                    <div class="card card-body p-0">
                        <table class="leaderboard leaderboard--clickable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User</th>
                                    <template v-if="displayMode === 'criterias'">
                                        <th
                                            v-for="criteria in criterias"
                                            :key="criteria.id"
                                        >
                                            <a
                                                href="#"
                                                @click.prevent="sortBy('criteria', criteria.id)"
                                            >
                                                {{ criteria.name }}
                                            </a>
                                        </th>
                                    </template>
                                    <template v-else>
                                        <th
                                            v-for="judge in judges"
                                            :key="judge.id"
                                        >
                                            <a
                                                href="#"
                                                @click.prevent="sortBy('judge', judge.id)"
                                            >
                                                {{ judge.username }}
                                            </a>
                                        </th>
                                    </template>
                                    <th>
                                        <a
                                            href="#"
                                            @click.prevent="sortBy('rawScore')"
                                        >
                                            Final Score (raw)
                                        </a>
                                    </th>
                                    <th>
                                        <a
                                            href="#"
                                            @click.prevent="sortBy('stdScore')"
                                        >
                                            Final Score (standardized)
                                        </a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(score, i) in selectedCategoryResults.usersScores"
                                    :key="i"
                                    data-toggle="modal"
                                    data-target="#detailModal"
                                    @click="selectedScore = score"
                                >
                                    <td>{{ i + 1 }}</td>
                                    <td>{{ score.user.username }}</td>
                                    <template v-if="displayMode === 'criterias'">
                                        <td v-for="criteria in criterias" :key="criteria.id">
                                            {{ getCriteriaScore(score, criteria.id) }}
                                        </td>
                                    </template>
                                    <template v-else>
                                        <td v-for="judge in judges" :key="judge.id">
                                            {{ getJudgeScore(score, judge.id, displayMode === 'detail') }}
                                        </td>
                                    </template>

                                    <td>{{ score.rawFinalScore }}</td>
                                    <td>{{ getFinalScore(score.standardizedFinalScore) }}</td>
                                </tr>

                                <template v-if="displayMode === 'detail'">
                                    <tr class="cursor-default">
                                        <td />
                                        <td>AVG</td>
                                        <td v-for="judge in judges" :key="judge.id">
                                            {{ getJudgeAvg(judge.id) }}
                                        </td>
                                        <td />
                                        <td />
                                    </tr>
                                    <tr class="cursor-default">
                                        <td />
                                        <td>SD</td>
                                        <td v-for="judge in judges" :key="judge.id">
                                            {{ getJudgeSd(judge.id) }}
                                        </td>
                                        <td />
                                        <td />
                                    </tr>
                                    <tr class="cursor-default">
                                        <td />
                                        <td>COR</td>
                                        <td v-for="judge in judges" :key="judge.id">
                                            {{ getJudgeCorrel(judge.id) }}
                                        </td>
                                        <td />
                                        <td />
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>

        <div
            v-else
            class="card card-body"
        >
            Comeback on
            <time-string v-if="contest" :timestamp="contest.resultsAt" />
            <span v-else>TBS</span>
        </div>

        <judging-detail
            v-if="selectedScore"
            :submission="scoreDetail"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter, State } from 'vuex-class';
import PageHeader from '../../components/PageHeader.vue';
import JudgingDetail from '../../components/results/JudgingDetail.vue';
import TimeString from '../../components/TimeString.vue';
import { UserScore, Results } from '../../../app/helpers';
import { Category, Contest, Submission, User } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        JudgingDetail,
        TimeString,
    },
})
export default class JudgingLeaderboard extends Vue {

    @State criterias!: [];
    @State judges!: User[];
    @State contest!: Contest | null;
    @State selectedCategoryId!: number;
    @Getter selectedCategory!: Category | undefined;
    @Getter selectedCategoryResults!: Results;

    selectedScore: UserScore | null = null;
    displayMode: 'criterias' | 'judges' | 'detail' = 'criterias';

    get scoreDetail (): Submission | undefined {
        let submission: Submission | undefined;
        const songs = this.selectedCategory?.songs;

        if (songs) {
            for (const song of songs) {
                const related = song.submissions?.find(s => s.user.id == this.selectedScore?.user.id);

                if (related) submission = related;
            }
        }

        return submission;
    }

    getCriteriaScore (score: UserScore, criteriaId: number): number {
        return score.criteriaSum.find(c => c.criteriaId === criteriaId)?.sum || 0;
    }

    getJudgeScore (score: UserScore, judgeId: number, std = false): number | string {
        const judgeScore = score.judgingSum.find(j => j.judgeId === judgeId);
        const stdScore = judgeScore?.standardized || 0;

        if (std) {
            return `${judgeScore?.sum || 0} (${stdScore.toFixed(3)})`;
        }

        return judgeScore?.sum || 0;
    }

    getJudgeAvg (id: number): number | string {
        return this.selectedCategoryResults.judgesCorrel.find(j => j.id === id)?.rawAvg.toFixed(4) || 0;
    }

    getJudgeSd (id: number): number | string {
        return this.selectedCategoryResults.judgesCorrel.find(j => j.id === id)?.sd.toFixed(4) || 0;
    }

    getJudgeCorrel (id: number): number | string {
        const correl = this.selectedCategoryResults.judgesCorrel.find(j => j.id === id)?.correl || 0;

        return correl.toFixed(4);
    }

    getFinalScore (standardizedFinalScore: number): string {
        return isNaN(standardizedFinalScore) || standardizedFinalScore === null ? '0' : standardizedFinalScore.toFixed(4);
    }

    sortBy (field: string, relatedId?: number): void {
        this.$store.commit('updateSort', {
            sortBy: field,
            sortById: relatedId,
        });
    }

}
</script>

<style lang="scss" scoped>

.cursor-default td {
    cursor: default;
}

</style>