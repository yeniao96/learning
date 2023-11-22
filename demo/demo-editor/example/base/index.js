import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
const canvas = document.getElementById('box')
const width = window.innerWidth
const height = window.innerHeight
console.log(width)
// create scene
const scene = new THREE.Scene()
// add geometry
const box = new THREE.SphereGeometry(10)
// add material
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     transparent: true,
//     opacity: 0.7
// })
// add Lambert Material
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    transparent: false,
    opacity: 0.7
})
// create model
const model = new THREE.Mesh(box, material)
// set position
model.position.set(0,0,-5)
// scene add model
scene.add(model)

// add point light
const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(150, 100, 100)
scene.add(pointLight)
const sphereSize = 10;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );
// add ambient light
const ambientLight = new THREE.AmbientLight( 0x404040, 0 )
scene.add( ambientLight )
// add direct light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 )
directionalLight.position.set(-150, 0, 0)
directionalLight.target = model
scene.add( directionalLight )
const helper = new THREE.DirectionalLightHelper( directionalLight, 5 )
scene.add( helper )
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
    model.rotateY(0.01)
    renderer.render(scene, camera)
    window.requestAnimationFrame(rotate)
}
rotate()

// update w / h when window change
// window.onresize = function () {
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
// }

for(let i = 0; i < 100; i++){
    for(let j = 0; j < 100; j++){ 
        // const box = new THREE.BoxGeometry(10,10,10)
        // const box = new THREE.SphereGeometry(10)
        // const box = new THREE.CylinderGeometry(5, 10, 10)
        // const box = new THREE.PlaneGeometry(10, 10)
        const box = new THREE.CircleGeometry(10)


        // const material = new THREE.MeshLambertMaterial({
        //     color: 0xff0000,
        //     side: THREE.DoubleSide
        // })
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(box, material)
        mesh.position.x = i * 20
        mesh.position.y = 0
        mesh.position.z = j * 20
        // scene.add(mesh)
    }
}

// import gui
const gui = new GUI()
const modelControl = gui.addFolder('模型')
modelControl.add(model.position, 'x', 0, 100)
modelControl.add(model.position, 'y', 0, 100)
modelControl.add(model.position, 'z', 0, 100)
const obj = {
    color: 0x00ff00
}
modelControl.addColor(obj, 'color').onChange((val) =>{
    console.log(12312, val)
    model.material.color.set(val)
})

// light control
const lightControl = gui.addFolder('光照')
const lightColor = lightControl.addFolder('颜色')
const lightColorCfg = {
    ambientColor: 0xffffff,
    pointColor: 0xffffff,
    directionalColor: 0xffffff,
}
lightColor.addColor(lightColorCfg, 'ambientColor').name('环境光').onChange((val) => {
    ambientLight.color.set(val)
})
lightColor.addColor(lightColorCfg, 'pointColor').name('点光源').onChange((val) => {
    pointLight.color.set(val)
})
lightColor.addColor(lightColorCfg, 'directionalColor').name('平行光').onChange((val) => {
    directionalLight.color.set(val)
})

const lightIntensity = lightControl.addFolder('强度')
const lightIntensityCfg = {
    ambientIntensity: 0.1,
    pointIntensity: 0.1,
    directionalIntensity: 0.1,
}
lightIntensity.add(lightIntensityCfg, 'ambientIntensity', 0, 2).name('环境光').onChange((val) => {
    ambientLight.intensity = val
})
lightIntensity.add(lightIntensityCfg, 'pointIntensity', 0, 2).name('点光源').onChange((val) => {
    pointLight.intensity = val
})
lightIntensity.add(lightIntensityCfg, 'directionalIntensity', 0, 2).name('平行光').onChange((val) => {
    directionalLight.intensity = val
})

