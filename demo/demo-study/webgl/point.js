const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
const box = document.getElementById('box')
const vertexSource = `
    attribute vec4 a_position;
    attribute float a_size;
    void main() {
        gl_Position = a_position;
        gl_PointSize = a_size;
    }
`
const fragmentSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        // gl_FragColor = u_color;
        float dist = distance(gl_PointCoord,vec2(0.5,0.5));
        if(dist<0.5) {
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }else {
            gl_FragColor = vec4(53.0/255.0, 39.0/255.0, 68.0/255.0, 1.0);
            discard;
        }
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

window.addEventListener('click', function (e) { 
    const x = (e.offsetX / box.width) * 2 - 1 
    const y = 1 - (e.offsetY / box.height) * 2 
    points.push([x, y])
    console.log(new Uint32Array([1, 0, 0, 1]))
    render()
})
gl.clearColor(53/255, 39/255, 68/255, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

function render () {
    gl.clearColor(53/255, 39/255, 68/255, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const aSize = gl.getAttribLocation(program, 'a_size')
    gl.vertexAttrib1f(aSize,2.0)
    const uColor = gl.getUniformLocation(program, 'u_color')
    for(let i = 0; i < points.length; i++){ 
        const aPosition = gl.getAttribLocation(program, 'a_position')
        gl.uniform4f(uColor, ...setColor(points[i]))
        gl.vertexAttrib3f(aPosition, ...points[i], 0.0)
        gl.drawArrays(gl.POINTS, 0, 1)
    }
}

function setColor(point) {
    const colorArr = [new Uint32Array([1, 0, 0, 1]), new Uint32Array([0, 1, 0, 1]), new Uint32Array([0, 0, 1, 1]), new Uint32Array([1, 1, 1, 1])]
    const [x, y] = point
    const l = x > 0 ? 1 : 0
    const h = y > 0 ? 2 : 0
    const t = l + h
    return colorArr[t]
}


