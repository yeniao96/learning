<template>
    <ul class="model-bar-list">
    </ul>
</template>

<script setup lang="ts">
import { useSelectStore } from '../stores/select'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { watch } from 'vue'

const selectStore = useSelectStore()
watch(selectStore.currentModel, () => {
    const model = selectStore.currentModel.model
    if(model.position){
        // import gui
        const gui = new GUI()
        const modelControl = gui.addFolder('模型')
        modelControl.add(model.position, 'x', 0, 100)
        modelControl.add(model.position, 'y', 0, 100)
        modelControl.add(model.position, 'z', 0, 100)
        const obj = {
            color: model.material.color
        }
        modelControl.addColor(obj, 'color').onChange((val) =>{
            model.material.color.set(val)
        })
        const materialCfg = {
            metalness: model.material.metalness,
            roughness: model.material.roughness,
            envMapIntensity: model.material.envMapIntensity,
            clearcoat: model.material.clearcoat,
            clearcoatRoughness: model.material.clearcoatRoughness
        }
        modelControl.add(materialCfg, 'metalness', 0, 1).name('金属度').onChange((val) => {
            model.material.metalness = val
        })
        modelControl.add(materialCfg, 'roughness', 0, 1).name('粗糙度').onChange((val) => {
            model.material.roughness = val
        })
        modelControl.add(materialCfg, 'envMapIntensity', 0, 5).name('环境贴图强度').onChange((val) => {
            model.material.envMapIntensity = val
        })
        modelControl.add(materialCfg, 'clearcoat', 0, 1).name('清漆度').onChange((val) => {
            model.material.clearcoat = val
        })
        modelControl.add(materialCfg, 'clearcoatRoughness', 0, 1).name('清漆粗糙度').onChange((val) => {
            model.material.clearcoatRoughness = val
        })
    }
})

</script>

<style scoped lang="scss">
.model-bar-list{
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 80px;
    left: 10px;
    &-item{
        padding: 0;
        margin-bottom: 2px;
        width: 36px;
        height: 36px;
        border: 1px solid #666666;
        border-radius: 6px;
        background: rgba($color: #000000, $alpha: 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #000000;
        &:hover{
            background: rgba($color: #000000, $alpha: 0.4);
        }
    }
}
</style>