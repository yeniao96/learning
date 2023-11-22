const gl = document.getElementById('box').getContext('webgl')

let program

function createSharder(gl) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    const vertexSource = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
    `
    const fragmentSource = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    
    void main() {
        //texture2D 抽取纹素颜色
        gl_FragColor = texture2D(u_Sampler,v_TexCoord);
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


// 图片加载
function loadImage(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      console.error("Failed to load image!");
      reject(e);
    };
    img.src = url;
  });
}
const initTextures = (gl, n, img) => {
  // 创建纹理对象
  const texture = gl.createTexture();
  // 获取纹理变量的存储位置
  const u_Sampler = gl.getUniformLocation(program, "u_Sampler");
  //对纹理进行Y轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //开启0号纹理单元
  gl.activeTexture(gl.TEXTURE0);
  //向target绑定纹理对象
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //配置纹理参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  
  //配置纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  //将0号纹理传递给着色器
  gl.uniform1i(u_Sampler, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};
const main = () => {
  //获取绘制dom
  const canvas = document.getElementById("box");

  //获取canvas上下文
  const gl = canvas.getContext("webgl");
  createSharder(gl)

  const initVertexBuffers = (gl) => {
    //类型化数组设置顶点坐标
    const vertices = new Float32Array([
      -0.5, 0.5, 0.3, 0.7, -0.5, -0.5, 0.3, 0.2, 0.5, 0.5, 0.7, 0.7, 0.5, -0.5,
      0.7, 0.2,
    ]);

    const n = 4; //点的个数

    //创建缓冲区对象
    const vertexTexCoordBuffer = gl.createBuffer();
    if (!vertexTexCoordBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(program, "a_Position");
    const a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");

    if (a_Position === -1 || !a_TexCoord === -1) {
      console.error("Failed to get the attribute location!");
      return;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * 4, 4 * 2);
    //链接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
  };
  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.error("n<0");
    return;
  }

  //图片加载成功后 => 进行纹理加载
  loadImage("../img/texture0.jpg").then(function (img) {
    initTextures(gl, n, img);
  });
};

main();
