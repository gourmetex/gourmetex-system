<template>
    <div class="inner-modal-content">
        <form class="add-dish" id="informations-form" @submit.prevent="saveDish()">
            <div class="form-group-horizontal">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" name="nome" placeholder="Ex. X-tudo" v-model="dish.nome" required>
                </div>
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select id="categoria" name="categoria" v-model="dish.categoria" required>
                        <option value="">Qualquer</option>
                        <option v-for="(category, index) in dishes_categories" :key="index" :value="category.id[1]">{{ category.nome[1] }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="preco">Preço</label>
                    <input type="text" name="preco" id="preco" v-model="dish.preco" @input="inputMoneyCheck($event)" required>
                </div>
            </div>
            <div class="form-group">
                <label for="descricao">Descrição</label>
                <input type="text" name="descricao" id="descricao" v-model="dish.descricao" maxlength="100" placeholder="Ex. Prato vegano" required>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
        <div class="modal-edit-grid">
            <gridView :gridoptions="dish.ingredientes.labels" :griddata="dish.ingredientes.ingredientes" @dataclick="selectRow($event)"></gridView>
            <div class="edit-buttons buttons-vertical">
                <button type="button" class="rounded-btn btn-primary" v-on:click="addIngredient()">
                    <span class="material-icons">add</span>
                </button>
                <div class="dynamic-edit-buttons">
                    <button type="button" class="rounded-btn btn-red" v-on:click="deleteIngredient()">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="small-modal">
            <form class="add-dish" id="informations-form" @submit.prevent="submitAddIngredient()">
                <div class="form-group">
                    <label for="ingredient">Item</label>
                    <select id="ingredient" name="ingredient" @change="selectThisIngredient()" required>
                        <option value="">Qualquer</option>
                        <option v-for="(item, index) in ingredients" :key="index" :value="item.id[1]">{{ item.nome[1] }}</option>
                    </select>
                </div>
                <div class="radio-group">
                    <label for="quantity">Quantidade {{ selected_ingredient_measure_unit != "" ? `(${selected_ingredient_measure_unit})` : "" }}</label>
                    <input type="text" name="quantity" id="quantity" required v-model="quantity" @keypress="formatDecimalValues(quantity)">
                </div>
                <button type="submit" class="btn btn-primary w-100">Salvar</button>
            </form>
        </div>
        <div class="small-modal-wrapper" v-on:click="closeSmallModal()"></div>
        <p class="response big">{{ response }}</p>
    </div>
</template>
<script>
import api from "../../../configs/api";
import { globalMethods } from "@/js/globalMethods";
import $ from 'jquery';
import gridView from "../../gridView.vue";

export default {
    name: "editDishModalContent",
    mixins: [globalMethods],
    props: ["dishid"],
    data() {
        return {
            quantity: "",
            savingDish: false,
            dishes_categories: [],
            dishes: [],
            ingredients: [],
            selected_ingredient_measure_unit: "",
            selected_ingredient: {},
            ingredients_list: [],
            dish: {
                nome: "",
                categoria: null,
                preco: null,
                ingredientes: {
                    ingredientes: [],
                    labels: [
                        "Id",
                        "Nome",
                        "Quantidade"
                    ]
                }
            }
        }
    },
    methods: {
        deleteIngredient: function () {
            let self = this;
            
            self.dish.ingredientes.ingredientes = self.dish.ingredientes.ingredientes.filter(obj => obj.id_ingrediente[1] !== self.editId);
            self.ingredients_list = self.ingredients_list.filter(obj => obj.id !== self.editId);
        },
        submitAddIngredient: function () {
            this.selectThisIngredient();

            let newIngredientGrid = {
                id_ingrediente: this.selected_ingredient.id,
                nome: this.selected_ingredient.nome,
                quantidade: ["text", this.quantity + " " + this.selected_ingredient_measure_unit, ""]
            }

            let newIngredient = {
                id: this.selected_ingredient.id[1],
                quantidade: this.quantity
            }

            if (this.dish.ingredientes.ingredientes.length == 0 || !this.dish.ingredientes.ingredientes.some(obj => obj.id_ingrediente[1] == this.selected_ingredient.id[1])) {
                this.dish.ingredientes.ingredientes.push(newIngredientGrid);
                this.ingredients_list.push(newIngredient);
                this.selected_ingredient = {};
                this.selected_ingredient_measure_unit = "";
                this.quantity = "";
            }

            this.closeSmallModal();
        },
        fillSubmitIngredients: function () {
            for (let i = 0; i < this.dish.ingredientes.ingredientes.length; i++) {
                let currentIngredient = this.dish.ingredientes.ingredientes[i];
                let newIngredient = {
                    id: currentIngredient.id_ingrediente[1],
                    quantidade: currentIngredient.quantidade[1]
                }

                this.ingredients_list.push(newIngredient);
            }
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
        saveDish: function () {
            let self = this;
            if (self.savingDish) return;

            if (this.ingredients_list.length == 0) {
                this.setResponse("O prato não pode estar vazio", "error");
                $("#modal-submit-button").removeAttr("disabled").removeClass("btn-loading");
                return;
            }

            self.savingDish = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            data["ingredientes"] = self.ingredients_list;
            let path = "create_dish";

            if (self.dishid != null) {
                path = "edit_dish/" + self.dishid;
            }
            
            api.post("/dishes/" + path, data).then(() => {
                self.$emit("savedContent", true);
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                self.savingDish = false;
            })
        },
        returnDish: function () {
            let self = this;

            if (self.dishid == null) {
                self.dish.ingredientes.ingredientes = [];
                return;
            } 

            api.get("/dishes/" + self.dishid).then((response) => {
                self.dish = response.data.returnObj;
                self.fillSubmitIngredients();
            }).catch((error) => {
                console.log(error);
            })
        },
        returnDishesCategories: function () {
            let self = this;

            api.post("/dishes/categories").then((response) => {
                self.dishes_categories = response.data.returnObj.dishes_categories;
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
        this.returnAllIngredients();
        this.returnDishesCategories();
        this.returnDish();        
    },
    components: {
        gridView
    }
}
</script>
<style scoped>
</style>