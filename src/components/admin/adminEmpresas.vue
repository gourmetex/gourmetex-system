<template>
    <div class="admin-empresas">
        <div class="companies-header">
            <h2>Empresas</h2>
            <button type="button" class="btn btn-primary" v-on:click="editCompany()">Cadastrar empresa</button>
        </div>
        
        <div class="empresas-list">
            <gridView :gridoptions="gridOptions" :griddata="companies" @dataclick="selectModal($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :modalbutton2="modalButton2" @closeModal="closeModalFunction()">
            <editCompanyModalContent v-if="showEditCompanieModalContent" :companyid="companyId" @savedContent="closeModalFunction()"></editCompanyModalContent>
        </modal>
    </div>
</template>
<script>
import api from "../../configs/api";
import { globalMethods } from "@/js/globalMethods";
import gridView from "../gridView.vue";
import modal from "../modal.vue";
import editCompanyModalContent from "./editCompanyModalContent.vue";

export default {
    name: "adminEmpresas",
    mixins: [globalMethods],
    data() {
        return {
            companies: [],
            gridOptions: [],
            showEditCompanieModalContent: false,
            companyId: null
        }
    },
    watch: {
        reloadGrid: function () {
            if (this.reloadGrid) {
                this.returnAllCompanies();
            }
        }
    },
    methods: {
        selectModal: function (event) {
            switch (event[2]) {
                case "companie_edit":
                    this.editCompany(event);
                    break;
            }
        },
        editCompany: function (event = [0, 0]) {
            this.showModalFunction("Editar empresa", "Salvar", "Cancelar");
            this.showEditCompanieModalContent = true;
            this.companyId = event[1];
        },
        returnAllCompanies: function () {
            let self = this;

            api.get("/companies/return_all_companies").then((response) => {
                self.companies = response.data.returnObj.companies;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnAllCompanies();
    },
    components: {
        gridView,
        modal,
        editCompanyModalContent
    }
}
</script>
<style scoped>
.companies-header {
    display: flex;
    align-items: center;
}

    .companies-header button {
        margin-left: var(--space-6);
    }
</style>