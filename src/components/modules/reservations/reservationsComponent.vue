<template>
    <div class="reservations-component">
        <div class="page-title">
            <h1>Reservas</h1>
        </div> 
        <actionButtons add_text="ADICIONAR RESERVA" exclude_text="EXCLUIR RESERVA" edit_text="EDITAR RESERVA" :disabledbuttons="disabledButtons" @add="createReservation()" @exclude="deleteReservation()" @edit="editReservation()" />
        <div class="reservations-container">
            <dataTable :dataTable="reservationsList" :rowsPerPage="7" searchText="item">
                <template slot="column-id" slot-scope="props">
                    <p class="clicable text-center" v-on:click="selectRow2($event)">{{ props.item.id }}</p>
                </template>
                <template slot="column-nome" slot-scope="props">
                    <p>{{ props.item.nome }}</p>
                </template>
                <template slot="column-data-e-hora" slot-scope="props">
                    <p>{{ props.item.data_reserva }}</p>
                </template>
                <template slot="column-quantidade-de-pessoas" slot-scope="props">
                    <p class="text-center">{{ props.item.quantidade_pessoas }}</p>
                </template>
                <template slot="column-status" slot-scope="props">
                    <p>{{ props.item.status }}</p>
                </template>
                <template slot="column-tipo" slot-scope="props">
                    <button class="btn btn-primary rounded-btn small" v-on:click="openReservations(props.item.id)" title="Abrir mesa">
                        <span class="material-icons" style="color: var(--white); font-size: var(--fontsize-sm);">open_in_new</span>
                    </button>
                </template>
            </dataTable>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/reservations/delete_reservation' + editId" :modalbutton2="modalButton2" :modalButton3="modalButton3" @closeModal="closeModalFunction(); returnReservations();">
            <editReservationModalContent v-if="showEditReservationModalContent" :reservationid="editId" @savedContent="closeModalFunction(); returnReservations();"></editReservationModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import dataTable from "../../dataTable.vue";
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
        openReservations: function (reservation_id) {
            let self = this;
            api.post("/reservations/open_reservation", { reservation_id: parseInt(reservation_id) }).then(() => {
                self.$router.push("/home/digital_menu");
            })
        },
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
                self.reservationsList = response.data.returnObj;
            })
        }
    },
    mounted: function () {
        this.returnReservations();
        this.disableActionsButtons(false, true, true);
    },
    components: {
        actionButtons,
        dataTable,
        modal,
        editReservationModalContent
    }
}
</script>
<style scoped>
</style>