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
import { globalMethods } from "@/js/globalMethods";
import gridView from "../gridView.vue";
import modal from "../modal.vue";
import editCompanyModalContent from "./editCompanyModalContent.vue";

export default {
    name: "adminEmpresas",
    mixins: [globalMethods],
    data() {
        return {
            companies: [
                {
                    id: ["text", 1, "companie_edit"],
                    name: ["text", "Gourmetech"],
                    active: ["badge", "Sim", "var(--green-2)", "var(--white)"],
                    members: ["text", 2]
                },
                {
                    id: ["text", 2, "companie_edit"],
                    name: ["text", "Barraca do zé"],
                    active: ["badge", "Sim", "var(--green-2)", "var(--white)"],
                    members: ["text", 5]
                },
                {
                    id: ["text", 3, "companie_edit"],
                    name: ["text", "Outback"],
                    active: ["badge", "Não", "var(--red)", "var(--white)"],
                    members: ["text", 450]
                }
            ],
            gridOptions: [
                "Id",
                "Nome",
                "Ativa",
                "Membros"
            ],
            showEditCompanieModalContent: false,
            companyId: null
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
            this.companieId = event[1];
        }
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