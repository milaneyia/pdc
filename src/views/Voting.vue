<template>
    <div class="container">
        <voting-results
            v-if="isResultsTime"
            :fa-songs="faSongs"
            :other-songs="otherSongs"
        />

        <voting-phase
            v-else-if="contest"
            :user="user"
            :fa-songs="faSongs"
            :other-songs="otherSongs"
            @get-data="getData()"
        />

        <login-modal />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginModal from '../components/LoginModal.vue';
import VotingPhase from '../components/voting/VotingPhase.vue';
import VotingResults from '../components/voting/VotingResults.vue';
import { Contest, Song, User } from '../interfaces';

interface ApiResponse {
    contest: Contest;
    user: User | undefined;
}

@Component({
    components: {
        LoginModal,
        VotingPhase,
        VotingResults,
    },
})
export default class Voting extends Vue {

    user: User | null = null;
    contest: Contest | null = null;

    async created (): Promise<void> {
        this.$store.commit('updateLoadingState');
        await this.getData();
        this.$store.commit('updateLoadingState');

        if (!this.user && !this.isResultsTime) $('#loginModal').modal('show');
    }

    async getData (): Promise<void> {
        const data = await this.getRequest<ApiResponse>('/api/voting');

        if (data) {
            this.contest = data.contest || null;
            this.user = data.user || null;
        }
    }

    get sortedSongs (): Song[] {
        if (!this.contest) return [];

        for (const song of this.contest.songs) {
            song.totalPoints = song.votes.map(v => v.points).reduce((acc, points) => acc + points, 0);
        }

        return [...this.contest.songs].sort((a, b) => b.totalPoints - a.totalPoints);
    }

    get isResultsTime (): boolean | null {
        return this.contest && (new Date(this.contest.votingEndedAt) <= new Date() || (this.user && this.user.isStaff));
    }

    get songs (): Song[] {
        return this.isResultsTime ? this.sortedSongs : (this.contest?.songs || []);
    }

    get faSongs (): Song[] {
        return this.songs.filter(s => s.isFa) || [];
    }

    get otherSongs (): Song[] {
        return this.songs.filter(s => !s.isFa) || [];
    }

}
</script>
