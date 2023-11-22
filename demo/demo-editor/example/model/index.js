import * as THREE from "three"
import gltf from './gltf.js'
import obj from './obj.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const canvas = document.getElementById('box')
const width = window.innerWidth
const height = window.innerHeight

const geometry = new THREE.SphereGeometry(100, 256, 128)

const textureLoader = new THREE.TextureLoader()

const texture = textureLoader.load('../img/earth.png')

const material = new THREE.MeshLambertMaterial({
    map: texture
})

const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0,0,0)

const scene = new THREE.Scene()
// const grid = new THREE.GridHelper(1000, 100, 0xffffff, 0xffffff)
// scene.add(grid)

const floor = new THREE.PlaneGeometry(500, 500)
const floorMtl = new THREE.MeshLambertMaterial({
    color: 0xffffff
})
floorMtl.shadowSide = THREE.DoubleSide

const floorMesh = new THREE.Mesh(floor, floorMtl)
floorMesh.receiveShadow = true
floorMesh.rotateX(-Math.PI / 2)
scene.add(floorMesh)
scene.add(obj)
// scene.add(gltf)


const plight = new THREE.PointLight(0xffffff, 0.2)
plight.position.set(50, 50, 50)
plight.castShadow = true
plight.shadow.mapSize.width = 2048
plight.shadow.mapSize.height = 2048
plight.shadow.radius = 12
plight.shadow.camera.near = 1
plight.shadow.camera.far = 1000

const pointLightCameraHelper = new THREE.CameraHelper(plight.shadow.camera)
scene.add(pointLightCameraHelper)

scene.add(plight)

const spotLight = new THREE.SpotLight(0xffffff, 1, 1000, Math.PI * 0.2)
spotLight.castShadow = true
spotLight.position.set(-50, 50, 50)
spotLight.shadow.mapSize.width = 2048
spotLight.shadow.mapSize.height = 2048
spotLight.shadow.camera.fov = 10
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)


// const dlight = new THREE.DirectionalLight(0xffffff, 1)
// dlight.position.set(50, 50, 50)
// scene.add(dlight)

// const light = new THREE.AmbientLight(0xffffff, 1)
// light.position.set(15, 10, 10)

// scene.add(light)

const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 2000)

camera.position.set(100, 100, 100)

camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setClearColor(0x000000)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.render(scene, camera)

canvas.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

function render() {
    renderer.render(scene, camera)
    window.requestAnimationFrame(render)
}

render()

const axesHelper = new THREE.AxesHelper( 50 )

scene.add(axesHelper)