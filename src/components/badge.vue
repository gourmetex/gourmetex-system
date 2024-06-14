<template>
    <div class="badge" :style="'background: ' + col[2]" v-on:click="emitClick(col, rowkey)" :class="col[4] != '' ? 'clicable' : ''">
        <h3 :style="'color: ' + col[3]" v-html="col[1]"></h3>
    </div>
</template>
<script>
export default {
    name: "badgeComponent",
    props: ["col", "rowkey"],
    methods: {
        emitClick: function (data, rowKey) {
            if (data[4] != null && data[4] != '') {
                let returnData = data;
                returnData.push(rowKey);
                this.$emit("dataclick", returnData);
            }
        }
    }
}
</script>
<style scoped>
.badge {
    width: fit-content;
    min-width: 70px;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-lg);
}
</style>