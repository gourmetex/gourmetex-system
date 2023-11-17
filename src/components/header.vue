<template>
    <div class="system-frame">
        <header>
            <div class="left-content">
                <div class="profile">
                    <img :src="connectedUser.profile_photo" class="avatar-p" v-on:click="toggleProfileMenu()">
                    <div class="profile-menu-wrapper" v-on:click="toggleProfileMenu()"></div>
                    <div class="profile-menu-container">
                        <ul>
                            <li>Perfil</li>
                            <li>Sair</li>
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
                <li v-for="(item, index) in menuOptions" :key="index" class="menu-item">
                    <span class="material-icons">{{ item.icon }}</span>
                    <h3>{{ item.name }}</h3>
                </li> 
            </ul>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "headerComponent",
    data() {
        return {
            menuOptions: [
                {
                    id: 1,
                    name: "Menu digital",
                    icon: "menu_book"
                },
                {
                    id: 2,
                    name: "Pratos",
                    icon: "dinner_dining"
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
                profile_photo: "https://www.cdc.gov/policy/polaris/tis/assets/tis-img/systems-problems-hero-medium.png",
                name: "Barraca do zé"
            }
        }
    },
    methods: {
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
        }
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

.notifications-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    margin-right: var(--space-4);
}

    .notifications-container span:first-child, .right-content > span {
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
            display: flex;
            padding: var(--space-4);
            cursor: pointer;
            color: var(--white);
            width: 90%;
            border-radius: var(--radius-md);
            margin: auto;
        }   

            .lateral-menu ul li:hover {
                background: var(--blue-low);
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

</style>