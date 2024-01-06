<template>
    <div class="add-order-modal-content">
        <form class="add-order" id="informations-form" @submit.prevent="saveOrder()">
            <div class="form-group-horizontal inputs-50">
                <div class="form-group">
                    <label for="mesa">Mesa vinculada</label>
                    <input type="number" name="mesa" v-model="order.mesa">
                </div>
                <div class="form-group">
                    <label for="cliente">Nome do cliente</label>
                    <input type="text" name="cliente" v-model="order.cliente" required>
                </div>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
        <div class="order-dishes-container">
            <h3>Itens do pedido</h3>
            <div class="order-dishes-inner">
                <gridView :gridoptions="order.dishes.labels" :griddata="order.dishes.dishes" @dataclick="selectRow($event)"></gridView>
                <div class="edit-buttons">
                    <button type="button" class="rounded-btn btn-primary" v-on:click="addDish()">
                        <span class="material-icons">add</span>
                    </button>
                    <div class="dynamic-edit-buttons">
                        <button type="button" class="rounded-btn btn-red" v-on:click="excludeDish()">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <h2 class="order-total">{{ order.total }}</h2>
        <div class="small-modal">
            <form class="add-dish" id="informations-form" @submit.prevent="submitAddIngredient()">
                
                <button type="submit" class="btn btn-primary w-100">Salvar</button>
            </form>
        </div>
        <p class="response big">{{ response }}</p>
    </div>
</template>
<script>
import api from "../../../configs/api";
import { globalMethods } from "@/js/globalMethods";
import $ from 'jquery';
import gridView from "../../gridView.vue";

export default {
    name: "editOrderModalContent",
    mixins: [globalMethods],
    props: ["orderid"],
    data() {
        return {
            savingOrder: false,
            order: {
                dishes: {
                    dishes: [],
                    labels: [
                        "Cód. do item",
                        "Nome do item",
                        "Qtd.",
                        "Obs",
                        "Valor do item"
                    ]
                },
                total: "R$ 25,52"
            },
            order_dishes: []
        }
    },
    methods: {
        addDish: function () {
            this.openSmallModal();
        },
        excludeDish: function () {
            this.closeSmallModal();
        },
        saveOrder: function () {
            let self = this;
            if (self.savingOrder) return;

            if (this.order_dishes.length == 0) {
                this.setResponse("O pedido não pode estar vazio", "error");
                $("#modal-submit-button").removeAttr("disabled").removeClass("btn-loading");
                return;
            }
            
            self.savingOrder = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            data["ingredientes"] = self.ingredients_list;
            let path = "create_dish";

            if (self.orderid != null) {
                path = "edit_dish/" + self.orderid;
            }
            
            console.log(path)
            console.log(data)

            /*api.post("/dishes/" + path, data).then(() => {
                self.$emit("savedContent", true);
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                self.savingOrder = false;
            })*/
        },
        returnOrder: function () {
            let self = this;

            if (self.orderid == null) {
                self.order.dishes.dishes = [];
                return;
            } 

            api.get("/dishes/" + self.dishid).then((response) => {
                self.dish = response.data.returnObj;
                self.fillSubmitIngredients();
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnOrder();        
    },
    components: {
        gridView
    }
}
</script>
<style scoped>
.order-dishes-inner {
    display: flex;
    flex-direction: row-reverse;
}

    .order-dishes-inner .edit-buttons {
        margin-right: var(--space-5);;
    }

.add-order-modal-content {
    position: relative;
}
</style>