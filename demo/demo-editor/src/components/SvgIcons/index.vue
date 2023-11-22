<template>
    <svg :style="svgStyle" class="svg-icon">
        <use :xlink:href="`#icon-${iconName}`" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
    iconName: String,
    width?: Number,
    height?: Number
}>()

const svgStyle = computed(()=>{
    return `width: ${props.width}px; height: ${props.height}px;`
})
</script>

<style scoped>
.svg-icon{
    color: #eeeeee;
    fill: currentColor;
}
</style>