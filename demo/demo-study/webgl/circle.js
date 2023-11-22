// 点击添加图形
const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
const box = document.getElementById('box')
const vertexSource = `
    attribute vec4 a_position;

    void main() {
        gl_Position = a_position;
    }
`
const fragmentSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`

gl.shaderSource(vertexShader, vertexSource)
gl.shaderSource(fragmentShader, fragmentSource)


gl.compileShader(vertexShader)
gl.compileShader(fragmentShader)

const program = gl.createProgram()

gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

gl.linkProgram(program)

const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)

if(linkStatus){
    gl.useProgram(program)     
}else{
    console.log(gl.getProgramInfoLog(program))
}
const points = []

function createTriangle(x, y) {
    const offset = 0.05
    const x1 = x
    const y1 = y + offset
    const x2 = x - offset * Math.cos(1/3 * Math.PI)
    const y2 = y - offset * Math.sin(1/3 * Math.PI)
    const x3 = x + offset * Math.cos(1/3 * Math.PI)
    const y3 = y - offset * Math.sin(1/3 * Math.PI)

    points.push([x1, y1, x2, y2, x3, y3])
}

function createCircle(x, y) {
    const temp = []
    const pieces = 36
    const r = 0.05
    temp.push(x, y)
    for(let i = 0; i <= pieces; i++){
        const rad = i / (pieces / 2) * Math.PI
        console.log(i / (pieces / 2), x, y, r * Math.sin(rad), r * Math.cos(rad))
        const radio = box.width / box.height

        const px = x + (r * Math.sin(rad)) / radio
        const py = y + r * Math.cos(rad)
        temp.push(px, py)
    }
    points.push(temp)
}

gl.clearColor(0, 0, 0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

function render (index) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points[index]), gl.STATIC_DRAW)
    const aPosition = gl.getAttribLocation(program, 'a_position')

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPosition)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points[index].length / 2)
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

window.addEventListener('click', function (e) {
    gl.clearColor(0, 0, 0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const x = (e.offsetX / box.width) * 2 - 1 
    const y = 1 - (e.offsetY / box.height) * 2
    // createTriangle(x, y)
    createCircle(x, y)
    for(let i = 0; i < points.length; i++) {
        setColor([points[i][0], points[i][1]])
        render(i)
    }
})