import * as THREE from "three"
import _ from 'lodash'
import { useSelectStore } from '../stores/select'

export default function useModelSelect(canvas: HTMLElement, camera: THREE.Camera, scene: THREE.Scene) {
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    let lastPointer = new THREE.Vector2()
    canvas.addEventListener('click', (event) => {
        lastPointer.x = event.clientX
        lastPointer.y = event.clientY
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera( pointer, camera )
    
        // 计算物体和射线的焦点
        let intersects = raycaster.intersectObjects( scene.children )
        intersects = intersects.filter((item) => item.object && item.object.type !== 'GridHelper')

        if(intersects.length <= 0) {
            return
        }
        const { addModel } = useSelectStore()
        console.log(1231, intersects[0].object)

        addModel(intersects[0].object)
    })
}