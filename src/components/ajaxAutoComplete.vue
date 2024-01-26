<template>
    <div class="ajax-autocomplete">
        <input type="text" id="ajax-autocomplete-input" v-model="entity_search">
        <div class="selected-entity" v-if="entity_object.name != ''">
            {{ entity_object.name }}
            <span class="material-icons" v-on:click="deselectEntity()">close</span>
        </div>
        <div class="entities-list">
            <div class="empty-search" v-if="entity_search.length > 2 && entities_list.length == 0">
                <p>Nenhum resultado encontrado</p>
            </div>
            <div class="entities-list-inner" v-if="entity_search.length > 2 && entities_list.length > 0">
                <div class="entity" v-for="(entityObj, index) in entities_list" :key="index" v-on:click="selectEntity(entityObj)">
                    <div class="customers-entity" v-if="ajaxtype == 'clientes'">
                        <div class="entity-line">
                            <p>{{ entityObj.nome }}</p>
                            <p v-if="entityObj.porcentagem_desconto != ''"><span class="font-bold">{{ entityObj.porcentagem_desconto }}</span> desconto</p>
                        </div>
                        <div class="entity-line">
                            <p>{{ entityObj.email }}</p>
                            <p>{{ entityObj.telefone }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from "../configs/api";
import $ from 'jquery';

export default {
    name: "ajaxAutoComplete",
    props: ["ajaxtype", "entity", "required"],
    data() {
        return {
            entity_id: null,
            entity_search: "",
            entity_object: {
                nome: ""
            },
            entities_list: []
        }
    },
    watch: {
        entity_search: function () {
            if (this.entity_search.length > 2) {
                let searchString = this.entity_search;
                setTimeout(() => {
                    if (this.entity_search == searchString) {
                        this.searchEntity();
                    }
                }, 150)
            }

            if (this.entity_search.trim().length == 0) {
                $(".ajax-autocomplete").attr("invalid", true);
            } else {
                $(".ajax-autocomplete").attr("invalid", false);
            }
        }
    },
    methods: {
        selectEntity: function (selected_entity) {
            this.entity_object = selected_entity;
        },
        deselectEntity: function () {
            this.entity_object = {
                nome: ""
            }
        },
        searchEntity: function () {
            let self = this;
            let domain = "";

            switch (this.ajaxtype) {
                case "clientes":
                    domain = "/customers/";
                    break;
                default: 
                    return;
            }

            let data = {
                search_string: this.entity_search
            }

            api.post(domain + "search", data).then((response) => {
                self.entities_list = response.data.returnObj;
            }).catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>
<style scoped>
</style>