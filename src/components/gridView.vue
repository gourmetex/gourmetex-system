<template>
    <div class="custom-grid-container">
        <div class="loading" v-if="loading">
            <lottie-player id="loading" background="transparent" speed="1" loop autoplay></lottie-player></div>
        <div class="custom-grid" v-if="!loading" :class="gridoptions.length > 2 ? 'large-grid' : ''">
            <div class="grid-header">
                <div class="grid-header-cell" v-for="item in gridoptions" :key="item">
                    <h3 class="font-bold">{{ item }}</h3>
                </div>
            </div>
            <div class="grid-body">
                <div class="grid-row" v-for="(row, rowKey) in griddata" :key="rowKey" :id="'grid-row-' + rowKey">
                    <div class="grid-cell" v-for="(col, colKey) in row" :key="colKey">
                        <h3 v-if="col[0] == 'text'" v-on:click="emitClick(col, rowKey)" :class="col[2] != '' ? 'clicable' : ''">{{ col[1] }}</h3>
                        <badge v-if="col[0] == 'badge'" :content="col[1]" :backcolor="col[2]" :forecolor="col[3]"></badge>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import badge from './badge.vue';
import loadingJson from "../assets/animations/loading-component.json";

export default {
    name: "gridView",
    props: ["gridoptions", "griddata"],
    data() {
        return {
            loading: true
        }  
    },
    watch: {
        griddata: function () {
            this.loading = false;
        }
    },
    methods: {
        emitClick: function (data, rowKey) {
            if (data[2] != '') {
                let returnData = data;
                returnData.push(rowKey);
                this.$emit("dataclick", returnData);
            }
        }
    },
    mounted: function () {
        const player = document.querySelector("lottie-player");
        player.addEventListener("rendered", () => {
            player.load(
                loadingJson
            );
        });
    },
    components: {
        badge
    }
}
</script>
<style scoped>

#loading {
    width: 170px;
    margin: auto;
}

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
    background: var(--white);
}

.custom-grid.large-grid {
    min-width: var(--tablet);
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

.grid-row.row-selected, .grid-row:hover {
    background: var(--blue-high-2);
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
    text-decoration: underline;
}

@media (max-width: 768px) {
    .inner-page-system {
        width: 100vw;
        left: 0;
    }
}
</style>