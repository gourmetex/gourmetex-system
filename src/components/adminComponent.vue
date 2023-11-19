<template>
    <div class="admin">
        <h1>Admin</h1>
        <div class="admin-container">
            <ul class="admin-options-ul">
                <li v-for="(item, index) in adminOptions" v-bind:key="index" v-on:click="selectAdminOption(item.path)" :id="'admin-' + item.path" class="admin-option">
                    <h3>{{ item.name }}</h3>
                </li>
            </ul>
            <div class="select-some-option" v-if="showingSomething">
                <h2>Bem vindo ao admin, selecione uma opção para continuar</h2>
            </div>
            <adminEmpresas v-if="showAdminCompanies"></adminEmpresas>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import adminEmpresas from "./admin/adminEmpresas.vue";

export default {
    name: "adminComponent",
    data() {
        return {
            adminOptions: [
                {
                    id: 1,
                    path: "companies",
                    name: "Empresas"
                }
            ],
            showAdminCompanies: false
        }
    },
    computed: {
        showingSomething: function () {
            if (!this.showAdminCompanies) {
                return true;
            }

            return false;
        }
    },
    methods: {
        selectAdminOption: function (path) {
            $(".admin-option").removeClass("selected");
            $("#admin-" + path).addClass("selected");

            this.resetAdminOptions();

            switch (path) {
                case "companies":
                    this.showAdminCompanies = true;
                    break;
            }
        },
        resetAdminOptions: function () {
            this.showAdminCompanies = false;
        }
    },
    components: {
        adminEmpresas
    }
}
</script>
<style scoped>

.select-some-option {
    text-align: center;
}

.admin-options-ul {
    list-style-type: none;
    margin: var(--space-4) 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    border-top: 1px solid var(--gray-3);
    border-bottom: 1px solid var(--gray-3);
}

    .admin-options-ul li {
        padding: var(--space-3) var(--space-5);
        border-radius: var(--radius-md);
        cursor: pointer;
        width: fit-content;
        margin: var(--space-2);
    }

        .admin-options-ul li:hover, .selected {
            background: var(--gray-3);
        }

</style>