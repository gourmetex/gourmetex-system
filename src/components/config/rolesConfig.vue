<template>
    <div class="roles-config">
        <div class="filters">
            <div class="filter-field">
                <label for="id">Id</label>
                <input type="number" id="id">
            </div>
            <div class="filter-field">
                <label for="name">Nome</label>
                <input type="text" id="name">
            </div>
            <div class="filter-field">
                <label for="role">Cargo</label>
                <select id="role">
                    <option value="">Qualquer</option>
                </select>
            </div>
            <button type="button" class="btn btn-primary search-filter-button">Buscar</button>
        </div>
        <gridView :gridoptions="gridOptions" :griddata="roles" :selected="selectedRow" @dataclick="selectRow($event)"></gridView>
        <div class="edit-buttons">
            <button type="button" class="rounded-btn btn-primary">
                <span class="material-icons">add</span>
            </button>
            <button type="button" class="rounded-btn btn-red">
                <span class="material-icons">delete</span>
            </button>
            <button type="button" class="rounded-btn btn-yellow">
                <span class="material-icons">edit</span>
            </button>
        </div>
    </div>
</template>
<script>
import gridView from "../gridView.vue";
import { globalMethods } from "@/js/globalMethods";

export default {
    name: "rolesConfig",
    mixins: [globalMethods],
    data() {
        return {
            roles: [
                {
                    id: ["text", 0, "select_row"],
                    name: ["text", "Gerente"],
                    permission: ["text", "Master"]
                },
                {
                    id: ["text", 1, "select_row"],
                    name: ["text", "Garçom"],
                    permission: ["text", "Padrão"]
                }
            ],
            gridOptions: [
                "Id",
                "Cargo",
                "Permissão"
            ],
            selectedRow: null,
            editId: null
        }
    },
    methods: {
        selectRow: function (event) {
            switch (event[2]) {
                case "select_row":
                    this.showEditButtons(event);
                    this.editId = event[1];
                    this.selectGridRow(event[3])
                    break;
            }
        }
    },
    components: {
        gridView
    }
}
</script>
<style scoped>
</style>