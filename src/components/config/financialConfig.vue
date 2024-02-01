<template>
    <div class="financial">
        <gridView :gridoptions="gridOptions" :griddata="debtCategories" @dataclick="selectRow($event)"></gridView>
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
import gridView from "../gridView.vue";
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

            api.get("/financial/debt_categories").then((response) => {
                self.debtCategories = response.data.returnObj.debtCategories;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnDebtCategories();
    },
    components: {
        gridView,
        modal,
        editDebtCategoryModalContent
    }
}
</script>
<style scoped>
</style>