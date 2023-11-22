import * as THREE from "three"

const geometry = new THREE.CircleGeometry(100, 128)
console.log(geometry)
const verticles = geometry.attributes.position.array

const uvs = verticles.map(item => (item / 200) * 0.8 + 0.5)

const uv = new THREE.BufferAttribute(new Float32Array(uvs.filter((p,i) => i % 3 !== 2)), 2)

geometry.attributes.uv = uv


const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('../img/earth.png')
const material = new THREE.MeshLambertMaterial({
    map: texture
})

const mesh = new THREE.Mesh(geometry, material)

export default mesh