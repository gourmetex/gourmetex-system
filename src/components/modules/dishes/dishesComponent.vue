<template>
    <div class="dishes-component">
        <div class="page-title">
            <h1>Pratos</h1>
        </div>  
        <actionButtons add_text="ADICIONAR PRATO" exclude_text="EXCLUIR PRATO" edit_text="EDITAR PRATO" :disabledbuttons="disabledButtons" @add="addDish()" @exclude="excludeDish()" @edit="editDish()" />
        <div class="dishes-container">
            <div class="filter-container-header">
                <h2>Lista de pratos</h2>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="dishes" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/dishes/' + editId" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnDishes();">
            <editDishModalContent v-if="showEditDishModalContent" :dishid="editId" @savedContent="closeModalFunction(); returnDishes();"></editDishModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import editDishModalContent from "./editDishModalContent.vue";
import api from "../../../configs/api";

export default {
    name: "dishesComponent",
    mixins: [globalMethods],
    data() {
        return {
            dishes: [],
            gridOptions: [],
            showEditDishModalContent: false,
            ingredients_categories: []
        }
    },
    methods: {
        resetModalContents: function () {
            this.showEditDishModalContent = false;
        },  
        addDish: function () {
            this.resetModalContents();
            this.showModalFunction("Criar prato", "Criar", "Cancelar");
            this.showEditDishModalContent = true;
            this.editId = null;
            this.descelectRows();
        },
        excludeDish: function () {
            this.resetModalContents();
            this.showModalFunction("Excluir prato", "Remover", "Cancelar");
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

            api.get("/dishes").then((response) => {
                self.dishes = response.data.returnObj.dishes;
                self.gridOptions = response.data.returnObj.labels;
                self.editId = null;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnDishes();
        this.disableActionsButtons(false, true, true);
    },
    components: {
        actionButtons,
        gridView,
        modal,
        editDishModalContent
    }
}
</script>
<style scoped>
</style>