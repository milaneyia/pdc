<template>
    <div class="card">
        <div class="card-header">
            {{ listTitle }}
        </div>
        <div class="card-body">
            <div
                v-for="song in songs"
                :key="song.id"
                class="row mt-2"
                :class="song.wasChosen ? 'text-success' : ''"
            >
                <div class="col-sm-4 text-center">
                    <span :class="song.wasChosen ? 'text-success' : 'text-info'">
                        <b>{{ song.totalPoints }} pts</b>
                        <small v-if="song.votes.length">
                            ({{ song.votes.length }} votes)
                        </small>
                    </span>
                </div>
                <div class="col-sm-8 justify-content-center justify-content-sm-between d-flex">
                    {{ song.artist }} - {{ song.title }}
                    <a
                        v-if="song.wasChosen"
                        class="ml-auto"
                        :href="`/api/voting/${song.id}/downloadTemplate`"
                    >
                        <i class="fas fa-download" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        listTitle: {
            type: String,
            required: true,
        },
        songs: {
            type: Array,
            required: true,
        },
    },
})
export default class SongResultsListing extends Vue {

}
</script>