<template>
    <ul class="model-bar-list">
        <li v-for="item in modelTypes" :key="item.icon" class="model-bar-list-item" :title="item.name" @click="addModel(item)">
            <svg-icon :icon-name="item.icon" width="18" height="18"></svg-icon>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useActionStore } from '../stores/action'

const modelTypes = reactive([
    {
        name: '球体',
        icon: 'sphere',
        type: 'sphere',
        options: [20, 32, 16]
    },
    {
        name: '正方体',
        icon: 'cube',
        type: 'cube',
        options: [20, 20, 20]
    },
    {
        name: '棱锥',
        icon: 'pyramid',
        type: 'pyramid',
        options: [20, 20, 32]
    },
    {
        name: '圆柱',
        icon: 'cylinder',
        type: 'cylinder',
        options: [20, 20, 50, 32]
    },
    {
        name: '心形',
        icon: 'heart',
        type: 'heart',
        options: []
    },
    {
        name: '模型',
        icon: 'stool',
        type: 'stool',
        options: ['stool']
    }
])
const actionStore = useActionStore()
const addModel = (item: any) => {
    actionStore.addAction({
        type: 'add',
        target: item
    })
}

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