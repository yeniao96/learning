const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
const box = document.getElementById('box')
const flagPoints = [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
let program
let points = []

class Matrix4 {
    constructor() {
        this.matrix = new Float32Array([
            1, 0, 0, 0,   
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
    }

    multiple (m1, m2) {
        const m = []
        for(let i = 0; i < 4; i++) { 
            for(let k = 0; k < 4; k++) {
                const j = 4 * k
                m[i + j] = m1[i] * m2[j] + m1[i+4] * m2[j+1] + m1[i+8] * m2[j+2] + m1[i+12] * m2[j+3]
            }
        }
        this.matrix = new Float32Array(m)
        return this.matrix
    }

    setTranslate(x, y, z) {
        const TMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            Math.abs(x) * (-0.5 + Math.abs(x)), -Math.abs(x) * 0.5, z, 1
        ])
        return this.multiple(TMatrix, this.matrix)
    }

    setScale(x, y, z) {
        const SMatrix = new Float32Array([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ])

        return this.multiple(SMatrix, this.matrix)
    }

    setRotate(angle) {
        const RMatrix = new Float32Array([
            Math.cos(angle), Math.sin(angle), 0, 0,
            -Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiple(RMatrix, this.matrix)
    }
}

function createSharder(gl) {
    const vertexSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_TexCoord;
        uniform mat4 u_xmatrix;
        uniform mat4 u_xscalematrix;
        uniform mat4 u_xtmatrix;
        varying vec4 v_Color;
        varying vec2 v_TexCoord;
        void main() {
            gl_Position = a_position;
            v_TexCoord = a_TexCoord;
        }
    `
    const fragmentSource = `
        precision mediump float;
        varying vec4 v_Color;
        varying vec2 v_TexCoord;
        uniform sampler2D u_Sampler0;
        uniform sampler2D u_Sampler1;
        uniform sampler2D u_Sampler2;
        void main() {
            vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
            vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
            vec4 color2 = texture2D(u_Sampler2, v_TexCoord);
            vec4 uv = vec4(gl_FragCoord.xyz / vec3(500, 500, 1.0), 1.0);
            if(uv.x < 0.5) {
                gl_FragColor = color0 * color2;
            }else{
                gl_FragColor = color1 * color2;
            }
        }
    `

    gl.shaderSource(vertexShader, vertexSource)
    gl.shaderSource(fragmentShader, fragmentSource)

    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)

    if(linkStatus){
        gl.useProgram(program)     
    }else{
        console.log(gl.getProgramInfoLog(program))
    }
}

// function createCircle(x, y) {
//     points = []
//     const temp = []
//     const pieces = 36
//     const r = 0.05
//     temp.push(x, y, 0.0, 1.0)
//     for(let i = 0; i <= pieces; i++){
//         const rad = i / (pieces / 2) * Math.PI
//         const radio = box.width / box.height

//         const px = x + (r * Math.sin(rad)) / radio
//         const py = y + r * Math.cos(rad)
//         temp.push(px, py, 0.0, 1.0)
//     }
//     points.push(...temp)
// }

function createTriangle(x, y) {
    points = []
    const offset = 0.5
    const x1 = x
    const y1 = y + offset
    const x2 = x - offset * Math.cos(1/6 * Math.PI)
    const y2 = y - offset * Math.sin(1/6 * Math.PI)
    const x3 = x + offset * Math.cos(1/6 * Math.PI)
    const y3 = y - offset * Math.sin(1/6 * Math.PI)
    points.push(x1, y1, 0.0, 0.0, x2, y2, 0.5, 1.0, x3, y3, 1.0, 0.0)
}

function render () {

    const buffer = gl.createBuffer()
    const verticles = new Float32Array(points)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticles, gl.STATIC_DRAW)
    const Bytes = verticles.BYTES_PER_ELEMENT

    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, Bytes * 4, 0)
    gl.enableVertexAttribArray(aPosition)

    const aTexCoord = gl.getAttribLocation(program, 'a_TexCoord')
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, Bytes * 4, Bytes * 2)
    gl.enableVertexAttribArray(aTexCoord)
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 4)
}
 
function setColor(point) {
    const colorArr = [new Uint32Array([1, 0, 0, 1]), new Uint32Array([0, 1, 0, 1]), new Uint32Array([0, 0, 1, 1]), new Uint32Array([1, 1, 1, 1])]
    const [x, y] = point
    const l = x > 0 ? 1 : 0 
    const h = y > 0 ? 2 : 0
    const t = l + h
    const color = colorArr[t]
    const uColor = gl.getUniformLocation(program, 'u_color')
    gl.uniform4f(uColor, ...color)
}

function createTranslateMatrix(x) {
    const matrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        Math.abs(x), 0.0, 0.0, 1.0
    ])
    const uMatrix = gl.getUniformLocation(program, 'u_xmatrix')
    gl.uniformMatrix4fv(uMatrix, false, matrix)
}

function createScaleMatrix(scale) {
    const targetScale = 1.0 + Math.abs(scale)
    const matrix = new Float32Array([
        targetScale, 0.0, 0.0, 0.0,
        0.0, targetScale, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        Math.abs(scale) * (-0.5 + Math.abs(scale)), -Math.abs(scale) * 0.5 , 0.0, 1.0
    ])
    const u_xscalematrix = gl.getUniformLocation(program, 'u_xscalematrix')
    gl.uniformMatrix4fv(u_xscalematrix, false, matrix)
}

function createTMatrix(step) {
    const matrixObj = new Matrix4()
    matrixObj.setRotate(Math.PI)
    // matrixObj.setScale(1 + step, 1 + step, 1)
    // matrixObj.setTranslate(step, 0, 0)
    const u_xtmatrix = gl.getUniformLocation(program, 'u_xtmatrix')
    gl.uniformMatrix4fv(u_xtmatrix, false, matrixObj.matrix)
}

function setTexture (i, img) {
    const texture = gl.createTexture()
    const uSampler = gl.getUniformLocation(program, `u_Sampler${i}`)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
    gl.activeTexture(gl[`TEXTURE${i}`])
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
    gl.uniform1i(uSampler, i)
}


// create texture
function initTexture(imgs) {
    main()
    
    imgs.forEach((img, i) => {
        setTexture(i, img)
    })


    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 4)

}

function run(start, step) {
    // createCircle(...start)
    createTriangle(...start)
    // createTranslateMatrix(step)
    // createScaleMatrix(step)
    // createTMatrix(Math.abs(step))
    // setColor([start[0] + step, start[1]])

    render()
    // window.requestAnimationFrame(() => {
    //     run(start, Math.sin((Date.now() - timestamp) / 3600))
    // })
}
const timestamp = Date.now()
createSharder(gl)

function main() {
    run([0, 0], 0)
}


function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function (e) {
            reject(e)
        }
    })
}

Promise.all([loadImage('../img/texture0.jpg'), loadImage('../img/texture3.jpg'), loadImage('../img/texture3.jpg')]).then((imgs) => {
    initTexture(imgs)
})
