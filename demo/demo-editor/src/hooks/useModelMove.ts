import * as THREE from "three"
import _ from 'lodash'

export default function useModelMove(canvas: HTMLElement, camera: THREE.Camera, scene: THREE.Scene, beforeCb: Function, after: Function) {

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    let currentModel: THREE.Group;
    let lastPointer = new THREE.Vector2()
    canvas.addEventListener('mousedown', (event) => {
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
        if(beforeCb){
            beforeCb()
        }
        (document.querySelector("body") as HTMLElement).style.cursor= "grabbing"
        currentModel = intersects[0]
        const handleMouseMove = (event: Event) => {
            const {clientX, clientY} = event
            const dx = clientX - lastPointer.x
            const dy = clientY - lastPointer.y
            lastPointer.x = clientX
            lastPointer.y = clientY
            currentModel.object.position.z += dy / 4
            currentModel.object.position.x += dx / 4
        }
        canvas.addEventListener('mousemove', handleMouseMove)

        const handleMouseUp = () => {
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)
            after && after()
        }
        canvas.addEventListener('mouseup', handleMouseUp)
    })
    
}