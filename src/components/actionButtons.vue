<template>
    <div class="action-buttons-component">
        <div class="buttons-container">
            <button class="btn-big btn-primary" v-if="add_text">
                {{ add_text }}
                <span class="material-icons">add</span>
            </button>
            <button class="btn-big btn-red" v-if="exclude_text">
                {{ exclude_text }}
                <span class="material-icons">close</span>
            </button>
            <button class="btn-big btn-yellow" v-if="edit_text">
                {{ edit_text }}
                <span class="material-icons">edit</span>
            </button>
        </div>  
    </div>
</template>
<script>

export default {
    name: "actionButtonsComponent",
    props: ["add_text", "exclude_text", "edit_text"]
}
</script>
<style scoped>
.buttons-container {
    display: flex;
    flex-wrap: wrap;
}
</style>