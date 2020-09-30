<template>
    <div>
        <page-header
            :title="$t('voting.results.title')"
            class="text-center"
        >
            {{ $t('voting.results.description') }}
        </page-header>

        <div class="row mb-2">
            <div class="col-lg-6 mb-2">
                <song-results-listing
                    :list-title="$t('voting.fa')"
                    :songs="faSongs"
                />
            </div>
            <div class="col-lg-6">
                <song-results-listing
                    :list-title="$t('voting.others')"
                    :songs="otherSongs"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import SongResultsListing from '../../components/SongResultsListing.vue';

@Component({
    components: {
        PageHeader,
        SongResultsListing,
    },
    props: {
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
export default class VotingResults extends Vue {

}
</script>
