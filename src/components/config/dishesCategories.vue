<template>
    <div class="ingredients-config">
        <div class="filters">
            <form id="filter-form" @submit.prevent="search()">
                <div class="filter-field">
                    <label for="nome">Nome da categoria</label>
                    <input type="text" name="nome" id="nome" placeholder="Ex. Lanches">
                </div>
                <button type="submit" class="btn btn-primary">Buscar</button>
            </form>
        </div>
        <gridView :gridoptions="gridOptions" :griddata="dishes_categories" :selected="selectedRow" @dataclick="selectRow($event)"></gridView>
        <div class="edit-buttons">
            <button type="button" class="rounded-btn btn-primary" v-on:click="createNewCategory()">
                <span class="material-icons">add</span>
            </button>
            <div class="dynamic-edit-buttons">
                <button type="button" class="rounded-btn btn-red" v-on:click="deleteCategory()">
                    <span class="material-icons">delete</span>
                </button>
                <button type="button" class="rounded-btn btn-yellow" v-on:click="editCategory()">
                    <span class="material-icons">edit</span>
                </button>
            </div>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/dishes/categories/' + editId" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnDishesCategories();">
            <editDishesCategoriesModalContent v-if="showEditDishesCategoriesModalContent" :categoryid="editId" @savedContent="closeModalFunction(); returnDishesCategories();"></editDishesCategoriesModalContent>
        </modal>
    </div>
</template>
<script>
import gridView from "../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../modal.vue";
import editDishesCategoriesModalContent from "./editDishesCategoriesModalContent.vue";
import api from "../../configs/api";
import $ from 'jquery';

export default {
    name: "ingredientsConfig",
    mixins: [globalMethods],
    data() {
        return {
            dishes_categories: [],
            gridOptions: [],
            selectedRow: null,
            showEditDishesCategoriesModalContent: false,
            filters: [],
            ingredients_categories: []
        }
    },
    methods: {
        search: function () {
            let data = $("#filter-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            this.filters = data;
            this.returnDishesCategories();
        },
        deleteCategory: function () {
            this.showModalFunction("Excluir categoria", "Excluir", "Cancelar");
            this.descelectRows();
        },
        createNewCategory: function () {
            this.showModalFunction("Cadastrar categoria", "Cadastrar", "Cancelar");
            this.showEditDishesCategoriesModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        editCategory: function () {
            this.showModalFunction("Editar categoria", "Salvar", "Cancelar");
            this.showEditDishesCategoriesModalContent = true;
        },
        returnDishesCategories: function () {
            let self = this;

            let data = {
                filters: self.filters
            }

            api.post("/dishes/categories", data).then((response) => {
                self.dishes_categories = response.data.returnObj.dishes_categories;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnDishesCategories();
    },
    components: {
        gridView,
        editDishesCategoriesModalContent,
        modal
    }
}
</script>
<style scoped>
</style>