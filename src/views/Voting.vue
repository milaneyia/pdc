<template>
    <div class="container">
        <page-header :title="$t('voting.title')" class="text-center">
            <p>{{ $t('voting.description') }}</p>
            {{ $t('voting.note') }}
        </page-header>

        <div v-if="songs" class="row mb-2">
            <div class="col-lg-6 mb-2">
                <song-listing
                    :list-title="$t('voting.fa')"
                    :songs="faSongs"
                    @save="save($event.points, $event.songId, $event.e)"
                />
            </div>
            <div class="col-lg-6">
                <song-listing
                    :list-title="$t('voting.others')"
                    :songs="otherSongs"
                    @save="save($event.points, $event.songId, $event.e)"
                />
            </div>
        </div>

        <login-modal />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';
import TimeString from '../components/TimeString.vue';
import SongListing from '../components/SongListing.vue';
import LoginModal from '../components/LoginModal.vue';
import { Contest, Song, User } from '../interfaces';

interface ApiResponse {
    songs: Song[];
    user: User | undefined;
}

@Component({
    components: {
        PageHeader,
        TimeString,
        SongListing,
        LoginModal,
    },
})
export default class Voting extends Vue {

    user: User | null = null;
    songs: Song[] = [];
    contest: Contest | null = null;
    oszFile: File | null = null;
    isSaving = false;
    selectedSong: Song | null = null

    async created (): Promise<void> {
        this.$store.commit('updateLoadingState');
        await this.getData();
        this.$store.commit('updateLoadingState');

        if (!this.user) $('#loginModal').modal('show');
    }

    async getData (): Promise<void> {
        const data = await this.getRequest<ApiResponse>('/api/voting');

        if (data) {
            this.songs = data.songs || [];
            this.user = data.user || null;
        }
    }

    async save (points: number, songId: number, e: Event): Promise<void> {
        if (!this.user) {
            $('#loginModal').modal('show');

            return;
        }

        await this.postRequest('/api/voting/save', {
            points,
            songId,
        }, e);
        await this.getData();
    }

    get faSongs (): Song[] {
        return this.songs.filter(s => s.isFa);
    }

    get otherSongs (): Song[] {
        return this.songs.filter(s => !s.isFa);
    }

}
</script>
