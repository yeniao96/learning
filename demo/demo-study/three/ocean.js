import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Water } from 'three/addons/objects/Water.js'
import { Sky } from 'three/addons/objects/Sky.js'

class Ocean {
    container
    scene
    renderer
    camera
    controls
    sun
    water
    pmremGenerator
    sky
    resizeListener
    mousemoveListener
    isDestroy = true
    parameters = {
        elevation: 2,
        azimuth: 180,
    }

    constructor(id) {
        this.container = document.getElementById(id)
        if (!this.container) {
            console.log(`不存在id为{id}的HTMLElement`)
            return
        }
        this.isDestroy = false
        this.init()
        this.animate()
        this.addEventListener()
    }
    init() {
        // renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.container.appendChild(this.renderer.domElement)

        // scene
        this.scene = new THREE.Scene()

        // camera
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000)
        this.camera.position.set(30, 30, 100)

        // 太阳
        this.sun = new THREE.Vector3()

        // 水波
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000)

        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                'http://localhost:8081/img/ocean.jpg',
                function(texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
                },
            ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined,
        })
        this.water.rotation.x = -Math.PI / 2
        this.scene.add(this.water)

        // 天空盒
        this.sky = new Sky()
        this.sky.scale.setScalar(10000)
        this.scene.add(this.sky)

        const skyUniforms = this.sky.material.uniforms

        skyUniforms['turbidity'].value = 10
        skyUniforms['rayleigh'].value = 2
        skyUniforms['mieCoefficient'].value = 0.005
        skyUniforms['mieDirectionalG'].value = 0.8

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.updateSun()
            // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.maxPolarAngle = Math.PI * 0.495
        this.controls.target.set(0, 10, 0)
        this.controls.minDistance = 40.0
        this.controls.maxDistance = 200.0
        this.controls.update()
    }

    updateSun() {
        if (this.isDestroy) return
        const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation)
        const theta = THREE.MathUtils.degToRad(this.parameters.azimuth)

        this.sun.setFromSphericalCoords(1, phi, theta)

        this.sky.material.uniforms['sunPosition'].value.copy(this.sun)
        this.water.material.uniforms['sunDirection'].value.copy(this.sun).normalize()

        this.scene.environment = this.pmremGenerator.fromScene(this.sky).texture
    }
    animate() {
        if (this.isDestroy) return
        requestAnimationFrame(this.animate.bind(this))
        this.water.material.uniforms['time'].value += 1.0 / 60.0
        this.renderer.render(this.scene, this.camera)
    }
    addEventListener() {
        this.resizeListener = () => {
            try {
                this.onWindowResize()
            } catch (e) {
                window.removeEventListener('resize', this.resizeListener)
            }
        }
        window.addEventListener('resize', this.resizeListener)
    }
    onWindowResize() {
        if (this.isDestroy) return
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    clearScene() {
        this.scene.remove.apply(this.scene, this.scene.children)
        this.renderer.forceContextLoss()
        this.renderer.dispose()
        this.scene.clear()
        this.controls.dispose()
        this.scene = null
        this.camera = null
        this.container.removeChild(this.renderer.domElement)
        this.renderer.domElement = null
        this.renderer = null
    }

    destroy() {
        if (this.isDestroy) return
        this.isDestroy = true
        window.removeEventListener('resize', this.resizeListener)
        document.removeEventListener('mousemove', this.mousemoveListener, false)
        this.clearScene()
    }
}

new Ocean('box')