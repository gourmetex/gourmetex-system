<template>
    <div class="color-select">
        <div class="colors-list">
            <div class="color" v-for="(color, index) in colors" :key="index" :style="'background: ' + color.cor" :colorid="color.id"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: "colorSelect",
    props: ["colors"]
}
</script>
<style scoped>
.colors-list, .color {
    width: 100%;
    height: 42px;
}
</style>