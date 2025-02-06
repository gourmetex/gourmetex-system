<template>
    <div class="badge" :style="'background: ' + background">
        <h3 :style="'color: ' + getContrastColorFromCssVariable(background)" v-html="text"></h3>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "newBadge",
    props: ["background", "label", "text"],
    methods: {
        getContrastColorFromCssVariable(variable) {
            let $tempElement = $("<div>").css("color", variable).appendTo("body");
            let computedColor = $tempElement.css("color");

            $tempElement.remove();

            let hexColor = this.rgbToHex(computedColor);
            let contrastColor = this.calculateContrastColor(hexColor);

            return contrastColor;
        },
        rgbToHex(rgb) {
            let result = rgb.match(/\d+/g);
            if (!result || result.length < 3) return null;

            let r = parseInt(result[0]);
            let g = parseInt(result[1]);
            let b = parseInt(result[2]);

            return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
        },
        calculateContrastColor(hexColor) {
            let r = parseInt(hexColor.slice(1, 3), 16);
            let g = parseInt(hexColor.slice(3, 5), 16);
            let b = parseInt(hexColor.slice(5, 7), 16);

            let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            return luminance > 0.5 ? "#000000" : "#FFFFFF";
        }
    }
}
</script>
<style scoped>
.badge {
    margin: auto;
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