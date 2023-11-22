import Matrix4 from "matrix4"
const gl = document.getElementById('box').getContext('webgl')
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
class Light {
    constructor() {
        this.pos = [-5, 5, 5]
        this.color = [255, 255, 255]
        this.intensity = 2
    }
}
class Sphere {
    constructor(...args) {
        this.pos = args[0]
        this.albedo = args[1]
        this.radius = args[2]
        this.roughness = args[3]
        this.metalic = args[4]
    }
}

    const sphereVertexSource = `
        attribute vec4 a_position;
        attribute vec2 a_TexCoord;
        attribute vec4 a_normal;
        uniform vec4 u_light;
        uniform vec4 u_eye;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_normalMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_perspectiveMatrix;
        varying vec4 v_Normal;
        varying vec4 v_Light;
        varying vec4 v_Viewer;
        void main() {
            gl_Position = u_perspectiveMatrix * u_viewMatrix * u_modelMatrix * a_position;
            v_Normal = u_normalMatrix * a_normal;
            v_Light = normalize(u_light - a_position);
            v_Viewer = normalize(u_eye - a_position);
        }
    `
    const sphereFragmentSource = `
        precision mediump float;
        uniform vec3 u_lightColor;
        uniform float u_lightIntensity;
        uniform vec3 u_albedo;
        uniform float u_roughness;
        uniform float u_metalic;
        uniform samplerCube u_texture;
        varying vec3 v_Color;
        varying vec4 v_Normal;
        varying vec4 v_Light;
        varying vec4 v_Viewer;
        vec3 f = vec3(0.04);
        float PI = acos(-1.0);
        struct light {
            vec3 pos;
            vec3 color;
            float intensity;
        };
        
        struct ball {
            vec3 pos;
            vec3 albedo;
            float radius;
            float roughness;
            float metalic;
        };
        // textureCube(u_texture, normalize(v_normal))
        // 漫反射
        vec3 calcDiffuse (vec3 albedo) {
            return albedo / PI;
        }
        // 几何遮蔽方程
        float GeometrySchlickGGX (vec3 n, vec3 i, float roughness) {
            float k = pow(roughness + 1.0, 2.0) / 8.0;
            float x = max(dot(n, i), 0.0);
            return x / (x * (1.0 - k) + k);
        }
        // 法线分布方程
        float DistributionGGX(vec3 N, vec3 H, float roughness){
            float a      = roughness*roughness;
            float a2     = a*a;
            float NdotH  = max(dot(N, H), 0.0);
            float NdotH2 = NdotH*NdotH;
            float num   = a2;
            float denom = (NdotH2 * (a2 - 1.0) + 1.0);
            denom = PI * denom * denom;
            return num / denom;
        }
        
        // 菲涅尔系数
        vec3 Finel(vec3 F0, vec3 h, vec3 v) {
            return F0 + (vec3(1.0) - F0) * pow(1.0 - max(0.0, dot(h, v)), 5.0);
        }
        
        // 高光
        vec3 calcHighlights (vec3 l, vec3 n, vec3 v, vec3 F, float roughness) {
            vec3 h = normalize(l + v);
            float staticParam = 4.0 * max(dot(v, n), 0.0) * max(dot(l, n), 0.0);
            float D = DistributionGGX(n, h, roughness);
            float G = GeometrySchlickGGX(n, v, roughness) * GeometrySchlickGGX(n, l, roughness);
            return D * F * G / max(staticParam, 0.001);
        }
        
        // BRDF
        vec3 brdf (light light, ball ball, vec3 l, vec3 n, vec3 viewer) {
            vec3 color = vec3(0.0);
            vec3 h = normalize(l + viewer);
            vec3 F0 = mix(f, ball.albedo, ball.metalic);
            vec3 F = Finel(F0, h, viewer);
            vec3 ks = F;
            vec3 kd = (1.0 - ball.metalic) * (vec3(1.0) - F);
            vec3 diffuse = calcDiffuse(ball.albedo);
            vec3 specular = calcHighlights(l, n, viewer, F, ball.roughness);
            vec3 radiance = light.color * (light.intensity / pow(length(l), 2.0)); 
            vec3 Lo = (kd * diffuse + specular) * radiance * max(dot(l, n), 0.0);
            vec3 ambient = vec3(0.03) * ball.albedo;
            color = Lo;
            // tonemapping
            color = color / (color + vec3(1.0));
            // gamma
            color = pow(color, vec3(1.0 / 2.2));
            return color;
        }
        
        void main() {
            vec3 color = vec3(0.1,0.1,0.1);
            light light_ins = light(vec3(v_Light.xyz), u_lightColor, u_lightIntensity);
            ball ball_ins = ball(
                vec3(0.0, 0.0, 0.0),
                u_albedo,
                0.05,
                u_roughness,
                u_metalic
            );
            color = brdf(light_ins, ball_ins, vec3(v_Light.xyz), vec3(v_Normal.xyz), vec3(v_Viewer.xyz));
            gl_FragColor = vec4( color, 1.0 );
        }
    `
    const cubeVertexSource = `
        attribute vec4 a_position;
        attribute vec3 a_normal;
        uniform mat4 u_modelMatrix;
        uniform mat4 u_normalMatrix;
        uniform mat4 u_viewMatrix;
        uniform mat4 u_perspectiveMatrix;
        varying vec3 v_Normal;
        varying vec4 v_pos;
        void main() {
            v_pos = a_position;
            vec4 clipPos = u_perspectiveMatrix * u_viewMatrix * u_modelMatrix * a_position;
            gl_Position = clipPos;
            v_Normal = normalize(clipPos.xyz);
        }
    `
    const cubeFragmentSource = `
        precision mediump float;
        varying vec3 v_Normal;
        varying vec4 v_pos;

        // 纹理。
        uniform samplerCube u_texture;
        
        void main() {
            gl_FragColor = textureCube(u_texture, normalize(v_Normal));
        }
    `
    const boxVertexSource = `
        attribute vec4 a_position;
        varying vec4 v_pos;
        void main() {
            v_pos = a_position;
            gl_Position = a_position;
            gl_Position.z = 0.999;
        }
    `
    const boxFragmentSource = `
        precision mediump float;
        varying vec4 v_pos;
        uniform mat4 u_viewDirectionProjectionInverse;
        // 纹理。
        uniform samplerCube u_texture;
        
        void main() {
            vec4 pos = u_viewDirectionProjectionInverse * v_pos;
            // gl_FragColor = vec4(1.0,0.0,0.0,1.0);

            gl_FragColor = textureCube(u_texture, normalize(pos.xyz / pos.w));
        }
    `
