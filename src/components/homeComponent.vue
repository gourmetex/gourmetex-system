<template>
    <div class="home">
        <h1>{{ today }}</h1>
    </div>
</template>
<script>
import moment from 'moment';

export default {
    name: "homeComponent",
    data() {
        return {
            today: null
        }
    },
    methods: {
        returnToday: function () {
            let today = moment().format("dddd") + ", " +  moment().format("LL");
            return today;
        }
    },
    mounted: function () {
        moment.locale("pt-br");

        this.today = this.returnToday();
    }
}
</script>