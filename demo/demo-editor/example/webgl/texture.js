import Matrix4 from "matrix4"
const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
const box = document.getElementById('box')

let program
let points = []

function createSharder(gl) {
    const vertexSource = `
        attribute vec4 a_position;
        attribute vec2 a_TexCoord;
        attribute vec4 a_light;
        attribute vec3 a_lightColor;
        attribute float a_lightIntensity;
        attribute vec4 a_normal;
        attribute float a_deep;
        uniform mat4 u_normalMatrix;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_perspectiveMatrix;
        uniform mat4 u_shadowMatrix;
        uniform sampler2D u_Sampler;
        varying vec3 v_Color;
        varying float v_deep;
        varying highp vec2 v_TexCoord;
        varying float v_show;

        void main() {
            gl_Position = u_perspectiveMatrix * u_viewMatrix * u_modelMatrix * a_position;
            vec4 pl = a_light - a_position; 
            float distance = length(pl);
            float intensity = a_lightIntensity / pow(distance, 2.0);
            vec3 normal = normalize(vec3(u_normalMatrix * a_normal));
            vec3 diffuseColor = 2.0 * intensity * max(0.0, dot(vec3(pl.xyz), normal)) * a_lightColor;
            vec3 embientColor = 0.3 * a_lightIntensity * a_lightColor;
            v_Color = vec3(0.0, 0.0, 0.0) + diffuseColor + embientColor;
            v_show = 1.0;
            v_TexCoord = a_TexCoord;
        }
    `
    const fragmentSource = `
        uniform sampler2D u_Sampler;
        precision mediump float;
        varying vec3 v_Color;
        varying float v_deep;
        varying float v_show;
        varying highp vec2 v_TexCoord;

        void main() {
            gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
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

    const texCoords = new Float32Array([
        // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ])

    renderCube(vertices, colors, verticesIndexs, normals, texCoords)
}

let ex = -2;
let ey = 2;
let ez = 4;

// view
function createViewMatrix() {
    const modelMatrix = new Matrix4()
    modelMatrix.setRotateY(Date.now() / (Math.PI * 1000))
    const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix')
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.matrix)
    const u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix')
    gl.uniformMatrix4fv(u_normalMatrix, false, modelMatrix.transpose(modelMatrix.inverse(modelMatrix.matrix)))
    const m = new Matrix4()
    m.setLookAt(ex, ey, ez, 0, 0, 0, 0, 1, 0)
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    gl.uniformMatrix4fv(u_viewMatrix, false, m.matrix || m.elements)
    const perspectiveMatrix = new Matrix4()
    perspectiveMatrix.setPerspectiveByFovy(60, 1,  1.0, 100)

    const u_perspectiveMatrix = gl.getUniformLocation(program, 'u_perspectiveMatrix')
    gl.uniformMatrix4fv(u_perspectiveMatrix, false, perspectiveMatrix.matrix || perspectiveMatrix.elements)
}

let shadowMatrix = null

// shadow
function createShadowMatrix() {
    const modelMatrix = new Matrix4()
    // modelMatrix.setRotateY(Date.now() / (Math.PI * 1000))
    const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix')
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.matrix)
    const u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix')
    gl.uniformMatrix4fv(u_normalMatrix, false, modelMatrix.transpose(modelMatrix.inverse(modelMatrix.matrix)))
    const m = new Matrix4()
    m.setLookAt(-4, 4, 4, 0, 0, 0, 0, 1, 0)
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    gl.uniformMatrix4fv(u_viewMatrix, false, m.matrix || m.elements)
    const perspectiveMatrix = new Matrix4()
    perspectiveMatrix.setPerspectiveByFovy(60, 1,  1.0, 100)
    const u_perspectiveMatrix = gl.getUniformLocation(program, 'u_perspectiveMatrix')
    gl.uniformMatrix4fv(u_perspectiveMatrix, false, perspectiveMatrix.matrix || perspectiveMatrix.elements)
    shadowMatrix = perspectiveMatrix.multiple(perspectiveMatrix.matrix, perspectiveMatrix.multiple(m.matrix, modelMatrix.matrix))
}

// box
function renderCube (v, c, i, n, t) {
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

    const texBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, n, gl.STATIC_DRAW)

    const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord')
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, c.BYTES_PER_ELEMENT * 2, 0)
    gl.enableVertexAttribArray(a_TexCoord)

    const indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i, gl.STATIC_DRAW)

    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

// light
function createLight() {
    const a_light = gl.getAttribLocation(program, 'a_light')
    gl.vertexAttrib4f(a_light, -2, 2, 2, 1)
    const a_lightColor = gl.getAttribLocation(program, 'a_lightColor')
    gl.vertexAttrib3f(a_lightColor, 1, 1, 1)
    const a_lightIntensity = gl.getAttribLocation(program, 'a_lightIntensity')
    gl.vertexAttrib1f(a_lightIntensity, 1)
}

// texture
const initTextures = (img) => {
    // 创建纹理对象
    const texture = gl.createTexture();
    // 获取纹理变量的存储位置
    const u_Sampler = gl.getUniformLocation(program, "u_Sampler");
    //对纹理进行Y轴反转
    //开启0号纹理单元
    
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);
  
  };

function run() {
    // img.src = box.toDataURL()
    loadTexture(gl, "http://127.0.0.1:5500/example/img/wall.jpg")
    // window.requestAnimationFrame(run)
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


box.onmousedown = function (e) {
    const { offsetX, offsetY } = e
    originX = offsetX
    originY = offsetY
    box.addEventListener('mousemove', move)
}
box.onmouseup = function (e) {
    box.removeEventListener('mousemove', move)
}


function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    );
  
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image,
      );
  
      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
        const u_Sampler = gl.getUniformLocation(program, "u_Sampler");
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.activeTexture(gl.TEXTURE0);
        //向target绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //将0号纹理传递给着色器
        gl.uniform1i(u_Sampler, 0);
        createViewMatrix()
        createLight()
        createColorCube()
    };
    image.src = url;
  
    return texture;
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }