import * as THREE from "three"

const geometry = new THREE.BufferGeometry()

const verticles = new THREE.BufferAttribute(new Float32Array([
    0,0,0,
    160, 0,0,
    160, 80, 0,
    0, 80,0
]), 3)

geometry.attributes.position = verticles

const indexs = new THREE.BufferAttribute(new Uint16Array([
    0,1,2,
    0,2,3
]), 1)

geometry.index = indexs

const uv = new THREE.BufferAttribute(new Float32Array([
    0,0,
    0.1,0,
    0.1,0.1,
    0,0.1
]), 2)

geometry.attributes.uv = uv

const n = new THREE.BufferAttribute(new Float32Array([
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1
]), 3)

geometry.attributes.normal = n

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('../img/earth.png')
const material = new THREE.MeshLambertMaterial({
    map: texture
})

const mesh = new THREE.Mesh(geometry, material)

export default mesh