<template>
    <div class="ml-2 mb-2" style="position: fixed; bottom: 0; left: 0">
        <div
            class="toast"
            :class="`bg-${toast.type}`"
            style="min-width: 100px"
        >
            <div class="toast-body text-center">
                {{ toast.message }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';

@Component({
    props: {
        header: String,
    },
})
export default class AlertPopup extends Vue {

    @State toast!: object;

    mounted() {
        $('.toast').toast({ delay: 2000 });
    }

}
</script>
