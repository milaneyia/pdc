<template>
    <div
        id="detailModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-lg">
            <div v-if="submission" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ submission.country.name }}
                    </h5>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                    >
                        &times;
                    </button>
                </div>

                <div class="modal-body text-left">
                    <h5>
                        <a
                            v-if="submission.originalPath"
                            :href="`/api/results/download/${submission.id}`"
                            target="__blank"
                        >
                            Download the entry
                        </a>
                    </h5>

                    <div
                        v-for="(judging, i) in submission.judging"
                        :key="judging.id"
                    >
                        <b>{{ judging.judge.username }}</b>

                        <div
                            v-for="judgingToCriterias in judging.judgingToCriterias"
                            :key="judgingToCriterias.id"
                            class="my-1"
                        >
                            <a
                                data-toggle="collapse"
                                :href="`#judgingToCriteria${judgingToCriterias.id}`"
                                @click="showComment(judgingToCriterias.id)"
                            >
                                <small>
                                    <i
                                        class="fas mr-2"
                                        :class="getCollapseClass(judgingToCriterias.id)"
                                    />
                                </small>
                                {{ judgingToCriterias.criteria.name }}
                                <b>({{ judgingToCriterias.score }})</b>:
                            </a>


                            <p
                                :id="`judgingToCriteria${judgingToCriterias.id}`"
                                class="text-light ml-3 collapse"
                            >
                                <span style="white-space: pre-line;">{{ judgingToCriterias.comment }}</span>
                            </p>
                        </div>

                        <hr v-if="i < submission.judging.length - 1">
                    </div>
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
        submission: {
            type: Object,
            default: () => null,
        },
    },
})
export default class JudgingDetail extends Vue {

    commentsExpanded: number[] = [];

    showComment (id: number): void {
        const i = this.commentsExpanded.findIndex(j => j === id);
        i !== -1 ? this.commentsExpanded.splice(i, 1) : this.commentsExpanded.push(id);
    }

    getCollapseClass (id: number): string {
        if (this.commentsExpanded.includes(id)) {
            return 'fa-chevron-down';
        }

        return 'fa-chevron-right';
    }

}
</script>