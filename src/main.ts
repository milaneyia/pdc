import './hooks';
import './sass/app.scss';
import './interfaces';
import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import storeOptions from './store';
import routes from './routes';
import Axios from 'axios';
import mixins from './mixins';
import en from './lang/en';
import zh from './lang/zh';
import dayjs from 'dayjs';

Vue.prototype.$dayjs = dayjs;

$(function() {
    $('body').tooltip({ selector: '[data-toggle=tooltip]', trigger: 'hover' });
});

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);

const store = new Vuex.Store(storeOptions);

const router = new VueRouter({
    mode: 'history',
    routes,
    linkExactActiveClass: 'active',
});

const locale = localStorage.lang || 'en';

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title || 'Pending Cup Mapping Contest';

    if (!store.state.initialized) {
        const res = await Axios.get('/api/');
        store.commit('setData', res.data);
    }

    if (
        to.matched.some(r =>
            (r.path.startsWith('/admin') && !store.state.user?.isStaff) ||
            (r.path.startsWith('/judging') && !store.state.user?.isJudge)
        )
    ) {
        next({ path: '/' });
    } else {
        next();
    }
});

const i18n = new VueI18n({
    locale,
    fallbackLocale: 'en',
    messages: {
        en,
        zh,
    },
    silentFallbackWarn: process.env.NODE_ENV !== 'development',
});

Vue.filter('shortDateTimeString', (value: string) => {
    if (!value) return '';

    return new Date(value).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric' });
});

Vue.mixin(mixins);

new Vue({
    store,
    router,
    render: (h): VNode => h(App),
    i18n,
}).$mount('#app');
