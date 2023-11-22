import * as THREE from "three"
// add geometry
const verticles = new Float32Array([
    0,0,50,
    50,0,0,
    50,50,0,
    0,50,0,
    0,50,50,
    50,0,50,
    50,50,50,
    0,0,0
])
const attributes = new THREE.BufferAttribute(verticles, 3)
const box = new THREE.BufferGeometry()
box.attributes.position = attributes
// add Lambert Material
const material = new THREE.PointsMaterial({
    color: 0x00ff00,
    size: 10
})
// create model
const point = new THREE.Points(box, material)
export default point