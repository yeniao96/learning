class Vec4 { 
    constructor(...args){ 
        this.x = args[0] || 0
        this.y = args[1] || 0
        this.z = args[2] || 0
        this.w = args[3] || 1
    }

    add(vector) { 
        return new Vec4(this.x + vector.x, this.y + vector.y, this.z + vector.z)
    }

    minus(vector) { 
        return new Vec4(vector.x - this.x, vector.y - this.y, vector.z - this.z)
    }

    dot(vector) { 
        return vector.x * this.x + vector.y * this.y + vector.z * this.z
    }

    cross(vector) {
        return new Vec4(this.y * vector.z - vector.y * this.z, vector.x * this.z - this.x * vector.z, this.x * vector.y - vector.x * this.y)
    }

}
export default class Matrix4 {
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
        // for(let i = 0; i < 4; i++) { 
        //     for(let k = 0; k < 4; k++) {
        //         const j = 4 * k
        //         m[i + j] = m1[i] * m2[j] + m1[i+4] * m2[j+1] + m1[i+8] * m2[j+2] + m1[i+12] * m2[j+3]
        //     }
        // }
        for (let i = 0; i < 4; i++) {
            let ai0=m1[i];  let ai1=m1[i+4];  let ai2=m1[i+8];  let ai3=m1[i+12];
            m[i]    = ai0 * m2[0]  + ai1 * m2[1]  + ai2 * m2[2]  + ai3 * m2[3];
            m[i+4]  = ai0 * m2[4]  + ai1 * m2[5]  + ai2 * m2[6]  + ai3 * m2[7];
            m[i+8]  = ai0 * m2[8]  + ai1 * m2[9]  + ai2 * m2[10] + ai3 * m2[11];
            m[i+12] = ai0 * m2[12] + ai1 * m2[13] + ai2 * m2[14] + ai3 * m2[15];
        }
        return new Float32Array(m)
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

    setRotateX(angle) {
        const RMatrix = new Float32Array([
            0, 0, 0, 0,
            0, Math.cos(angle), Math.sin(angle), 0,
            1, -Math.sin(angle), Math.cos(angle), 0,
            0, 0, 0, 1
        ])
        this.matrix = this.multiple(RMatrix, this.matrix)
        return this
    }

    setRotateY(angle) {
        const RMatrix = new Float32Array([
            Math.cos(angle), 0, -Math.sin(angle), 0,
            0, 1, 0, 0,
            Math.sin(angle), 0, Math.cos(angle), 0,
            0, 0, 0, 1
        ])
        this.matrix = this.multiple(RMatrix, this.matrix)
        return this
    }

    setRotateZ(angle) {
        const RMatrix = new Float32Array([
            Math.cos(angle), Math.sin(angle), 0, 0,
            -Math.sin(angle), Math.cos(angle), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        this.matrix = this.multiple(RMatrix, this.matrix)
        return this
    }
    

    normalize(vector) {
        const { x, y, z } = vector
        const total = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))
        return new Vec4( x / total, y / total, z / total )
    }

    inverse(m) {
        let i, s, d, inv, det
        s = m
        d = new Float32Array(16)
        inv = new Float32Array(16)
    
        inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
                + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
        inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
                - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
        inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
                + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
        inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
                - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];
    
        inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
                - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
        inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
                + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
        inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
                - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
        inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
                + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];
    
        inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
                + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
        inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
                - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
        inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
                + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
        inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
                - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];
    
        inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
                - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
        inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
                + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
        inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
                - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
        inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
                + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];
    
        det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
        if (det === 0) {
            return this;
        }
    
        det = 1 / det;
        for (i = 0; i < 16; i++) {
            d[i] = inv[i] * det
        }
    
        return d
    }

    transpose(m) { 
        return new Float32Array([
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
        ])
    }

    len(vector) {
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2))
    }

    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) { 
        var e, fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz;
  
        fx = centerX - eyeX;
        fy = centerY - eyeY;
        fz = centerZ - eyeZ;
    
        // Normalize f.
        rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;
    
        // Calculate cross product of f and up.
        sx = fy * upZ - fz * upY;
        sy = fz * upX - fx * upZ;
        sz = fx * upY - fy * upX;
    
        // Normalize s.
        rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;
    
        // Calculate cross product of s and f.
        ux = sy * fz - sz * fy;
        uy = sz * fx - sx * fz;
        uz = sx * fy - sy * fx;
    
        // Set to this.
        e = [];
        e[0] = sx;
        e[1] = ux;
        e[2] = -fx;
        e[3] = 0;
    
        e[4] = sy;
        e[5] = uy;
        e[6] = -fy;
        e[7] = 0;
    
        e[8] = sz;
        e[9] = uz;
        e[10] = -fz;
        e[11] = 0;
    
        e[12] = 0;
        e[13] = 0;
        e[14] = 0;
        e[15] = 1;
        // 平移
        const TMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -eyeX, -eyeY, -eyeZ, 1
        ])

        this.matrix = this.multiple(new Float32Array(e), TMatrix)
    }

    // ortho projection matrix
    setOrtho(left, right, top, bottom, near, far) {
        const rx = 2 / (right - left)
        const ry = 2 / (top - bottom)
        const rz = -2 / (far - near)

        const scaleMatrix = new Float32Array([
            rx, 0, 0, 0,
            0, ry, 0, 0,
            0, 0, rz, 0,
            0, 0, 0, 1
        ])

        const translateMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -(left + right) / 2, -(top + bottom) / 2, (near + far) / 2, 1      
        ])
        const orthoMatrix = this.multiple(scaleMatrix, translateMatrix)
        this.matrix = this.multiple(orthoMatrix, this.matrix)
    }

    // Perspective projection matrix
    setPerspective(left, right, top, bottom, near, far) {
        const perspectiveMatrix = new Float32Array([
            near, 0, 0, 0,
            0, near, 0, 0,
            0, 0, far + near, -1,
            0, 0, far * near, 0
        ])
        
        this.matrix = this.multiple(perspectiveMatrix, this.matrix)
        this.setOrtho(left, right, top, bottom, near, far)
    }

    // Perspective projection matrix
    setPerspectiveByFovy(fovy, aspect, near, far) {
        var e, rd, s, ct;
      
        if (near === far || aspect === 0) {
          throw 'null frustum';
        }
        if (near <= 0) {
          throw 'near <= 0';
        }
        if (far <= 0) {
          throw 'far <= 0';
        }
      
        fovy = Math.PI * fovy / 180 / 2;
        s = Math.sin(fovy);
        if (s === 0) {
          throw 'null frustum';
        }
      
        rd = 1 / (far - near);
        ct = Math.cos(fovy) / s;
      
        e = [];
       
        e[0]  = ct / aspect;
        e[1]  = 0;
        e[2]  = 0;
        e[3]  = 0;
      
        e[4]  = 0;
        e[5]  = ct;
        e[6]  = 0;
        e[7]  = 0;
      
        e[8]  = 0;
        e[9]  = 0;
        e[10] = -(far + near) * rd;
        e[11] = -1;
      
        e[12] = 0;
        e[13] = 0;
        e[14] = -2 * near * far * rd;
        e[15] = 0;
      
        this.matrix = this.multiple(new Float32Array(e), this.matrix)
      }
}
