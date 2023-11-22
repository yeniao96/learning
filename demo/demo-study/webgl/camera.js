import Matrix4 from "matrix4"
const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
let program
let points = []

function createSharder(gl) {
    const vertexSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_TexCoord;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_perspectiveMatrix;
        varying vec4 v_Color;
        void main() {
            gl_Position = u_perspectiveMatrix * u_viewMatrix * u_modelMatrix * a_position;
            v_Color = a_color;
        }
    `
    const fragmentSource = `
        precision mediump float;
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color;
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

createSharder(gl)


// function createCube() {
//     const vertices = new Float32Array([
//         1.0, 1.0, 1.0, 1.0, 1.0, 1.0,1.0, //v0 white
//         -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,//v1 品红
//         -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,1.0, //v2 红色
//         1.0, -1.0, 1.0, 1.0, 1.0, 0.0,1.0, //v3 黄色
//         1.0, -1.0, -1.0, 0.0, 1.0, 0.0,1.0, //v4
//         1.0, 1.0, -1.0, 0.0, 1.0, 1.0,1, //v5
//         -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,1, //v6
//         -1.0, -1.0, -1.0, 0.0, 0.0, 0.0,1, //v7 
//     ])
//     const verticesIndexs = new Uint8Array([
//         0, 1, 2, 0, 2, 3, //front
//         0, 3, 4, 0, 4, 5, //right
//         0, 5, 6, 0, 6, 1, //up
//         1, 6, 7, 1, 7, 2, //left
//         7, 4, 3, 7, 3, 2, //bottom
//         4, 7, 6, 4, 6, 5 //behind
//     ])

//     renderCube(vertices, verticesIndexs)
// }

function createColorCube() {
    const vertices = new Float32Array([
        1.0, 1.0, 1.0, // front
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, -1.0, // right
        1.0, 1.0, 1.0, 
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0, // up
        -1.0, 1.0, -1.0, 
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, // left
        -1.0, 1.0, -1.0, 
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0, // bottom
        -1.0, -1.0, 1.0, 
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0, // behind
        1.0, 1.0, -1.0, 
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0
    ])
    const colors = new Float32Array([
        0.4,0.4,1.0,
        0.4,0.4,1.0,
        0.4,0.4,1.0,
        0.4,0.4,1.0, //front
        0.4,1.0,0.4,
        0.4,1.0,0.4,
        0.4,1.0,0.4,
        0.4,1.0,0.4, //right
        1.0,0.4,0.4,
        1.0,0.4,0.4,
        1.0,0.4,0.4,
        1.0,0.4,0.4, //up
        1.0,1.0,0.4,
        1.0,1.0,0.4,
        1.0,1.0,0.4,
        1.0,1.0,0.4, //left
        1.0,0.4,1.0,
        1.0,0.4,1.0,
        1.0,0.4,1.0,
        1.0,0.4,1.0, //btm
        0.4,1.0,1.0,
        0.4,1.0,1.0,
        0.4,1.0,1.0,
        0.4,1.0,1.0, //back
    ])
    const verticesIndexs = new Uint8Array([
        0, 1, 2, 0, 2, 3, //front
        4, 5, 6, 4, 6, 7, //right
        8, 9, 10, 8, 10, 11, //up
        12, 13, 14, 12, 14, 15, //left
        16, 17, 18, 16, 18, 19, //bottom
        20, 21, 22, 20, 22, 23 //behind
    ])

    renderCube(vertices, colors, verticesIndexs)
}

function createTriangle() { 
    points = []
    const vertices = new Float32Array([
        0.0, 0.5, 0.0, 0.9, 0.9, 0.9,
        -0.5, -0.5, 0.0, 0.9, 0.9, 0.9,
        0.5, -0.5, 0.0, 0.9, 0.9, 0.9,

        0.0, 0.5, -0.1, 0.8, 0.8, 0.8,
        -0.5, -0.5, -0.1, 0.8, 0.8, 0.8,
        0.5, -0.5, -0.1, 0.8, 0.8, 0.8,

        0.0, 0.5, -0.2, 0.7, 0, 0,
        -0.5, -0.5, -0.2, 0.7, 0, 0,
        0.5, -0.5, -0.2, 0.7, 0, 0

    ])
    points.push(...vertices)
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
    imgs.forEach((img, i) => {
        setTexture(i, img)
    })
}

let ex = 0;
let ey = 0;
let ez = 8;

function createViewMatrix() {

    const modelMatrix = new Matrix4()
    modelMatrix.setRotateY(Date.now() / (Math.PI * 1000)).setRotateZ(Date.now() / (Math.PI * 700))
    const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix')
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.matrix)
    const m = new Matrix4()
    m.setLookAt(ex, ey, ez, 0, 0, 0, 0, 1, 0)
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    gl.uniformMatrix4fv(u_viewMatrix, false, m.matrix || m.elements)

    const perspectiveMatrix = new Matrix4()
    // perspectiveMatrix.setPerspective(30, 1, 1.0, 100)
    // perspectiveMatrix.setPerspectiveByFovy(30, 1, 1.0, 100)
    perspectiveMatrix.setPerspective(-0.3, 0.3, -0.3, 0.3, 1.0, 100)
    const u_perspectiveMatrix = gl.getUniformLocation(program, 'u_perspectiveMatrix')
    gl.uniformMatrix4fv(u_perspectiveMatrix, false, perspectiveMatrix.matrix || perspectiveMatrix.elements)
}


