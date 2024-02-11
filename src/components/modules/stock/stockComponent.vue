<template>
    <div class="stock-component">
        <div class="page-title">
            <h1>Estoque</h1>
        </div>  
        <actionButtons add_text="ADICIONAR ITEM" exclude_text="EXCLUIR ITEM" @add="addIngredientQuantity()" @exclude="excludeIngredientQuantity()" />
        <div class="stock-container">
            <div class="filter-container-header">
                <h2>Itens do estoque</h2>
            
                <div class="filters">
                    <form id="filter-form" @submit.prevent="search()">
                        <div class="filter-field">
                            <label for="nome">Nome</label>
                            <input type="text" id="nome" name="ci.nome">
                        </div>
                        <div class="filter-field">
                            <label for="categoria">Categoria</label>
                            <select id="categoria" name="categoria">
                                <option value="">Qualquer</option>
                                <option v-for="(category, index) in ingredients_categories" :key="index" :value="category.nome">{{ category.nome }}</option>
                            </select>
                        </div>
                        <div class="filter-field">
                            <label for="status">Status</label>
                            <select id="status" name="status">
                                <option value="">Qualquer</option>
                                <option value="1">Normal</option>
                                <option value="0">Vazio</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="items" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnStock();">
            <addIngredientQuantityModalContent v-if="showAddIngredientQuantityModalContent" @savedContent="closeModalFunction(); returnStock();"></addIngredientQuantityModalContent>
            <deleteIngredientQuantityModalContent v-if="showDeleteIngredientQuantityModalContent" @savedContent="closeModalFunction(); returnStock();"></deleteIngredientQuantityModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import addIngredientQuantityModalContent from "./addIngredientQuantityModalContent.vue";
import deleteIngredientQuantityModalContent from "./deleteIngredientQuantityModalContent.vue";
import api from "../../../configs/api";
import $ from 'jquery';

export default {
    name: "stockComponent",
    mixins: [globalMethods],
    data() {
        return {
            items: [],
            gridOptions: [],
            filters: [],
            showAddIngredientQuantityModalContent: false,
            showDeleteIngredientQuantityModalContent: false,
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
            this.returnStock();
        },
        resetModalContents: function () {
            this.showAddIngredientQuantityModalContent = false;
            this.showDeleteIngredientQuantityModalContent = false;
        },  
        addIngredientQuantity: function () {
            this.resetModalContents();
            this.showModalFunction("Adicionar quantidade ", "Adicionar", "Cancelar");
            this.showAddIngredientQuantityModalContent = true;
            this.descelectRows();
        },
        excludeIngredientQuantity: function () {
            this.resetModalContents();
            this.showModalFunction("Remover quantidade ", "Remover", "Cancelar");
            this.showDeleteIngredientQuantityModalContent = true;
            this.descelectRows();
        },
        returnIngredientsCategories: function () {
            let self = this;

            api.get("/dishes/ingredient_categories").then((response) => {
                self.ingredients_categories = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        },  
        returnStock: function () {
            let self = this;

            let data = {
                filters: self.filters
            }

            api.post("/stock/return_stock", data).then((response) => {
                self.items = response.data.returnObj.items;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnIngredientsCategories();
        this.returnStock();
    },
    components: {
        actionButtons,
        gridView,
        modal,
        addIngredientQuantityModalContent,
        deleteIngredientQuantityModalContent
    }
}
</script>
<style scoped>
</style>