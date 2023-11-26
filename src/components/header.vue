<template>
    <div class="system-frame">
        <header>
            <div class="left-content">
                <span class="material-icons responsive-lateral-menu-toggle" v-on:click="toggleLateralMenu()">menu</span>
                <div class="profile">
                    <img :src="connectedUser.profile_photo" class="avatar-p" v-on:click="toggleProfileMenu()">
                    <div class="profile-menu-wrapper" v-on:click="toggleProfileMenu()"></div>
                    <div class="profile-menu-container">
                        <ul>
                            <li>Perfil</li>
                            <li v-on:click="logoutUser()">Sair</li>
                        </ul>
                    </div>
                </div>
                <img :src="currentCompany.profile_photo" class="company-logo-p">
            </div>
            <div class="right-content">
                <div class="notifications-container">
                    <span class="material-icons">notifications</span>
                    <span class="notifications-number">{{ connectedUser.status.notifications }}</span>
                </div>
                <span class="material-icons">help</span>
            </div>
        </header>
        <div class="lateral-menu">
            <ul>
                <li v-for="(item, index) in menuOptions" :key="index" class="menu-item" v-on:click="selectThisItem('menu-' + item.icon)" :id="'menu-' + item.icon" :class="checkCurrentPathname(item.link) ? 'li-active' : ''">
                    <router-link :to="item.link">
                        <span class="material-icons">{{ item.icon }}</span>
                        <h3>{{ item.name }}</h3>
                    </router-link>
                </li> 
            </ul>
        </div>
        <div class="lateral-menu-wrapper" v-on:click="toggleLateralMenu()"></div>
    </div>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '@/js/globalMethods';

export default {
    name: "headerComponent",
    mixins: [globalMethods],
    data() {
        return {
            menuOptions: [
                {
                    id: 0,
                    name: "Início",
                    icon: "home",
                    link: "/home"
                },
                {
                    id: 1,
                    name: "Menu digital",
                    icon: "menu_book",
                    link: "/home/digital-menu"
                },
                {
                    id: 2,
                    name: "Pratos",
                    icon: "dinner_dining",
                    link: "/home/dishes"
                },
                {
                    id: 3,
                    name: "Admin",
                    icon: "admin_panel_settings",
                    link: "/home/admin"
                },
                {
                    id: 4,
                    name: "Configurações",
                    icon: "settings",
                    link: "/home/config"
                }
            ],
            connectedUser: {
                id: 1,
                name: "João Marques de Carvalho Junior",
                profile_photo: "https://m.media-amazon.com/images/I/61Sz-RayqyL._AC_UF1000,1000_QL80_.jpg",
                status: {
                    notifications: 5
                }
            },
            currentCompany: {
                id: 1,
                profile_photo: "https://gourmetech-test-storage.s3.sa-east-1.amazonaws.com/gourmetech-erp-para-restaurantes-branco.png",
                name: "Barraca do zé"
            },
            menuMovement: false
        }
    },
    methods: {
        checkCurrentPathname: function (linkToCheck) {
            let pathname = window.location.pathname;
            if (pathname == linkToCheck) {
                return true;
            }
            return false;
        },
        selectThisItem: function (elementId) {
            $(".menu-item").removeClass("li-active");

            let targetElement = $("#" + elementId);
            targetElement.addClass("li-active");
        },
        toggleProfileMenu: function () {
            let profileMenu = $(".profile-menu-container");
            let profileMenuWrapper = $(".profile-menu-wrapper");

            if (profileMenu.is(":visible")) {
                profileMenuWrapper.hide();
                profileMenu.hide();
            } else {
                profileMenu.show();
                profileMenuWrapper.show();
            }
        },
        toggleLateralMenu: function () {
            let lateralMenu = $(".lateral-menu");
            if (lateralMenu.is(":visible")) {
                this.$emit("toggleMenu", false);
                this.hideLateralMenu();
            } else {
                this.$emit("toggleMenu", true);
                this.showLateralMenu();
            }
        },
        hideLateralMenu: function () {
            this.menuMovement = true;

            let lateralMenu = $(".lateral-menu");
            let lateralMenuWrapper = $(".lateral-menu-wrapper");

            lateralMenu.css("transform", "translateX(-260px)");
            lateralMenuWrapper.hide();
            setTimeout(() => {
                lateralMenu.hide();
                this.menuMovement = false;
            }, 400)
        },
        showLateralMenu: function () {
            this.menuMovement = true;

            let lateralMenu = $(".lateral-menu");
            let lateralMenuWrapper = $(".lateral-menu-wrapper");

            lateralMenuWrapper.show();
            lateralMenu.show();
            setTimeout(() => {
                lateralMenu.css("transform", "translateX(0)");
                setTimeout(() => {
                    this.menuMovement = false;
                }, 400)
            }, 1)
        },
        hideResponsiveButton: function () {
            let responsiveButton = $(".responsive-lateral-menu-toggle");

            responsiveButton.css("opacity", 0);

            setTimeout(() => {
                responsiveButton.hide();
            }, 400)
        },
        showResponsiveButton: function () {
            let responsiveButton = $(".responsive-lateral-menu-toggle");

            responsiveButton.show();

            setTimeout(() => {
                responsiveButton.css("opacity", 1);
            }, 1)
        }
    },
    mounted: function () {
        let self = this;

        $(window).on("resize", () => {
            let windowWidth = $(window).width();

            if (windowWidth <= 960) {
                if (this.menuMovement) return;

                self.hideLateralMenu();
                self.showResponsiveButton();
            } else {
                if (this.menuMovement) return;

                self.showLateralMenu();
                self.hideResponsiveButton();
            }
        })
    }
}
</script>
<style scoped>

