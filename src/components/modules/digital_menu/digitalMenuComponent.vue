<template>
    <div class="digital-menu">
        <div class="page-title">
            <h1>Menu digital</h1>
        </div>  
        <actionButtons add_text="ABRIR MESA" exclude_text="FECHAR MESA" edit_text="EDITAR MESA" :disabledbuttons="disabledButtons" @add="openTable()" @exclude="closeTable()" @edit="editTable()" />
        <div class="digital-menu-container" v-if="!reloadTable">
            <gridView :gridoptions="gridOptions" :griddata="digitalMenu" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/orders/' + editId" :modalbutton2="modalButton2" :modalButton3="modalButton3" @closeModal="closeModalFunction(); returnMenuDigital();">
            <editOrderModalContent v-if="showEditOrderModalContent" :payment="payment" :orderid="editId" @savedContent="closeModalFunction(); returnMenuDigital();"></editOrderModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import api from "../../../configs/api";
import editOrderModalContent from "../orders/editOrderModalContent.vue";
import modal from "../../modal.vue";

export default {
    name: "digitalMenuComponent",
    mixins: [globalMethods],
    data() {
        return {
            gridOptions: [],
            digitalMenu: [],
            showEditOrderModalContent: false,
            payment: false,
            reloadTable: false
        }
    },
    methods: {
        resetModalContents: function () {
            this.showEditOrderModalContent = false;
        }, 
        openTable: function () {
            this.resetModalContents();
            this.showModalFunction("Abrir mesa", "Abrir", "Cancelar");
            this.showEditOrderModalContent = true;
            this.editId = null;
        },
        closeTable: function () {
            this.payment = true;
            this.resetModalContents();
            this.showModalFunction("Fechar mesa", "Salvar", "Cancelar", "Finalizar");
            this.showEditOrderModalContent = true;
        },
        editTable: function () {
            this.resetModalContents();
            this.showModalFunction("Editar mesa", "Salvar", "Cancelar");
            this.showEditOrderModalContent = true;
        },
        returnMenuDigital: function () {
            let self = this;

            this.reloadTable = true;

            setTimeout(() => {
                this.reloadTable = false;
            }, 1)

            api.get("/digital_menu").then((response) => {
                self.digitalMenu = response.data.returnObj.digital_menu;
                self.gridOptions = response.data.returnObj.labels;
            })
        }
    },
    mounted: function () {
        this.returnMenuDigital();
    },
    components: {
        actionButtons,
        gridView,
        editOrderModalContent,
        modal
    }
}
</script>
<style scoped>
</style>