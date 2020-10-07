<template>
    <div>
        <div class="container pt-6">
            <h1 class="text-center">
                <b>Pending Cup Mapping Contest</b>
            </h1>

            <div class="row mt-5">
                <div class="col-lg-5 mx-auto">
                    <div class="d-flex justify-content-around flex-wrap">
                        <a
                            class="d-flex align-items-center mb-3 mb-sm-0"
                            href="https://discord.com/invite/fVgU9pA"
                            target="__blank"
                        >
                            <i class="fab fa-discord fa-2x" />
                            <h5 class="mx-3 mb-0">{{ $t('index.links.discord') }}</h5>
                        </a>
                        <a
                            class="d-flex align-items-center mb-3 mb-sm-0"
                            href="https://osu.ppy.sh/community/forums/topics/1155108"
                            target="__blank"
                        >
                            <div style="background-image: url('/img/osu.png'); height: 30px; width: 30px; background-repeat: no-repeat; background-size: cover;" />
                            <h5 class="mx-3 mb-0">
                                {{ $t('index.links.forumPost') }}
                            </h5>
                        </a>
                    </div>
                </div>
            </div>

            <div v-if="user && contest" class="row mt-5">
                <div class="col-sm-12 mx-auto text-center">
                    <h5>
                        <a v-if="isVotingTime" href="/voting">
                            <i class="fas fa-poll-h mr-1" /> {{ $t('index.links.voting') }}
                        </a>
                    </h5>
                    <h5>
                        <a v-if="isSubmissionTime" href="/submissions">
                            <i class="fas fa-upload mr-1" /> {{ $t('index.links.submissions') }}
                        </a>
                    </h5>
                </div>
            </div>

            <div class="row pt-6 pb-6">
                <div class="col-sm-5 mx-auto">
                    <hr>
                </div>
            </div>

            <h2 class="text-center mb-5">
                <b>{{ $t('index.schedule.title') }}</b>
            </h2>

            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card">
                        <div class="card-body">
                            <ul class="timeline mb-0 text-right">
                                <li v-for="item in schedule" :key="item.key">
                                    <div>
                                        {{ $t(`index.schedule.${item.key}`) }}
                                    </div>
                                    <div>
                                        <time-string
                                            v-for="timestamp in item.timestamps"
                                            :key="timestamp"
                                            :timestamp="timestamp"
                                            :div="true"
                                        />
                                    </div>
                                </li>
                                <!-- <li>
                                    <div>
                                        {{ $t('index.schedule.announcement') }}
                                    </div>
                                    <div>
                                        <time-string timestamp="09/14/2020" :div="true" />
                                        <time-string timestamp="09/22/2020" :div="true" />
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        {{ $t('index.schedule.voting') }}
                                    </div>
                                    <div>
                                        <time-string timestamp="09/23/2020" :div="true" />
                                        <time-string timestamp="09/30/2020" :div="true" />
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        {{ $t('index.schedule.mapping') }}
                                    </div>
                                    <div>
                                        <time-string timestamp="10/01/2020" :div="true" />
                                        <time-string timestamp="11/01/2020" :div="true" />
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        {{ $t('index.schedule.judging') }}
                                    </div>
                                    <div>
                                        <time-string timestamp="11/02/2020" :div="true" />
                                        <time-string timestamp="11/20/2020" :div="true" />
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        {{ $t('index.schedule.results') }}
                                    </div>
                                    <div>
                                        <time-string timestamp="11/21/2020" :div="true" />
                                    </div>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h2 class="text-center mt-5">
                <b>{{ $t('index.prices.title') }}</b>
            </h2>
            <div class="text-center text-secondary mb-5">
                {{ $t('index.prices.supporterNote') }}
            </div>

            <div class="row mb-4 align-items-center">
                <div class="col-sm-3">
                    <div class="row my-2 text-center">
                        <h5 class="col text-warning">
                            <i class="fas fa-crown mr-1" />
                            {{ $t('index.prices.firstPlace') }}
                        </h5>
                    </div>
                </div>
                <div class="col-sm-9">
                    <div class="row mb-3 text-center">
                        <div
                            v-for="i in 3"
                            :key="i"
                            class="col-sm-4"
                        >
                            <div class="card card-body">
                                <div class="row text-center">
                                    <div class="col">
                                        (imagine a badge here)
                                        <!-- <div
                                            style="
                                                background-image: url('/img/badge_1.png');
                                                background-repeat: no-repeat;
                                                background-size: contain;
                                                background-position: center;
                                                width: 100px;
                                                height: 50px;
                                                margin: 0.5rem auto;
                                            "
                                        /> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card card-body">
                        <div class="row text-center">
                            <div class="col-sm-12">
                                <small class="text-danger"><i class="fas fa-heart mr-1" /></small>
                                {{ $tc('index.prices.supporter', '?') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-4 align-items-center">
                <div class="col-sm-3">
                    <div class="row my-2 text-center">
                        <h5 class="col text-info">
                            <i class="fas fa-crown mr-1" />
                            {{ $t('index.prices.secondPlace') }}
                        </h5>
                    </div>
                </div>
                <div class="col-sm-9">
                    <div class="card card-body">
                        <div class="row text-center">
                            <div class="col">
                                <small class="text-danger"><i class="fas fa-heart mr-1" /></small>
                                {{ $tc('index.prices.supporter', '?') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mb-2 align-items-center">
                <div class="col-sm-3">
                    <div class="row my-2 text-center">
                        <h5 class="col text-muted">
                            <i class="fas fa-crown mr-1" />
                            {{ $t('index.prices.thirdPlace') }}
                        </h5>
                    </div>
                </div>
                <div class="col-sm-9">
                    <div class="card card-body">
                        <div class="row text-center">
                            <div class="col">
                                <small class="text-danger"><i class="fas fa-heart mr-1" /></small>
                                {{ $tc('index.prices.supporter', '?') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 class="text-center py-5">
                <b>{{ $t('index.sponsorship.title') }}</b>
            </h2>

            <div class="row mb-3">
                <div class="col-sm">
                    <div class="card card-body">
                        <span>
                            {{ $t('index.sponsorship.contact') }}
                            <a href="https://osu.ppy.sh/users/3076909">Mafumafu (Regraz)</a>
                            {{ $t('index.sponsorship.detail') }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter, State } from 'vuex-class';
import { Contest, User } from '../interfaces';
import TimeString from '../components/TimeString.vue';

@Component({
    components: {
        TimeString,
    },
})
export default class Index extends Vue {

    @State user!: User;
    @State contest!: Contest;
    @Getter isVotingTime!: boolean;
    @Getter isSubmissionTime!: boolean;

    schedule = [
        { key: 'announcement', timestamps: ['09/14/2020', '09/22/2020'] },
        { key: 'voting', timestamps: ['09/23/2020', '09/30/2020'] },
        { key: 'mapping', timestamps: ['10/01/2020', '11/01/2020'] },
        { key: 'judging', timestamps: ['11/02/2020', '11/20/2020'] },
        { key: 'results', timestamps: ['11/21/2020'] },
    ]

}
</script>
