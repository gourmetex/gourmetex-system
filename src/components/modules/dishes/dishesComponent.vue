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
            <dataTable :dataTable="dishes" :rowsPerPage="7" searchText="prato">
                <template slot="column-id" slot-scope="props">
                    <p class="clicable text-center" v-on:click="selectRow2($event)">{{ props.item.id }}</p>
                </template>
                <template slot="column-nome" slot-scope="props">
                    <p>{{ props.item.nome }}</p>
                </template>
                <template slot="column-descrição" slot-scope="props">
                    <p>{{ props.item.dishes }}</p>
                </template>
                <template slot="column-preço" slot-scope="props">
                    <p>{{ props.item.preco }}</p>
                </template>
                <template slot="column-categoria" slot-scope="props">
                    <newBadge class="text-center" :background="props.item.cor" :text="props.item.nome_categoria" />
                </template>
                <template slot="column-disponível" slot-scope="props">
                    <p class="text-center">{{ props.item.disponivel == 1 ? "Sim" : "Não" }}</p>
                </template>                
            </dataTable>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :excludepath="'/dishes/' + editId" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnDishes();">
            <editDishModalContent v-if="showEditDishModalContent" :dishid="editId" @savedContent="closeModalFunction(); returnDishes();"></editDishModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import editDishModalContent from "./editDishModalContent.vue";
import api from "../../../configs/api";
import dataTable from "../../dataTable.vue";
import newBadge from "../../newBadge.vue";

export default {
    name: "dishesComponent",
    mixins: [globalMethods],
    data() {
        return {
            dishes: [],
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
        },
        excludeDish: function () {
            this.resetModalContents();
            this.showModalFunction("Excluir prato", "Remover", "Cancelar");
        }, 
        editDish: function () {
            this.resetModalContents();

            this.showModalFunction("Editar prato", "Salvar", "Cancelar");
            this.showEditDishModalContent = true;
        },
        returnDishes: function () {
            let self = this;

            api.get("/dishes").then((response) => {
                self.dishes = response.data.returnObj;
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
        dataTable,
        newBadge,
        modal,
        editDishModalContent
    }
}
</script>
<style scoped>
</style>