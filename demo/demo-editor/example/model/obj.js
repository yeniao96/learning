import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
const objLoader = new OBJLoader()
const mtlLoader = new MTLLoader()

const group = new THREE.Group()

mtlLoader.load('http://127.0.0.1:5500/example/resource/stool.mtl', function(mtl) {
    mtl.preload()
    objLoader.setMaterials(mtl)
    objLoader.load('http://127.0.0.1:5500/example/resource/stool.obj', function(obj) {
        obj.children.forEach((child) => {
            child.material.side = THREE.DoubleSide
            child.castShadow = true
            // child.receiveShadow = true
        })
        group.add(obj)
        group.scale.set(10, 10, 10)
    }) 
})

export default group