function main() {
    run([0, 0], 0)
}

function run() {
    createViewMatrix()
    createColorCube()
    window.requestAnimationFrame(run)
}

function render () {

    const buffer = gl.createBuffer()
    const verticles = new Float32Array(points) 
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticles, gl.STATIC_DRAW)
    const Bytes = verticles.BYTES_PER_ELEMENT

    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, Bytes * 6, 0)
    gl.enableVertexAttribArray(aPosition)

    const a_color = gl.getAttribLocation(program, 'a_color')
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, Bytes * 6, Bytes * 3)
    gl.enableVertexAttribArray(a_color)

    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 9)
}

function renderCube (v, c, i) {
    const buffer = gl.createBuffer()
    const colorBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW)
    const Bytes = v.BYTES_PER_ELEMENT

    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, Bytes * 3, 0)
    gl.enableVertexAttribArray(aPosition)

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, c, gl.STATIC_DRAW)

    const a_color = gl.getAttribLocation(program, 'a_color')
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, c.BYTES_PER_ELEMENT * 3, 0)
    gl.enableVertexAttribArray(a_color)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i, gl.STATIC_DRAW)

    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
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
    main()
})

main()

window.document.onkeydown = function (e) {
    const { keyCode } = e
    console.log(keyCode)
    switch (keyCode) {
        case 37:
            ex -= 0.1
            break
        case 38:
            ey += 0.1
            break
        case 39:
            ex += 0.1
            break
        case 40:
            ey -= 0.1
            break
    }
    main()
}

let originX = 0
let originY = 0

function handleMove(e){
    const { offsetX, offsetY } = e
    const x = offsetX - originX
    const y = offsetY - originY
    ex -= x * 0.0005
    ey -= y * 0.000
    main()
}

function debounce(func) {
    let timer = null
    return function () {
        if(timer){ 
            return
        }
        func(...arguments)
        timer = setTimeout(() => {
            timer = null
        }, 0)
    } 
}
const move = debounce(handleMove)

const box = document.getElementById('box')

box.onmousedown = function (e) {
    const { offsetX, offsetY } = e
    originX = offsetX
    originY = offsetY
    box.addEventListener('mousemove', move)
}
box.onmouseup = function (e) {
    box.removeEventListener('mousemove', move)
}