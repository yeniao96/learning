const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

const vertexSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`
const fragmentSource = `
    void main() {
        gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
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


const buffer = gl.createBuffer()

gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

const vertexData = new Float32Array([
    0,0,0,
    1,0,0,
    1,1,0
])

gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
const apos = gl.getAttribLocation(program, 'a_position')
gl.enableVertexAttribArray(apos)
gl.vertexAttribPointer(apos, 3, gl.FLOAT, false, 0, 0)

gl.clearColor(0, 0, 0, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.drawArrays(gl.TRIANGLES, 0, 3)

