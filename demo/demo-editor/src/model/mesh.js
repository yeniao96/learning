import * as THREE from "three"
// add geometry
const verticles = new Float32Array([
    0,0,0,
    50,0,0,
    50,50,0,
    0,50,0
])

const normals = new Float32Array([
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1
])
const normalAttributes = new THREE.BufferAttribute(normals, 3)

// 属性缓冲区对象
const attributes = new THREE.BufferAttribute(verticles, 3)
const box = new THREE.BufferGeometry()

const indexes = new Uint16Array([
    0,1,2,
    0,2,3
])
const indexAttributes = new THREE.BufferAttribute(indexes, 1)

box.attributes.position = attributes

box.index = indexAttributes

box.attributes.normal = normalAttributes

// add Lambert Material
const material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false,
    transparent: true,
    opacity: 0.5
})
// create model
// const line = new THREE.Line(box, material)
const mesh = new THREE.Mesh(box, material)
// const line = new THREE.LineSegments(box, material)


const geometry = new THREE.BoxGeometry( 10, 10, 10 )
const cube = new THREE.Mesh( geometry, material )
const v = new THREE.Vector3(2,1,1)
v.normalize()
cube.translateOnAxis(v, 100)
// create group
const group = new THREE.Group()
group.add(mesh)
group.add(cube)

group.rotateY(Math.PI / 2)


console.log(group)
export default group