import $ from 'jquery';
import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        // Métodos response
        setResponse: function (message, objClass) {
            this.resetResponse();

            let response = $(".response");

            response.addClass(objClass);

            if (objClass == "error") {
                $("#modal-submit-button").removeAttr("disabled").removeClass("btn-loading");
                $("#modal-save-submit-button").removeAttr("disabled").removeClass("btn-loading");
            }

            this.response = message;
        },
        resetResponse: function () {
            let response = $(".response");

            this.response = "";
            response.removeClass("error").removeClass("success");
        },
        //Métodos modal
        showModalFunction: function (modalTitle, modalButton1, modalButton2, modalButton3 = "") {
            this.modalTitle = modalTitle;
            this.modalButton1 = modalButton1;
            this.modalButton2 = modalButton2;
            this.modalButton3 = modalButton3;
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
                this.descelectRows();
            }, 400);
        },
        closeModalContent: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 0).css("transform", "translateY(-20vh)");
        },
        openSmallModal: function (modalId = "") {
            let smallModal = $(modalId || ".small-modal");
            let smallModalWrapper = $(".small-modal-wrapper");

            smallModal.show();
            smallModalWrapper.show();
            setTimeout(() => {
                smallModal.css("transform", "translateY(0)").css("opacity", 1);
            }, 1)
        },
        closeSmallModal: function () {
            let smallModal = $(".small-modal");
            let smallModalWrapper = $(".small-modal-wrapper");

            smallModal.css("transform", "translateY(-10vh)").css("opacity", 0);
            setTimeout(() => {
                smallModalWrapper.hide();
                smallModal.hide();
            }, 400)
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
                    this.showEditButtons();
                    this.editId = event[1];
                    this.selectGridRow(event[3]);
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
                this.descelectRows();
            } else {
                allRows.removeClass("row-selected");
                row.addClass("row-selected");
            }
        },
        descelectRows: function () {
            let allRows = $(".grid-row");

            allRows.removeClass("row-selected");
            this.editId = null;
            this.hideEditButtons();
        },
        inputMoneyCheck: function (event) {
            let target = $(event.target);
            const formattedValue = this.formatCurrency(target.val());
            target.val(formattedValue);
        },
        inputTelCheck: function (event) {
            let target = $(event.target);
            const formattedValue = this.formatTel(target.val());
            target.val(formattedValue);
        },
        disableActionsButtons: function (addButton = true, excludeButton = true, editButton = true) {
            this.disabledButtons = [];
            
            if (addButton) {
                this.disabledButtons.push(1);
            }

            if (excludeButton) {
                this.disabledButtons.push(2);
            }

            if (editButton) {
                this.disabledButtons.push(3);
            }
        },
        //Métodos de manipulação de valores de inputs
        formatCurrency: function (value) {
            const numeroLimpo = value.toString().replace(/[^\d.]/g, ''); // Remove caracteres não numéricos, exceto ponto
            const partes = numeroLimpo.replace(".", ",").split(',');

            if (partes.length > 1) {
                // Se houver parte decimal, formata separadamente
                return `R$ ${partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},${partes[1].slice(0, 2)}`;
            } else {
                // Se não houver parte decimal, formata apenas a parte inteira
                return `R$ ${partes[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
            }
        },
        formatTel: function (value) {
            let numberTemplate = "(00) 0 0000-0000";
            let number = value.replace("+55", "").replace("(", "").replace(")", "").replace("-", "").replace(" ", '').replace(" ", '');
            let formattedNumber = [], numberPosition = 0;
            for (let i in numberTemplate) {
                if (numberTemplate[i] == "0") {
                    formattedNumber[i] = number[numberPosition];
                    numberPosition++;
                } else {
                    formattedNumber[i] = numberTemplate[i];
                }
            }

            return formattedNumber.join('');
        },
        formatTelToSubmit: function (value) {
            // Remove everything that is not a number
            const numbers = value.replace("+55", "").replace(/\D/g, '');

            // Limit the string to a maximum of 11 digits
            const truncatedNumbers = numbers.slice(0, 11);

            // Add the country code +55
            const formattedNumber = `+55${truncatedNumbers}`;

            return formattedNumber;
        },
        formatDecimalValues: function (value) {
            const numeroLimpo = value.toString().replace(/[^\d,]/g, '').replace(",", ".");
            let formattedFloat = parseFloat(numeroLimpo);
            return formattedFloat;
        }
    },
    watch: {
        editId: function () {
            if (this.editId != null) {
                this.disableActionsButtons(false, false, false);
            } else {
                this.disableActionsButtons(false, true, true);
            }
        }
    },
    mounted: function () {
    },
    data() {
        return {
            response: "",
            year: new Date().getFullYear(),
            showModal: false,
            modalTitle: "",
            modalButton1: "",
            modalButton2: "",
            modalButton3: "",
            closeModal: false,
            reloadGrid: false,
            editId: null,
            disabledButtons: []
        }
    }
}