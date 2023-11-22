import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const gltfLoader = new GLTFLoader()

const group = new THREE.Group()

gltfLoader.load('http://127.0.0.1:5500/example/resource/stool.gltf', function(model) {
    group.add(model.scene)
    group.scale.set(10, 10, 10)
})
export default group