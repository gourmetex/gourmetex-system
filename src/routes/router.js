import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import indexPage from '../pages/indexPage.vue';
import loginPage from '../pages/loginPage.vue';
import registerPage from '../pages/registerPage.vue';

const routes = [
    {
        path: '/home',
        component: indexPage,
        meta: {
            title: "Gourmetech",
            metaTags: [
                {
                    name: "description",
                    content: "Página inicial - Gourmetech"
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
        path: '/login',
        component: loginPage,
        meta: {
            title: "Faça login - Gourmetech",
            metaTags: [
                {
                    name: "description",
                    content: "Login - Gourmetech"
                },
                {
                    name: "og:description",
                    content: "ERP para restaurantes, tudo o que você precisa"
                }
            ]
        },
    },
    {
        path: '/register',
        component: registerPage,
        meta: {
            title: "Registre-se - Gourmetech",
            metaTags: [
                {
                    name: "description",
                    content: "Registro - Gourmetech"
                },
                {
                    name: "og:description",
                    content: "ERP para restaurantes, tudo o que você precisa"
                }
            ]
        },
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