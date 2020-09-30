<template>
    <div>
        <page-header
            :title="$t('voting.title')"
            class="text-center"
        >
            <p>{{ $t('voting.description') }}</p>
            {{ $t('voting.note') }}
        </page-header>

        <div class="row mb-2">
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import SongListing from '../../components/SongListing.vue';
import { User } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        SongListing,
    },
    props: {
        user: {
            type: Object,
            default: () => null,
        },
        faSongs: {
            type: Array,
            default: () => [],
        },
        otherSongs: {
            type: Array,
            default: () => [],
        },
    },
})
export default class VotingPhase extends Vue {

    user!: User | null;

    async save (points: number, songId: number, e: Event): Promise<void> {
        if (!this.user) {
            $('#loginModal').modal('show');

            return;
        }

        await this.postRequest('/api/voting/save', {
            points,
            songId,
        }, e);

        this.$emit('get-data');
    }

}
</script>
