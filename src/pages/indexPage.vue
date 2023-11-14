<template>
    <appTemplate>
        <router-view path="$router.key" />
    </appTemplate>
</template>

<script>
import appTemplate from '../templates/appTemplate.vue';

export default {
    name: "indexPage",
    components: {
        appTemplate
    }
}
</script>

<style scoped>

</style>