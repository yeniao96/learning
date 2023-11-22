import * as THREE from "three"
// add geometry
const group = new THREE.Group()
const group2 = new THREE.Group()
for(let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(20, 60, 10)
    const geometry2 = new THREE.BoxGeometry(20, 30, 10)
    const material = new THREE.MeshLambertMaterial({
        color: 0x00ff00
    })
    const material2 = material.clone()
    const mesh = new THREE.Mesh(geometry, material)
    const mesh2 = new THREE.Mesh(geometry2, material2)
    mesh.position.set(40 * i, 30, 5)
    mesh.name = `高${i}`
    mesh2.position.set(40 * i,15, 70)
    mesh2.name = `低${i}`
    group.add(mesh)
    group2.add(mesh2)
}
const collection = new THREE.Group()
collection.add(group, group2)

collection.traverse((obj) => {
    if(obj.isMesh){ 
        obj.material.color.set('#ff0000')
    }
})

const target = collection.getObjectByName('高1')
target.material.color.set('#0000ff')

export default collection