let program

// shader
function createSharder(gl, vertexSource, fragmentSource) {

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

function createCube(imgs) {
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

    createTexture(imgs)

    render(vertices, colors, verticesIndexs, normals)
}

function createBox(imgs) {
    const vertices = new Float32Array([
        -1, 1, 1, 
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1
    ])
    const verticesIndexs = new Uint8Array([
        0, 1, 2, 0, 2, 3,
    ])
    renderBox(vertices, verticesIndexs)
}

function createTexture(imgs) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    
    const faceInfos = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, image: imgs[0] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, image: imgs[1] },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, image: imgs[2] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, image: imgs[3] },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, image: imgs[4] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, image: imgs[5] },
    ];
    faceInfos.forEach((faceInfo) => {
        const {target, image} = faceInfo;
        const level = 0;
        const internalFormat = gl.RGBA;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.texImage2D(target, level, internalFormat, format, type, image);
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    const u_texture = gl.getUniformLocation(program, "u_texture");
    gl.activeTexture(gl.TEXTURE0);
    //将0号纹理传递给着色器
    gl.uniform1i(u_texture, 0);
}

function calcSpherePoints(center, r, pieces) {
    let vertices = []
    let normals = []
    let verticesIndexs = []
 
    let m = pieces
    for (let  latitude= 0; latitude <= m; latitude++) {
      let x;
      let z;
      let l = r*Math.sin(Math.PI*latitude/m);
      let y = r*Math.cos(Math.PI*latitude/m);
      for(let longitude = 0; longitude <= m; longitude++){
        x = l*Math.cos(2*Math.PI*longitude/m);
        z = l*Math.sin(2*Math.PI*longitude/m);
        vertices.push(center[0] + x, center[1] + y, center[2] + z);
        normals.push(x, y, z);
      }
    }

    for (let i = 0; i < m; i++) {
      for(let j = 0; j < m; j++){
        var first = (i*(m+1)) + j;
        var second = first + m + 1;
        verticesIndexs.push(first);
        verticesIndexs.push(second);
        verticesIndexs.push(first + 1);

        verticesIndexs.push(second);
        verticesIndexs.push(second + 1);
        verticesIndexs.push(first + 1);
      }
    }

    return {
        vertices,
        verticesIndexs,
        normals
    }
}

function createMaterial(i, j) {
    const u_albedo = gl.getUniformLocation(program, 'u_albedo')
    gl.uniform3f(u_albedo, 1.0, 0.5, 0.1)
    const u_roughness = gl.getUniformLocation(program, 'u_roughness')
    gl.uniform1f(u_roughness, i)
    const u_metalic = gl.getUniformLocation(program, 'u_metalic')
    gl.uniform1f(u_metalic, j)
}

function createSphere() {
    for(let i = -5; i < 5; i+=2.5) {
        for(let j = -5; j < 5; j+=2.5) {
            const sphere = new Sphere([i, j, 0], [255, 128, 25], 1, i / 10, j / 10)
            const {vertices, verticesIndexs, normals} = calcSpherePoints(sphere.pos, sphere.radius, 50)
            createMaterial(0.1 * i + 0.5, 0.1 * j + 0.5)
            render(new Float32Array(vertices), new Uint16Array(verticesIndexs), new Float32Array(normals))
        }     
    }
}

function renderBox (v, i) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW)
    const Bytes = v.BYTES_PER_ELEMENT
    const aPosition = gl.getAttribLocation(program, 'a_position')
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, Bytes * 3, 0)
    gl.enableVertexAttribArray(aPosition)


    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i, gl.STATIC_DRAW)

    gl.enable(gl.DEPTH_TEST)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES, i.length, gl.UNSIGNED_BYTE, 0)
}

