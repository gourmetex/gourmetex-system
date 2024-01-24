<template>
    <div class="customers-component">
        <div class="page-title">
            <h1>CLIENTES</h1>
        </div>  
        <actionButtons add_text="ADICIONAR CLIENTE" exclude_text="EXCLUIR CLIENTE" edit_text="EDITAR CLIENTE" :disabledbuttons="disabledButtons" @add="addCustomer()" @exclude="excludeCustomer()" @edit="editCustomer()" />
        <div class="dishes-container">
            <div class="filter-container-header">
                <h2>Lista de clientes</h2>
                <div class="filters">
                    <form id="filter-form" @submit.prevent="search()">
                        <div class="filter-field">
                            <label for="nome">Nome do cliente</label>
                            <input type="text" name="nome" id="nome" placeholder="Ex. João">
                        </div>
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="customers" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/customers/' + editId" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnCustomers();">
            <editCustomerModalContent v-if="showEditCustomerModalContent" :customerid="editId" @savedContent="closeModalFunction(); returnCustomers();"></editCustomerModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import editCustomerModalContent from "./editCustomerModalContent.vue";
import api from "../../../configs/api";
import $ from 'jquery';

export default {
    name: "customersComponent",
    mixins: [globalMethods],
    data() {
        return {
            customers: [],
            gridOptions: [],
            showEditCustomerModalContent: false,
            filters: []
        }
    },
    methods: {
        search: function () {
            let data = $("#filter-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            this.filters = data;
            this.returnCustomers();
        },
        resetModalContents: function () {
            this.showEditCustomerModalContent = false;
        },  
        addCustomer: function () {
            this.resetModalContents();
            this.showModalFunction("Adicionar cliente", "Salvar", "Cancelar");
            this.showEditCustomerModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        excludeCustomer: function () {
            this.resetModalContents();
            this.showModalFunction("Excluir cliente", "Excluir", "Cancelar");
            this.descelectRows();
        }, 
        editCustomer: function () {
            this.resetModalContents();
            this.showModalFunction("Editar cliente", "Salvar", "Cancelar");
            this.showEditCustomerModalContent = true;
            this.descelectRows();
        },
        returnCustomers: function () {
            let self = this;

            let data = {
                filters: self.filters
            }

            api.post("/customers", data).then((response) => {
                self.customers = response.data.returnObj.customers;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnCustomers();
        this.disableActionsButtons(false, true, true);
    },
    components: {
        actionButtons,
        gridView,
        modal,
        editCustomerModalContent
    }
}
</script>
<style scoped>
</style>