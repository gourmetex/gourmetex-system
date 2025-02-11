<template>
    <div class="edit-company-modal-content">
        <form class="edit-company" id="informations-form" @submit.prevent="saveCompany()" v-if="company.id != null">
            <h3 class="font-bold">Informações principais</h3>
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" name="name" id="name" placeholder="Nome da empresa" v-model="company.nome" required>
            </div>
            <div class="form-group">
                <label for="main-user">Usuário admin</label>
                <input type="email" name="main_user_email" id="main-user" v-model="company.email_requisitado" placeholder="example@domain.com" required>
            </div>
            <div class="radio-group">
                <input type="checkbox" name="active" id="active" v-model="company.ativa">
                <label for="active">Ativo?</label>
            </div>
            <div class="company-modules">
                <h3 class="font-bold">Módulos habilitados</h3>
                <div class="radio-group" v-for="module in modules" :key="module.id">
                    <input 
                        type="checkbox" 
                        :id="'module-' + module.id" 
                        :value="module.id"
                        v-model="activeModules"
                        name="modules"
                    >
                    <label :for="'module-' + module.id">{{ module.nome }}</label>
                </div>
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
                id: null,
                nome: "",
                ativa: false,
                email_requisitado: ""
            },
            savingCompany: false,
            modules: [],
            activeModules: []
        }
    },
    methods: {
        returnModules: function () {
            let self = this;

            api.get("/companies/modules").then((response) => {
                self.modules = response.data.returnObj;
            })
        },
        returnCompany: function () {
            let self = this;
            
            if (!self.companyid) return;

            api.get("/companies/" + self.companyid + "/return_company").then((response) => {
                self.company = response.data.returnObj;
                self.activeModules = self.company.active_modules;
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
            data["active_modules"] = self.activeModules;

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
        this.returnModules();
        if (this.companyid != 0) {
            $("#main-user").attr("disabled", "disabled");
        }
        this.returnCompany();
    }
}
</script>