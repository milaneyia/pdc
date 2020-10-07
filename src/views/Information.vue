<template>
    <div class="container">
        <page-header
            :title="$t('nav.info')"
        />

        <card-text>
            <div class="text-center">
                {{ $t('information.intro.hello') }}
            </div>

            <hr>
            <p>{{ $t('information.intro.history') }}</p>
            <hr>

            <div class="text-center">
                {{ $t('information.intro.moreInfo.go') }}
                <a
                    href="https://osu.ppy.sh/community/forums/topics/1155108"
                    target="__blank"
                >
                    <b>{{ $t('information.intro.moreInfo.here') }}</b>
                </a>
            </div>
        </card-text>

        <card-text
            :header="$t('information.ruleset.title')"
        >
            <p>
                <b>{{ $t('information.ruleset.note') }}</b>
            </p>

            <ul>
                <li v-for="(rule, i) in $t('information.ruleset.rules')" :key="i">
                    {{ rule }}
                </li>
            </ul>
        </card-text>

        <card-text
            :header="$t('information.songs.title')"
        >
            <p>
                {{ $t('information.songs.description') }}
            </p>

            <p v-for="category in contest.categories" :key="category.id">
                <b>{{ category.name }}</b>

                <ul>
                    <li v-for="song in category.songs" :key="song.id">
                        {{ song.artist }} - {{ song.title }}
                        <a
                            v-if="song.wasChosen"
                            class="ml-auto"
                            :href="`/api/voting/${song.id}/downloadTemplate`"
                        >
                            <i class="fas fa-download" />
                        </a>
                    </li>
                </ul>
            </p>
        </card-text>

        <card-text
            :header="$t('information.mapping.title')"
        >
            <ul>
                <li v-for="(rule, i) in $t('information.mapping.rules')" :key="i">
                    {{ rule }}
                </li>
            </ul>
        </card-text>

        <card-text
            :header="$t('information.criterias.title')"
        >
            <ul>
                <li
                    v-for="(criteria, i) in $t('information.criterias.criterias')"
                    :key="i"
                    class="mb-3"
                >
                    {{ criteria.percentage }} - {{ criteria.name }}
                    <div>
                        {{ criteria.description }}
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
import { State } from 'vuex-class';

@Component({
    components: {
        PageHeader,
        CardText,
    },
})
export default class Information extends Vue {

    @State contest;

}
</script>
