<template>
    <div>
        <div
            v-if="isLoading"
            class="d-flex justify-content-center align-items-center loading-container opacity-transition"
        >
            <div
                class="spinner-border"
                role="status"
                style="height: 3rem; width: 3rem;"
            >
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div
            class="opacity-transition"
            :class="isLoading ? 'loading-content' : ''"
        >
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';

@Component
export default class LoadingPage extends Vue {

    @State isLoading!: boolean;

}

</script>

<style lang="sass">

.loading-container {
    position: fixed;
    height: 85vh;
    width: 100%;
    transition: opacity 0.25s ease-in-out;
}

.loading-content {
    visibility: hidden;
    opacity: 0;
}

.opacity-transition {
    transition: opacity 0.25s ease-in-out;
}

</style>
