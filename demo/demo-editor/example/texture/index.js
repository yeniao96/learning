import * as THREE from "three"
import bufferGeo from './uv.js'
import circleGeo from './circle.js'
import wallGeo from './wall.js'
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
const grid = new THREE.GridHelper(1000, 100, 0xffffff, 0xffffff)
scene.add(grid)
// scene.add(mesh)
// scene.add(bufferGeo)
// scene.add(circleGeo)
scene.add(wallGeo)


const light = new THREE.AmbientLight(0xffffff, 1)
light.position.set(150, 100, 100)

scene.add(light)

const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 2000)

camera.position.set(0, 50, 500)

camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setClearColor(0x000000)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width, height)

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