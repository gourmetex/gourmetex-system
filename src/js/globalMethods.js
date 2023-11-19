import $ from 'jquery';
//import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        resetResponse: function (element) {
            this.response = "";
            element.removeClass("error").removeClass("success");
        },
        showModalFunction: function (modalTitle, modalButton1, modalButton2) {
            this.modalTitle = modalTitle;
            this.modalButton1 = modalButton1;
            this.modalButton2 = modalButton2;
            this.showModal = true;
        },
        closeModalFunction: function () {
            this.closeModalContent();

            setTimeout(() => {
                this.showModal = false;

                this.modalTitle = "";
                this.modalButton1 = "";
                this.modalButton2 = "";
                this.submitContent = false;
            }, 400);
        },
        closeModalContent: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 0).css("transform", "translateY(-20vh)");
        },
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
            closeModal: false
        }
    }
}