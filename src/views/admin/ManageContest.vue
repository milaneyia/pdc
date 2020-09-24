<template>
    <div class="container text-center">
        <page-header
            title="General Contest Info"
        />

        <template v-if="contest">
            <card-text>
                <template #header>
                    Schedule (in your local timezone)
                </template>

                <div class="row mb-2">
                    <div
                        v-for="[key, value] in Object.entries(editSchedule)"
                        :key="key"
                        class="col-sm-6"
                    >
                        <div class="form-group">
                            <label
                                :for="key"
                            >
                                {{ value }}
                            </label>

                            <input
                                type="datetime-local"
                                class="form-control"
                                :name="key"
                                :value="formatDate(contest[key])"
                                @change="parseDate(key, $event.target.value)"
                            >
                        </div>
                    </div>
                </div>
            </card-text>

            <div class="row">
                <div class="col-sm">
                    <button class="btn btn-success btn-block" @click="update($event)">
                        Update
                    </button>
                </div>
            </div>

            <hr class="my-5">

            <card-text>
                <template #header>
                    Songs
                </template>

                <data-table
                    :headers="[
                        'Artist',
                        'Title',
                        'Preview Link',
                        'osz Link',
                        'Is FA?',
                        'Was Chosen?',
                        ''
                    ]"
                >
                    <tr
                        v-for="song in contest.songs"
                        :key="song.id"
                    >
                        <td v-for="input in inputs" :key="input">
                            <input
                                v-model="song[input]"
                                type="text"
                                class="form-control form-control-sm"
                            >
                        </td>
                        <td>
                            <input
                                type="file"
                                class="form-control form-control-sm"
                                maxlength="255"
                                @change="oszFiles[song.id] = $event.target.files[0]"
                            >

                            <a :href="`/api/admin/contests/songs/${song.id}/download`">
                                download (if exists)
                            </a>
                        </td>
                        <td>
                            <div class="form-check">
                                <input
                                    :id="`isFa${song.id}`"
                                    v-model="song.isFa"
                                    class="form-check-input"
                                    type="checkbox"
                                >
                                <label class="form-check-label" :for="`isFa${song.id}`">
                                    FA
                                </label>
                            </div>
                        </td>
                        <td>
                            <div class="form-check">
                                <input
                                    :id="`wasChosen${song.id}`"
                                    v-model="song.wasChosen"
                                    class="form-check-input"
                                    type="checkbox"
                                >
                                <label class="form-check-label" :for="`wasChosen${song.id}`">
                                    Confirm
                                </label>
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-success btn-sm mb-2" @click="updateSong(song, $event)">
                                Update
                            </button>
                            <button class="btn btn-danger btn-sm" @click="removeSong(song.id, $event)">
                                Remove
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td v-for="input in inputs" :key="input">
                            <input
                                v-model="newSong[input]"
                                type="text"
                                class="form-control form-control-sm"
                            >
                        </td>
                        <td>
                            <div class="form-check">
                                <input
                                    id="isFaNew"
                                    v-model="newSong.isFa"
                                    class="form-check-input"
                                    type="checkbox"
                                >
                                <label class="form-check-label" for="isFaNew">
                                    FA
                                </label>
                            </div>
                        </td>
                        <td>
                            <button class="btn btn-success btn-sm" @click="storeSong($event)">
                                Add
                            </button>
                        </td>
                    </tr>
                </data-table>
            </card-text>
        </template>

        <card-text v-else>
            No contest created yet

            <button class="btn btn-primary mt-2" @click="store($event)">
                Create
            </button>
        </card-text>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import CardText from '../../components/CardText.vue';
import DataTable from '../../components/admin/DataTable.vue';
import { Contest, Song } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        CardText,
        DataTable,
    },
})
export default class ManageContest extends Vue {

    editSchedule = {
        votingStartedAt: 'Voting Start Date',
        votingEndedAt: 'Voting End Date',
        submissionsStartedAt: 'Submissions Start Date',
        submissionsEndedAt: 'Submissions End Date',
        judgingStartedAt: 'Judging Start Date',
        judgingEndedAt: 'Judging End Date',
        resultsAt: 'Results Date',
    };
    contest: Contest | null = null;
    editing: Song | null = null;
    newSong = {};
    inputs = ['artist', 'title', 'previewLink'];
    oszFiles = [];

    async created (): Promise<void> {
        const data = await this.initialRequest<{ contest: Contest }>('/api/admin/contests');
        if (data) this.contest = data.contest;
    }

    async getContestData (): Promise<void> {
        const data = await this.getRequest<{ contest: Contest }>('/api/admin/contests/');
        if (data) this.contest = data.contest;
    }

    formatDate (date: string) {
        return this.$dayjs(date).format('YYYY-MM-DDTHH:mm');
    }

    parseDate (key: string, value: string): void {
        if (!this.contest) return;

        this.contest[key] = this.$dayjs(value);
    }

    async update (e): Promise<void> {
        await this.postRequest<{ contest: Contest }>('/api/admin/contests/update', {
            contest: this.contest,
        }, e);
        await this.getContestData();
    }

    async store (e: Event): Promise<void> {
        await this.postRequest<{ contest: Contest }>('/api/admin/contests/store', {}, e);
        await this.getContestData();
    }

    async storeSong (e: Event): Promise<void> {
        const data = await this.postRequest<{ success: string }>('/api/admin/contests/storeSong', {
            song: this.newSong,
        }, e);

        if (this.contest && data?.success) {
            await this.getContestData();
            this.newSong = {};
        }
    }

    async updateSong (song: Song, e): Promise<void> {
        await this.fileRequest<{ contest: Contest }>(`/api/admin/contests/songs/${song.id}/update`, {
            oszFile: this.oszFiles[song.id],
            song,
        }, e);
        await this.getContestData();
    }

    async removeSong (id: number, e): Promise<void> {
        if (!confirm('Cannot undo this action')) return;

        await this.postRequest<{ contest: Contest }>(`/api/admin/contests/songs/${id}/remove`, {}, e);
        await this.getContestData();
    }

}
</script>
