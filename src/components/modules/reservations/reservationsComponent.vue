<template>
    <div class="reservations-component">
        <div class="page-title">
            <h1>Reservas</h1>
        </div> 
        <actionButtons add_text="ADICIONAR RESERVA" exclude_text="EXCLUIR RESERVA" edit_text="EDITAR RESERVA" :disabledbuttons="disabledButtons" @add="createReservation()" @exclude="deleteReservation()" @edit="editReservation()" />
        <div class="reservations-container">
            <gridView :gridoptions="gridOptions" :griddata="reservationsList" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/orders/' + editId" :modalbutton2="modalButton2" :modalButton3="modalButton3" @closeModal="closeModalFunction(); returnReservations();">
            <editReservationModalContent v-if="showEditReservationModalContent" :reservationid="editId" @savedContent="closeModalFunction(); returnReservations();"></editReservationModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import editReservationModalContent from "./editReservationModalContent.vue";
import modal from "../../modal.vue";
import api from "../../../configs/api";

export default {
    name: "reservationsComponent",
    mixins: [globalMethods],
    data() {
        return {
            gridOptions: [],
            reservationsList: [],
            showEditReservationModalContent: false
        }
    },
    methods: {
        resetModalContents: function () {
            this.showEditReservationModalContent = false;
        }, 
        createReservation: function () {
            this.resetModalContents();
            this.showModalFunction("Adicionar reserva", "Adicionar", "Cancelar");
            this.showEditReservationModalContent = true;
            this.editId = null;
        },
        deleteReservation: function () {
            this.resetModalContents();
            this.showModalFunction("Excluir reserva", "Excluir", "Cancelar");
        },
        editReservation: function () {
            this.resetModalContents();
            this.showModalFunction("Editar reserva", "Salvar", "Cancelar");
            this.showEditReservationModalContent = true;
        },
        returnReservations: function () {
            let self = this;

            api.get("/reservations").then((response) => {
                self.reservationsList = response.data.returnObj.reservationsList;
                self.gridOptions = response.data.returnObj.labels;
            })
        }
    },
    components: {
        actionButtons,
        gridView,
        modal,
        editReservationModalContent
    }
}
</script>
<style scoped>
</style>