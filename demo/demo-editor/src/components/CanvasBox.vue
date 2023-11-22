<template>
    <Teleport v-if="data.isLoading" to="body">
        <div class="loading">{{ data.loadingPercent }} %</div>
    </Teleport>
    <div id="canvas"></div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useActionStore } from '../stores/action'
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/addons/libs/stats.module.js'
import useLight from '../hooks/useLight.ts'
import useModel from '../hooks/useModel.ts'
import useModelHover from '../hooks/useModelHover.ts'
import useModelMove from '../hooks/useModelMove.ts'
import useModelSelect from '../hooks/useModelSelect.ts'

const width = window.innerWidth
const height = window.innerHeight
// 创建场景
const scene = new THREE.Scene()
// 点光源
const pointLight = useLight('point', {x: 50, y: 100, z: 100}, 0xffffff, 10000, {
    mapSize: {
        width: 2048,
        height: 2048
    },
    radius: 10,
    camera: {
        near: 1,
        far: 1000
    }
})
scene.add(pointLight)
// 环境光
const ambientLight = useLight('ambient', {x: 150, y: 100, z: 100}, 0xffffff, 0.1)
scene.add(ambientLight)

// 添加网格
const grid = new THREE.GridHelper(1000, 100, 0x333333, 0x333333)
scene.add(grid)

// 创建相机
const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 2000)
camera.position.set(100, 200, 200)
camera.lookAt(0,0,100)

// 创建坐标轴
const axesHelper = new THREE.AxesHelper( 50 )
scene.add(axesHelper)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
     antialias: true 
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x666666)
renderer.setSize(width, height)

// 设置控制轨道
const orbitControls = new OrbitControls(camera, renderer.domElement)
// 添加渲染监控
const stats = new Stats()

// 添加模型
const data = reactive({
    loadingPercent: 0,
    isLoading: false
})
function loadingFun (percent:number) {
    data.isLoading = true
    data.loadingPercent = Math.ceil(percent * 100)
    if(data.loadingPercent >= 100){ 
        data.isLoading = false
    }
}
const actionStore = useActionStore()
watch(actionStore.actionList, async () => {
    const action = actionStore.actionList[actionStore.actionList.length - 1]
    if(action.type === 'add'){
        console.log(action.target)
        
        const model = await useModel(action.target.type, [
            ...action.target.options
        ], loadingFun)
             
        scene.add(model)
    }
})

// 模型选中效果
let removeHover = useModelHover(camera, scene)


// 渲染
function render() {
    stats.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
}
onMounted(() => {
    const canvas = document.getElementById('canvas') as HTMLElement
    canvas.appendChild(renderer.domElement)
    document.body.appendChild(stats.domElement)
    // 模型点击
    useModelSelect(canvas, camera, scene)
    // 模型移动
    useModelMove(canvas, camera, scene, () => {
        removeHover()
        orbitControls.enabled = false
    }, () => {
        removeHover = useModelHover(camera, scene)
        orbitControls.enabled = true
    })
    render()
})

</script>

<style lang="scss">
.loading{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>