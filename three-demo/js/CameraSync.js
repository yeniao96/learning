const WORLD_SIZE = 1024000;
const MERCATOR_A = 6378137.0;
let ThreeboxConstants = {
  WORLD_SIZE: WORLD_SIZE,
  PROJECTION_WORLD_SIZE: WORLD_SIZE / (MERCATOR_A * Math.PI * 2),
  MERCATOR_A: MERCATOR_A, // 900913 projection property
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,
  EARTH_CIRCUMFERENCE: 40075000, // In meters
}

//相机的操作
function CameraSync(map,camera,world)
{
    this.map = map;
    this.camera = camera;
    this.active = true;

    this.camera.matrixAutoUpdate = false;//静止后使用自身的变换矩阵

    this.world = world || new THREE.Group();
    this.world.position.x = this.world.position.y = ThreeboxConstants.WORLD_SIZE/2;
    this.world.matrixAutoUpdate = false;

    this.state = {
        fov: 0.6435011087932844,
        translateCenter: new THREE.Matrix4,
        worldSizeRatio: 512/ThreeboxConstants.WORLD_SIZE
    };

    this.state.translateCenter.makeTranslation(ThreeboxConstants.WORLD_SIZE/2, -ThreeboxConstants.WORLD_SIZE / 2, 0);

    // Listen for move events from the map and update the Three.js camera. Some attributes only change when viewport resizes, so update those accordingly
    var _this = this;

    this.map
        .on('move', function() {
            _this.updateCamera()
        })
        .on('resize', function(){
            _this.setupCamera();
        })


    this.setupCamera();
}
CameraSync.prototype = {//CameraSync对象的方法
  setupCamera: function() {

    var t = this.map.transform
    const halfFov = this.state.fov / 2;
    var cameraToCenterDistance = 0.5 / Math.tan(halfFov) * t.height;
    const groundAngle = Math.PI / 2 + t._pitch;

    this.state.cameraToCenterDistance = cameraToCenterDistance;
    this.state.cameraTranslateZ = new THREE.Matrix4().makeTranslation(0,0,cameraToCenterDistance);
    this.state.topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

    this.updateCamera();
},

    updateCamera:function (ev) {

        if(!this.camera) {
            console.log('nocamera')
            return;
        }

        // Build a projection matrix, paralleling the code found in Mapbox GL JS
        //构建一个投影矩阵，与mapbox gl js中的代码并行
        const fov = 0.6435011087932844;
        var cameraToCenterDistance = 0.5 / Math.tan(fov / 2) * this.map.transform.height;
        const halfFov = fov / 2;
        const groundAngle = Math.PI / 2 + this.map.transform._pitch;
        const topHalfSurfaceDistance = Math.sin(halfFov) * cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);

        // Calculate z distance of the farthest fragment that should be rendered.
        const furthestDistance = Math.cos(Math.PI / 2 - this.map.transform._pitch) * topHalfSurfaceDistance + cameraToCenterDistance;

        // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`当一个片段的距离正好是“进一步的距离”时，再加一点以避免精度问题。
        const farZ = furthestDistance * 1.01;

        this.camera.projectionMatrix = makePerspectiveMatrix(fov, this.map.transform.width / this.map.transform.height, 1, farZ);


        var cameraWorldMatrix = new THREE.Matrix4();
        var cameraTranslateZ = new THREE.Matrix4().makeTranslation(0,0,cameraToCenterDistance);
        var cameraRotateX = new THREE.Matrix4().makeRotationX(this.map.transform._pitch);
        var cameraRotateZ = new THREE.Matrix4().makeRotationZ(this.map.transform.angle);

        // Unlike the Mapbox GL JS camera, separate camera translation and rotation out into its world matrix
        // If this is applied directly to the projection matrix, it will work OK but break raycasting
        //与Mapbox GL JS相机不同，将相机的平移和旋转分离到其世界矩阵中。
        //如果直接应用于投影矩阵，它会正常工作，但会破坏光线投射
        cameraWorldMatrix
            .premultiply(cameraTranslateZ)
            .premultiply(cameraRotateX)
            .premultiply(cameraRotateZ);

        this.camera.matrixWorld.copy(cameraWorldMatrix);//对象的全局变换


        var zoomPow =  this.map.transform.scale;
        // Handle scaling and translation of objects in the map in the world's matrix transform, not the camera
        //处理世界矩阵变换中地图中对象的缩放和平移，而不是相机
        var scale = new THREE.Matrix4;
        var translateCenter = new THREE.Matrix4;
        var translateMap = new THREE.Matrix4;
        var rotateMap = new THREE.Matrix4;

        scale
            .makeScale(zoomPow, zoomPow , zoomPow );//通过地图的缩放设置对象的缩放
        //平移变换
        translateCenter
            .makeTranslation(ThreeboxConstants.WORLD_SIZE/2, -ThreeboxConstants.WORLD_SIZE / 2, 0);

        translateMap
            .makeTranslation(-this.map.transform.x, this.map.transform.y , 0);
        //弧度旋转
        rotateMap
            .makeRotationZ(Math.PI);

        this.world.matrix = new THREE.Matrix4;
        this.world.matrix
            .premultiply(rotateMap)
            .premultiply(translateCenter)
            .premultiply(scale)
            .premultiply(translateMap)

        //need to reset renderer to avoid paintprogram error需要重置渲染器以避免绘制程序错误

        // utils.prettyPrintMatrix(this.camera.projectionMatrix.elements);

    },
    //  投影到世界
    projectToWorld:function (coords) {
      // Spherical mercator forward projection, re-scaling to WORLD_SIZE球面墨卡托正投影，重新缩放到世界尺寸
      var projected = [
          -ThreeboxConstants.MERCATOR_A * coords[0] * ThreeboxConstants.DEG2RAD * ThreeboxConstants.PROJECTION_WORLD_SIZE,
          -ThreeboxConstants.MERCATOR_A * Math.log(Math.tan((Math.PI*0.25) + (0.5 * coords[1] * ThreeboxConstants.DEG2RAD))) * ThreeboxConstants.PROJECTION_WORLD_SIZE
      ];
      console.log(projected)
      var pixelsPerMeter = this.projectedUnitsPerMeter(coords[1]);

      //z dimension
      var height = coords[2] || 0;
      projected.push( height * pixelsPerMeter );

      var result = new THREE.Vector3(projected[0], projected[1], projected[2]);

      return result;
  },
  //  投影单位转化
  projectedUnitsPerMeter:function (latitude) {
      return Math.abs(ThreeboxConstants.WORLD_SIZE * (1 / Math.cos(latitude*Math.PI/180))/ThreeboxConstants.EARTH_CIRCUMFERENCE);
  },
  //  添加对象
  addAtCoordinate:function (obj,lnglat,options) {
      this.world.add(obj);
      this.moveToCoordinate(obj,lnglat,options);
      return obj;
  },
  //  对象移动到坐标
  moveToCoordinate:function (obj,lnglat,options) {
      if (options === undefined) options = {};
      if(options.preScale === undefined) options.preScale = 1.0;
      if(options.scaleToLatitude === undefined || obj.userData.scaleToLatitude) options.scaleToLatitude = true;
      obj.userData.scaleToLatitude = options.scaleToLatitude;
      if (typeof options.preScale === 'number') options.preScale = new THREE.Vector3(options.preScale, options.preScale, options.preScale);
      else if(options.preScale.constructor === Array && options.preScale.length === 3) options.preScale = new THREE.Vector3(options.preScale[0], options.preScale[1], options.preScale[2]);
      else if(options.preScale.constructor !== THREE.Vector3) {
          console.warn("Invalid preScale value: number, Array with length 3, or THREE.Vector3 expected. Defaulting to [1,1,1]");
          options.preScale = new THREE.Vector3(1,1,1);
      }

      var scale = options.preScale;

      // Figure out if this object is a geoGroup and should be positioned and scaled directly, or if its parent
      var geoGroup;
      if (obj.userData.isGeoGroup) geoGroup = obj;
      else if (obj.parent && obj.parent.userData.isGeoGroup) geoGroup = obj.parent;
      else return console.error("Cannot set geographic coordinates of object that does not have an associated GeoGroup. Object must be added to scene with 'addAtCoordinate()'.")

      if(options.scaleToLatitude) {
          // Scale the model so that its units are interpreted as meters at the given latitude对模型进行缩放
          var pixelsPerMeter = this.projectedUnitsPerMeter(lnglat[1]);
          scale.multiplyScalar(pixelsPerMeter);
      }

      geoGroup.scale.copy(scale);

      geoGroup.position.copy(this.projectToWorld(lnglat));
      obj.coordinates = lnglat;

      return obj;
  }
};
//  生成透视矩阵
function makePerspectiveMatrix(fovy, aspect, near, far) {
    var out = new THREE.Matrix4();
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);

    var newMatrix = [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
    ]

    out.elements = newMatrix
    return out;
};