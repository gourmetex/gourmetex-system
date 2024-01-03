<template>
    <div class="add-dish-modal-content">
        <form class="add-dish form-horizontal" id="informations-form" @submit.prevent="saveDish()">
            <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" name="nome" placeholder="Ex. Hambúrguer" required>
            </div>
            <div class="form-group">
                <label for="categoria">Categoria</label>
                <select id="categoria" name="categoria" required>
                    <option value="">Qualquer</option>
                    <option v-for="(category, index) in ingredients_categories" :key="index" :value="category.id">{{ category.nome }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="preco">Preço</label>
                <input type="text" name="preco" id="preco" @input="inputMoneyCheck($event)" required>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
        <gridView :gridoptions="gridOptions" :griddata="dish_ingredients" @dataclick="selectRow($event)"></gridView>
        <div class="edit-buttons">
            <button type="button" class="rounded-btn btn-primary" v-on:click="addIngredient()">
                <span class="material-icons">add</span>
            </button>
            <div class="dynamic-edit-buttons">
                <button type="button" class="rounded-btn btn-red" v-on:click="deleteIngredient()">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
        <div class="small-modal">
            <form class="add-dish" id="informations-form" @submit.prevent="submitAddIngredient()">
                <div class="form-group">
                    <label for="ingredient">Item</label>
                    <select id="ingredient" name="ingredient">
                        <option value="">Qualquer</option>
                        <option v-for="(item, index) in ingredients" :key="index" :value="item.id[1]">{{ item.nome[1] }}</option>
                    </select>
                </div>
                <div class="radio-group">
                    <label for="quantity">Quantidade {{ selected_ingredient_measure_unit != "" ? `(${selected_ingredient_measure_unit})` : "" }}</label>
                    <input type="text" name="quantity" id="quantity" required v-model="quantity" @keypress="quantity = formatDecimalValues(quantity)">
                </div>
                <button type="submit" class="btn btn-primary w-100">Salvar</button>
            </form>
        </div>
    </div>
</template>
<script>
import api from "../../../configs/api";
import { globalMethods } from "@/js/globalMethods";
import $ from 'jquery';
import gridView from "../../gridView.vue";

export default {
    name: "addIngredientQuantityModalContent",
    mixins: [globalMethods],
    data() {
        return {
            quantity: "",
            savingDish: false,
            ingredients_categories: [],
            gridOptions: [
                "Nome",
                "Quantidade"
            ],
            dishes: [],
            editId: [],
            dish_ingredients: [],
            ingredients: [],
            selected_ingredient_measure_unit: "",
            selected_ingredient: {}
        }
    },
    methods: {
        submitAddIngredient: function () {
            this.selectThisIngredient();

            let newIngredient = {
                nome: this.selected_ingredient.nome,
                quantidade: ["text", this.quantity + " " + this.selected_ingredient_measure_unit, ""]
            }

            if (this.dish_ingredients.length == 0 || !this.dish_ingredients.some(obj => obj.nome == this.selected_ingredient.nome)) {
                this.dish_ingredients.push(newIngredient);
                this.selected_ingredient = {};
                this.selected_ingredient_measure_unit = "";
                this.quantity = "";
            }

            this.closeSmallModal();
        },
        selectThisIngredient: function () {
            let value = $("#ingredient").val();
            let ingredient = this.ingredients.find(obj => obj.id[1] == value);

            if (ingredient != undefined && ingredient != null) {
                this.selected_ingredient = ingredient;
                this.selected_ingredient_measure_unit = ingredient.unidade_medida[1];
            } else {
                this.selected_ingredient = {};
                this.selected_ingredient_measure_unit = "";
            }
        },
        addIngredient: function () {
            this.openSmallModal();
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
        saveDish: function () {
            let self = this;

            if (self.savingStock) return;

            self.savingStock = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            api.post("/stock/add_ingredient_quantity", data).then(() => {
                self.$emit("savedContent", true);
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                self.savingRole = false;
            })
        },
        returnIngredientsCategories: function () {
            let self = this;

            api.get("/dishes/ingredient_categories").then((response) => {
                self.ingredients_categories = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        },
        returnAllIngredients: function () {
            let self = this;

            api.post("/dishes/ingredients").then((response) => {
                self.ingredients = response.data.returnObj.ingredients;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnIngredientsCategories();
        this.returnAllIngredients();
    },
    components: {
        gridView
    }
}
</script>
<style scoped>
</style>