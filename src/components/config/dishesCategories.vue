<template>
    <div class="ingredients-config">
        <div class="filters">
            <form id="filter-form" @submit.prevent="search()">
                <div class="filter-field">
                    <label for="categoria">Nome da categoria</label>
                    <input type="text" name="categoria" id="categoria" placeholder="Ex. Lanches">
                </div>
                <button type="submit" class="btn btn-primary">Buscar</button>
            </form>
        </div>
        <gridView :gridoptions="gridOptions" :griddata="dishesCategories" :selected="selectedRow" @dataclick="selectRow($event)"></gridView>
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
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/dishes/ingredients/' + editId" :modalbutton2="modalButton2" @closeModal="closeModalFunction(); returnIngredientsCategories();">
            <editDishesCategoriesModalContent v-if="showEditDishesCategoriesModalContent" :categoryid="editId" @savedContent="closeModalFunction(); returnIngredientsCategories();"></editDishesCategoriesModalContent>
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
            dishesCategories: [],
            gridOptions: [],
            selectedRow: null,
            editId: null,
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
            this.returnAllIngredients();
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
        selectRow: function (event) {
            switch (event[2]) {
                case "select_row":
                    this.showEditButtons();
                    this.editId = event[1];
                    this.selectGridRow(event[3]);
                    break;
            }
        },
        returnIngredientsCategories: function () {
            let self = this;

            api.get("/dishes/ingredient_categories").then((response) => {
                self.ingredients_categories = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnIngredientsCategories();
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