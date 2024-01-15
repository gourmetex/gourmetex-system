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
            dishes: [],
            gridOptions: []
        }
    },
    methods: {
        resetModalContents: function () {
            this.showEditOrderModalContent = false;
        }, 
        cancelDish: function () {
            this.resetModalContents();
            this.showModalFunction("Cancelar pedido", "Cancelar", "Cancelar");
            this.showEditOrderModalContent = true;
            this.descelectRows();
        },
        finishDish: function () {
            this.resetModalContents();
            this.showModalFunction("Adicionar pedido", "Adicionar", "Cancelar");
            this.showEditOrderModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        returnDishes: function () {
            let self = this;

            api.get("/orders").then((response) => {
                self.dishes = response.data.returnObj.orders;
                self.gridOptions = response.data.returnObj.labels;
                self.editId = null;
            }).catch((error) => {
                console.log(error);
            })
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