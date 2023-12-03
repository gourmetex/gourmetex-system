<template>
    <div class="config-component">
        <div class="page-title">
            <h1>Configurações</h1>
        </div>
        <div class="config-content">
            <div class="config-menu">
                <ul>
                    <li v-for="(menu, index) in configMenus" class="config-menu-item" :key="index" :id="'config-menu-' + index" v-on:click="toggleMenu($event)">
                        <div class="menu-title">
                            <span class="material-icons">expand_more</span>
                            <h3>{{ menu.name }}</h3>
                        </div>
                        <ul class="sub-menu">
                            <li v-for="(subMenu, index) in menu.subMenus" :key="index" :dataLink="subMenu.link" v-on:click="selectThisConfig($event)">
                                <h3>{{ subMenu.name }}</h3>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="config-inner-page">
                <div class="not-showing" v-if="notShowingSubMenuContent">
                    <h2>Abra algume configuração</h2>
                </div>
                <systemConfig v-if="showSections.systemConfig"></systemConfig>
                <rolesConfig v-if="showSections.rolesConfig"></rolesConfig>
                <usersConfig v-if="showSections.usersConfig"></usersConfig>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import systemConfig from "./config/systemConfig.vue";
import rolesConfig from "./config/rolesConfig.vue";
import usersConfig from "./config/usersConfig.vue";

export default {
    name: "configComponent",
    data() {
        return {
            configMenus: [
                {
                    id: 0,
                    name: "Sistema",
                    subMenus: [
                        {
                            id: 1,
                            name: "Personalização",
                            link: "systemConfig"
                        }
                    ]
                },
                {
                    id: 1,
                    name: "Usuarios",
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
                }
            ],
            showSections: {
                systemConfig: false,
                rolesConfig: false,
                usersConfig: false
            }
        }
    },
    computed: {
        notShowingSubMenuContent() {
            return Object.values(this.showSections).every(property => !property);
        }
    },
    methods: {
        toggleMenu: function (event) {
            let menuItem = $(event.target.parentElement);
            let subMenu = menuItem.parent().find(".sub-menu");
            let subMenuName = subMenu.find("h3");
            let arrowIcon = menuItem.find("span");
            let menuTitle = menuItem.find("h3");

            if (subMenu.is(":visible")) {
                menuTitle.removeClass("font-bold");
                subMenuName.removeClass("font-bold");
                arrowIcon.css("transform", "rotate(180deg)");
            } else {
                menuTitle.addClass("font-bold");
                arrowIcon.css("transform", "rotate(0)");
            }

            subMenu.slideToggle();
        },
        closeAllMenusExceptFirst: function () {
            let configMenus = $(".config-menu-item:not(:first-child)");
            for (let i = 0; i < configMenus.length; i++) {
                let currentMenu = $(configMenus[i]);
                currentMenu.click();
            }
        },
        selectThisConfig: function (event) {
            $(".sub-menu h3").removeClass("font-bold");

            let subMenuItem = $(event.target.parentElement);
            let dataLink = subMenuItem.attr("dataLink");

            for (let key in this.showSections) {
                this.showSections[key] = false;
            }

            this.showSections[dataLink] = true;
        }
    },
    mounted: function () {
        this.closeAllMenusExceptFirst();
    },
    components: {
        systemConfig,
        rolesConfig,
        usersConfig
    }
}
</script>
<style scoped>
.config-content {
    display: flex;
}

.config-component {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.config-menu, .config-content, .config-inner-page {
    flex: 1;
}

.config-menu {
    border-right: 1px solid var(--blue-high);
    width: 40%;
    max-width: 300px;
}

    .config-menu ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

        .config-menu ul li {
            padding: var(--space-3) 0;
        }

        .config-menu ul li .menu-title {
            display: flex;
            cursor: pointer;
        }

            .config-menu ul li .menu-title:hover h3, .sub-menu li:hover h3 {
                text-decoration: underline;
                cursor: pointer;
            }

            .config-menu ul li .menu-title span {
                margin-right: var(--space-3);
                transition: transform 0.4s;
            }

            .config-menu ul li ul {
                padding-left: var(--space-8);
            }

.config-inner-page {
    padding-left: var(--space-6);
}
</style>