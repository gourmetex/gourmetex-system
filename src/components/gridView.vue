<template>
    <div class="custom-grid-container">
        <div class="custom-grid">
            <div class="grid-header">
                <div class="grid-header-cell" v-for="item in gridoptions" :key="item">
                    <h3 class="font-bold">{{ item }}</h3>
                </div>
            </div>
            <div class="grid-body">
                <div class="grid-row" v-for="(row, index) in griddata" :key="index">
                    <div class="grid-cell" v-for="col in row" :key="col[1]">
                        <h3 v-if="col[0] == 'text'" v-on:click="emitClick(col)" :class="col[2] != undefined ? 'clicable' : ''">{{ col[1] }}</h3>
                        <badge v-if="col[0] == 'badge'" :content="col[1]" :backcolor="col[2]" :forecolor="col[3]"></badge>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import badge from './badge.vue';

export default {
    name: "gridView",
    props: ["gridoptions", "griddata"],
    methods: {
        emitClick: function (data) {
            if (data[2] != undefined) {
                this.$emit("dataclick", data);
            }
        }
    },
    components: {
        badge
    }
}
</script>
<style scoped>
.custom-grid-container {
    width: 100%;
    height: fit-content;
    max-height: 68vh;
    overflow: auto;
    border-radius: var(--radius-sm);
    border: 1px solid var(--gray-2);
    margin: var(--space-4) 0;
    position: relative;
}

.custom-grid {
    width: 100%;
    min-width: var(--tablet);
    background: var(--white);
}

.grid-header {
    position: sticky;
    width: 100%;
    top: 0;
    left: 0;
    background: var(--white);
}

.grid-header, .grid-row {
    padding: var(--space-4);
    border-bottom: 1px solid var(--gray-3);
}

.grid-row:last-child {
    border: none;
}

.grid-header-cell, .grid-cell {
    width: 100%;
    display: flex;
    justify-content: center;
}

.grid-header, .grid-row {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.clicable {
    cursor: pointer;
}

@media (max-width: 768px) {
    .inner-page-system {
        width: 100vw;
        left: 0;
    }
}
</style>