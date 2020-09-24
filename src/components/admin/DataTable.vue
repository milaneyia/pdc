<template>
    <div class="card-body p-0">
        <table
            class="table table-hover text-left"
            :class="customClass || 'table-responsive-lg'"
        >
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <slot />
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../PageHeader.vue';

@Component({
    components: {
        PageHeader,
    },
    props: {
        headers: Array,
        customClass: {
            type: String,
            required: false,
        },
    },
})
export default class AdminHeader extends Vue {
}

</script>
