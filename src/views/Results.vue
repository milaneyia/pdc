<template>
    <div class="container-lg py-2 text-center">
        <page-header
            title="Leaderboard"
        />

        <div v-if="contest" class="row my-3">
            <div class="col-sm">
                <div class="results__details">
                    Submissions
                    <div class="results__date">
                        <time-string :timestamp="contest.submissionsStartedAt" /> -
                        <time-string :timestamp="contest.submissionsEndedAt" />
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="results__details">
                    Judging
                    <div class="results__date">
                        <time-string :timestamp="contest.judgingStartedAt" /> -
                        <time-string :timestamp="contest.judgingEndedAt" />
                    </div>
                </div>
            </div>
            <div class="col-sm">
                <div class="results__details">
                    Results
                    <div class="results__date">
                        <time-string :timestamp="contest.resultsAt" />
                    </div>
                </div>
            </div>
        </div>

        <div class="row my-3">
            <div class="col-sm">
                <div class="btn-group">
                    <button
                        v-for="category in contest.categories"
                        :key="category.id"
                        type="button"
                        class="btn btn-dark"
                        :class="category.id === selectedCategoryId ? 'active' : ''"
                        @click="$store.commit('updateSelectedCategoryId', category.id)"
                    >
                        {{ category.name }}
                    </button>
                </div>
            </div>
        </div>

        <judging-leaderboard />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import PageHeader from '../components/PageHeader.vue';
import JudgingLeaderboard from '../components/results/JudgingLeaderboard.vue';
import TimeString from '../components/TimeString.vue';
import { Contest } from '../interfaces';

@Component({
    components: {
        PageHeader,
        JudgingLeaderboard,
        TimeString,
    },
})
export default class Results extends Vue {

    @State contest!: Contest | null;
    @State results!: [];
    @State selectedCategoryId!: number;

    async created (): Promise<void> {
        if (!this.contest || !this.results.length) {
            const data = await this.initialRequest('/api/results');
            if (data) this.$store.commit('updateContest', data);
        }
    }
}
</script>
