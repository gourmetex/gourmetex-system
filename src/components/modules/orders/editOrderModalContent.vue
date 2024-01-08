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
                <div class="edit-buttons buttons-vertical">
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
            <form class="add-dish" id="informations-form" @submit.prevent="submitAddDish()">
                <div class="form-group">
                    <label for="item">Item</label>
                    <select name="item" id="item" required>
                        <option value="">"Selecione um item"</option>
                        <option :value="item.id[1]" v-for="(item, index) in dishes_list" :key="index">{{ item.nome[1] }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantidade">Quantidade</label>
                    <input type="number" name="quantidade" v-model="quantity" id="quantidade" required>
                </div>
                <div class="form-group">
                    <label for="observacoes">Observações</label>
                    <input type="text" name="observacoes" v-model="observations" id="observacoes">
                </div>
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
                total: "R$ 0,00"
            },
            order_dishes: [],
            dishes_list: [],
            selected_dish: [],
            quantity: null,
            order_total: null,
            observations: ""
        }
    },
    watch: {
        order_total: function () {
            this.order.total = this.formatCurrency(this.order_total);
        }
    },
    methods: {
        addDish: function () {
            this.openSmallModal();
            this.descelectRows();
        },
        excludeDish: function () {
            let self = this;
            
            let excludedDish = self.order.dishes.dishes.find(obj => obj.id[1] == self.editId);

            self.order.dishes.dishes = self.order.dishes.dishes.filter(obj => obj.id[1] !== self.editId);
            self.order_dishes = self.order_dishes.filter(obj => obj.id !== self.editId);
            let item_value = (this.formatDecimalValues(excludedDish.preco[1]) * parseFloat(excludedDish.quantidade[1]));

            this.order_total -= item_value;

            this.closeSmallModal();
            this.descelectRows();
        },
        submitAddDish: function () {
            this.selectThisDish();

            let newDishGrid = {
                id: this.selected_dish.id,
                nome: this.selected_dish.nome,
                quantidade: ["text", this.quantity, ""],
                observacoes: ["text", this.observations, ""],
                preco: this.selected_dish.preco
            }

            let newDish = {
                id: this.selected_dish.id[1],
                quantidade: this.quantity,
                observacoes: this.observations
            }

            if (this.order.dishes.dishes.length == 0) {
                this.order.dishes.dishes.push(newDishGrid);
                this.order_dishes.push(newDish);
            } else {
                this.order.dishes.dishes.map(obj => {
                    if (obj.id[1] == this.selected_dish.id[1]) {
                        obj.quantidade[1] = (parseInt(obj.quantidade[1]) + parseInt(this.quantity)).toString();
                    }
                })

                this.order.dishes.dishes.push({});
                this.order.dishes.dishes.pop();

                this.order_dishes.map(obj => {
                    if (obj.id == this.selected_dish.id[1]) {
                        obj.quantidade = this.quantity;
                    }
                })
            }

            let total_value = (this.formatDecimalValues(newDishGrid.preco[1]) * parseFloat(this.quantity));
            this.order_total += total_value;
            this.selected_dish = {};
            this.quantity = null;

            this.closeSmallModal();
        },
        selectThisDish: function () {
            let value = $("#item").val();
            let dish = this.dishes_list.find(obj => obj.id[1] == value);

            if (dish != undefined && dish != null) {
                this.selected_dish = dish;
            } else {
                this.selected_dish = {};
            }
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

            data["pratos"] = self.order_dishes;
            let path = "new_order";

            if (self.orderid != null) {
                path = "edit_order/" + self.orderid;
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
        returnAllDishes: function () {
            let self = this;

            api.get("/dishes").then((response) => {
                self.dishes_list = response.data.returnObj.dishes;
                console.log(self.dishes_list)
            }).catch((error) => {
                console.log(error);
            })
        },
        returnOrder: function () {
            let self = this;

            if (self.orderid == null) {
                self.order.dishes.dishes = [];
                return;
            } 

            api.get("/orders/" + self.orderid).then((response) => {
                self.order = response.data.returnObj;
                self.order_total = self.formatDecimalValues(self.order.total);
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnAllDishes();
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