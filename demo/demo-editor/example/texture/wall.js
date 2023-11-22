import * as THREE from "three"

const geometry = new THREE.PlaneGeometry(1000, 1000)

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('../img/wall.jpg')
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(32, 32)
const material = new THREE.MeshLambertMaterial({
    map: texture
})

const mesh = new THREE.Mesh(geometry, material)

function run(){
    texture.offset.x += 0.1
    texture.offset.y += 0.1
    window.requestAnimationFrame(run)
}
run()
export default mesh