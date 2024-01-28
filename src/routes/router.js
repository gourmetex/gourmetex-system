import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import indexPage from '../pages/indexPage.vue';
import loginPage from '../pages/loginPage.vue';
import registerPage from '../pages/registerPage.vue';
import adminComponent from '../components/adminComponent.vue';
import dishesComponent from '../components/modules/dishes/dishesComponent.vue';
import digitalMenuComponent from '../components/digitalMenuComponent.vue';
import homeComponent from '../components/homeComponent.vue';
import configComponent from "../components/configComponent.vue"
import stockComponent from "../components/modules/stock/stockComponent.vue";
import ordersComponent from "../components/modules/orders/ordersComponent.vue";
import customersComponent from "../components/modules/customers/customersComponent.vue";
import kitchenComponent from "../components/modules/kitchen/kitchenComponent.vue";
import printOut from "../components/printOut.vue";

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
            {
                path: '',
                component: homeComponent
            },
            {
                path: 'admin',
                component: adminComponent
            },
            {
                path: 'dishes',
                component: dishesComponent
            },
            {
                path: 'digital-menu',
                component: digitalMenuComponent
            },
            {
                path: "config",
                component: configComponent
            },
            {
                path: "stock",
                component: stockComponent
            },
            {
                path: "orders",
                component: ordersComponent
            },
            {
                path: "customers",
                component: customersComponent
            },
            {
                path: "kitchen",
                component: kitchenComponent
            },
            {
                path: "printout",
                component: printOut
            }
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