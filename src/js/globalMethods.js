import $ from 'jquery';
import api from '../configs/api.js';
import axios from 'axios';

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
                this.descelectRows2();
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
        //Métodos retorno objetos
        searchCEP: function (cep) {
            return new Promise((resolve, reject) => {
                cep = cep.replace(/\D/g, '');
                
                axios.get(`/api/ws/${cep}/json/`)
                .then(response => {
                    const data = response.data;

                    if (!data.erro) {
                        let address = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;

                        resolve(address);
                    } else {
                        alert('CEP não encontrado!')
                    }
                })
                .catch((erro) => {
                    reject(erro);
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

            if (event[0] == "badge" && event[4] == "action") {
                let id = $("#grid-row-" + event[5]).find(".grid-cell:first-child h3").html();
                this.triggerAction(id);
            }
        },
        selectRow2: function (event) {
            let id = $(event.target).html();
            let parent = $(event.target).parent().parent();

            this.showEditButtons();
            this.editId = parseInt(id);
            this.selectGridRow2(parent);
        },
        showEditButtons: function () {
            let editButtons = $(".dynamic-edit-buttons");

            editButtons.show();
        },
        hideEditButtons: function () {
            let editButtons = $(".dynamic-edit-buttons");

            editButtons.hide();
        },
        selectGridRow2: function (row) {
            if (row.hasClass("row-selected")) {
                this.descelectRows2();
            } else {
                row.addClass("row-selected");                
            }
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
        descelectRows2: function () {
            let allRows = $("td, tr");

            allRows.removeClass("row-selected");
            this.editId = null;
            this.hideEditButtons();
        },
        descelectRows: function () {
            let allRows = $(".grid-row");

            allRows.removeClass("row-selected");
            this.editId = null;
            this.hideEditButtons();
        },
        inputMoneyCheck: function (event) {
            var valor = event.target.value.replace(/\D/g, '');
            
            // Transforma em número decimal com duas casas
            var valorNumerico = parseInt(valor) / 100;

            // Formata para o formato monetário brasileiro
            var valorFormatado = valorNumerico.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Atualiza o valor do input
            event.target.value = valorFormatado;

            // Mantém a posição do cursor no final do texto
            event.target.setSelectionRange(valorFormatado.length, valorFormatado.length);
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
        //Métodos de manipulação de inputs
        groupObservations: function (input) {
            if (input == null) {
                return "";
            }

            // Divide a string em itens baseados na vírgula e remove espaços em branco extras
            let itens = input.split(',')
                       .map(item => item.trim())
                       .filter(item => item !== "");

            // Se não houver itens válidos, retorna vazio
            if (itens.length === 0) {
                return "";
            }
            
            itens = itens.flatMap(item => {
                const parts = item.split(' '); // Divide a string inteira em partes baseadas em espaços
                const count = parseInt(parts[0], 10); // Tenta converter o primeiro elemento em um número
                if (!isNaN(count) && parts.length > 1) {
                    const description = parts.slice(1).join(' '); // Junta os restantes elementos como a descrição
                    return Array(count).fill(description);
                }
                return [item];
            });
            
            // Contador para armazenar a frequência de cada item
            const contador = {};

            // Preenche o contador
            itens.forEach(item => {
                if (item in contador) {
                    contador[item]++;
                } else {
                    contador[item] = 1;
                }
            });

            // Verifica se existe apenas uma observação e se a contagem é 1
            const chaves = Object.keys(contador);
            if (chaves.length === 1 && contador[chaves[0]] === 1) {
                return chaves[0]; // Retorna apenas a observação sem número
            }

            // Constrói a string de resultado agrupando os itens com suas contagens
            const resultado = chaves.map(key => `${contador[key]} ${key}`).join(', ');

            return resultado;
        },
        loadPreferences: function () {
            for (let i = 0; i < this.preferences.length; i++) {
                let currentPreferenceGroup = this.preferences[i];
                let groupElement = $(".preferences-group[datalabel='" + currentPreferenceGroup.label + "']");

                groupElement.find("input[type='radio'][value='" + currentPreferenceGroup.preferences[0].nome + "']").prop('checked', true);
            }
        },
        //Métodos de formatação de valores ou strings
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
        },
        formatDateFromDb: function (date) {
            return date.replace(' ', 'T').slice(0, -3);
        },
        capitalize: (str) => {
            if (!str) return "";
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },
        //Métodos configurações
        cancel: function () {
            this.$emit("cancel");
        }
    },
    watch: {
        editId: function () {
            if (this.editId != null) {
                this.disableActionsButtons(false, false, false);
            } else {
                this.disableActionsButtons(false, true, true);
                this.descelectRows();
                this.descelectRows2();
            }
        }
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
            disabledButtons: [],
            preferences: []
        }
    }
}