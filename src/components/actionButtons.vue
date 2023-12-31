<template>
    <div class="action-buttons-component">
        <div class="buttons-container">
            <button class="btn-big btn-primary" v-if="add_text" v-on:click="add()">
                {{ add_text }}
                <span class="material-icons">add</span>
            </button>
            <button class="btn-big btn-red" v-if="exclude_text" v-on:click="exclude()">
                {{ exclude_text }}
                <span class="material-icons">close</span>
            </button>
            <button class="btn-big btn-yellow" v-if="edit_text" v-on:click="edit()">
                {{ edit_text }}
                <span class="material-icons">edit</span>
            </button>
        </div>  
    </div>
</template>
<script>

export default {
    name: "actionButtonsComponent",
    props: ["add_text", "exclude_text", "edit_text"],
    methods: {
        add: function () {
            this.$emit("add");
        },
        exclude: function () {
            this.$emit("exclude");
        },
        edit: function () {
            this.$emit("edit");
        }
    }
}
</script>
<style scoped>
.buttons-container {
    display: flex;
    flex-wrap: wrap;
}
</style>