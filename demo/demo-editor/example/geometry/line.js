import * as THREE from "three"
// add geometry
const verticles = new Float32Array([
    0,0,50,
    50,0,50,
    50,0,0,
    0,0,0,
    0,50,0,
    50,50,0,
    50,50,50,
    0,50,50
])
const attributes = new THREE.BufferAttribute(verticles, 3)
const box = new THREE.BufferGeometry()
box.attributes.position = attributes
// add Lambert Material
const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    size: 10
})
// create model
// const line = new THREE.Line(box, material)
const line = new THREE.LineLoop(box, material)
// const line = new THREE.LineSegments(box, material)


export default line