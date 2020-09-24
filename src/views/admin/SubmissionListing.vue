<template>
    <div class="container text-center">
        <page-header
            title="Submissions"
        >
            <p>Listing of submissions by song, you NEED to set an anonymised name and upload the .osz for the entry, otherwise it'll not show up for the judges</p>
            <p class="small">
                Also generate zips for faster download before judging is started
            </p>

            <select v-model="selectedSongId" class="form-control mt-3">
                <option
                    v-for="song in songs"
                    :key="song.id"
                    :value="song.id"
                >
                    {{ song.artist }} - {{ song.title }}
                </option>
            </select>

            <button class="btn btn-sm btn-primary mt-2 mx-1" @click="generateZip($event)">
                Generate zip (from originals osz)
            </button>

            <a
                :href="`/api/admin/songs/${selectedSongId}/downloadZip`"
                class="btn btn-sm btn-primary mt-2 mx-1"
                target="_blank"
            >
                Download original
            </a>

            <button class="btn btn-sm btn-primary mt-2 mx-1" @click="generateAnomZip($event)">
                Generate zip (from anonymised osz for judges)
            </button>

            <a
                :href="`/api/admin/songs/${selectedSongId}/downloadAnomZip`"
                class="btn btn-sm btn-primary mt-2 mx-1"
                target="_blank"
            >
                Download anom
            </a>
        </page-header>

        <div v-if="selectedSong" class="card">
            <data-table
                v-if="selectedSong.submissions.length"
                :headers="[
                    'Team',
                    'Submission Date',
                    'Original Link',
                    'Anonymised As',
                    'Anonymised Link',
                    '',
                ]"
            >
                <tr
                    v-for="submission in selectedSong.submissions"
                    :key="submission.id"
                >
                    <td>{{ submission.user.username }}</td>
                    <td>{{ submission.updatedAt | shortDateTimeString }}</td>
                    <td>
                        <a
                            v-if="submission.originalPath"
                            :href="`/api/admin/submissions/${submission.id}/download`"
                        >
                            download
                        </a>
                    </td>
                    <td>
                        <input
                            v-if="editing == submission.id"
                            v-model="anonymisedAs"
                            type="text"
                            class="form-control form-control-sm"
                            maxlength="255"
                        >

                        <span v-else>{{ submission.anonymisedAs }}</span>
                    </td>
                    <td>
                        <input
                            v-if="editing == submission.id"
                            type="file"
                            class="form-control form-control-sm"
                            maxlength="255"
                            @change="oszFile = $event.target.files[0]"
                        >

                        <a
                            v-else-if="submission.anonymisedAs"
                            :href="`/api/admin/submissions/${submission.id}/downloadAnom`"
                        >
                            download
                        </a>
                    </td>
                    <td>
                        <template v-if="editing == submission.id">
                            <button
                                class="btn btn-sm btn-secondary mb-2 mb-lg-0"
                                @click="cancel"
                            >
                                Cancel
                            </button>
                            <button
                                class="btn btn-sm btn-success"
                                @click="save(submission, $event)"
                            >
                                <div
                                    v-if="isSaving"
                                    class="spinner-border spinner-border-sm align-middle"
                                    role="status"
                                >
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <span v-else>Save</span>
                            </button>
                        </template>

                        <button
                            v-else-if="!editing"
                            class="btn btn-sm btn-primary"
                            @click="edit(submission.id, submission.anonymisedAs)"
                        >
                            Edit
                        </button>
                    </td>
                </tr>
            </data-table>

            <div
                v-else
                class="card-body"
            >
                No submissions
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import CountryFlagCell from '../../components/CountryFlagCell.vue';
import { Song, Submission } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
        CountryFlagCell,
    },
})
export default class SubmissionListing extends Vue {

    songs: Song[] = [];
    editing: null | number = null;
    anonymisedAs = '';
    oszFile: File | null = null;
    isSaving = false;
    selectedSongId = 1;

    async created (): Promise<void> {
        await this.getData();
    }

    get selectedSong (): Song | undefined {
        return this.songs.find(r => r.id === this.selectedSongId);
    }

    async getData (): Promise<void> {
        const data = await this.initialRequest<{ songs: [] }>('/api/admin/submissions');
        if (data?.songs) this.songs = data.songs;
    }

    async save (submission: Submission, e: Event): Promise<void> {
        this.isSaving = true;
        const data = await this.fileRequest<{ success: string }>(`/api/admin/submissions/${submission.id}/save`, {
            oszFile: this.oszFile,
            anonymisedAs: this.anonymisedAs,
        }, e);
        this.isSaving = false;

        if (data?.success) {
            this.cancel();
            this.getData();
        }
    }

    edit (id: number, anonymisedAs: string): void {
        this.editing = id;
        this.oszFile = null;
        this.anonymisedAs = anonymisedAs || '';
    }

    cancel (): void {
        this.editing = null;
        this.oszFile = null;
        this.anonymisedAs = '';
    }

    async generateZip (e: Event): Promise<void> {
        await this.postRequest(`/api/admin/songs/${this.selectedSongId}/generateZip`, {
            type: 'original',
        }, e);
    }

    async generateAnomZip (e: Event): Promise<void> {
        await this.postRequest(`/api/admin/songs/${this.selectedSongId}/generateZip`, {
            type: 'anom',
        }, e);
    }

}
</script>
