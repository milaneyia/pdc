<template>
    <div class="container text-center">
        <page-header
            title="Submissions"
        >
            <p>Listing of submissions by song, you NEED to set an anonymised name, otherwise it'll not show up for the judges</p>

            <select v-model="selectedCategoryId" class="form-control mt-3">
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
                </option>
            </select>

            <button class="btn btn-sm btn-primary mt-2 mx-1" @click="generateZip($event)">
                Generate zip (from originals osz)
            </button>

            <a
                :href="`/api/admin/submissions/${selectedCategoryId}/downloadZip`"
                class="btn btn-sm btn-primary mt-2 mx-1"
                target="_blank"
            >
                Download original
            </a>
        </page-header>

        <div v-if="selectedCategory">
            <div
                v-for="song in selectedCategory.songs"
                :key="song.id"
                class="card my-2"
            >
                <div class="card-header">
                    <b>{{ song.title }}</b>
                </div>

                <data-table
                    :headers="[
                        'User',
                        'Submission Date',
                        'Original Link',
                        'Anonymised As',
                        '',
                    ]"
                >
                    <tr
                        v-for="submission in song.submissions"
                        :key="submission.id"
                    >
                        <td>{{ submission.user.username }}</td>
                        <td>{{ submission.updatedAt | shortDateTimeString }}</td>
                        <td>
                            <a :href="`/api/admin/submissions/${submission.id}/download`">
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
            </div>
        </div>

        <div
            v-else
            class="card card-body"
        >
            No submissions
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../../components/PageHeader.vue';
import DataTable from '../../components/admin/DataTable.vue';
import { Song, Submission } from '../../interfaces';

@Component({
    components: {
        PageHeader,
        DataTable,
    },
})
export default class SubmissionListing extends Vue {

    categories: Song[] = [];
    editing: null | number = null;
    anonymisedAs = '';
    isSaving = false;
    selectedCategoryId = 1;

    async created (): Promise<void> {
        await this.getData();
    }

    get selectedCategory (): Song | undefined {
        return this.categories.find(r => r.id === this.selectedCategoryId);
    }

    async getData (): Promise<void> {
        const data = await this.initialRequest<{ categories: [] }>('/api/admin/submissions');
        if (data?.categories) this.categories = data.categories;
    }

    async save (submission: Submission, e: Event): Promise<void> {
        this.isSaving = true;
        const data = await this.postRequest<{ success: string }>(`/api/admin/submissions/${submission.id}/save`, {
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
        this.anonymisedAs = anonymisedAs || '';
    }

    cancel (): void {
        this.editing = null;
        this.anonymisedAs = '';
    }

    async generateZip (e: Event): Promise<void> {
        await this.postRequest(`/api/admin/submissions/${this.selectedCategoryId}/generateZip`, {}, e);
    }

}
</script>
