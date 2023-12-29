<template>
    <div class="stock-component">
        <div class="page-title">
            <h1>Estoque</h1>
        </div>  
        <actionButtons add_text="ADICIONAR ITEM" exclude_text="EXCLUIR ITEM" />
        <div class="stock-container">
            <div class="filter-container-header">
                <h2>Itens do estoque</h2>
            
                <div class="filters">
                    <form id="filter-form" @submit.prevent="search()">
                        <div class="filter-field">
                            <label for="nome">Nome</label>
                            <input type="text" id="nome" name="nome">
                        </div>
                        <div class="filter-field">
                            <label for="categoria">Categoria</label>
                            <select id="categoria" name="categoria">
                                <option value="">Qualquer</option>
                                <option v-for="(category, index) in ingredients_categories" :key="index" :value="category.id">{{ category.nome }}</option>
                            </select>
                        </div>
                        <div class="filter-field">
                            <label for="categoria">Categoria</label>
                            <select id="categoria" name="categoria">
                                <option value="">Qualquer</option>
                                <option value="cheio">Cheio</option>
                                <option value="medio">Medio</option>
                                <option value="vazio">Vazio</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
            </div>
            <gridView :gridoptions="gridOptions" :griddata="ingredients" :selected="selectedRow" @dataclick="selectRow($event)"></gridView>
        </div>
    </div>
</template>
<script>
import actionButtons from "./actionButtons.vue";
import gridView from "./gridView.vue";
import { globalMethods } from "@/js/globalMethods";

export default {
    name: "stockComponent",
    mixins: [globalMethods],
    data() {
        return {
            ingredients_categories: [],
            ingredients: [],
            gridOptions: [],
            selectedRow: null
        }
    },
    methods: {
        search: function () {

        }
    },
    components: {
        actionButtons,
        gridView
    }
}
</script>
<style scoped>
</style>