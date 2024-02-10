<template>
    <div class="financial-component">
        <div class="page-title">
            <h1>Financeiro</h1>
        </div>  
        <actionButtons add_text="LANÇAR CONTA A RECEBER" exclude_text="EXCLUIR CONTA" edit_text="LANÇAR CONTA A PAGAR" :disabledbuttons="disabledButtons" add_icon="attach_money" edit_icon="money_off" @add="addAccountReceivable()" @exclude="deleteDebt()" @edit="addPayableAccount()" />
        <div class="financial-container">
            <div class="filter-container-header">
                <h2>Contas</h2>
                <div class="filters">
                    <form id="filter-form" @submit.prevent="search()">
                        <div class="filter-field">
                            <label for="categoria_conta">Categoria</label>
                            <select id="categoria_conta" name="categoria_conta">
                                <option value="">Qualquer</option>
                                <option v-for="(category, index) in debt_categories" :key="index" :value="category.id[1]">{{ category.nome[1] }}</option>
                            </select>
                        </div>
                        <div class="filter-field">
                            <label for="data_inicio">Data início</label>
                            <input type="date" name="data_inicio" id="data_inicio">
                        </div>
                        <div class="filter-field">
                            <label for="data_fim">Data fim</label>
                            <input type="date" name="data_fim" id="data_fim">
                        </div>
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="debts" @dataclick="selectRow($event)"></gridView>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :excludepath="'/financial/' + editId" :modalbutton1="modalButton1" :modalbutton2="modalButton2" :modalbutton3="modalButton3" @closeModal="closeModalFunction(); returnFinancial();">
            <postAccountReceivableModalContent v-if="showPostAccountReceivableModalContent" @savedContent="closeModalFunction(); returnFinancial();"></postAccountReceivableModalContent>
            <postPayableAccountModalContent v-if="showPostPayableAccountModalContent" @savedContent="closeModalFunction(); returnFinancial();"></postPayableAccountModalContent>
        </modal>
    </div>
</template>
<script>
import actionButtons from "../../actionButtons.vue";
import gridView from "../../gridView.vue";
import { globalMethods } from "@/js/globalMethods";
import modal from "../../modal.vue";
import postAccountReceivableModalContent from "./postAccountReceivableModalContent.vue";
import postPayableAccountModalContent from "./postPayableAccountModalContent.vue";
import api from "../../../configs/api";
import $ from 'jquery';

export default {
    name: "financialComponent",
    mixins: [globalMethods],
    data() {
        return {
            items: [],
            gridOptions: [],
            filters: [],
            showPostAccountReceivableModalContent: false,
            showPostPayableAccountModalContent: false,
            debts: [],
            debt_categories: []
        }
    },
    methods: {
        search: function () {
            let data = $("#filter-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                if (item.name.indexOf("data_") != -1 && item.value.trim() != "") {
                    obj[item.name] = "data_lancamento:" + item.value;
                } else {
                    obj[item.name] = item.value;
                }
                
                return obj;
            }, {});
            this.filters = data;
            this.returnFinancial();
        },
        resetModalContents: function () {
            this.showPostAccountReceivableModalContent = false;
            this.showPostPayableAccountModalContent = false;
        },  
        addAccountReceivable: function () {
            this.resetModalContents();
            this.showModalFunction("Lançar conta a receber", "Lançar", "Cancelar");
            this.showPostAccountReceivableModalContent = true;
            this.descelectRows();
        },
        deleteDebt: function () {
            this.resetModalContents();
            this.showModalFunction("Excluir conta", "Excluir", "Cancelar");
        },
        addPayableAccount: function () {
            this.resetModalContents();
            this.showModalFunction("Lançar conta a pagar", "Lançar", "Cancelar");
            this.showPostPayableAccountModalContent = true;
            this.descelectRows();
        }, 
        returnFinancial: function () {
            let self = this;

            let data = {
                filters: self.filters
            }

            api.post("/financial", data).then((response) => {
                self.debts = response.data.returnObj.debts;
                self.gridOptions = response.data.returnObj.labels;
            }).catch((error) => {
                console.log(error);
            })
        },
        returnDebtCategories: function () {
            let self = this;

            api.get("/financial/debt_categories?all=true").then((response) => {
                self.debt_categories = response.data.returnObj.debtCategories;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnFinancial();
        this.returnDebtCategories();
        this.disableActionsButtons(false, true, false);
    },
    components: {
        actionButtons,
        gridView,
        modal,
        postAccountReceivableModalContent,
        postPayableAccountModalContent
    }
}
</script>
<style scoped>
</style>