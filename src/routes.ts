import { RouteConfig } from 'vue-router';
import Index from './views/Index.vue';
// const Information = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/Information.vue');
const Results = () => import(/* webpackChunkName: "info", webpackPrefetch: true */ './views/Results.vue');
const Voting = () => import(/* webpackChunkName: "user" */ './views/Voting.vue');
const Submissions = () => import(/* webpackChunkName: "user" */ './views/Submissions.vue');
const ManageContest = () => import(/* webpackChunkName: "admin" */ './views/admin/ManageContest.vue');
const SubmissionListing = () => import(/* webpackChunkName: "admin" */ './views/admin/SubmissionListing.vue');
const ManageUser = () => import(/* webpackChunkName: "admin" */ './views/admin/ManageUser.vue');
const LogListing = () => import(/* webpackChunkName: "admin" */ './views/admin/LogListing.vue');
const JudgingListing = () => import(/* webpackChunkName: "admin" */ './views/admin/JudgingListing.vue');
const JudgingPanel = () => import(/* webpackChunkName: "judging" */ './views/JudgingPanel.vue');

const routes: RouteConfig[] = [
    { path: '/', component: Index },
    // { path: '/info', component: Information, meta: { title: 'Information - PDC2020' } },
    { path: '/results', component: Results, meta: { title: 'Results - PDC2020' } },

    { path: '/voting', component: Voting, meta: { title: 'Song Voting - PDC2020' } },
    { path: '/submissions', component: Submissions, meta: { title: 'Submissions - PDC2020' } },

    { path: '/admin/contests', component: ManageContest, meta: { title: 'Manage Contest - PDC2020' } },
    { path: '/admin/submissions', component: SubmissionListing, meta: { title: 'Manage Submissions - PDC2020' } },
    { path: '/admin/judging', component: JudgingListing, meta: { title: 'Judging - PDC2020' } },
    { path: '/admin/users/roles', component: ManageUser, meta: { title: 'Manage Roles - PDC2020' } },
    { path: '/admin/logs', component: LogListing, meta: { title: 'Logs - PDC2020' } },

    { path: '/judging', component: JudgingPanel, meta: { title: 'Judging - PDC2020' } },

    { path: '*', redirect: '/' },
];

export default routes;