header, .lateral-menu {
    background: var(--blue);
}

header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 80px;
    display: flex;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid var(--blue-low);
    z-index: 2;
}

.left-content, .right-content {
    display: flex;
    align-items: center;
    color: var(--white);
}

    .left-content img {
        margin: var(--space-3);
    }

.responsive-lateral-menu-toggle {
    margin: 0 var(--space-4) 0 var(--space-3);
    transition: opacity 0.4s;
    display: none;
    opacity: 0;
}

.notifications-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    margin-right: var(--space-4);
}

    .notifications-container span:first-child, .right-content > span, .responsive-lateral-menu-toggle {
        font-size: var(--fontsize-lg);
        cursor: pointer;
    }

    .notifications-container span:last-child {
        position: absolute;
        left: -3px;
        bottom: -3px;
        background: var(--orange);
        border-radius: var(--radius-full);
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

.lateral-menu {
    position: absolute;
    top: 80px;
    left: 0;
    width: 260px;
    height: calc(100vh - 80px);
    transition: transform 0.4s;
}

    .lateral-menu h3 {
        color: var(--white);
    }

    .lateral-menu ul {
        margin: 0;
        padding: var(--space-3) 0;
        list-style-type: none;
        min-height: 100%;
    }

        .lateral-menu ul li {
            margin: var(--space-2) auto;
            width: 90%;
        }

        .lateral-menu ul li a {
            padding: var(--space-4);
            width: 100%;
        }

        .lateral-menu ul li, .lateral-menu ul li a {
            display: flex;
            cursor: pointer;
            color: var(--white);
            border-radius: var(--radius-md);
        }   

            .lateral-menu ul li:hover, .li-active {
                background: var(--blue-low);
            }

.lateral-menu-wrapper {
    position: fixed;
    top: 80px;
    left: 260px;
    width: calc(100vw - 260px);
    height: calc(100vh - 80px);
    background: transparent;
    display: none;
    z-index: 2;
}

.menu-item span {
    margin-right: var(--space-4);
}

.avatar-p {
    cursor: pointer;
}

.profile {
    position: relative;
}

.profile-menu-container {
    position: absolute;
    top: 105%;
    left: 0;
    padding: var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--white);
    box-shadow: var(--boxshadow-default);
    border: 1px solid var(--gray-2);
    color: var(--black);
    display: none;
}

    .profile-menu-container ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

        .profile-menu-container ul li {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-2) var(--space-6);
        }

            .profile-menu-container ul li:hover {
                background: var(--gray-3);
                cursor: pointer;
            }

.profile-menu-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
}

@media (max-width: 768px) {
    .responsive-lateral-menu-toggle {
        display: block;
        opacity: 1;
    }

    .lateral-menu {
        display: none;
        transform: translateX(-260px);
    }
}

@media (max-width: 480px) {
    .company-logo-p {
        display: none;
    }
}

</style>