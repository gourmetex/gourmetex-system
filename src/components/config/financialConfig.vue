<template>
    <div class="financial">
        <dataTable :dataTable="debtCategories" :rowsPerPage="7" searchText="item">
            <template slot="column-id" slot-scope="props">
                <p class="clicable text-center" v-on:click="selectRow2($event)">{{ props.item.id }}</p>
            </template>
            <template slot="column-nome" slot-scope="props">
                <p>{{ props.item.nome }}</p>
            </template>
            <template slot="column-tipo" slot-scope="props">
                <newBadge class="text-center" :background="props.item.cor" :text="props.item.tipo_conta" />
            </template>
        </dataTable>
        <div class="edit-buttons">
            <button type="button" class="rounded-btn btn-primary" v-on:click="createNewDebtCategory()">
                <span class="material-icons">add</span>
            </button>
            <div class="dynamic-edit-buttons">
                <button type="button" class="rounded-btn btn-red" v-on:click="deleteDebtCategory()">
                    <span class="material-icons">delete</span>
                </button>
                <button type="button" class="rounded-btn btn-yellow" v-on:click="editDebtCategory()">
                    <span class="material-icons">edit</span>
                </button>
            </div>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/financial/debt_categories/' + editId" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnDebtCategories();">
            <editDebtCategoryModalContent v-if="showEditDebtCategoryModalContent" :debtid="editId" @savedContent="closeModalFunction(); returnDebtCategories();"></editDebtCategoryModalContent>
        </modal>
    </div>
</template>
<script>
import dataTable from "../dataTable.vue";
import newBadge from "../newBadge.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../modal.vue";
import editDebtCategoryModalContent from "./editDebtCategoryModalContent.vue";
import api from "../../configs/api";

export default {
    name: "financialConfig",
    mixins: [globalMethods],
    data() {
        return {
            showEditDebtCategoryModalContent: false,
            debtCategories: [],
            gridOptions: []
        }
    },
    methods: {
        createNewDebtCategory: function () {
            this.showModalFunction("Criar categoria", "Criar", "Cancelar");
            this.showEditDebtCategoryModalContent = true;
            this.editId = null;
        },
        deleteDebtCategory: function () {
            this.showModalFunction("Excluir categoria", "Excluir", "Cancelar");
        },
        editDebtCategory: function () {
            this.showModalFunction("Editar categoria", "Salvar", "Cancelar");
            this.showEditDebtCategoryModalContent = true;
        },
        returnDebtCategories: function () {
            let self = this;

            api.get("/financial/debt_categories?all=true").then((response) => {
                self.debtCategories = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnDebtCategories();
    },
    components: {
        dataTable,
        newBadge,
        modal,
        editDebtCategoryModalContent
    }
}
</script>
<style scoped>
</style>