function render (v, i, n) {
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
    gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, Bytes * 3, 0)
    gl.enableVertexAttribArray(a_normal)

    const indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, i, gl.STATIC_DRAW)

    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    gl.drawElements(gl.TRIANGLES, i.length, i.length < 255 ? gl.UNSIGNED_BYTE : gl.UNSIGNED_SHORT, 0)
}

// eye
let ex = 0;
let ey = 0;
let ez = 30;

function createViewMatrix(scale) {
    const modelMatrix = new Matrix4()
    // modelMatrix.setRotate(Date.now() / (Math.PI * 100), 0,1,0)
    const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix')
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements)
    const u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix')
    gl.uniformMatrix4fv(u_normalMatrix, false, modelMatrix.invert().transpose().elements)
    const viewMatrix = new Matrix4()
    viewMatrix.setLookAt(ex, ey, ez, 0, 0, 0, 0, 1, 0)
    const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix')
    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements)
    const perspectiveMatrix = new Matrix4()
    perspectiveMatrix.setPerspective(30, 1, 1, 3000)
    const u_perspectiveMatrix = gl.getUniformLocation(program, 'u_perspectiveMatrix')
    gl.uniformMatrix4fv(u_perspectiveMatrix, false, perspectiveMatrix.elements)

    perspectiveMatrix.concat(viewMatrix).concat(modelMatrix).invert()
    const u_viewDirectionProjectionInverse = gl.getUniformLocation(program, 'u_viewDirectionProjectionInverse')
    gl.uniformMatrix4fv(u_viewDirectionProjectionInverse, false, perspectiveMatrix.elements)
}



function createLight() {
    const u_light = gl.getUniformLocation(program, 'u_light')
    gl.uniform4f(u_light, -10, 10, 5, 1)
    const u_lightColor = gl.getUniformLocation(program, 'u_lightColor')
    gl.uniform3f(u_lightColor, 1, 0.5, 0.5)
    const u_lightIntensity = gl.getUniformLocation(program, 'u_lightIntensity')
    gl.uniform1f(u_lightIntensity, 1)
    const u_eye = gl.getUniformLocation(program, 'u_eye')
    gl.uniform4f(u_eye, ex, ey, ez, 1.0)
}

function createFog() {
    const u_fogColor = gl.getUniformLocation(program, 'u_fogColor')
    gl.uniform4f(u_fogColor, 53/255, 39/255, 68/255, 1)
    const u_fogDist = gl.getUniformLocation(program, 'u_fogDist')
    gl.uniform2f(u_fogDist, 0, 6)
}
createSharder(gl, boxVertexSource, boxFragmentSource);

function run() {
    gl.clearColor(53/255, 39/255, 68/255, 1)
    createSharder(gl, boxVertexSource, boxFragmentSource);
    createViewMatrix(10)
    createBox(imgs)
    createSharder(gl, sphereVertexSource, sphereFragmentSource);
    createViewMatrix(1)
    createLight()
    createSphere()
    window.requestAnimationFrame(run)
}

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

function loadTexture(url) {
    return new Promise((resolve) => {
        const img = new Image(512, 512)
        img.src = url
        img.onload = () => {
            resolve(img)
        }
    })
}
const callbacks = ['http://127.0.0.1:5500/example/img/posx.jpg', 
'http://127.0.0.1:5500/example/img/negx.jpg', 
'http://127.0.0.1:5500/example/img/posy.jpg',
'http://127.0.0.1:5500/example/img/negy.jpg',
'http://127.0.0.1:5500/example/img/posz.jpg',
'http://127.0.0.1:5500/example/img/negz.jpg'].map((url) => {
    return loadTexture(url)
})

let imgs = []
Promise.all(callbacks).then((res) => {
    imgs = res
    createTexture(imgs)

    run()
})
