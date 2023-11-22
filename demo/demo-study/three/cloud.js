/** @format */
import * as THREE from 'three'
import * as BufferGeometryUtils  from 'three/addons/utils/BufferGeometryUtils.js'
class CloudView {

  mouseX = 0
  mouseY = 0
  start_time = Date.now()

  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  isDestroy = true

  constructor(id) {
    this.container = document.getElementById(id)
    if (!this.container) {
      console.log(`不存在id为{id}的HTMLElement`)
      return
    }
    this.isDestroy = false
    this.init()
    this.addEventListener()
  }

  init() {
    //bg
    this.container.style['background-image'] = 'linear-gradient(#1e4877, #4584b4,#1e4877)'
    //camera
    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 3000)
    this.camera.position.z = 6000
    //scene
    this.scene = new THREE.Scene()

    var texture = new THREE.TextureLoader().load(
      'http://localhost:8081/img/cloud.png',
      this.animate.bind(this),
    )
    texture.magFilter = THREE.LinearMipMapLinearFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter

    let fog = new THREE.Fog(0x4584b4, -100, 3000)

    const vs = `
varying vec2 vUv;

void main() {

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
    `

    const fs = `
uniform sampler2D map;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;

void main() {

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( fogNear, fogFar, depth );

  gl_FragColor = texture2D( map, vUv );
  gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
  gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}
    `

    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: {value: texture},
        fogColor: {value: fog.color},
        fogNear: {value: fog.near},
        fogFar: {value: fog.far},
      },
      vertexShader: vs,
      fragmentShader: fs,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    })

    const geometries = []

    const plane = new THREE.PlaneGeometry(64, 64)
    const position = new THREE.Vector3()
    const rotation = new THREE.Euler()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()

    for (var i = 0; i < 8000; i++) {
      const matrix = new THREE.Matrix4()
      position.x = Math.random() * 1000 - 500
      position.y = -Math.random() * Math.random() * 200 - 15
      position.z = i
      rotation.z = Math.random() * Math.PI
      quaternion.setFromEuler(rotation)
      scale.x = scale.y = Math.random() * Math.random() * 1.5 + 0.5
      matrix.compose(position, quaternion, scale)
      geometries.push(plane.clone().applyMatrix4(matrix))
    }
    console.log('geometries',geometries)
    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    geometry.computeBoundingSphere()
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
    const mesh2 = mesh.clone()
    mesh2.position.z = -8000
    this.scene.add(mesh2)

    this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    console.log(this.renderer.domElement)
    this.container.appendChild(this.renderer.domElement)
  }
  onDocumentMouseMove(event) {
    if (this.isDestroy) {
      return
    }
    this.mouseX = (event.clientX - this.windowHalfX) * 0.25
    this.mouseY = (event.clientY - this.windowHalfY) * 0.15
  }

  animate() {
    if (this.isDestroy) {
      return
    }
    requestAnimationFrame(this.animate.bind(this))
    const position = ((Date.now() - this.start_time) * 0.03) % 8000
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.01
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.01
    this.camera.position.z = -position + 8000
    this.renderer.render(this.scene, this.camera)
  }
  addEventListener() {
    this.mousemoveListener = this.onDocumentMouseMove.bind(this)
    this.resizeListener = () => {
      try {
        this.onWindowResize()
      } catch (e) {
        window.removeEventListener('resize', this.resizeListener)
      }
    }
    window.addEventListener('resize', this.resizeListener)
    document.addEventListener('mousemove', this.mousemoveListener, false)
  }
  onWindowResize() {
    if (this.isDestroy) {
      return
    }
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  clearScene() {
    this.scene.remove.apply(this.scene, this.scene.children)
    this.renderer.forceContextLoss()
    this.renderer.dispose()
    this.scene.clear()
    this.scene = null
    this.camera = null
    this.container.removeChild(this.renderer.domElement)
    this.renderer.domElement = null
    this.renderer = null
  }
  destroy() {
    if (this.isDestroy) {
      return
    }
    this.isDestroy = true
    window.removeEventListener('resize', this.resizeListener)
    document.removeEventListener('mousemove', this.mousemoveListener, false)
    this.clearScene()
  }
}

new CloudView('box')
