<template>
    <div class="config-component">
        <div class="page-title">
            <h1>Configurações</h1>
        </div>
        <div class="config-content">
            <div class="config-menu">
                <ul class="options-ul principal-options">
                    <li v-for="(menu, index) in configMenus" class="config-option" :key="index" :id="'config-menu-' + index" v-on:click="selectConfigOption(index)">
                        <div class="menu-title">
                            <h3>{{ menu.name }}</h3>
                        </div>
                    </li>
                </ul>
                <ul class="sub-menu options-ul" :id="'sub-menu-' + index" v-for="(menu, index) in configMenus" :key="index">
                    <li v-for="(subMenu, index) in menu.subMenus" class="config-option" :key="index" :dataLink="subMenu.link" v-on:click="selectThisConfig($event)">
                        <h3>{{ subMenu.name }}</h3>
                    </li>
                </ul>
            </div>
            <div class="config-inner-page">
                <div class="not-showing" v-if="notShowingSubMenuContent">
                    <h2>Abra alguma configuração</h2>
                </div>
                <systemConfig v-if="showSections.systemConfig"></systemConfig>
                <rolesConfig v-if="showSections.rolesConfig"></rolesConfig>
                <usersConfig v-if="showSections.usersConfig"></usersConfig>
                <ingredientsConfig v-if="showSections.ingredientsConfig"></ingredientsConfig>
                <dishesCategories v-if="showSections.dishesCategories"></dishesCategories>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import systemConfig from "./config/systemConfig.vue";
import rolesConfig from "./config/rolesConfig.vue";
import usersConfig from "./config/usersConfig.vue";
import ingredientsConfig from "./config/ingredientsConfig.vue";
import dishesCategories from "./config/dishesCategories.vue";

export default {
    name: "configComponent",
    data() {
        return {
            configMenus: [
                {
                    id: 0,
                    name: "Categorias de pratos",
                    subMenus: [
                        {
                            id: 0,
                            name: "Listar categorias",
                            link: "dishesCategories"
                        }
                    ]
                },
                {
                    id: 1,
                    name: "Tipos de ingredientes",
                    subMenus: [
                        {
                            id: 0,
                            name: "Listar tipos",
                            link: "ingredientsConfig"
                        }
                    ]
                },
                {
                    id: 2,
                    name: "Usuários",
                    subMenus: [
                        {
                            id: 0,
                            name: "Listar usuários",
                            link: "usersConfig"
                        },
                        {
                            id: 1,
                            name: "Cargos",
                            link: "rolesConfig"
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Sistema",
                    subMenus: [
                        {
                            id: 0,
                            name: "Personalização",
                            link: "systemConfig"
                        }
                    ]
                }
            ],
            showSections: {
                systemConfig: false,
                rolesConfig: false,
                usersConfig: false,
                ingredientsConfig: false,
                dishesCategories: false
            }
        }
    },
    computed: {
        notShowingSubMenuContent() {
            return Object.values(this.showSections).every(property => !property);
        }
    },
    methods: {
        selectThisConfig: function (event) {
            $(".sub-menu .config-option").removeClass("selected");

            let subMenuItem = $(event.target.parentElement);
            if (event.target.localName == "li") {
                subMenuItem = $(event.target);
            }

            subMenuItem.addClass("selected");
            let dataLink = subMenuItem.attr("dataLink");

            for (let key in this.showSections) {
                this.showSections[key] = false;
            }

            this.showSections[dataLink] = true;
        },
        selectConfigOption: function (path) {
            $(".principal-options .config-option").removeClass("selected");
            $("#config-menu-" + path).addClass("selected");

            this.resetConfigOptions();

            let subMenu = "sub-menu-" + path;

            $("#" + subMenu).show();
        },
        resetConfigOptions: function () {
            $(".sub-menu").hide();
        }
    },
    mounted: function () {
        this.resetConfigOptions();
    },
    components: {
        systemConfig,
        rolesConfig,
        usersConfig,
        ingredientsConfig,
        dishesCategories
    }
}
</script>
<style scoped>
.not-showing {
    text-align: center;
}
</style>