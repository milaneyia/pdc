<template>
    <div
        v-cloak
        id="app"
    >
        <nav
            class="nav navbar navbar-expand-md navbar-dark"
            :class="$route.path !== '/' || ($route.path === '/' && user) ? 'navbar-triangles' : ''"
        >
            <router-link to="/" class="navbar-brand p-0">
                PDC2020
            </router-link>

            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarTarget"
            >
                <span class="navbar-toggler-icon" />
            </button>

            <div id="navbarTarget" class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link small" to="/">
                            {{ $t('nav.home') }}
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link small" to="/info">
                            {{ $t('nav.info') }}
                        </router-link>
                    </li>
                    <li v-if="isResultsTime" class="nav-item">
                        <router-link class="nav-link small" to="/results">
                            {{ $t('nav.results') }}
                        </router-link>
                    </li>

                    <li v-if="isSubmissionTime" class="nav-item">
                        <router-link class="nav-link small" to="/submissions">
                            {{ $t('nav.submissions') }}
                        </router-link>
                    </li>

                    <template v-if="user">
                        <li v-if="user.isJudge" class="nav-item">
                            <router-link class="nav-link small" to="/judging">
                                Judging Panel
                            </router-link>
                        </li>

                        <li v-if="user.isStaff" class="nav-item dropdown">
                            <a
                                class="nav-link small dropdown-toggle"
                                href="#"
                                data-toggle="dropdown"
                            >
                                Admin
                            </a>

                            <div class="dropdown-menu">
                                <router-link to="/admin/contests" class="dropdown-item small">
                                    Contest
                                </router-link>
                                <router-link to="/admin/submissions" class="dropdown-item small">
                                    Submissions
                                </router-link>
                                <router-link to="/admin/judging" class="dropdown-item small">
                                    Judging List
                                </router-link>
                                <div class="dropdown-divider" />
                                <router-link to="/admin/users/roles" class="dropdown-item small">
                                    User Roles
                                </router-link>
                                <router-link to="/admin/logs" class="dropdown-item small">
                                    Logs
                                </router-link>
                            </div>
                        </li>
                    </template>
                </ul>

                <template v-if="initialized">
                    <a
                        v-if="!user"
                        href="/login"
                        class="my-2 my-lg-0 small"
                    >
                        {{ $t('nav.login') }}
                    </a>
                    <a
                        v-else
                        href="/logout"
                        class="my-2 my-lg-0 small"
                    >
                        {{ $t('nav.logout') }}
                    </a>
                </template>

                <lang-switcher class="ml-0 ml-md-2 mt-2 mt-md-0" />
            </div>
        </nav>

        <loading-page>
            <transition name="route-transition" mode="out-in">
                <router-view />
            </transition>
        </loading-page>

        <alert-popup />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter, State } from 'vuex-class';
import LoadingPage from './components/LoadingPage.vue';
import LangSwitcher from './components/LangSwitcher.vue';
import AlertPopup from './components/AlertPopup.vue';
import { Contest, User } from './interfaces';

@Component({
    components: {
        LoadingPage,
        LangSwitcher,
        AlertPopup,
    },
})
export default class App extends Vue {

    @State initialized!: object;
    @State user!: User;
    @State contest!: Contest;
    @Getter isVotingTime!: boolean;
    @Getter isSubmissionTime!: boolean;
    @Getter isResultsTime!: boolean;

}
</script>
