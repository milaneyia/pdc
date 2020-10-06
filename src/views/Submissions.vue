<template>
    <div class="container">
        <page-header :title="$t('submissions.title')" />

        <div v-if="submissions.length" class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>{{ $t('submissions.table.song') }}</th>
                                    <th>{{ $t('submissions.table.date') }}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="submission in submissions"
                                    :key="submission.id"
                                >
                                    <td>{{ submission.song.artist }} - {{ submission.song.title }} ({{ submission.song.category && submission.song.category.name }})</td>
                                    <td>
                                        {{ submission.updatedAt | shortDateTimeString }}
                                    </td>
                                    <td>
                                        <a
                                            :href="`/api/submissions/${submission.id}/download`"
                                        >
                                            {{ $t('submissions.table.download') }}
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="contest">
            <div class="row">
                <div class="col-sm">
                    <div class="card">
                        <div class="card-header text-center">
                            {{ $t('submissions.deadline.from') }}
                            <b><time-string :timestamp="contest.submissionsStartedAt" /></b>
                            {{ $t('submissions.deadline.to') }}
                            <b><time-string :timestamp="contest.submissionsEndedAt" /></b>
                            {{ $t('submissions.deadline.submit') }}
                        </div>
                        <div class="card-body">
                            <div class="text-center mb-2">
                                <a
                                    v-if="selectedSongId"
                                    :href="`/api/voting/${selectedSongId}/downloadTemplate`"
                                >
                                    Download the template
                                </a>
                            </div>

                            <select v-model="selectedSongId" class="form-control mb-2">
                                <option
                                    v-for="song in contest.songs"
                                    :key="song.id"
                                    :value="song.id"
                                >
                                    {{ song.artist }} - {{ song.title }} ({{ song.category && song.category.name }})
                                </option>
                            </select>

                            <div class="custom-file">
                                <input
                                    id="oszFile"
                                    type="file"
                                    class="custom-file-input"
                                    @change="oszFile = $event.target.files[0]"
                                >
                                <label
                                    class="custom-file-label"
                                    for="oszFile"
                                    :data-browse="$t('submissions.input.browse')"
                                >
                                    {{ oszFile ? oszFile.name : $t('submissions.input.placeholder') }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm">
                    <button class="btn btn-primary btn-block" @click="save($event)">
                        <div
                            v-if="isSaving"
                            class="spinner-border spinner-border-sm align-middle"
                            role="status"
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                        <span v-else>{{ $t('submissions.save') }}</span>
                    </button>
                </div>
            </div>
        </template>

        <div
            v-else
            class="card card-body text-center"
        >
            Nothing to submit yet
        </div>

        <login-modal />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';
import TimeString from '../components/TimeString.vue';
import LoginModal from '../components/LoginModal.vue';
import { Contest, Song, Submission, User } from '../interfaces';

interface ApiResponse {
    submissions: Submission[];
    contest: Contest | undefined;
    user: User | undefined;
}

@Component({
    components: {
        PageHeader,
        TimeString,
        LoginModal,
    },
})
export default class Submissions extends Vue {

    user: User | null = null;
    submissions: Submission[] = [];
    contest: Contest | null = null;
    oszFile: File | null = null;
    isSaving = false;
    selectedSongId: Song | null = null

    async created (): Promise<void> {
        await this.getData();

        if (!this.user) $('#loginModal').modal('show');
    }

    async getData (): Promise<void> {
        const data = await this.initialRequest<ApiResponse>('/api/submissions');

        if (data) {
            this.submissions = data.submissions || [];
            this.contest = data.contest || null;
            this.user = data.user || null;
        }
    }

    async save (e: Event): Promise<void> {
        if (!this.user) {
            $('#loginModal').modal('show');

            return;
        }

        this.isSaving = true;
        const data = await this.fileRequest<{ success: string }>(`/api/submissions/save`, {
            oszFile: this.oszFile,
            songId: this.selectedSongId,
        }, e);
        this.isSaving = false;

        if (data?.success) {
            await this.getData();
        }
    }

}
</script>
