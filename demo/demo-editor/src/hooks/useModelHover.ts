import * as THREE from "three"
import _ from 'lodash'

export default function useModelHover(camera: THREE.Camera, scene: THREE.Scene) {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    function onPointerMove( event: any ) {
        (document.querySelector("body") as HTMLElement).style.cursor= "default"
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera( pointer, camera );
    
        // 计算物体和射线的焦点
        let intersects = raycaster.intersectObjects( scene.children );
        intersects = intersects.filter((item) => item.object && item.object.type !== 'GridHelper')
        
        if(intersects.length > 0) {
            (document.querySelector("body") as HTMLElement).style.cursor= "grab"
        }
    }
    const fun = _.debounce(onPointerMove, 100, { 'maxWait': 500 })
    window.addEventListener( 'pointermove', fun );
    
    function removeHover() {
        window.removeEventListener( 'pointermove', fun )
    }
    return removeHover
}