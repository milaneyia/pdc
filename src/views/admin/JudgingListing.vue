<template>
    <div class="container text-center">
        <page-header
            title="Judging List"
        >
            <p>This shows a listing of all the judging (scores/comments) done by entries</p>

            <select class="form-control mt-3" @change="$store.commit('updateSelectedCategoryId', parseInt($event.target.value))">
                <option
                    v-for="category in contest.categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
                </option>
            </select>
        </page-header>

        <div v-if="selectedCategory">
            <judging-leaderboard />

            <div
                v-for="song in selectedCategory.songs"
                :key="song.id"
                class="card my-2"
            >
                <div class="card-header">
                    <b>{{ song.title }}</b>
                </div>

                <data-table
                    :headers="['User', 'Count', 'Judges']"
                >
                    <tr
                        v-for="submission in song.submissions"
                        :key="submission.id"
                        data-toggle="modal"
                        data-target="#detailModalAdmin"
                        style="cursor: pointer"
                        @click="selected = submission"
                    >
                        <td>
                            {{ `${submission.user.username} (${submission.anonymisedAs || 'Not anonymized'})` }}
                        </td>
                        <td
                            :class="getJudgesInvolvedCount(submission) >= judgeCount ? 'text-success' : 'text-danger'"
                        >
                            {{ getJudgesInvolvedCount(submission) }} done of {{ judgeCount }}
                        </td>
                        <td>{{ getJudgesInvolved(submission) }}</td>
                    </tr>
                </data-table>
            </div>
        </div>

        <judging-detail
            id="detailModalAdmin"
            :submission="selected"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import JudgingDetail from '../../components/results/JudgingDetail.vue';
import JudgingLeaderboard from '../../components/results/JudgingLeaderboard.vue';
import { Category, Contest, Submission } from '../../interfaces';
import { Getter, State } from 'vuex-class';

@Component({
    components: {
        PageHeader,
        DataTable,
        JudgingDetail,
        JudgingLeaderboard,
    },
})
export default class JudgingListing extends Vue {

    @State contest!: Contest | null;
    @State selectedCategoryId!: number;
    @Getter selectedCategory!: Category;

    selected: Submission | null = null;
    judgeCount = 7;

    async created (): Promise<void> {
        const data = await this.initialRequest('/api/results');
        if (data) this.$store.commit('updateContest', data);
    }

    getJudgesInvolvedCount (submission: Submission): number {
        const judges = submission.judging.map(j => j.judge);

        return judges.length;
    }

    getJudgesInvolved (submission: Submission): string {
        const judges = submission.judging.map(j => j.judge.username);

        return judges.join(', ');
    }

}
</script>
