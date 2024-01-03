<template>
    <div class="users-config">
        <div class="filters">
            <form id="filter-form" @submit.prevent="search()">
                <div class="filter-field">
                    <label for="id">Id</label>
                    <input type="number" name="u.id" id="id">
                </div>
                <div class="filter-field">
                    <label for="name">Nome</label>
                    <input type="text" name="u.nome" id="name">
                </div>
                <div class="filter-field">
                    <label for="role">Perfil</label>
                    <select id="role" name="id_cargo">
                        <option value="">* Qualquer</option>
                        <option :value="role.id[1]" v-for="(role, index) in roles" :key="index">{{ role.nome[1] }}</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Buscar</button>
            </form>
        </div>
        <gridView :gridoptions="gridOptions" :griddata="users" :selected="selectedRow" @dataclick="selectRow($event)"></gridView>
        <div class="edit-buttons">
            <button type="button" class="rounded-btn btn-primary" v-on:click="createNewUser()">
                <span class="material-icons">add</span>
            </button>
            <div class="dynamic-edit-buttons">
                <button type="button" class="rounded-btn btn-red" v-on:click="deleteUser()">
                    <span class="material-icons">delete</span>
                </button>
                <button type="button" class="rounded-btn btn-yellow" v-on:click="editUser()">
                    <span class="material-icons">edit</span>
                </button>
            </div>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/users/' + editId" :modalbutton2="modalButton2" @closeModal="closeModalFunction(); returnAllUsers();">
            <editUsersModalContent v-if="showEditUsersModalContent" :userid="editId" :companyroles="roles" @savedContent="closeModalFunction(); returnAllUsers();"></editUsersModalContent>
        </modal>
    </div>
</template>
<script>
import gridView from "../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../modal.vue";
import editUsersModalContent from "./editUsersModalContent.vue";
import api from "../../configs/api";
import $ from 'jquery';

export default {
    name: "rolesConfig",
    mixins: [globalMethods],
    data() {
        return {
            users: [],
            roles: [],
            gridOptions: [],
            selectedRow: null,
            editId: null,
            showEditUsersModalContent: false,
            filters: []
        }
    },
    methods: {
        search: function () {
            let data = $("#filter-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            this.filters = data;
            this.returnAllUsers();
        },
        deleteUser: function () {
            this.showModalFunction("Excluir usuário", "Excluir", "Cancelar");
            this.descelectRows();
        },
        createNewUser: function () {
            this.showModalFunction("Cadastrar usuário", "Salvar", "Cancelar");
            this.showEditUsersModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        editUser: function () {
            this.showModalFunction("Editar usuário", "Salvar", "Cancelar");
            this.showEditUsersModalContent = true;
        },
        selectRow: function (event) {
            switch (event[2]) {
                case "select_row":
                    this.showEditButtons();
                    this.editId = event[1];
                    this.selectGridRow(event[3])
                    break;
            }
        },
        returnAllUsers: function () {
            let self = this;

            let data = {
                filters: self.filters
            }

            api.post("/users/get_all_users", data).then((response) => {
                self.roles = response.data.returnObj.roles;
                self.users = response.data.returnObj.users;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnAllUsers();
    },
    components: {
        gridView,
        modal,
        editUsersModalContent
    }
}
</script>
<style scoped>
</style>