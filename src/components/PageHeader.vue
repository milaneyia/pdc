<template>
    <div>
        <h2 class="text-center my-5">
            <b>{{ title }}</b>
        </h2>

        <div v-if="$slots.default" class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        <slot />
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
        title: {
            type: String,
            required: true,
        },
    },
})
export default class PageHeader extends Vue {
}

</script>
