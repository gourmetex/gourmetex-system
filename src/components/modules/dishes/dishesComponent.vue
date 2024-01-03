<template>
    <div class="dishes-component">
        <div class="page-title">
            <h1>Pratos</h1>
        </div>  
        <actionButtons add_text="ADICIONAR PRATO" exclude_text="EXCLUIR PRATO" edit_text="EDITAR PRATO" @add="addDish()" @exclude="excludeDish()" @edit="editDish()" />
        <div class="dishes-container">
            <div class="filter-container-header">
                <h2>Lista de pratos</h2>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="dishes" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :modalbutton2="modalButton2" @closeModal="closeModalFunction(); returnDishes();">
            <addDishModalContent v-if="showAddDishModalContent" @savedContent="closeModalFunction(); returnDishes();"></addDishModalContent>
            <deleteDishModalContent v-if="showDeleteDishModalContent" @savedContent="closeModalFunction(); returnDishes();"></deleteDishModalContent>
            <editDishModalContent v-if="showEditDishModalContent" @savedContent="closeModalFunction(); returnDishes();"></editDishModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import addDishModalContent from "./addDishModalContent.vue";
import deleteDishModalContent from "./deleteDishModalContent.vue";
import editDishModalContent from "./editDishModalContent.vue";
import api from "../../../configs/api";

export default {
    name: "stockComponent",
    mixins: [globalMethods],
    data() {
        return {
            dishes: [],
            gridOptions: [],
            showAddDishModalContent: false,
            showDeleteDishModalContent: false,
            showEditDishModalContent: false,
            ingredients_categories: []
        }
    },
    methods: {
        resetModalContents: function () {
            this.showAddDishModalContent = false;
            this.showDeleteDishModalContent = false;
            this.showEditDishModalContent = false;
        },  
        addDish: function () {
            this.resetModalContents();
            this.showModalFunction("Criar prato", "Criar", "Cancelar");
            this.showAddDishModalContent = true;
            this.descelectRows();
        },
        excludeDish: function () {
            this.resetModalContents();
            this.showModalFunction("Remover prato", "Remover", "Cancelar");
            this.showDeleteDishModalContent = true;
            this.descelectRows();
        }, 
        editDish: function () {
            this.resetModalContents();
            this.showModalFunction("Editar prato", "Salvar", "Cancelar");
            this.showEditDishModalContent = true;
            this.descelectRows();
        },
        returnDishes: function () {
            let self = this;

            api.post("/stock/return_stock").then((response) => {
                self.dishes = response.data.returnObj.items;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnDishes();
    },
    components: {
        actionButtons,
        gridView,
        modal,
        addDishModalContent,
        deleteDishModalContent,
        editDishModalContent
    }
}
</script>
<style scoped>
</style>