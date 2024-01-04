<template>
    <div class="edit-dishe-caregories-modal-content">
        <form class="edit-category" id="informations-form" @submit.prevent="saveCategory()">
            <div class="form-group">
                <label for="name">Nome da categoria</label>
                <input type="text" name="name" id="name" v-model="category.nome" required>
            </div>
            <div class="form-group">
                <label for="name">Cor da categoria</label>
                <colorSelect :colors="categoriesColors" @select="selectedColor = $event" :selectedcolor="selectedColor" required="true" />
            </div>
            <div class="radio-group">
                <input type="checkbox" name="promocional" id="promocional" v-model="category.promocional">
                <label for="promocional">Promocional?</label>
            </div>
            <div class="form-group">
                <label for="porcentagem_desconto">Nome da categoria</label>
                <input type="text" name="porcentagem_desconto" id="porcentagem_desconto" v-model="category.porcentagem_desconto" @keypress="formatPercentageValues()">
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
    </div>
</template>
<script>
import api from "../../configs/api";
import $ from 'jquery';
import colorSelect from "../colorSelect.vue";
import { globalMethods } from "@/js/globalMethods";

export default {
    name: "editIngredientModalContent",
    mixins: [globalMethods],
    props: ["ingredientid"],
    data() {
        return {
            category: {
                promocional: 0,
                porcentagem_desconto: 0,
                nome: ""
            },
            savingCategory: false,
            categoriesColors: [],
            selectedColor: null
        }
    },
    methods: {
        saveCategory: function () {
            let self = this;

            if (self.savingCategory) return;

            self.savingCategory = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            data["id"] = self.ingredientid;

            let path = "create_ingredient";

            if (self.ingredient.id != 0) {
                path = "edit_ingredient";
            }

            api.post("/dishes/ingredients/" + path, data).then(() => {
                self.$emit("savedContent", true);
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                self.savingIngredient = false;
            })
        },
        returnDishesCategoriesColors: function () {
            let self = this;
            
            api.get("/dishes/categories_colors").then((response) => {
                self.categoriesColors = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted: function () {
        this.returnDishesCategoriesColors();
    },
    components: {
        colorSelect
    }
}
</script>
<style scoped>
</style>