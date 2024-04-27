<template>
    <div class="kitchen-component">
        <div class="page-title">
            <h1>Fila da cozinha</h1>
        </div>  
        <actionButtons add_text="FINALIZAR PRATO" exclude_text="CANCELAR PRATO" :disabledbuttons="disabledButtons" @add="finishDish()" @exclude="cancelDish()" />
        <div class="dishes-container">
            <gridView :gridoptions="gridOptions" :griddata="orders" @dataclick="selectRow($event)"></gridView>
        </div>
    </div>
</template>
<script>
import api from "../../../configs/api";
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";

export default {
    name: "kitchenComponent",
    mixins: [globalMethods],
    data() {
        return {
            orders: [],
            gridOptions: []
        }
    },
    methods: {
        cancelDish: function () {
            let self = this;
            
            api.delete("/kitchen/orders/" + self.editId).then(() => {
                self.returnDishes();
                self.editId = null;
            }).catch((error) => {
                console.log(error);
            })
        },
        finishDish: function () {
            let self = this;

            api.post("/kitchen/orders/" + self.editId).then(() => {
                self.returnDishes();
                self.editId = null;
            }).catch((error) => {
                console.log(error);
            })
        },
        returnDishes: function () {
            let self = this;

            api.get("/kitchen/orders").then((response) => {
                self.orders = response.data.returnObj.orders;
                self.gridOptions = response.data.returnObj.labels;
                self.reorganizeDishesObservations();
                self.editId = null;
            }).catch((error) => {
                console.log(error);
            })
        },
        reorganizeDishesObservations: function () {
            for (let i = 0; i < this.orders.length; i++) {
                this.orders[i].observacoes[1] = this.groupObservations(this.orders[i].observacoes[1]);
            }
        }
    },
    mounted: function () {
        this.returnDishes();
        this.disableActionsButtons(true, true, true);
    },
    components: {
        actionButtons,
        gridView
    }
}
</script>
<style scoped>
</style>