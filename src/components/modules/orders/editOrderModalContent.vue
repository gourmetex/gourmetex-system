<template>
    <div class="inner-modal-content">
        <form class="add-order" id="informations-form" @submit.prevent="saveOrder()">
            <input type="hidden" id="submit_type" value="save">
            <div class="form-group-horizontal inputs-50">
                <div class="form-group">
                    <label for="mesa">Mesa vinculada</label>
                    <input type="number" name="mesa" v-model="order.mesa">
                </div>
                <div class="form-group">
                    <label for="id_cliente">Nome do cliente</label>
                    <ajaxAutoComplete @select="setCustomer($event)" ajaxtype="clientes" :entityid="this.order.id_cliente" :entityname="this.order.nome_cliente" :required="true" />
                </div>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
        <div class="order-dishes-container">
            <h3>Itens do pedido</h3>
            <div class="modal-edit-grid">
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
        <div class="order-submit-informations">
            <div class="payment">
                <div class="payment-inner">
                    <button class="btn btn-primary" v-on:click="openPaymentModal()">Pagamento</button>
                    <div class="payment-list">
                        <h3>Pix: {{ pix_payment }}</h3>
                        <h3>Cartão: {{ card_payment }}</h3>
                        <h3>Dinheiro: {{ cash_payment }}</h3>
                    </div>
                    <div class="payment-difference">
                        <h3>Desconto: {{ total_desconto }}</h3>
                        <h3 class="font-bold">Restante: {{ difference }}</h3>
                        <h3 class="font-bold" v-if="have_delivery_module">Entrega: {{ delivery_amount }}</h3>
                    </div>
                </div>
                <h2 class="order-total">{{ order.total }}</h2>
            </div>
            <div class="delivery" v-if="have_delivery_module">
                <button class="btn btn-blue">Entrega</button>
                <div class="delivery-content">
                    <div class="delivery-texts">
                        <h3>Rua Brasholanda, 556 - Weissópolis, Pinhais</h3>
                        <h3>Cep: 86930-000</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="small-modal" id="modal-dishes">
            <form class="add-dish" id="informations-form" @submit.prevent="submitAddDish()">
                <div class="form-group">
                    <label for="item">Item</label>
                    <select name="item" id="item" required>
                        <option value="">"Selecione um item"</option>
                        <option :value="item.id[1]" v-for="(item, index) in dishes_list" :key="index">{{ item.nome[1] }} {{ item.disponivel[1] != "Sim" ? "(Indisponível)" : "" }}</option>
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
        <div class="small-modal" id="modal-payment">
            <form class="add-payment" id="informations-form" @submit.prevent="submitAddPayment()">
                <div class="form-group">
                    <label for="metodo_pagamento">Método de pagamento</label>
                    <select name="metodo_pagamento" id="metodo_pagamento" required>
                        <option value="">"Selecione um item"</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="cartao">Cartão</option>
                        <option value="pix">Pix</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="valor_pago">Valor pago</label>
                    <input type="text" name="valor_pago" id="quantidade" v-model="amount_payed" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Adicionar</button>
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
import ajaxAutoComplete from "../../ajaxAutoComplete.vue";

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
                        "Valor do item",
                        "Status"
                    ]
                },
                total: "R$ 0,00",
                nome_cliente: "",
                id_cliente: "",
                cep_entrega: null
            },
            order_dishes: [],
            dishes_list: [],
            selected_dish: [],
            quantity: null,
            order_total: null,
            observations: "",
            have_delivery_module: false,
            delivery_amount: "R$ 0",
            card_payment: "R$ 0",
            cash_payment: "R$ 0",
            pix_payment: "R$ 0",
            amount_payed: "R$ 0",
            accumulatedQuantity: 0,
            cliente_nome: null,
            cliente_id: null,
            cliente_desconto: 0,
            total_desconto: "R$ 0"
        }
    },
    computed: {
        total_amout() {
            let total = (this.formatDecimalValues(this.card_payment) + this.formatDecimalValues(this.cash_payment) + this.formatDecimalValues(this.pix_payment));
            return total;
        },
        difference() {
            let order_total = this.formatDecimalValues(this.order.total);
            let difference = order_total - this.total_amout;
            return this.formatCurrency(difference);
        }
    },
    watch: {
        order_total: function () {
            this.calculateOrderTotal();
        }
    },
    methods: {
        calculateOrderTotal: function () {
            let total = this.order_total;
            let desconto = ((parseInt(this.cliente_desconto) / 100) * total).toFixed(2);
            let totalWithDiscount = total - desconto;

            this.total_desconto = this.formatCurrency(desconto);
            this.order.total = this.formatCurrency(totalWithDiscount);
        },
        setCustomer: function (event) {
            this.cliente_desconto = event.porcentagem_desconto != undefined && event.porcentagem_desconto != "" ? event.porcentagem_desconto.replace("%", "") : 0;
            this.cliente_nome = event.nome;
            this.cliente_id = event.id;
            this.calculateOrderTotal();
        },
        openPaymentModal: function () {
            this.openSmallModal("#modal-payment");
        },
        addDish: function () {
            this.openSmallModal("#modal-dishes");
        },
        excludeDish: function () {
            let self = this;
            
            let excludedDish = self.order.dishes.dishes.find(obj => obj.id[1] == self.editId);

            self.order.dishes.dishes = self.order.dishes.dishes.filter(obj => obj.id[1] !== self.editId);
            self.order_dishes = self.order_dishes.filter(obj => obj.id !== self.editId);
            let item_value = (this.formatDecimalValues(excludedDish.preco[1]) * parseFloat(excludedDish.quantidade[1]));

            this.order_total -= item_value;

            this.closeSmallModal();
        },
        fillOrderDishes: function () {
            for (let i = 0; i < this.order.dishes.dishes.length; i++) {
                let currentDish = this.order.dishes.dishes[i];
                let newDish = {
                    id: currentDish.id[1],
                    quantidade: currentDish.quantidade[1],
                    observacoes: currentDish.observacoes[1]
                }

                this.order_dishes.push(newDish);
            }
        },
        submitAddDish: function () {
            this.selectThisDish();
            this.resetResponse();
            
            if (this.quantity == 0 || this.selected_dish.disponivel[1] != "Sim") {
                this.disposeSelectedDishAndCloseSmallModal();
                return;
            }

            let promises = [];

            let newDishGrid = {
                id: this.selected_dish.id,
                nome: this.selected_dish.nome,
                quantidade: ["text", this.quantity, ""],
                observacoes: ["text", this.observations, ""],
                preco: this.selected_dish.preco,
                status: ["text", "Preparando", ""]
            }

            let newDish = {
                id: this.selected_dish.id[1],
                quantidade: this.quantity,
                observacoes: this.observations
            }

            let selectedDishHaveInGrid = this.order.dishes.dishes.some(obj => obj.id[1] == this.selected_dish.id[1]);

            let accumulatedQuantity = this.quantity;

            if (this.order.dishes.dishes.length != 0 && selectedDishHaveInGrid) {
                this.order.dishes.dishes.map(obj => {
                    if (obj.id[1] == this.selected_dish.id[1]) {
                        accumulatedQuantity = (parseInt(obj.quantidade[1]) + parseInt(this.quantity)).toString();
                    }
                })
            }

            let data = {
                id: this.selected_dish.id[1],
                quantidade: accumulatedQuantity
            }

            promises.push(
                api.post("/dishes/quantity_avalilable", data)
            )

            Promise.all(promises).then(() => {
                if (this.order.dishes.dishes.length == 0 || !selectedDishHaveInGrid) {
                    this.order.dishes.dishes.push(newDishGrid);
                    this.order_dishes.push(newDish);
                } else {
                    this.order.dishes.dishes.map(obj => {
                        if (obj.id[1] == this.selected_dish.id[1]) {
                            obj.quantidade[1] = accumulatedQuantity;
                        }
                    })

                    this.order.dishes.dishes.push({});
                    this.order.dishes.dishes.pop();

                    this.order_dishes.map(obj => {
                        if (obj.id == this.selected_dish.id[1]) {
                            obj.quantidade = parseInt(obj.quantidade) + parseInt(this.quantity);
                        }
                    })
                }

                let total_value = (this.formatDecimalValues(newDishGrid.preco[1]) * parseFloat(this.quantity));
                this.order_total += total_value;
            }).catch((error) => {
                this.setResponse(error.response.data, "error");
            }).then(() => {
                this.disposeSelectedDishAndCloseSmallModal();
            })
        },
        disposeSelectedDishAndCloseSmallModal: function () {
            this.selected_dish = {};
            this.quantity = null;

            this.closeSmallModal();
        },  
        submitAddPayment: function () {
            let metodoPagamento = $("#metodo_pagamento").val();

            switch (metodoPagamento) {
                case "dinheiro": 
                    this.cash_payment = this.amount_payed;
                    break;
                case "cartao":
                    this.card_payment = this.amount_payed;
                    break;
                case "pix":
                    this.pix_payment = this.amount_payed;
                    break;
            }
            this.amount_payed = "R$ 0";
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

            this.resetResponse();

            if (this.order.status == "Cancelado" || this.order.status == "Finalizado") {
                self.$emit("savedContent", true);
                return;
            }

            if (this.order_dishes.length == 0) {
                this.setResponse("O pedido não pode estar vazio", "error");
                return;
            }

            if ($("#submit_type").val() == "finish" && this.formatDecimalValues(this.difference) != 0) {
                this.setResponse("O pedido possui valor em aberto", "error");
                return;
            }

            if ($(".ajax-autocomplete").attr("invalid") == "true") {
                this.setResponse("Campo cliente não pode ser vazio", "error");7
                return;
            }

            self.savingOrder = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            data["pratos"] = self.order_dishes;
            data["pagamento_pix"] = this.pix_payment;
            data["pagamento_cartao"] = this.card_payment;
            data["pagamento_dinheiro"] = this.cash_payment;
            data["cep_entrega"] = this.order.cep_entrega;
            data["save_type"] = $("#submit_type").val();
            data["cliente_nome"] = this.cliente_nome != null ? this.cliente_nome : $("#ajax-autocomplete-input").val();
            data["cliente_id"] = this.cliente_id;

            let path = "new_order";

            if (self.orderid != null) {
                path = "edit_order/" + self.orderid;
            }

            api.post("/orders/" + path, data).then(() => {
                self.$emit("savedContent", true);
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                self.savingOrder = false;
            })
        },
        returnAllDishes: function () {
            let self = this;

            api.get("/dishes").then((response) => {
                self.dishes_list = response.data.returnObj.dishes;
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
                self.pix_payment = self.formatCurrency(self.order.pagamento_pix);
                self.card_payment = self.formatCurrency(self.order.pagamento_cartao);
                self.cash_payment = self.formatCurrency(self.order.pagamento_dinheiro);
                self.cliente_nome = self.order.nome_cliente;
                self.cliente_id = self.order.id_cliente;
                self.cliente_desconto = self.order.porcentagem_desconto;
                self.fillOrderDishes();
                self.calculateOrderTotal();
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
        gridView,
        ajaxAutoComplete
    }
}
</script>
<style scoped>
.payment, .payment-inner, .delivery {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.delivery, .payment-inner {
    justify-content: flex-start;
}

.modal-body .custom-grid-container {
    max-height: 160px;
}
.delivery-content, .payment-list, .payment-difference {
    margin: 0 var(--space-5);
}
</style>