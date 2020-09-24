<template>
    <div class="container text-center">
        <page-header
            title="Judging List"
        >
            <p>This shows a listing of all the judging (scores/comments) done by entries</p>

            <select v-model="selectedSongId" class="form-control mt-3">
                <option
                    v-for="song in songs"
                    :key="song.id"
                    :value="song.id"
                >
                    {{ song.title }}
                </option>
            </select>
        </page-header>

        <div v-if="selectedSong" class="card">
            <judging-leaderboard />

            <data-table
                v-if="selectedSong.submissions && selectedSong.submissions.length"
                :headers="['Country', getMatchJudgesCountDisplay(selectedSong.submissions), 'Judges']"
            >
                <tr
                    v-for="submission in selectedSong.submissions"
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
import { Song, Submission } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
        JudgingDetail,
        JudgingLeaderboard,
    },
})
export default class JudgingListing extends Vue {

    songs: Song[] = [];
    selected: Submission | null = null;
    selectedSongId = 1;
    judgeCount = 5;

    async created (): Promise<void> {
        const [initialData, storeData] = await Promise.all([
            this.initialRequest<{ songs: [] }>('/api/admin/judging'),
            this.getRequest('/api/results'),
        ]);

        if (initialData?.songs) this.songs = initialData.songs;
        if (storeData) this.$store.commit('updateContest', storeData);
    }

    get selectedSong (): Song | undefined {
        return this.songs.find(r => r.id === this.selectedSongId);
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
