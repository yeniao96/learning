declare type Vec3 = {
    x: Number,
    y: Number,
    z: Number
}

declare type Vec4 = {
    x: Number,
    y: Number,
    z: Number,
    w: Number
}

declare type IColor = Number

declare type IIntensity = Number

declare type ILigntType = 'point' | 'direction' | 'ambient' | 'spot'

declare type ILightShadow = {
    mapSize: {
        width: Number,
        height: Number
    },
    radius: Number,
    camera: {
        near: Number,
        far: Number
    }
}