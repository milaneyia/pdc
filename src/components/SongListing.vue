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
            >
                <div class="col-md-9 col-lg-8 col-xl-9">
                    <a
                        v-for="(link, i) in getPreviewLinks(song.previewLink)"
                        :key="i"
                        :href="link"
                        target="_blank"
                        class="mr-1"
                    >
                        <i class="fas fa-link" />
                    </a>
                    {{ song.artist }} - {{ song.title }}
                </div>
                <div class="col-md-3 col-lg-4 col-xl-3 my-2 my-sm-0 text-right">
                    <button
                        v-for="i in 3"
                        :key="i"
                        class="btn btn-sm rounded-circle ml-1 text-center"
                        :class="song.votes.some(v => v.points === i) ? 'btn-danger' : 'btn-primary'"
                        style="min-width: 29px"
                        @click="$emit('save', { points: i, songId: song.id, e: $event })"
                    >
                        <b>{{ i }}</b>
                    </button>
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
export default class SongListing extends Vue {

    getPreviewLinks (links: string): string[] {
        return links.split(' | ');
    }

}
</script>