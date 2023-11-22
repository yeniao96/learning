import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import point from "./point.js"
import line from "./line.js"
import mesh from "./mesh.js"
import group from "./group.js"
const canvas = document.getElementById('box')
const width = window.innerWidth
const height = window.innerHeight
console.log(width)
// create scene
const scene = new THREE.Scene()

// const model = point
// const model = line
// const model = mesh
const model = group
// set position
// model.position.set(0,0,0)
// scene add model
scene.add(model)

// add point light
const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(150, 100, 100)
// scene.add(pointLight)
const sphereSize = 10;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );
const directLight = new THREE.DirectionalLight(0xffffff, 1)
directLight.position.set(100, 60, 50)
scene.add(directLight)
// add ambient light
const ambientLight = new THREE.AmbientLight( 0x404040, 0 )
scene.add( ambientLight )
// create camera
const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 2000)
// set camera postion
camera.position.set(100, 200, 200)
// set lookat
camera.lookAt(0,0,100)

// create axes
const axesHelper = new THREE.AxesHelper( 50 )
// add axes
scene.add(axesHelper)

// create renderer
const renderer = new THREE.WebGLRenderer({
     antialias: true 
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x666666)
renderer.setSize(width, height)

const control = new OrbitControls(camera, renderer.domElement)

// render
renderer.render(scene, camera)
// add render result to dom
canvas.appendChild(renderer.domElement)

// create clock
const clock = new THREE.Clock()
// add stats
const stats = new Stats()
document.body.appendChild(stats.domElement)
// rotate
function rotate() {
    stats.update()
    const spt = clock.getDelta() * 1000
    // model.rotateY(0.01)
    renderer.render(scene, camera)
    window.requestAnimationFrame(rotate)
}
rotate()


