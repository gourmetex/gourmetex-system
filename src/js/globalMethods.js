//import $ from 'jquery';
//import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        resetResponse: function (element) {
            this.response = "";
            element.removeClass("error").removeClass("success");
        }
    },
    mounted: function() {
    },
    data() {
        return {
            response: "",
            year: new Date().getFullYear()
        }
    }
}