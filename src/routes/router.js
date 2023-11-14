import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import indexPage from '../pages/indexPage.vue';

const routes = [
    {
        path: '/home',
        component: indexPage,
        meta: {
            title: "Gourmetex",
            metaTags: [
                {
                    name: "description",
                    content: "Página inicial - Gourmetex"
                },
                {
                    name: "og:description",
                    content: "ERP para restaurantes, tudo o que você precisa"
                }
            ]
        },
        children: [
        ]
    },
    {
        path: '',
        redirect: '/home'
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router;