import Matrix4 from "matrix4"
const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
let program

function createSharder(gl) {
    const vertexSource = `
        attribute vec4 a_position;
        attribute vec2 a_TexCoord;
        attribute vec4 a_light;
        attribute vec3 a_lightColor;
        attribute float a_lightIntensity;
        attribute vec4 a_normal;
        uniform mat4 u_normalMatrix;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_perspectiveMatrix;
        uniform vec3 u_eye;
        varying vec3 v_Color;
        varying float v_dist;
        void main() {
            gl_Position = u_perspectiveMatrix * u_viewMatrix * u_modelMatrix * a_position;
            vec4 pl = a_light - a_position; 
            float dist = length(pl);
            float intensity = a_lightIntensity / pow(dist, 2.0);
            vec3 normal = normalize(vec3(u_normalMatrix * a_normal));
            vec3 diffuseColor = 2.0 * intensity * max(0.0, dot(vec3(pl.xyz), normal)) * a_lightColor;
            vec3 embientColor = 0.3 * a_lightIntensity * a_lightColor;
            v_Color = vec3(0.0, 0.0, 0.0) + diffuseColor + embientColor;
            v_dist = length( vec3( u_modelMatrix * a_position ) - u_eye );
        }
    `
    const fragmentSource = `
        precision mediump float;
        uniform vec4 u_fogColor;
        uniform vec2 u_fogDist;
        varying vec3 v_Color;
        varying float v_dist;
        void main() {
            float dist = clamp( (v_dist - u_fogDist.x) / (u_fogDist.y - u_fogDist.x), 0.0, 1.0 );
            gl_FragColor = vec4(mix(v_Color, vec3(u_fogColor), dist), 1.0);
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
    const normals = new Float32Array([
        0.0, 0.0, 1.0, // front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, // right
        1.0, 0.0, 0.0, 
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, // up
        0.0, 1.0, 0.0, 
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, // left
        -1.0, 0.0, 0.0, 
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, // bottom
        0.0, -1.0, 0.0, 
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, // behind
        0.0, 0.0, -1.0, 
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0
    ])

    renderCube(vertices, colors, verticesIndexs, normals)
}

let ex = -3;
let ey = 3;
let ez = 6;

function createViewMatrix() {
    const modelMatrix = new Matrix4()
    // modelMatrix.setRotateY(Date.now() / (Math.PI * 1000))
    const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix')
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.matrix || modelMatrix.elements)
    const u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix')
    gl.uniformMatrix4fv(u_normalMatrix, false, modelMatrix.invert().transpose().elements)
    const m = new Matrix4()
    m.setLookAt(ex, ey, ez, 0, 0, 0, 0, 1, 0)
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    gl.uniformMatrix4fv(u_viewMatrix, false, m.matrix || m.elements)
    const perspectiveMatrix = new Matrix4()
    perspectiveMatrix.setPerspective(30, 1, 1, 3000)
    const u_perspectiveMatrix = gl.getUniformLocation(program, 'u_perspectiveMatrix')
    gl.uniformMatrix4fv(u_perspectiveMatrix, false, perspectiveMatrix.matrix || perspectiveMatrix.elements)
}

function renderCube (v, c, i, n) {
    const buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW)
    const Bytes = v.BYTES_PER_ELEMENT

    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, Bytes * 3, 0)
    gl.enableVertexAttribArray(aPosition)

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, n, gl.STATIC_DRAW)

    const a_normal = gl.getAttribLocation(program, 'a_normal')
    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, c.BYTES_PER_ELEMENT * 3, 0)
    gl.enableVertexAttribArray(a_normal)

    const indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i, gl.STATIC_DRAW)

    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(53/255, 39/255, 68/255, 1)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

function createLight() {
    const a_light = gl.getAttribLocation(program, 'a_light')
    gl.vertexAttrib4f(a_light, -2, 2, 2, 1)
    const a_lightColor = gl.getAttribLocation(program, 'a_lightColor')
    gl.vertexAttrib3f(a_lightColor, 1, 0.5, 0.5)
    const a_lightIntensity = gl.getAttribLocation(program, 'a_lightIntensity')
    gl.vertexAttrib1f(a_lightIntensity, 1)
}

function createFog() {
    const u_fogColor = gl.getUniformLocation(program, 'u_fogColor')
    gl.uniform4f(u_fogColor, 53/255, 39/255, 68/255, 1)
    const u_fogDist = gl.getUniformLocation(program, 'u_fogDist')
    gl.uniform2f(u_fogDist, 0, 10)
    const u_eye = gl.getUniformLocation(program, 'u_eye')
    gl.uniform3f(u_eye, ex, ey, ez)
}


function run() {
    createViewMatrix()
    createFog()
    createLight()
    createColorCube()
    window.requestAnimationFrame(run)
}

run()

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
    run()
}

let originX = 0
let originY = 0

function handleMove(e){
    const { offsetX, offsetY } = e
    const x = offsetX - originX
    const y = offsetY - originY
    ex -= x * 0.0005
    ey -= y * 0.000
    run()
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