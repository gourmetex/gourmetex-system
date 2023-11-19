<template>
    <div class="edit-company-modal-content">
        <h2>Editar empresa</h2>
        <form class="edit-company" id="informations-form" @submit.prevent="saveCompany()">
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" name="name" placeholder="Nome da empresa" v-model="company.name" required>
            </div>
            <div class="radio-group">
                <input type="checkbox" name="active" v-model="company.active">
                <label for="active">Ativo?</label>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "editCompanyModalContent",
    props: ["companyid", "submitcontent"],
    data() {
        return {
            company: {
                name: "Gourmetech",
                active: true
            },
            savingCompany: false
        }
    },
    methods: {
        returnCompany: function () {

        },
        saveCompany: function () {
            if (this.savingCompany) return;

            let self = this;

            this.savingCompany = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            
            setTimeout(() => {
                self.$emit("savedContent", true);
                this.savingCompany = false;
                console.log(data)
            }, 2000)
        }
    },
    mounted: function () {
    }
}
</script>