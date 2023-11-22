import * as THREE from "three"
const LightMap = {
    'point': THREE.PointLight,
    'direction': THREE.DirectionalLight,
    'ambient': THREE.AmbientLight,
    'spot': THREE.SpotLight
}
export default function useLight(type: ILigntType, pos: Vec3, color: IColor, intensity: IIntensity, shadowOpt?: ILightShadow) {
    const light = new LightMap[type]( color, intensity )
    light.position.set(pos.x, pos.y, pos.z)
    shadowOpt && (light.castShadow = true)
    return light
}