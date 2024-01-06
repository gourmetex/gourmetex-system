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
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/dishes/' + editId" :modalbutton2="modalButton2" @closeModal="closeModalFunction(); returnOrders();">
            <editOrderModalContent v-if="showEditOrderModalContent" :dishid="editId" @savedContent="closeModalFunction(); returnOrders();"></editOrderModalContent>
        </modal>
    </div>
</template>
<script>
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
            showEditOrderModalContent: false
        }
    },
    methods: {
        resetModalContents: function () {
            this.showEditOrderModalContent = false;
        }, 
        addOrder: function () {
            this.resetModalContents();
            this.showModalFunction("Adicionar pedido", "Adicionar", "Cancelar");
            this.showEditOrderModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        returnOrders: function () {

        }
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