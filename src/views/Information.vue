<template>
    <div class="container">
        <page-header
            title="Information"
        />

        <card-text>
            <div class="text-center">
                Hello! It is the time to celebrate again the great annual mapping contest – Pending Cup!
            </div>
            <hr>
            <p>Pending Cup is originally a Chinese mapping contest, which had its first iteration in 2013 and held by NatsumeRin. Through the past years, Pending Cup has always been a means of encouraging creative mapping and finding new talent across the entire mapping community, and it will always be the core value of the contest. We would strongly encourage and welcome you to participate this event!</p>
            <hr>
            <span class="text-right text-secondary">Contest rules will be announced when the contest starts.</span>
        </card-text>

        <card-text
            header="Criterias"
        >
            <ul>
                <li class="mb-3">
                    30% - Expertise
                    <div>
                        How well does the submission demonstrate techniques regarding structure,
                        music representation, flow, hitsounding, etc?
                    </div>
                </li>
                <li class="mb-3">
                    30% - Cohesion
                    <div>
                        How consistent is the submission regarding structure, music representation,
                        flow, hitsounding etc especially between different sections, considering this
                        contest is collaborative?
                    </div>
                </li>
                <li class="mb-3">
                    30% - Creativity
                    <div>
                        How well does the submission show originality and uniqueness compared with
                        the other submissions with reasonable respect to the playability?
                    </div>
                </li>
                <li class="mb-3">
                    10% - Judge's Impression
                    <div>
                        This is the part of the score left to the Judges’ personal preferences on the
                        submission
                    </div>
                </li>
            </ul>
        </card-text>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PageHeader from '../components/PageHeader.vue';
import CardText from '../components/CardText.vue';

@Component({
    components: {
        PageHeader,
        CardText,
    },
})
export default class Information extends Vue {

}
</script>
