<template>
    <div class="orders-component">
        <div class="page-title">
            <h1>Pedidos</h1>
        </div>  
        <actionButtons add_text="ADICIONAR PEDIDO" exclude_text="CANCELAR PEDIDO" edit_text="EDITAR PEDIDO" :disabledbuttons="disabledButtons" @add="addOrder()" @exclude="cancelOrder()" @edit="editOrder()" />
        <div class="dishes-container">
            <div class="filter-container-header">
                <h2>Lista de pedidos</h2>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="orders" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/orders/' + editId" :modalbutton2="modalButton2" :modalButton3="modalButton3" @closeModal="closeModalFunction(); returnOrders();">
            <editOrderModalContent v-if="showEditOrderModalContent" :orderid="editId" @savedContent="closeModalFunction(); returnOrders();"></editOrderModalContent>
        </modal>
    </div>
</template>
<script>
import api from "../../../configs/api";
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import editOrderModalContent from "./editOrderModalContent.vue";

export default {
    name: "ordersComponent",
    mixins: [globalMethods],
    data() {
        return {
            orders: [],
            showEditOrderModalContent: false,
            gridOptions: []
        }
    },
    methods: {
        resetModalContents: function () {
            this.showEditOrderModalContent = false;
        }, 
        cancelOrder: function () {
            this.resetModalContents();
            this.showModalFunction("Cancelar pedido", "Cancelar", "Cancelar");
            this.showEditOrderModalContent = true;
            this.descelectRows();
        },
        addOrder: function () {
            this.resetModalContents();
            this.showModalFunction("Adicionar pedido", "Adicionar", "Cancelar");
            this.showEditOrderModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        editOrder: function () {
            this.resetModalContents();
            this.showModalFunction("Editar pedido", "Salvar", "Cancelar", "Finalizar");
            this.showEditOrderModalContent = true;
            this.descelectRows();
        },
        returnOrders: function () {
            let self = this;

            api.get("/orders").then((response) => {
                self.orders = response.data.returnObj.orders;
                self.gridOptions = response.data.returnObj.labels;
                self.editId = null;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnOrders();
        this.disableActionsButtons(false, true, true);
    },
    components: {
        actionButtons,
        gridView,
        modal,
        editOrderModalContent
    }
}
</script>
<style scoped>
</style>