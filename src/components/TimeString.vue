<template>
    <div
        v-if="div"
        data-toggle="tooltip"
        :title="tooltipDate"
    >
        {{ timestamp | shortDateTimeString }}
    </div>
    <span
        v-else
        data-toggle="tooltip"
        :title="tooltipDate"
    >
        {{ timestamp | shortDateTimeString }}
    </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    props: {
        timestamp: {
            type: [String, Date],
            required: true,
        },
        div: {
            type: Boolean,
        },
    },
})
export default class TimeString extends Vue {

    timestamp!: string;

    get tooltipDate (): string {
        return new Date(this.timestamp).toLocaleString('en-US', { timeZoneName: 'short' });
    }

}
</script>
