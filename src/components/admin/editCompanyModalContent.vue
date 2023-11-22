<template>
    <div class="edit-company-modal-content">
        <form class="edit-company" id="informations-form" @submit.prevent="saveCompany()">
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" name="name" placeholder="Nome da empresa" v-model="company.nome" required>
            </div>
            <div class="radio-group">
                <input type="checkbox" name="active" v-model="company.ativa">
                <label for="active">Ativo?</label>
            </div>
            <input type="submit" id="submit-button" style="display: none;">
        </form>
    </div>
</template>
<script>
import api from "../../configs/api";
import $ from 'jquery';

export default {
    name: "editCompanyModalContent",
    props: ["companyid"],
    data() {
        return {
            company: {
                nome: "",
                ativa: false
            },
            savingCompany: false
        }
    },
    methods: {
        returnCompany: function () {
            let self = this;
            
            if (self.companyid == 0) return;

            api.get("/companies/" + self.companyid + "/return_company").then((response) => {
                self.company = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        },
        saveCompany: function () {
            let self = this;

            if (self.savingCompany) return;

            self.savingCompany = true;

            let data = $("#informations-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            data["active"] = data.active == "on" ? true : false;
            data["company_id"] = self.companyid;

            let path = "create";

            if (self.companyid != 0) {
                path = "edit_company";
            }

            api.post("/companies/" + path, data).then(() => {
                self.$emit("savedContent", true);
            }).catch((error) => {
                console.log(error);
            }).then(() => {
                self.savingCompany = false;
            })
        }
    },
    mounted: function () {
        this.returnCompany();
    }
}
</script>