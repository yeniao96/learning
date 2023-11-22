<template>
    <div class="editor-container">
        <ModelBar />
        <ConfigBar />
        <canvas-box />
    </div>
</template>

<script setup lang="ts">
import CanvasBox from '../../components/CanvasBox.vue'
import ModelBar from '../../components/ModelBar.vue'
import ConfigBar from '../../components/ConfigBar.vue'
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>