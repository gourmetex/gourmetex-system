<template>
    <div>
        <headerComponent />
        <slot />
    </div>
</template>

<script>
import headerComponent from '../components/header.vue';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "appTemplate",
    mixins: [globalMethods],
    components: {
        headerComponent
    },
    data() {
        return {
            
        }
    },
    mounted: function () {
    }
}
</script>