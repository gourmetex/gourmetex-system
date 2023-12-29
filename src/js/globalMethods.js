import $ from 'jquery';
import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        // Métodos response
        setResponse: function (message, objClass) {
            this.resetResponse();

            let response = $(".response");

            response.addClass(objClass);
            this.response = message;
        },
        resetResponse: function () {
            let response = $(".response");

            this.response = "";
            response.removeClass("error").removeClass("success");
        },
        //Métodos modal
        showModalFunction: function (modalTitle, modalButton1, modalButton2) {
            this.modalTitle = modalTitle;
            this.modalButton1 = modalButton1;
            this.modalButton2 = modalButton2;
            this.showModal = true;
        },
        closeModalFunction: function () {
            this.closeModalContent();

            this.reloadGrid = true;

            setTimeout(() => {
                this.showModal = false;

                this.modalTitle = "";
                this.modalButton1 = "";
                this.modalButton2 = "";
                this.submitContent = false;

                this.reloadGrid = false;
            }, 400);
        },
        closeModalContent: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 0).css("transform", "translateY(-20vh)");
        },
        //Métodos autenticação
        logoutUser: function () {
            let self = this;

            self.removeJwtFromLocalStorage();
            self.$router.push("/login");
        },
        setJwtInLocalStorage: function (token) {
            localStorage.setItem("gourmetech_jwt", token);
            this.checkAndSetJwt();
        },
        getJwtInLocalStorage: function () {
            return localStorage.getItem("gourmetech_jwt");
        },
        removeJwtFromLocalStorage: function () {
            localStorage.removeItem("gourmetech_jwt");
        },
        checkAndSetJwt: function() {
            let interval = setInterval(() => {
                let jwt = this.getJwtInLocalStorage();
                if (jwt != null) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
                    this.$root.jwtLoaded = true;
                    clearInterval(interval);
                }
            }, 100)
        },
        checkIfUserIsAuthenticated: function () {
            return new Promise((resolve) => {
                let self = this;
                let pathName = window.location.href;
                let jwt = "Bearer " + self.getJwtInLocalStorage();
                
                if (jwt == "Bearer null") {
                    if (pathName.indexOf("/home") != -1) {
                        self.$router.push("/login");
                        return;
                    }
                } else {
                    let data = {
                        token: jwt
                    }

                    api.post("/users/check_jwt", data) // Se ja estiver logado no sistema e acessar a página de login, é checkado a valia do token JWT e então redirecionado para a index.
                    .then(function (res) { 
                        self.setJwtInLocalStorage(res.data.returnObj.newToken); // Setando o novo jwt que foi resetado

                        if (pathName.indexOf("/login") != -1) { // Se o usuário estiver logado e entrar em login, o mesmo é logado novamente e direcionado para a index.
                            let loginForm = $("#login-form");
                            loginForm.find("input").attr("disabled", "disabled");
                            loginForm.find("button").attr("disabled", "disabled").addClass("btn-loading");

                            setTimeout(() => {
                                self.$router.push("/home");
                            }, 1000);
                        }
                        resolve();
                    })
                    .catch(function () { // Caso contrário ele é deslogado e enviado para login.
                        self.logoutUser();
                        return;
                    })
                    .then(function () { // Chamada recursiva da função se o usuario estiver na home
                        if (pathName.indexOf("/home") != -1) {
                            setTimeout(self.checkIfUserIsAuthenticated, 10 * 1000);
                        }
                    })
                }
            })
        },
        //Métodos retorno objetos globais
        requireCompany: function (company_id) {
            return new Promise((resolve) => {
                let self = this;
                
                api.get("/companies/" + company_id + "/return_company").then((response) => {
                    self.$root.company = response.data.returnObj;
                    resolve();
                })
            })
        },
        requireUser: function () {
            return new Promise((resolve) => {
                let self = this;

                api.get("/users/return_user").then((response) => {
                    self.$root.user = response.data.returnObj;
                    resolve();
                })
            })
        },
        //Metodos manipulação objetos
        selectRow: function (event) {
            switch (event[2]) {
                case "select_row":
                    this.showEditButtons(event);
                    this.editId = event[1];
                    this.selectGridRow(event[3]);
                    break;
            }
        },
        selectRowWithLargeButtons: function (event) {
            switch (event[2]) {
                case "select_row":
                    /*this.showEditButtons(event);
                    this.editId = event[1];
                    this.selectGridRow(event[3])*/
                    break;
            }
        },
        showEditButtons: function () {
            let editButtons = $(".dynamic-edit-buttons");

            editButtons.show();
        },
        hideEditButtons: function () {
            let editButtons = $(".dynamic-edit-buttons");

            editButtons.hide();
        },
        selectGridRow: function (rowKey) {
            let allRows = $(".grid-row");
            let row = $("#grid-row-" + rowKey);

            if (row.hasClass("row-selected")) {
                allRows.removeClass("row-selected");
                this.hideEditButtons();
            } else {
                allRows.removeClass("row-selected");
                row.addClass("row-selected");
            }
        },
        descelectRows: function () {
            let allRows = $(".grid-row");

            allRows.removeClass("row-selected");
            this.hideEditButtons();
        },
        formatCurrency: function (value) {
            const numeroLimpo = value.replace(/[^\d,]/g, ''); // Remove caracteres não numéricos, exceto a vírgula
            const partes = numeroLimpo.split(',');

            if (partes.length > 1) {
                // Se houver parte decimal, formata separadamente
                return `R$ ${partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},${partes[1].slice(0, 2)}`;
            } else {
                // Se não houver parte decimal, formata apenas a parte inteira
                return `R$ ${partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
            }
        },
        inputMoneyCheck: function (event) {
            let target = $(event.target);
            const formattedValue = this.formatCurrency(target.val());
            target.val(formattedValue);
        }
    },
    mounted: function() {
    },
    data() {
        return {
            response: "",
            year: new Date().getFullYear(),
            showModal: false,
            modalTitle: "",
            modalButton1: "",
            modalButton2: "",
            closeModal: false,
            reloadGrid: false
        }
    }
}