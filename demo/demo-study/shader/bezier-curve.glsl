vec2 calcCurve(float t, vec2 b0, vec2 b1, vec2 b2, vec2 b3){
    return pow((1.0-t), 3.0) * b0 + pow((1.0-t), 2.0) * t * b1 + pow(t, 2.0) * (1.0 - t) * b2 + pow(t, 3.0) * b3;
}

vec2 calcBezier(float t, vec2 b0, vec2 b1, vec2 b2, vec2 b3){
    vec2 a1 = mix(b0, b1, t);
    vec2 a2 = mix(b1, b2, t);
    vec2 a3 = mix(b2, b3, t);
    vec2 m1 = mix(a1, a2, t);
    vec2 m2 = mix(a2, a3, t);
    vec2 c = mix(m1, m2, t);
    return c;
}

vec3 drawPoint(vec2 p, vec2 target, float r, vec3 color, float buffer){

    float d = distance(p, target);
    d = smoothstep(r, r- r * buffer, d);
    
    return d * color;
    
}

vec3 drawLine(vec2 p, vec2 a, vec2 b, float r, vec3 color){
    vec2 ab = b - a;
    vec2 ap = p - a;
    float ab_len = length(ab);
    float t = dot(ab,ap) / ab_len;
    float scale = clamp(t / ab_len, 0.0, 1.0);
    vec2 tp = ap - scale * ab;
    float tp_len = length(tp);
    float d = smoothstep(r, 0.0, tp_len);

    return d * color;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    
    float time = iResolution.x / iResolution.y;
    
    uv.x *= time;
   
    uv.x -= time / 2.0;
    
    uv.y -= 0.5;
    
    // set controller points
    vec2 b0 = vec2(-0.3, -0.1);
    vec2 b1 = vec2(-0.1, 0.3);
    vec2 b2 = vec2(0.1, 0.3);
    vec2 b3 = vec2(0.3, -0.1);
    
    // pixel size
    float step = 2.0 / iResolution.x;
    
    // Time varying pixel color
    vec3 col = vec3(0.0, 0.0, 0.0);
    
    // draw line
    col += drawLine(uv, b0, b1, 1.2 * step, vec3(0.0, 1.0, 0.0));
    col += drawLine(uv, b1, b2, 1.2 * step, vec3(0.0, 1.0, 0.0));
    col += drawLine(uv, b2, b3, 1.2 * step, vec3(0.0, 1.0, 0.0));

    // draw animate point
    float t = fract(iTime / 5.0);
    vec2 a1 = mix(b0, b1, t);
    col += drawPoint(uv, a1, 5.0 * step, vec3(1.0, 1.0, 1.0), 0.2);
    vec2 a2 = mix(b1, b2, t);
    col += drawPoint(uv, a2, 5.0 * step, vec3(1.0, 1.0, 1.0), 0.2);
    vec2 a3 = mix(b2, b3, t);
    col += drawPoint(uv, a3, 5.0 * step, vec3(1.0, 1.0, 1.0), 0.2);
    col += drawLine(uv, a1, a2, 1.2 * step, vec3(0.0, 0.0, 1.0));
    col += drawLine(uv, a2, a3, 1.2 * step, vec3(0.0, 0.0, 1.0));

    // draw mid point
    vec2 mid1 = mix(a1, a2, t);
    col += drawPoint(uv, mid1, 5.0 * step, vec3(1.0, 1.0, 0.0), 0.2);
    vec2 mid2 = mix(a2, a3, t);
    col += drawPoint(uv, mid2, 5.0 * step, vec3(1.0, 1.0, 0.0), 0.2);
    col += drawLine(uv, mid1, mid2, 1.2 * step, vec3(1.0, 0.0, 1.0));

    // draw point in curve
    vec2 mid3 = mix(mid1, mid2, t);
    col += drawPoint(uv, mid3, 5.0 * step, vec3(0.0, 1.0, 1.0), 0.2);

    // draw point
    col += drawPoint(uv, b0, 5.0 * step, vec3(1.0, 0.0, 0.0), 0.2);
    col += drawPoint(uv, b1, 5.0 * step, vec3(1.0, 0.0, 0.0), 0.2);
    col += drawPoint(uv, b2, 5.0 * step, vec3(1.0, 0.0, 0.0), 0.2);
    col += drawPoint(uv, b3, 5.0 * step, vec3(1.0, 0.0, 0.0), 0.2);

    // draw curve
    for(float i = 0.0; i <= 1.0; i+=step) {
        // vec2 p = calcCurve(i, b0, b1, b2, b3);
        // col += drawPoint(uv, p, step, vec3(1.0, 0.5, 0.0), 0.2);
        vec2 p = calcBezier(i, b0, b1, b2, b3);
        col += drawPoint(uv, p, step, vec3(1.0, 0.5, 0.0), 0.2);
    }
    
    // Output to screen
    fragColor = vec4(col,1.0);
}