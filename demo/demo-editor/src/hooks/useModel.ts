import * as THREE from "three"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import '../assets/img/posx.jpg'
import '../assets/img/posy.jpg'
import '../assets/img/posz.jpg'
import '../assets/img/negx.jpg'
import '../assets/img/negy.jpg'
import '../assets/img/negz.jpg'

class GltfModel{
    name: String
    loadingFun: Function
    constructor(name: string, loadingFun: Function) {
        this.name = name
        this.loadingFun = loadingFun
    }

    loadModel() {
        const gltfLoader = new GLTFLoader()

        const group = new THREE.Group()

        return new Promise((resolve) => {
            gltfLoader.load(`../assets/img/${this.name}.glb`, function(model) {
                group.add(model.scene)
                group.scale.set(10, 10, 10)
                resolve(group)
            }, (event) => { 
                const {loaded, total} = event
                this.loadingFun(loaded / total)
            })
        })
    }
}

class HeartGeometry{
    constructor() {
        this.model = this.initHeart()        
    }

    initHeart() {
        let resultArr = [], itemKeyVal = {}
        const verticles = []
        for(let x = -1.12; x <= 1.12; x+=0.02) {
            for(let y = -0.96; y <= 1.2; y+=0.02) {
                for(let z = -0.64; z <= 0.64; z+=0.02) {
                    if(this.findPoint(x, y, z)){ 
                        if (!itemKeyVal[`${x}_${y}_${z}`]) {
                            itemKeyVal[`${x}_${y}_${z}`] = true
                            verticles.push(x, y, z)
                        }
                    }
                }
            }   
        }
        const attributes = new THREE.BufferAttribute(new Float32Array(verticles), 3)
        const box = new THREE.BufferGeometry()
        box.attributes.position = attributes
        const material = new THREE.PointsMaterial({
            color: 0x990000,
            size: 0.1
        })
        const points = new THREE.Points(box, material)
        points.scale.set(20, 20, 20)
        points.position.set(0, 20, 0)
        return points
    }

    findPoint(x: number, y: number, z: number) {
        const func = Math.pow(Math.pow(x, 2) + 9 / 4 * Math.pow(z, 2) + Math.pow(y, 2) - 1, 3) - Math.pow(x, 2) * Math.pow(y, 3) - 9 / 80 * Math.pow(z, 2) * Math.pow(y, 3)
        if (func == 0 || func < 0) {
            return true
        }
        return false
    }
}
const modelMap = {
    'sphere': THREE.SphereGeometry,
    'cube': THREE.BoxGeometry,
    'pyramid': THREE.ConeGeometry,
    'cylinder': THREE.CylinderGeometry,
    'heart': HeartGeometry,
    'stool': GltfModel
}

function createEnvMap(rootPath: string) {
    const envMap = new THREE.CubeTextureLoader()
                    .setPath(rootPath)
                    .load(['posx.jpg','negx.jpg','posz.jpg','negz.jpg','posy.jpg','negy.jpg'])
    return envMap
}

export default async function useModel(type:string, options:any, loadingFun: Function) {
    const model = new modelMap[type](...options)
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.3,
        envMap: createEnvMap('./src/assets/img/'),
        envMapIntensity: 2.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    })
    if(type === 'heart') {
        return model.model
    }
    if(type === 'stool') {
        const obj = await model.loadModel()
        return obj
    }
    const mesh = new THREE.Mesh(model, material)
    mesh.position.set(0, 20, 0)

    return mesh
}